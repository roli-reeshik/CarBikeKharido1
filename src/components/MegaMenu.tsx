"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bike, Car, ChevronDown, ChevronRight, Newspaper, PlayCircle, Recycle } from "lucide-react";
import { useRef, useState } from "react";

import { ExplainTooltip } from "@/components/ExplainTooltip";
import { useCity } from "@/components/providers/CityProvider";
import { requestCatalogLens } from "@/lib/catalogFocus";
import { megaCategories, type MegaChild, type MegaItem } from "@/lib/megaMenu";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 380, damping: 32 } as const;

const categoryIcons = {
  "new-cars": Car,
  "used-cars": Recycle,
  bikes: Bike,
  news: Newspaper,
  videos: PlayCircle,
} as const;

function followHref(
  href: string,
  extras?: { lens?: string; cityId?: string; setCityId?: (id: string) => void },
) {
  if (extras?.cityId && extras.setCityId) extras.setCityId(extras.cityId);
  if (extras?.lens) requestCatalogLens(extras.lens);
  const id = href.startsWith("#") ? href.slice(1) : href;
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function ItemRow({
  item,
  nested,
  categoryLens,
  onNested,
  onNavigate,
}: {
  item: MegaItem;
  nested: boolean;
  categoryLens?: string;
  onNested: () => void;
  onNavigate: () => void;
}) {
  const { setCityId } = useCity();
  const hasKids = Boolean(item.children?.length);

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
        nested
          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
          : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/70",
      )}
      onMouseEnter={hasKids ? onNested : undefined}
    >
      {item.explain ? (
        <span className="min-w-0 flex-1 truncate">
          <ExplainTooltip
            term={item.explain.term}
            meaning={item.explain.meaning}
          />
        </span>
      ) : (
        <button
          type="button"
          onFocus={hasKids ? onNested : undefined}
          onClick={() => {
            if (hasKids) {
              onNested();
              return;
            }
            followHref(item.href, {
              lens: item.lens ?? categoryLens,
              cityId: item.cityId,
              setCityId,
            });
            onNavigate();
          }}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span className="truncate">{item.label}</span>
          {item.hint ? (
            <span className="shrink-0 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              {item.hint}
            </span>
          ) : null}
        </button>
      )}
      {hasKids ? (
        <ChevronRight className="size-3.5 shrink-0 text-slate-400" aria-hidden />
      ) : null}
    </div>
  );
}

function NestedList({
  item,
  categoryLens,
  onNavigate,
}: {
  item: MegaItem;
  categoryLens?: string;
  onNavigate: () => void;
}) {
  const { setCityId } = useCity();

  return (
    <motion.div
      key={item.label}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={spring}
      className="min-w-48 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40"
    >
      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {item.label}
      </p>
      <ul className="space-y-0.5">
        {item.children?.map((child: MegaChild) => (
          <li key={child.label}>
            <button
              type="button"
              onClick={() => {
                followHref(child.href, {
                  lens: child.lens ?? item.lens ?? categoryLens,
                  cityId: child.cityId,
                  setCityId,
                });
                onNavigate();
              }}
              className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-900"
            >
              {child.label}
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function MegaMenu() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [nestedKey, setNestedKey] = useState<string | null>(null);
  const closeTimer = useRef<number>(0);

  const open = (id: string) => {
    window.clearTimeout(closeTimer.current);
    setActiveId(id);
    setNestedKey(null);
  };

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setActiveId(null);
      setNestedKey(null);
    }, 160);
  };

  const active = megaCategories.find((category) => category.id === activeId);
  const nestedItem = active
    ?.columns.flatMap((column) => column.items)
    .find((item) => item.label === nestedKey);

  return (
    <nav
      aria-label="Primary"
      className="hidden lg:block"
      onMouseLeave={scheduleClose}
    >
      <ul className="flex items-center gap-0.5">
        {megaCategories.map((category) => {
          const isOn = category.id === activeId;
          const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
          return (
            <li key={category.id}>
              <button
                type="button"
                aria-expanded={isOn}
                aria-haspopup="true"
                onMouseEnter={() => open(category.id)}
                onFocus={() => open(category.id)}
                onClick={() => open(category.id)}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  isOn
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
                )}
              >
                {isOn ? (
                  <motion.span
                    layoutId="activePill"
                    className="absolute inset-0 -z-10 rounded-full bg-slate-100 dark:bg-slate-800"
                    transition={spring}
                  />
                ) : null}
                <span className="inline-flex items-center gap-1">
                  {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
                  {category.label}
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform",
                      isOn && "rotate-180",
                    )}
                    aria-hidden
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {active ? (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={spring}
            onMouseEnter={() => window.clearTimeout(closeTimer.current)}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-lift backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95"
          >
            <div
              className={cn(
                "grid gap-6 p-5",
                nestedItem?.children ? "md:grid-cols-[1fr_auto]" : "",
              )}
            >
              <div
                className={cn(
                  "grid gap-6",
                  active.columns.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2",
                )}
              >
                {active.columns.map((column, columnIndex) => (
                  <div key={column.title}>
                    <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {column.title}
                    </p>
                    <ul className="space-y-0.5">
                      {column.items.map((item, itemIndex) => (
                        <motion.li
                          key={item.label}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.03 * (columnIndex * 4 + itemIndex) }}
                        >
                          <ItemRow
                            item={item}
                            nested={nestedKey === item.label}
                            categoryLens={active.lens}
                            onNested={() => setNestedKey(item.label)}
                            onNavigate={scheduleClose}
                          />
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {nestedItem?.children ? (
                  <NestedList
                    item={nestedItem}
                    categoryLens={active.lens}
                    onNavigate={scheduleClose}
                  />
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}

export function MobileMegaAccordion({ onNavigate }: { onNavigate: () => void }) {
  const { setCityId } = useCity();
  const [openId, setOpenId] = useState<string | null>(megaCategories[0].id);

  return (
    <div className="space-y-1">
      {megaCategories.map((category) => {
        const open = openId === category.id;
        return (
          <div
            key={category.id}
            className="rounded-xl border border-slate-200/80 dark:border-slate-800"
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : category.id)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100"
            >
              {category.label}
              <ChevronDown
                className={cn(
                  "size-4 text-slate-400 transition-transform",
                  open && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-1 border-t border-slate-100 px-2 py-2 dark:border-slate-800">
                    {category.columns.flatMap((column) =>
                      column.items.flatMap((item) => [
                        <li key={item.label}>
                          <button
                            type="button"
                            onClick={() => {
                              followHref(item.href, {
                                lens: item.lens ?? category.lens,
                                cityId: item.cityId,
                                setCityId,
                              });
                              onNavigate();
                            }}
                            className="w-full rounded-lg px-2 py-1.5 text-left text-sm font-medium text-slate-700 dark:text-slate-200"
                          >
                            {item.label}
                          </button>
                        </li>,
                        ...(item.children ?? []).map((child) => (
                          <li key={`${item.label}-${child.label}`}>
                            <button
                              type="button"
                              onClick={() => {
                                followHref(child.href, {
                                  lens: child.lens ?? item.lens ?? category.lens,
                                  cityId: child.cityId,
                                  setCityId,
                                });
                                onNavigate();
                              }}
                              className="w-full rounded-lg px-5 py-1.5 text-left text-sm text-slate-500 dark:text-slate-400"
                            >
                              {child.label}
                            </button>
                          </li>
                        )),
                      ]),
                    )}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
