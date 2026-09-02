"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPrisma } from "@/lib/catalogue/prisma";
import { rupeesToPaise } from "@/lib/money";
import { createSession, destroySession, requireAdmin, verifyPassword } from "./auth";
import {
  imageSchema,
  loginSchema,
  rtoUpdateSchema,
  variantUpdateSchema,
} from "./schemas";

/**
 * Server actions for the admin portal.
 *
 * Two rules apply to everything here. First, every mutating action calls
 * `requireAdmin()` itself: a server action is a public endpoint, and rendering
 * the form behind a login page does not protect it. Second, every input is
 * parsed with Zod before it reaches the database, because `FormData` values are
 * attacker-controlled strings.
 */

export interface ActionResult {
  ok: boolean;
  message: string;
}

const DB_REQUIRED =
  "No database is connected. Set DATABASE_URL and run `npm run db:push && npm run db:seed` to enable editing.";

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export async function signIn(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Enter the admin password." };
  }

  if (!verifyPassword(parsed.data.password)) {
    // Deliberately vague: do not reveal whether admin access is configured.
    return { ok: false, message: "Incorrect password." };
  }

  await createSession();
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  await destroySession();
  revalidatePath("/admin");
}

// ---------------------------------------------------------------------------
// Variant pricing
// ---------------------------------------------------------------------------

export async function updateVariant(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = variantUpdateSchema.safeParse({
    variantId: formData.get("variantId"),
    exShowroomRupees: formData.get("exShowroomRupees"),
    isPopular: formData.get("isPopular") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Those values are not valid.",
    };
  }

  const prisma = getPrisma();
  if (!prisma) return { ok: false, message: DB_REQUIRED };

  const { variantId, exShowroomRupees, isPopular } = parsed.data;

  try {
    // A line-up has one "most bought" trim, so setting a new one clears the
    // previous flag in the same transaction rather than leaving two.
    const variant = await prisma.variant.findUnique({
      where: { id: variantId },
      select: { vehicleId: true },
    });
    if (!variant) return { ok: false, message: "That variant no longer exists." };

    await prisma.$transaction([
      ...(isPopular
        ? [
            prisma.variant.updateMany({
              where: { vehicleId: variant.vehicleId, NOT: { id: variantId } },
              data: { isPopular: false },
            }),
          ]
        : []),
      prisma.variant.update({
        where: { id: variantId },
        data: {
          exShowroomPricePence: BigInt(rupeesToPaise(exShowroomRupees)),
          isPopular,
        },
      }),
    ]);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    return { ok: false, message: `Could not save: ${reason}` };
  }

  revalidatePath("/admin/variants");
  revalidatePath("/vehicles", "layout");
  revalidatePath("/");
  return { ok: true, message: "Saved. Prices are live." };
}

// ---------------------------------------------------------------------------
// RTO tax slabs
// ---------------------------------------------------------------------------

/**
 * Lets an operator apply a state's tax notification without a code deploy,
 * which is the whole point: slabs change on a state budget timetable that has
 * nothing to do with our release cadence.
 */
export async function updateRtoRule(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = rtoUpdateSchema.safeParse({
    ruleId: formData.get("ruleId"),
    taxPercentage: formData.get("taxPercentage"),
    cessPercentage: formData.get("cessPercentage"),
    fixedFeeRupees: formData.get("fixedFeeRupees"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Those values are not valid.",
    };
  }

  const prisma = getPrisma();
  if (!prisma) return { ok: false, message: DB_REQUIRED };

  try {
    await prisma.rtoTaxRule.update({
      where: { id: parsed.data.ruleId },
      data: {
        taxPercentage: parsed.data.taxPercentage,
        cessPercentage: parsed.data.cessPercentage,
        fixedFee: BigInt(rupeesToPaise(parsed.data.fixedFeeRupees)),
      },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    return { ok: false, message: `Could not save: ${reason}` };
  }

  revalidatePath("/admin/rto");
  revalidatePath("/vehicles", "layout");
  revalidatePath("/");
  return { ok: true, message: "Slab updated. On-road prices now use it." };
}

// ---------------------------------------------------------------------------
// Press-kit imagery
// ---------------------------------------------------------------------------

export async function addVehicleImage(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = imageSchema.safeParse({
    vehicleId: formData.get("vehicleId"),
    url: formData.get("url"),
    type: formData.get("type"),
    caption: formData.get("caption") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Those values are not valid.",
    };
  }

  const prisma = getPrisma();
  if (!prisma) return { ok: false, message: DB_REQUIRED };

  try {
    await prisma.vehicleImage.create({
      data: {
        vehicleId: parsed.data.vehicleId,
        url: parsed.data.url,
        type: parsed.data.type,
        caption: parsed.data.caption ?? null,
      },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    return { ok: false, message: `Could not save: ${reason}` };
  }

  revalidatePath("/admin/variants");
  revalidatePath("/vehicles", "layout");
  revalidatePath("/");
  return { ok: true, message: "Image added." };
}
