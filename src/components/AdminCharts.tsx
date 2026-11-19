import { useMemo, useState } from 'react';
import type { BankPartner, CommissionAssumptions, CustomerEnquiry } from '../types';

interface AdminChartsProps {
  enquiries: CustomerEnquiry[];
  partners: BankPartner[];
  commission: CommissionAssumptions;
}

export function AdminCharts({ enquiries, partners, commission }: AdminChartsProps) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const monthlySeries = useMemo(() => {
    const months: Array<{ key: string; label: string; enquiries: number; completed: number }> = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'short' });
      months.push({ key, label, enquiries: 0, completed: 0 });
    }
    enquiries.forEach((e) => {
      const key = e.createdAt.slice(0, 7);
      const bucket = months.find((m) => m.key === key);
      if (bucket) {
        bucket.enquiries += 1;
        if (e.status === 'Completed') bucket.completed += 1;
      }
    });
    return months;
  }, [enquiries]);

  const serviceDemand = useMemo(() => {
    const counts = [
      { label: 'Business Loan', count: 0, color: '#0B1F3A' },
      { label: 'Current Account', count: 0, color: '#059669' },
      { label: 'Insurance', count: 0, color: '#0284C7' },
      { label: 'General Guidance', count: 0, color: '#64748B' },
    ];
    enquiries.forEach((e) => {
      if (e.serviceRequired === 'Business Loan') counts[0].count += 1;
      else if (e.serviceRequired === 'Current Account') counts[1].count += 1;
      else if (e.serviceRequired === 'Insurance') counts[2].count += 1;
      else counts[3].count += 1;
    });
    return counts;
  }, [enquiries]);

  const completionMetrics = useMemo(() => {
    const total = enquiries.length;
    const completed = enquiries.filter((e) => e.status === 'Completed').length;
    const referred = enquiries.filter((e) =>
      ['Referred to Bank', 'Application Submitted', 'Bank Decision Pending', 'Completed'].includes(e.status)
    ).length;
    const notProceeding = enquiries.filter((e) => e.status === 'Not Proceeding').length;
    const active = Math.max(0, total - completed - notProceeding);
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, referred, active, notProceeding, rate };
  }, [enquiries]);

  const referralPerformance = useMemo(() => {
    const map = new Map<string, { name: string; referred: number; completed: number }>();
    partners.forEach((p) => {
      map.set(p.id, { name: p.name.replace(' (Sample Slot)', ''), referred: 0, completed: 0 });
    });
    enquiries.forEach((e) => {
      if (e.referredPartnerId && map.has(e.referredPartnerId)) {
        const entry = map.get(e.referredPartnerId)!;
        entry.referred += 1;
        if (e.status === 'Completed') entry.completed += 1;
      }
    });
    return Array.from(map.values());
  }, [enquiries, partners]);

  const maxMonthly = Math.max(1, ...monthlySeries.map((m) => m.enquiries));
  const maxService = Math.max(1, ...serviceDemand.map((s) => s.count));

  const actualCompleted = completionMetrics.completed;
  const actualRevenue = actualCompleted * commission.referralCommission;
  const actualVariable = actualCompleted * commission.variableCostPerReferral;
  const targetRevenue = commission.targetCustomersPerMonth * commission.referralCommission;
  const targetVariable = commission.targetCustomersPerMonth * commission.variableCostPerReferral;
  const maxFinance = Math.max(
    1000,
    actualRevenue,
    targetRevenue,
    commission.monthlyFixedCost + targetVariable
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Monthly Enquiries & Acquisition */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display font-semibold text-base text-[#0B1F3A]">
              Monthly Enquiries & Completions
            </h3>
            <p className="text-xs text-slate-500">6-month lead intake vs completed referrals</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#0B1F3A]" /> Enquiries
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600" /> Completed
            </span>
          </div>
        </div>

        <div className="h-48 flex items-end gap-3 pt-6 pb-2 border-b border-slate-100">
          {monthlySeries.map((m) => {
            const enqHeight = Math.round((m.enquiries / maxMonthly) * 130);
            const compHeight = Math.round((m.completed / maxMonthly) * 130);
            return (
              <div
                key={m.key}
                onMouseEnter={() => setHoveredBar(m.key)}
                onMouseLeave={() => setHoveredBar(null)}
                className="flex-1 flex flex-col items-center gap-2 relative"
              >
                {hoveredBar === m.key && (
                  <div className="absolute -top-6 bg-[#0B1F3A] text-white text-[11px] font-mono px-2 py-0.5 rounded whitespace-nowrap z-10 tabular-nums">
                    {m.enquiries} enq · {m.completed} done
                  </div>
                )}
                <div className="flex items-end gap-1 h-[132px]">
                  <div
                    style={{ height: `${Math.max(4, enqHeight)}px` }}
                    className="w-4 sm:w-5 rounded-t bg-[#0B1F3A] transition-all duration-150"
                  />
                  <div
                    style={{ height: `${Math.max(m.completed > 0 ? 4 : 0, compHeight)}px` }}
                    className="w-4 sm:w-5 rounded-t bg-emerald-600 transition-all duration-150"
                  />
                </div>
                <span className="text-xs font-mono text-slate-500">{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Service-wise Demand */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="mb-4">
          <h3 className="font-display font-semibold text-base text-[#0B1F3A]">
            Service-Wise Demand
          </h3>
          <p className="text-xs text-slate-500">Customer enquiries by banking product category</p>
        </div>

        <div className="space-y-4 pt-2">
          {serviceDemand.map((item) => {
            const pct = Math.round((item.count / maxService) * 100);
            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800">{item.label}</span>
                  <span className="font-mono font-semibold text-[#0B1F3A] tabular-nums">
                    {item.count}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${pct}%`, backgroundColor: item.color }}
                    className="h-full rounded-full transition-all duration-200"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Application Completion Rate */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display font-semibold text-base text-[#0B1F3A]">
              Application Completion Rate
            </h3>
            <p className="text-xs text-slate-500">Conversion across enquiry lifecycle</p>
          </div>
          <span className="font-mono text-2xl font-bold text-emerald-700 tabular-nums">
            {completionMetrics.rate}%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-500">Total Leads</p>
            <p className="font-mono text-lg font-bold text-[#0B1F3A] tabular-nums mt-1">
              {completionMetrics.total}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-500">Bank Referred+</p>
            <p className="font-mono text-lg font-bold text-[#0B1F3A] tabular-nums mt-1">
              {completionMetrics.referred}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-xs text-emerald-800">Completed</p>
            <p className="font-mono text-lg font-bold text-emerald-800 tabular-nums mt-1">
              {completionMetrics.completed}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-500">Active / Pending</p>
            <p className="font-mono text-lg font-bold text-slate-700 tabular-nums mt-1">
              {completionMetrics.active}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Referral Performance by Partner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="mb-4">
          <h3 className="font-display font-semibold text-base text-[#0B1F3A]">
            Partner Referral Performance
          </h3>
          <p className="text-xs text-slate-500">Assigned referrals vs bank completions</p>
        </div>

        <div className="space-y-3">
          {referralPerformance.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-b-0 text-sm"
            >
              <span className="text-slate-800 font-medium truncate">{p.name}</span>
              <div className="flex items-center gap-4 shrink-0 font-mono text-xs tabular-nums">
                <span className="text-slate-600">{p.referred} referred</span>
                <span className="text-emerald-700 font-semibold">{p.completed} completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Estimated Monthly Commission Revenue vs Costs */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="font-display font-semibold text-base text-[#0B1F3A]">
              Estimated Monthly Commission vs Cost Assumptions (Internal Planning)
            </h3>
            <p className="text-xs text-slate-500">
              Planning assumptions only (₹{commission.referralCommission}/referral) — not confirmed bank agreements
            </p>
          </div>
          <span className="font-mono text-xs text-slate-500 tabular-nums">
            Target: {commission.targetCustomersPerMonth} referrals/mo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-600">Current Completed Volume ({actualCompleted})</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Est. Commission Revenue</span>
                <span className="font-mono font-semibold tabular-nums">₹{actualRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${Math.round((actualRevenue / maxFinance) * 100)}%` }}
                  className="h-full bg-emerald-600 rounded-full"
                />
              </div>

              <div className="flex justify-between text-xs">
                <span>Est. Total Costs (Fixed + Variable)</span>
                <span className="font-mono font-semibold tabular-nums">
                  ₹{(commission.monthlyFixedCost + actualVariable).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{
                    width: `${Math.round(((commission.monthlyFixedCost + actualVariable) / maxFinance) * 100)}%`,
                  }}
                  className="h-full bg-[#0B1F3A] rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-600">
              Monthly Target Projection ({commission.targetCustomersPerMonth} referrals)
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Projected Commission Revenue</span>
                <span className="font-mono font-semibold tabular-nums">₹{targetRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${Math.round((targetRevenue / maxFinance) * 100)}%` }}
                  className="h-full bg-emerald-600 rounded-full"
                />
              </div>

              <div className="flex justify-between text-xs">
                <span>Projected Costs (Fixed + Variable)</span>
                <span className="font-mono font-semibold tabular-nums">
                  ₹{(commission.monthlyFixedCost + targetVariable).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{
                    width: `${Math.round(((commission.monthlyFixedCost + targetVariable) / maxFinance) * 100)}%`,
                  }}
                  className="h-full bg-[#0B1F3A] rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
