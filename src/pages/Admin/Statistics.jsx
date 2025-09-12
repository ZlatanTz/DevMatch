import React, { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const currency = (n) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
const number = (n) => new Intl.NumberFormat().format(n);

const MOCK = {
  totals: {
    jobsPosted: 128,
    applications: 954,
    hired: 37,
    employers: 22,
  },
  jobsPerMonth: [8, 11, 9, 12, 10, 13, 14, 18, 23, 6, 2, 2],
  applicationsPerMonth: [60, 72, 70, 76, 81, 88, 92, 120, 140, 80, 35, 30],
  bySeniority: {
    Junior: 46,
    Mid: 62,
    Senior: 20,
  },
  remoteSplit: {
    Remote: 78,
    Hybrid: 28,
    Onsite: 22,
  },
  topCompanies: [
    { name: "Coinis", jobs: 18, applications: 220 },
    { name: "Telekom", jobs: 14, applications: 187 },
    { name: "DevSoft", jobs: 13, applications: 165 },
    { name: "BlueSky", jobs: 9, applications: 111 },
    { name: "Codex", jobs: 7, applications: 92 },
  ],
};

function KPICard({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm p-4 sm:p-6 flex flex-col gap-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-2xl sm:text-3xl font-semibold">{value}</span>
      {sub && <span className="text-xs text-gray-500">{sub}</span>}
    </div>
  );
}

export default function AdminStatistics() {
  const [year, setYear] = useState("2025");
  const [range, setRange] = useState("YTD");

  const lineData = useMemo(
    () => ({
      labels: months,
      datasets: [
        {
          label: "Jobs posted",
          data: MOCK.jobsPerMonth,
          borderWidth: 2,
          borderColor: "#1f2937",
          fill: false,
          tension: 0.35,
        },
        {
          label: "Applications",
          data: MOCK.applicationsPerMonth,
          borderWidth: 2,
          borderColor: "#1f2937",
          fill: false,
          tension: 0.35,
        },
      ],
    }),
    [],
  );

  const lineOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: `Activity over months (${year})` },
        tooltip: { mode: "index", intersect: false },
      },
      interaction: { mode: "index", intersect: false },
      scales: {
        y: { beginAtZero: true },
      },
    }),
    [year],
  );

  const barData = useMemo(
    () => ({
      labels: MOCK.topCompanies.map((c) => c.name),
      datasets: [
        {
          label: "Jobs",
          data: MOCK.topCompanies.map((c) => c.jobs),
          backgroundColor: "#1F2937",
          borderColor: "#111827",
          borderWidth: 1,
          borderSkipped: false,
        },
        {
          label: "Applications",
          data: MOCK.topCompanies.map((c) => c.applications),
          backgroundColor: "#6B7280",
          borderColor: "#374151",
          borderWidth: 1,
          borderSkipped: false,
        },
      ],
    }),
    [],
  );

  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Top companies" },
      },
      scales: {
        y: { beginAtZero: true },
      },
    }),
    [],
  );

  const doughnutData = useMemo(
    () => ({
      labels: Object.keys(MOCK.remoteSplit),
      datasets: [
        {
          data: Object.values(MOCK.remoteSplit),
          backgroundColor: ["#111827", "#4B5563", "#9CA3AF"],
          borderColor: "#FFFFFF",
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    }),
    [],
  );

  const seniorityData = useMemo(
    () => ({
      labels: Object.keys(MOCK.bySeniority),
      datasets: [
        {
          data: Object.values(MOCK.bySeniority),
          backgroundColor: ["#111827", "#4B5563", "#9CA3AF"],
          borderColor: "#FFFFFF",
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    }),
    [],
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header + Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Statistics</h1>
          <p className="text-gray-500 text-sm">Datas about application usage</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Year</label>
            <select
              className="rounded-xl border px-3 py-2 bg-white"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Range</label>
            <select
              className="rounded-xl border px-3 py-2 bg-white"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option>YTD</option>
              <option>Last 90 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KPICard label="Jobs posted" value={number(MOCK.totals.jobsPosted)} sub={"All time"} />
        <KPICard label="Applications" value={number(MOCK.totals.applications)} sub={"All time"} />
        <KPICard label="Hires" value={number(MOCK.totals.hired)} sub={"Estimated"} />
        <KPICard label="Active employers" value={number(MOCK.totals.employers)} sub={"This year"} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 rounded-2xl bg-white shadow-sm border p-4 sm:p-6 h-[360px]">
          <Line data={lineData} options={lineOptions} />
        </div>

        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
          <div className="rounded-2xl bg-white shadow-sm border p-4 sm:p-6 h-[320px] flex flex-col">
            <h3 className="font-semibold mb-2">Remote / Hybrid / Onsite</h3>
            <div className="flex-1">
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            </div>
          </div>
          <div className="rounded-2xl bg-white shadow-sm border p-4 sm:p-6 h-[320px] flex flex-col">
            <h3 className="font-semibold mb-2">Seniority mix</h3>
            <div className="flex-1">
              <Doughnut
                data={seniorityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 rounded-2xl bg-white shadow-sm border p-4 sm:p-6 h-[360px]">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white shadow-sm border overflow-hidden">
        <div className="p-4 sm:p-6">
          <h3 className="font-semibold mb-4">Top companies by activity</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4">Company</th>
                  <th className="py-2 pr-4">Jobs</th>
                  <th className="py-2 pr-4">Applications</th>
                  <th className="py-2 pr-4">Avg. applications/job</th>
                </tr>
              </thead>
              <tbody>
                {MOCK.topCompanies.map((c) => (
                  <tr key={c.name} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{c.name}</td>
                    <td className="py-3 pr-4">{number(c.jobs)}</td>
                    <td className="py-3 pr-4">{number(c.applications)}</td>
                    <td className="py-3 pr-4">{(c.applications / c.jobs).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
