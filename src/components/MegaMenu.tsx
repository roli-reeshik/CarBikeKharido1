"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bike, Car, ChevronDown, ChevronRight, Newspaper, PlayCircle, Recycle } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { ExplainTooltip } from "@/components/ExplainTooltip";
import { useCity } from "@/components/providers/CityProvider";
import { useClickOutside, useEscapeKey } from "@/lib/hooks";
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

function MenuLink({
  item,
  nested,
  onNavigate,
  onFocusNested,
}: {
  item: MegaItem | MegaChild;
  nested?: boolean;
  onNavigate: () => void;
  onFocusNested?: () => void;
}) {
  const { setCityId } = useCity();
  const hasKids = "children" in item && Boolean(item.children?.length);

  if ("explain" in item && item.explain) {
    return (
      <span className="block rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
        <ExplainTooltip term={item.explain.term} meaning={item.explain.meaning} />
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      onFocus={onFocusNested}
      onMouseEnter={onFocusNested}
      onClick={() => {
        if (item.cityId) setCityId(item.cityId);
        onNavigate();
      }}
      className={cn(
        "flex w-full items-start justify-between gap-2 rounded-xl px-3 py-2 text-left transition-colors",
        nested
          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
          : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/70",
      )}
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium">{item.label}</span>
        {item.subtext ? (
          <span className="mt-0.5 block text-xs leading-snug text-slate-500 dark:text-slate-400">
            {item.subtext}
          </span>
        ) : null}
      </span>
      {hasKids ? (
        <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-slate-400" aria-hidden />
      ) : null}
    </Link>
  );
}

function NestedList({
  item,
  onNavigate,
}: {
  item: MegaItem;
  onNavigate: () => void;
}) {
  return (
    <motion.div
      key={item.label}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={spring}
      className="min-w-56 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40"
    >
      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {item.label}
      </p>
      <ul className="space-y-0.5">
        {item.children?.map((child) => (
          <li key={child.label}>
            <MenuLink item={child} onNavigate={onNavigate} />
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
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeIdRef = useRef<string | null>(null);
  const pendingPanelFocus = useRef(false);

  activeIdRef.current = activeId;

  const close = useCallback((restoreFocus = false) => {
    window.clearTimeout(closeTimer.current);
    const id = activeIdRef.current;
    pendingPanelFocus.current = false;
    setActiveId(null);
    setNestedKey(null);
    if (restoreFocus && id) {
      triggerRefs.current[id]?.focus();
    }
  }, []);

  const open = (id: string, focusPanel = false) => {
    window.clearTimeout(closeTimer.current);
    pendingPanelFocus.current = focusPanel;
    setActiveId(id);
    setNestedKey(null);
  };

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      if (navRef.current?.contains(document.activeElement)) return;
      close();
    }, 160);
  };

  useEscapeKey(() => close(true), Boolean(activeId));
  useClickOutside(navRef, () => close(), Boolean(activeId));

  useEffect(() => {
    if (!activeId || !pendingPanelFocus.current) return;
    pendingPanelFocus.current = false;
    document
      .querySelector<HTMLAnchorElement>(`#mega-panel-${activeId} a`)
      ?.focus();
  }, [activeId]);

  const active = megaCategories.find((category) => category.id === activeId);
  const nestedItem = active
    ?.columns.flatMap((column) => column.items)
    .find((item) => item.label === nestedKey);
  const categoryIds = megaCategories.map((category) => category.id);

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className="hidden lg:block"
      onMouseLeave={scheduleClose}
    >
      <ul className="flex items-center gap-0.5">
        {megaCategories.map((category, categoryIndex) => {
          const isOn = category.id === activeId;
          const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
          const panelId = `mega-panel-${category.id}`;
          return (
            <li key={category.id}>
              <button
                type="button"
                ref={(node) => {
                  triggerRefs.current[category.id] = node;
                }}
                aria-expanded={isOn}
                aria-haspopup="true"
                aria-controls={panelId}
                onMouseEnter={() => open(category.id)}
                onClick={() => (isOn ? close() : open(category.id))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    if (isOn) {
                      close();
                    } else {
                      open(category.id, true);
                    }
                  }
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    open(category.id, true);
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    const next =
                      categoryIds[(categoryIndex + 1) % categoryIds.length];
                    open(next);
                    triggerRefs.current[next]?.focus();
                  }
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    const prev =
                      categoryIds[
                        (categoryIndex - 1 + categoryIds.length) %
                          categoryIds.length
                      ];
                    open(prev);
                    triggerRefs.current[prev]?.focus();
                  }
                  if (event.key === "Tab" && !event.shiftKey && isOn) {
                    event.preventDefault();
                    document
                      .querySelector<HTMLAnchorElement>(`#${panelId} a`)
                      ?.focus();
                  }
                }}
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
            id={`mega-panel-${active.id}`}
            role="region"
            aria-label={`${active.label} menu`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={spring}
            onMouseEnter={() => window.clearTimeout(closeTimer.current)}
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const links = Array.from(
                event.currentTarget.querySelectorAll<HTMLAnchorElement>("a"),
              );
              if (links.length === 0) return;
              const first = links[0];
              const last = links[links.length - 1];
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                triggerRefs.current[active.id]?.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                close();
              }
            }}
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
                          <MenuLink
                            item={item}
                            nested={nestedKey === item.label}
                            onFocusNested={() => setNestedKey(item.label)}
                            onNavigate={close}
                          />
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {nestedItem?.children ? (
                  <NestedList item={nestedItem} onNavigate={close} />
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
                          <Link
                            href={item.href}
                            onClick={() => {
                              if (item.cityId) setCityId(item.cityId);
                              onNavigate();
                            }}
                            className="block rounded-lg px-2 py-1.5 text-left"
                          >
                            <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                              {item.label}
                            </span>
                            {item.subtext ? (
                              <span className="block text-xs text-slate-500 dark:text-slate-400">
                                {item.subtext}
                              </span>
                            ) : null}
                          </Link>
                        </li>,
                        ...(item.children ?? []).map((child) => (
                          <li key={`${item.label}-${child.label}`}>
                            <Link
                              href={child.href}
                              onClick={() => {
                                if (child.cityId) setCityId(child.cityId);
                                onNavigate();
                              }}
                              className="block rounded-lg px-5 py-1.5 text-left"
                            >
                              <span className="block text-sm text-slate-500 dark:text-slate-400">
                                {child.label}
                              </span>
                              {child.subtext ? (
                                <span className="block text-xs text-slate-400">
                                  {child.subtext}
                                </span>
                              ) : null}
                            </Link>
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
