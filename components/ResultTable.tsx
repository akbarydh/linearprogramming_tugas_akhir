import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ResultTableProps {
  allocation: { [key: string]: { [key: string]: number } };
  inputs: { [key: string]: number };
}

export default function ResultTable({ allocation, inputs }: ResultTableProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-md font-bold mb-4 text-slate-200">📊 Rencana Distribusi Optimal</h3>
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <Table>
            <TableHeader className="bg-slate-900/80">
              <TableRow className="border-b border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs uppercase font-semibold">Gudang</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase font-semibold">Bandung</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase font-semibold">Semarang</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase font-semibold">Makassar</TableHead>
                <TableHead className="text-slate-400 text-xs uppercase font-semibold">Balikpapan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-700/60">
              {Object.keys(allocation).map((gudang) => (
                <TableRow key={gudang} className="hover:bg-slate-700/20 border-b border-slate-700/50">
                  <TableCell className="font-semibold text-slate-300 bg-slate-900/10">{gudang}</TableCell>
                  <TableCell className="font-mono">{allocation[gudang].Bandung} Ton</TableCell>
                  <TableCell className="font-mono">{allocation[gudang].Semarang} Ton</TableCell>
                  <TableCell className="font-mono">{allocation[gudang].Makassar} Ton</TableCell>
                  <TableCell className="font-mono">{allocation[gudang].Balikpapan} Ton</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-xs border-t border-slate-700/60 pt-4 text-slate-400">
        <h4 className="font-bold text-slate-300 text-sm mb-1">Rincian Pemanfaatan Gudang:</h4>
        {Object.keys(allocation).map((gudang) => {
          const totalKirim = Object.values(allocation[gudang]).reduce((a, b) => a + b, 0);
          const capAwal = inputs[gudang.toLowerCase()];
          const sisa = capAwal - totalKirim;
          return (
            <div key={gudang}>
              • <strong>Gudang {gudang}:</strong> Mengirim <span className="text-emerald-400 font-semibold">{totalKirim} Ton</span> (Sisa kapasitas: {sisa} Ton dari {capAwal} Ton).
            </div>
          );
        })}
      </div>
    </div>
  );
}