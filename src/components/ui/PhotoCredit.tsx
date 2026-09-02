import type { CarPhoto } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Attribution for a photograph. The CC BY and CC BY-SA licences on the Wikimedia
 * Commons files require crediting the author and naming the licence, so this is
 * a legal requirement rather than a nicety.
 */
export function PhotoCredit({
  photo,
  className,
}: {
  photo: CarPhoto | undefined;
  className?: string;
}) {
  if (!photo) return null;

  const needsAuthor = !/^(cc0|public domain)/i.test(photo.licence);

  return (
    <p className={cn("text-[11px] leading-relaxed text-slate-400", className)}>
      Photo:{" "}
      {photo.sourceUrl ? (
        <a
          href={photo.sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-dotted underline-offset-2 hover:text-slate-600 dark:hover:text-slate-200"
        >
          {photo.title}
        </a>
      ) : (
        photo.title
      )}
      {needsAuthor ? ` by ${photo.author}` : null} ·{" "}
      {photo.licenceUrl ? (
        <a
          href={photo.licenceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-dotted underline-offset-2 hover:text-slate-600 dark:hover:text-slate-200"
        >
          {photo.licence}
        </a>
      ) : (
        photo.licence
      )}
    </p>
  );
}
