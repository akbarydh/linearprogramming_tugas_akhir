'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DistributionChartProps {
  allocation: { [key: string]: { [key: string]: number } };
}

export default function DistributionChart({ allocation }: DistributionChartProps) {
  const chartData = Object.keys(allocation).map((gudang) => ({
    name: gudang,
    Bandung: allocation[gudang].Bandung,
    Semarang: allocation[gudang].Semarang,
    Makassar: allocation[gudang].Makassar,
    Balikpapan: allocation[gudang].Balikpapan,
  }));

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md flex flex-col h-full">
      <h3 className="text-md font-bold mb-6 text-slate-200">📊 Visualisasi Pengiriman per Gudang</h3>
      <div className="w-full h-64 md:h-80 flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }} />
            <Legend />
            <Bar dataKey="Bandung" stackId="a" fill="#38bdf8" />
            <Bar dataKey="Semarang" stackId="a" fill="#3b82f6" />
            <Bar dataKey="Makassar" stackId="a" fill="#f472b6" />
            <Bar dataKey="Balikpapan" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}