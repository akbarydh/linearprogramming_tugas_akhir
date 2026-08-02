'use client';

import React, { useState } from 'react';
import KPI from '@/components/KPI';
import ResultTable from '@/components/ResultTable';
import DistributionChart from '@/components/DistributionChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OptimizeResult {
  totalCost: number;
  totalSupply: number;
  totalDemand: number;
  allocation: { [key: string]: { [key: string]: number } };
}

export default function Home() {
  const [inputs, setInputs] = useState<{ [key: string]: number }>({
    jakarta: 500,
    surabaya: 400,
    medan: 300,
    bandung: 250,
    semarang: 300,
    makassar: 350,
    balikpapan: 300,
  });

  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const biayaMatriks = {
    Jakarta: { Bandung: 100, Semarang: 120, Makassar: 300, Balikpapan: 250 },
    Surabaya: { Bandung: 140, Semarang: 100, Makassar: 180, Balikpapan: 160 },
    Medan: { Bandung: 180, Semarang: 200, Makassar: 350, Balikpapan: 300 }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: Math.max(0, parseInt(value) || 0) }));
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Terjadi kesalahan sistem.');

      setResult(data);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const selisih = result ? result.totalSupply - result.totalDemand : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans border-t-2 border-indigo-600">
      {/* Header Utama */}
      <header className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
              LogiPlan <span className="text-slate-500 font-normal">| Decision Support System</span>
            </h1>
          </div>
          <div className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
            Linear Programming Solver
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Title */}
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Optimasi Rute Distribusi Logistik
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Perhitungan alokasi pasokan barang menggunakan pendekatan matriks transportasi untuk meminimalkan total biaya distribusi nasional.
          </p>
        </div>

        {/* Dokumentasi Model LP */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 space-y-3">
          <h3 className="text-xs font-semibold text-slate-300 tracking-wider uppercase border-b border-slate-800 pb-2">
            Model Matematika
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400">
            <div>
              <p className="font-medium text-slate-200 mb-1">Fungsi Tujuan</p>
              <p className="text-slate-400">Meminimalkan total biaya transportasi:</p>
              <p className="font-mono text-indigo-400 bg-slate-950 p-2 rounded border border-slate-800 my-2 text-center text-xs">
                Min Z = ∑ (c_ij × x_ij)
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-200 mb-1">Batasan Sistem</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Total pengiriman tidak melebihi kapasitas gudang asal.</li>
                <li>Seluruh pemenuhan kuota kota tujuan wajib terpenuhi.</li>
                <li>Variabel keputusan bernilai non-negatif (x_ij ≥ 0).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Input */}
        <form onSubmit={handleCalculate} className="bg-slate-900/40 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            
            {/* Input Kapasitas Gudang */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase border-b border-slate-800 pb-2">
                1. Kapasitas Gudang Asal (Ton)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['jakarta', 'surabaya', 'medan'].map((gudang) => (
                  <div key={gudang} className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 capitalize">{gudang}</label>
                    <Input 
                      type="number" 
                      name={gudang} 
                      value={inputs[gudang]} 
                      onChange={handleInputChange} 
                      className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-1 focus-visible:ring-indigo-500 rounded h-9 text-xs" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Input Kebutuhan Kota */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase border-b border-slate-800 pb-2">
                2. Kebutuhan Wilayah Tujuan (Ton)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['bandung', 'semarang', 'makassar', 'balikpapan'].map((kota) => (
                  <div key={kota} className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 capitalize">{kota}</label>
                    <Input 
                      type="number" 
                      name={kota} 
                      value={inputs[kota]} 
                      onChange={handleInputChange} 
                      className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-1 focus-visible:ring-indigo-500 rounded h-9 text-xs" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Matriks Biaya */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase border-b border-slate-800 pb-2">
                3. Matriks Biaya Distribusi (Ribu Rp / Ton)
              </h3>
              <div className="rounded border border-slate-800 overflow-hidden bg-slate-950">
                <Table>
                  <TableHeader className="bg-slate-900">
                    <TableRow className="border-b border-slate-800">
                      <TableHead className="text-slate-400 text-xs h-8">Asal / Tujuan</TableHead>
                      <TableHead className="text-slate-400 text-xs h-8">Bandung</TableHead>
                      <TableHead className="text-slate-400 text-xs h-8">Semarang</TableHead>
                      <TableHead className="text-slate-400 text-xs h-8">Makassar</TableHead>
                      <TableHead className="text-slate-400 text-xs h-8">Balikpapan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(biayaMatriks).map((gudang) => (
                      <TableRow key={gudang} className="border-b border-slate-800/50">
                        <td className="p-2 text-xs font-medium text-slate-300 bg-slate-900/50">{gudang}</td>
                        <td className="p-2 text-xs font-mono text-slate-400">Rp {biayaMatriks[gudang as keyof typeof biayaMatriks].Bandung.toLocaleString()}k</td>
                        <td className="p-2 text-xs font-mono text-slate-400">Rp {biayaMatriks[gudang as keyof typeof biayaMatriks].Semarang.toLocaleString()}k</td>
                        <td className="p-2 text-xs font-mono text-slate-400">Rp {biayaMatriks[gudang as keyof typeof biayaMatriks].Makassar.toLocaleString()}k</td>
                        <td className="p-2 text-xs font-mono text-slate-400">Rp {biayaMatriks[gudang as keyof typeof biayaMatriks].Balikpapan.toLocaleString()}k</td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

          </div>

          <div className="bg-slate-900/80 border-t border-slate-800 px-6 py-3 flex justify-end">
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-5 py-2 rounded transition-colors"
            >
              {loading ? 'Memproses Optimization Solver...' : 'Hitung Alokasi Optimal'}
            </Button>
          </div>
        </form>

        {/* Notifikasi Error */}
        {error && (
          <div className="bg-red-950/40 border border-red-800/80 text-red-400 px-4 py-3 rounded text-xs">
            <strong>Kesalahan Parameter:</strong> {error}
          </div>
        )}

        {/* Hasil Optimasi */}
        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KPI title="Total Kapasitas" value={`${result.totalSupply.toLocaleString()} Ton`} />
              <KPI title="Total Permintaan" value={`${result.totalDemand.toLocaleString()} Ton`} />
              <KPI title="Biaya Minimum (Z)" value={`Rp ${result.totalCost.toLocaleString()} Juta`} isHighlight />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResultTable allocation={result.allocation} inputs={inputs} />
              <div className="h-full">
                <DistributionChart allocation={result.allocation} />
              </div>
            </div>

            {/* Ringkasan Eksekutif */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 space-y-2">
              <h3 className="text-xs font-semibold text-slate-300 tracking-wider uppercase border-b border-slate-800 pb-2">
                Analisis Hasil Optimasi
              </h3>
              <div className="text-xs text-slate-400 leading-relaxed space-y-2 font-normal">
                <p>
                  Sistem menemukan solusi optimal layak (<em>optimal feasible solution</em>). Seluruh kebutuhan daerah tujuan sebesar <span className="text-slate-200 font-medium">{result.totalDemand} Ton</span> terpenuhi dengan akumulasi biaya logistik terendah senilai <span className="text-indigo-400 font-medium">Rp {result.totalCost.toLocaleString()} Juta</span>.
                </p>
                {selisih > 0 ? (
                  <p className="text-slate-400 pt-2 border-t border-slate-800/60">
                    Model beroperasi dalam kondisi persediaan berlebih (<em>unbalanced supply</em>). Terdapat sisa persediaan sebesar <span className="text-slate-200 font-medium">{selisih} Ton</span> di gudang asal yang dialokasikan pada rute bernilai efisiensi terendah untuk mencegah pembengkakan biaya.
                  </p>
                ) : (
                  <p className="text-slate-400 pt-2 border-t border-slate-800/60">
                    Model beroperasi dalam kondisi seimbang (<em>balanced supply</em>). Seluruh kuota persediaan terdistribusi secara penuh tanpa sisa stok.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}