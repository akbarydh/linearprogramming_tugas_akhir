import { NextResponse } from 'next/server';
import { solveTransportation } from '@/lib/transportationSolver';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jakarta, surabaya, medan, bandung, semarang, makassar, balikpapan } = body;

    const totalSupply = jakarta + surabaya + medan;
    const totalDemand = bandung + semarang + makassar + balikpapan;

    if (totalSupply < totalDemand) {
      return NextResponse.json(
        { error: 'Total kapasitas gudang lebih kecil daripada total kebutuhan kota.' },
        { status: 400 }
      );
    }

    const solution = solveTransportation(body);

    if (!solution.feasible) {
      return NextResponse.json({ error: 'Optimasi gagal dilakukan.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      totalCost: solution.totalCost,
      allocation: solution.allocation,
      totalSupply,
      totalDemand,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}