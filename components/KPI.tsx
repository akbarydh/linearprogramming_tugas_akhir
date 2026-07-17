import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPIProps {
  title: string;
  value: string;
  isHighlight?: boolean;
}

export default function KPI({ title, value, isHighlight }: KPIProps) {
  return (
    <Card className={`border-slate-700 ${isHighlight ? 'bg-gradient-to-br from-slate-800 to-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 text-white'}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-xs uppercase tracking-wider ${isHighlight ? 'text-emerald-400 font-semibold' : 'text-slate-400 font-medium'}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}