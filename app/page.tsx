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

  // Data Matriks Biaya Kirim konstan (Sesuai parameter model LP)
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
      if (!response.ok) throw new Error(data.error || 'Terjadi kesalahan.');

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
    <main className="min-h-screen bg-[#0b0f19] text-slate-200 selection:bg-indigo-500/30">
      {/* Top Glassmorphism Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#0b0f19]/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🚚</span>
            <div>
              <h1 className="text-sm font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                LogiPlan SPK
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Transportation Problem Solver</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            Monolith Architecture
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Title Hero */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Sistem Pendukung Keputusan Distribusi Logistik Nasional
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Optimasi alokasi pasokan barang secara otomatis menggunakan model matriks transportasi untuk mencapai efisiensi biaya distribusi paling minimum.
          </p>
        </div>

        {/* 📚 Penjelasan Model LP Untuk Dosen */}
        <div className="bg-[#121826] border border-slate-800/80 rounded-xl p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="text-indigo-400">📘</span>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Dasar Teori & Pemodelan Linear Programming</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400 leading-relaxed font-medium">
            <div className="space-y-2">
              <h4 className="text-slate-200 font-semibold text-sm">🎯 Fungsi Tujuan (Objective Function)</h4>
              <p>Meminimalkan akumulasi total ongkos biaya transportasi dari seluruh rute gudang menuju kota tujuan:</p>
              <div className="bg-[#0b0f19] p-3 rounded-lg border border-slate-800 text-center font-mono text-indigo-400 text-sm my-2">
                Min Z = ∑ (Biaya × Jumlah Pengiriman)
              </div>
              <p>Sistem akan secara adaptif menekan variabel keputusan pengiriman pada rute dengan bobot ongkos termahal.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-slate-200 font-semibold text-sm">🚧 Kendala Batasan (Constraints)</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><strong className="text-slate-300">Kapasitas Suplai:</strong> Total barang keluar dari tiap gudang tidak boleh melampaui kapasitas maksimum stok tersedia.</li>
                <li><strong className="text-slate-300">Permintaan Pasar:</strong> Kebutuhan wajib kota tujuan harus terpenuhi secara presisi sesuai permintaan pasar.</li>
                <li><strong className="text-slate-300">Non-Negatif:</strong> Nilai volume kirim tidak boleh di bawah angka nol ({"x_ij ≥ 0"}).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Entry Form */}
        <form onSubmit={handleCalculate} className="bg-[#121826] border border-slate-800/60 rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            
            {/* 1. Kapasitas Gudang */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="text-slate-400 text-sm">📦</span>
                <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">1. Kapasitas Gudang Asal (Supply dalam Satuan Ton)</h3>
              </div>
              <p className="text-xs text-slate-400">Masukkan batasan persediaan produk mentah/jadi yang siap dimobilisasi pada masing-masing titik koordinat gudang asal.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {['jakarta', 'surabaya', 'medan'].map((gudang) => (
                  <div key={gudang} className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 capitalize">{gudang}</label>
                    <Input 
                      type="number" 
                      name={gudang} 
                      value={inputs[gudang]} 
                      onChange={handleInputChange} 
                      className="bg-[#0b0f19] border-slate-800 text-white focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 h-10 rounded-lg text-sm" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Kebutuhan Kota */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="text-slate-400 text-sm">🏙️</span>
                <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">2. Kebutuhan Kota Tujuan (Demand dalam Satuan Ton)</h3>
              </div>
              <p className="text-xs text-slate-400">Masukkan ambang kuota minimal volume komoditas yang wajib dipasok ke masing-masing klaster wilayah agar pasar tidak mengalami defisit.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {['bandung', 'semarang', 'makassar', 'balikpapan'].map((kota) => (
                  <div key={kota} className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 capitalize">{kota}</label>
                    <Input 
                      type="number" 
                      name={kota} 
                      value={inputs[kota]} 
                      onChange={handleInputChange} 
                      className="bg-[#0b0f19] border-slate-800 text-white focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 h-10 rounded-lg text-sm" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 💰 3. Matriks Biaya Distribusi */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="text-indigo-400 text-sm">💰</span>
                <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">3. Matriks Parameter Biaya Distribusi (Ribu Rp / Ton)</h3>
              </div>
              <p className="text-xs text-slate-400">Variabel koefisien ongkos kirim per 1 ton logistik. Angka ini bertindak sebagai bobot pengali utama (c_ij) dalam kalkulasi fungsi objektif.</p>
              
              <div className="overflow-hidden rounded-lg border border-slate-800 bg-[#0b0f19]">
                <Table>
                  <TableHeader className="bg-[#121826]">
                    <TableRow className="border-b border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400 font-bold text-xs">Asal / Tujuan</TableHead>
                      <TableHead className="text-slate-400 font-bold text-xs">Bandung</TableHead>
                      <TableHead className="text-slate-400 font-bold text-xs">Semarang</TableHead>
                      <TableHead className="text-slate-400 font-bold text-xs">Makassar</TableHead>
                      <TableHead className="text-slate-400 font-bold text-xs">Balikpapan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-800/60">
                    {Object.keys(biayaMatriks).map((gudang) => (
                      <TableRow key={gudang} className="hover:bg-slate-800/20 border-b border-slate-800/40">
                        <td className="p-3 text-xs font-bold text-slate-300 bg-[#121826]/30">{gudang}</td>
                        <td className="p-3 text-xs font-mono text-slate-400">Rp {biayaMatriks[gudang as keyof typeof biayaMatriks].Bandung.toLocaleString()}k</td>
                        <td className="p-3 text-xs font-mono text-slate-400">Rp {biayaMatriks[gudang as keyof typeof biayaMatriks].Semarang.toLocaleString()}k</td>
                        <td className="p-3 text-xs font-mono text-slate-400">Rp {biayaMatriks[gudang as keyof typeof biayaMatriks].Makassar.toLocaleString()}k</td>
                        <td className="p-3 text-xs font-mono text-slate-400">Rp {biayaMatriks[gudang as keyof typeof biayaMatriks].Balikpapan.toLocaleString()}k</td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Cara Kerja Mekanisme Inferensi */}
            <div className="bg-[#161d2f]/30 border border-slate-800 rounded-lg p-4 text-[11px] text-slate-400 leading-relaxed">
              💡 <strong>Mekanisme Logika Inferensi:</strong> Ketika tombol ditekan, mesin optimasi Next.js akan membaca variabel input, memeriksa kelayakan parameter (*feasibility check*), menyusun matriks pembatas dan mengeksekusi metode algoritma *Highs Simplex* untuk memotong rute tidak efisien.
            </div>

          </div>

          {/* Action Button Section */}
          <div className="bg-[#161d2f]/50 border-t border-slate-800/80 px-6 py-4 flex justify-end">
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-6 py-5 shadow-lg shadow-indigo-600/10 rounded-lg transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Mengeksekusi Algoritma Simplex...
                </div>
              ) : (
                '🚀 Jalankan Optimasi Distribusi'
              )}
            </Button>
          </div>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-400 px-5 py-4 rounded-xl text-xs flex items-center gap-2">
            ⚠️ <strong>Kegagalan Validasi Model:</strong> {error}
          </div>
        )}

        {/* Output Section */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Metric Kpis Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <KPI title="Total Kapasitas Terpasang" value={`${result.totalSupply.toLocaleString()} Ton`} />
              <KPI title="Total Kebutuhan Wilayah" value={`${result.totalDemand.toLocaleString()} Ton`} />
              <KPI title="Biaya Distribusi Minimum (Z)" value={`Rp ${result.totalCost.toLocaleString()} Juta`} isHighlight />
            </div>

            {/* Dashboard Visual Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <ResultTable allocation={result.allocation} inputs={inputs} />
              <div className="h-full">
                <DistributionChart allocation={result.allocation} />
              </div>
            </div>

            {/* Executive Analysis Box */}
            <div className="bg-[#121826] border border-slate-800/80 rounded-xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-indigo-400">⚡</span>
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">Kesimpulan Analisis Data (Interpretasi Hasil)</h3>
              </div>
              <div className="text-xs text-slate-400 leading-relaxed space-y-3 font-medium">
                <p>
                  Berdasarkan hasil pemrosesan matriks keputusan linear programming, alokasi jaringan distribusi komoditas logistik dinyatakan memiliki **solusi layak optimal** (*optimal feasible solution*). 
                  Seluruh kebutuhan daerah target operasional sebesar <span className="text-slate-200 font-bold">{result.totalDemand} Ton</span> berhasil disuplai penuh dengan pengeluaran akhir serendah mungkin yaitu 
                  <span className="text-indigo-400 font-bold"> Rp {result.totalCost.toLocaleString()} Juta</span>.
                </p>
                {selisih > 0 ? (
                  <p className="border-t border-slate-800/80 pt-3 text-slate-500">
                    💡 <span className="text-slate-400 font-semibold">Analisis Kasus Batasan (Unbalanced Supply):</span> Akibat nilai kapasitas pasokan awal lebih besar dari target pasar, sistem secara cerdas menyisakan stok muatan sebesar <span className="text-indigo-300 font-semibold">{selisih} Ton</span> pada tangki penyimpanan gudang asal. Alokasi *idle capacity* sengaja diletakkan pada unit rute logistik dengan tarif per mil/ton termahal agar efisiensi maksimal dapat terjaga.
                  </p>
                ) : (
                  <p className="border-t border-slate-800/80 pt-3 text-slate-500">
                    💡 <span className="text-slate-400 font-semibold">Analisis Kasus Batasan (Balanced Supply):</span> Sistem berada pada kondisi setimbang (*balanced transportation model*). Seluruh kapasitas gudang terserap 100% tanpa menyisakan muatan mati di gudang asal.
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