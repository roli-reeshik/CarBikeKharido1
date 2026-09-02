import type { SpecGroup } from "@/lib/types";

/**
 * Specifications grouped into readable blocks. Each row pairs the raw figure
 * with a plain-English gloss where one exists, so "382 litres" is always
 * accompanied by "three large suitcases".
 */
export function SpecTable({ groups }: { groups: SpecGroup[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {groups.map((group) => (
        <section
          key={group.label}
          className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/50"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {group.label}
          </h3>

          <dl className="mt-3 space-y-3">
            {group.items.map((item) => (
              <div
                key={item.label}
                className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800/70"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-sm text-slate-500 dark:text-slate-400">
                    {item.label}
                  </dt>
                  <dd className="text-right text-sm font-medium text-slate-900 dark:text-white">
                    {item.value}
                  </dd>
                </div>
                {item.plain ? (
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.plain}
                  </p>
                ) : null}
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
