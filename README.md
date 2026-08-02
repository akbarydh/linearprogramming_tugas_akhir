# 🚛 LogiPlan — Decision Support System (DSS) Optimasi Rute Distribusi Logistik

**LogiPlan** adalah aplikasi **Sistem Pendukung Keputusan (Decision Support System)** berbasis web yang memanfaatkan **Pemrograman Linear (Linear Programming / Model Transportasi)** untuk mengoptimalkan alokasi dan pengiriman barang nasional dengan meminimalkan total biaya distribusi logistik.

Dokumentasi ini disusun secara terstruktur untuk memudahkan pemahaman proyek sekaligus sebagai acuan bahan penyusunan **Slide Presentasi (PPT)**.

---

## 📌 1. Latar Belakang & Permasalahan

Dalam industri logistik dan *supply chain*, biaya pengiriman barang dari lokasi sumber (*supply/pabrik*) ke berbagai lokasi tujuan (*demand/pasar*) menyumbang porsi biaya operasional yang signifikan. 

* **Tantangan**: Setiap jalur distribusi memiliki tarif pengiriman yang berbeda-beda, sementara tiap pabrik memiliki batasan kapasitas pasokan dan tiap kota tujuan memiliki kuota permintaan tertentu.
* **Solusi**: Menggunakan teknik **Model Transportasi Riset Operasional (Linear Programming)** untuk menemukan kombinasi pengiriman paling optimal (total biaya terendah) tanpa melanggar batasan pasokan maupun permintaan.

---

## 🎯 2. Maksud & Tujuan Proyek

1. **Meminimalkan Biaya Logistik (*Cost Minimization*)**: Menentukan jumlah barang yang harus dikirim dari setiap kota asal ke kota tujuan sehingga total biaya pengiriman nasional mencapai angka minimum.
2. **Pengambilan Keputusan Berbasis Data (*Data-Driven DSS*)**: Membantu manajer rantai pasok (*supply chain manager*) mengambil keputusan alokasi secara cepat dan akurat.
3. **Simulasi Dinamis (*What-If Analysis*)**: Memungkinkan pengguna mengubah parameter pasokan dan permintaan secara *real-time* untuk melihat dampak terhadap total biaya dan pola distribusi.

---

## 📐 3. Model Matematika LP (Transportasi)

### A. Komponen Model
* **Sumber (*Supply*)**: Jakarta ($S_1$), Surabaya ($S_2$), Medan ($S_3$)
* **Tujuan (*Demand*)**: Bandung ($D_1$), Semarang ($D_2$), Makassar ($D_3$), Balikpapan ($D_4$)
* **Variabel Keputusan ($X_{ij}$)**: Jumlah unit barang yang dikirim dari sumber $i$ ke tujuan $j$.

### B. Fungsi Tujuan (*Objective Function*)
$$\min Z = \sum_{i} \sum_{j} C_{ij} \cdot X_{ij}$$

Di mana $C_{ij}$ adalah biaya pengiriman per unit dari kota $i$ ke kota $j$.

### C. Kendala (*Constraints*)
1. **Kendala Pasokan (Capacity)**: Total pengiriman dari sumber $i$ tidak boleh melebihi kapasitasnya:
   $$\sum_{j} X_{ij} \le S_i \quad \forall i$$
2. **Kendala Permintaan (Demand)**: Total penerimaan di tujuan $j$ harus memenuhi permintaannya:
   $$\sum_{i} X_{ij} \ge D_j \quad \forall j$$
3. **Non-Negativitas**:
   $$X_{ij} \ge 0$$

---

## ✨ 4. Fitur Utama Aplikasi

* 🎛️ **Form Input Interaktif**: Penginputan kapasitas pasokan (*supply*) 3 kota asal dan permintaan (*demand*) 4 kota tujuan.
* ⚡ **Solver Otomatis**: Perhitungan alokasi teroptimasi secara instan menggunakan algoritma Simplex via `javascript-lp-solver`.
* 📊 **Dashboard KPI**: Ringkasan indikator utama (Total Biaya Distribusi, Total Pasokan, Total Permintaan, dan Selisih Keseimbangan).
* 📋 **Matriks Alokasi Hasil**: Tabel alokasi terperinci yang menunjukkan berapa unit barang yang dikirim dari tiap sumber ke tiap tujuan.
* 📈 **Visualisasi Chart Distribusi**: Grafik batang interaktif (*Recharts*) untuk membandingkan volume distribusi antar rute.

---

## 🛠️ 5. Teknologi yang Digunakan (Tech Stack)

* **Framework Utama**: Next.js 16 (App Router), React 19, TypeScript
* **Styling & UI**: Tailwind CSS v4, Lucide Icons, Shadcn UI / Custom Components
* **Linear Programming Solver**: `javascript-lp-solver`
* **Visualisasi Data**: Recharts
* **Render Rumus Matematika**: KaTeX (`react-katex`)

---

## 📂 6. Struktur Direktori Utama

```text
├── app/
│   ├── api/optimize/route.ts   # Endpoint API pemrosesan optimasi LP
│   ├── globals.css             # Styling global & tema Tailwind
│   ├── layout.tsx              # Root layout aplikasi Next.js
│   └── page.tsx                # Halaman utama dashboard DSS
├── components/
│   ├── DistributionChart.tsx   # Komponen grafik distribusi barang (Recharts)
│   ├── KPI.tsx                 # Card indikator metrik utama
│   └── ResultTable.tsx         # Tabel matriks alokasi pengiriman
├── lib/
│   └── transportationSolver.ts # Logika perumusan model matematika & LP Solver
└── package.json                # Dependencies proyek
```

---

## 🚀 7. Cara Memulai (Getting Started)

1. **Clone repository & masuk ke direktori proyek**:
   ```bash
   cd next_js_linearprogramming
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan**:
   ```bash
   npm run dev
   ```

4. **Akses aplikasi**:
   Buka browser dan akses `http://localhost:3000`.

---

## 💡 8. Panduan Bahan Slide Presentasi (PPT Outline)

Bagi Anda yang ingin mengutip file README ini untuk bahan slide PPT:
1. **Slide 1**: Judul Proyek & Anggota Tim (LogiPlan - Decision Support System).
2. **Slide 2**: Latar Belakang & Permasalahan Logistik (Tinggi Biaya Distribusi).
3. **Slide 3**: Rumusan Masalah & Tujuan Optimasi.
4. **Slide 4**: Metode & Model Matematika (Fungsi Minimasi Biaya & Kendala).
5. **Slide 5**: Demoisasi Fitur Aplikasi & Dashboard LogiPlan.
6. **Slide 6**: Matriks Hasil Alokasi & Grafik Distribusi.
7. **Slide 7**: Kesimpulan & Dampak Efisiensi Biaya.
