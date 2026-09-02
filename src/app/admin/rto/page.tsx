import { RtoRuleEditor } from "@/components/admin/RtoRuleEditor";
import { isDatabaseConfigured } from "@/lib/catalogue/prisma";
import { getRtoTaxRules, getServiceCities } from "@/lib/catalogue/repository";

/** Groups bands by state so an operator edits one notification at a time. */
function groupByState<T extends { stateCode: string }>(rules: T[]) {
  return rules.reduce<Record<string, T[]>>((groups, rule) => {
    (groups[rule.stateCode] ??= []).push(rule);
    return groups;
  }, {});
}

export default async function AdminRtoPage() {
  const rules = await getRtoTaxRules();
  const cities = getServiceCities();
  const readOnly = !isDatabaseConfigured();

  const stateNames = new Map(
    cities.map((city) => [city.stateCode, city.stateName]),
  );
  const grouped = groupByState(rules);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        RTO tax slabs
      </h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Road tax is the largest single line on an on-road quote, and states
        revise it on their own budget timetable. Editing a rate here takes effect
        on the next page load — no deploy needed. Price bands and vehicle types
        are fixed, because re-banding would silently change historic quotes.
      </p>

      <div className="mt-6 space-y-5">
        {Object.entries(grouped).map(([stateCode, stateRules]) => (
          <section
            key={stateCode}
            className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/50"
          >
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                {stateNames.get(stateCode) ?? stateCode}
                <span className="ml-2 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {stateCode}
                </span>
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {stateRules.length} bands
              </span>
            </header>

            <div className="mt-2">
              {stateRules.map((rule) => (
                <RtoRuleEditor key={rule.id} rule={rule} disabled={readOnly} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
