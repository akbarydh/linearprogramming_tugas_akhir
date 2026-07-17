// @ts-ignore
import solver from 'javascript-lp-solver';

export interface SolverInput {
  jakarta: number;
  surabaya: number;
  medan: number;
  bandung: number;
  semarang: number;
  makassar: number;
  balikpapan: number;
}

export function solveTransportation(inputs: SolverInput) {
  const { jakarta, surabaya, medan, bandung, semarang, makassar, balikpapan } = inputs;

  const model = {
    optimize: 'cost',
    opType: 'min',
    constraints: {
      jkt_cap: { max: jakarta },
      sby_cap: { max: surabaya },
      mdn_cap: { max: medan },
      bdg_dem: { min: bandung },
      smg_dem: { min: semarang },
      mks_dem: { min: makassar },
      bpa_dem: { min: balikpapan },
    },
    variables: {
      jkt_bdg: { cost: 100, jkt_cap: 1, bdg_dem: 1 },
      jkt_smg: { cost: 120, jkt_cap: 1, smg_dem: 1 },
      jkt_mks: { cost: 300, jkt_cap: 1, mks_dem: 1 },
      jkt_bpa: { cost: 250, jkt_cap: 1, bpa_dem: 1 },
      sby_bdg: { cost: 140, sby_cap: 1, bdg_dem: 1 },
      sby_smg: { cost: 100, sby_cap: 1, smg_dem: 1 },
      sby_mks: { cost: 180, sby_cap: 1, mks_dem: 1 },
      sby_bpa: { cost: 160, sby_cap: 1, bpa_dem: 1 },
      mdn_bdg: { cost: 180, mdn_cap: 1, bdg_dem: 1 },
      mdn_smg: { cost: 200, mdn_cap: 1, smg_dem: 1 },
      mdn_mks: { cost: 350, mdn_cap: 1, mks_dem: 1 },
      mdn_bpa: { cost: 300, mdn_cap: 1, bpa_dem: 1 },
    },
  } as const; // <-- Mengunci tipe data agar Vercel mengenali 'min' sebagai ObjectiveDirection

  // Menentukan tipe data dynamic pada results agar tidak memicu eror strict linting
  const results = solver.Solve(model) as Record<string, any>;

  return {
    feasible: results.feasible,
    totalCost: results.result || 0,
    allocation: {
      Jakarta: {
        Bandung: results.jkt_bdg || 0,
        Semarang: results.jkt_smg || 0,
        Makassar: results.jkt_mks || 0,
        Balikpapan: results.jkt_bpa || 0,
      },
      Surabaya: {
        Bandung: results.sby_bdg || 0,
        Semarang: results.sby_smg || 0,
        Makassar: results.sby_mks || 0,
        Balikpapan: results.sby_bpa || 0,
      },
      Medan: {
        Bandung: results.mdn_bdg || 0,
        Semarang: results.mdn_smg || 0,
        Makassar: results.mdn_mks || 0,
        Balikpapan: results.mdn_bpa || 0,
      },
    },
  };
}