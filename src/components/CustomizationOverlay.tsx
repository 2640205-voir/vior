import {
  calculateLaunchCostBreakdown,
  FUEL_ORDER,
  MATERIAL_DISCLAIMER,
  MATERIAL_ORDER,
  MISSION_BUDGET_MILLIONS,
  SHUTTLE_FUELS,
  SHUTTLE_MATERIALS,
} from '../game/materials';
import type { FuelId, MaterialId } from '../types/game';

interface CustomizationOverlayProps {
  selectedMaterial: MaterialId;
  selectedFuel: FuelId;
  onSelectMaterial: (id: MaterialId) => void;
  onSelectFuel: (id: FuelId) => void;
  onLaunch: () => void;
  onBack: () => void;
}

export function CustomizationOverlay({
  selectedMaterial,
  selectedFuel,
  onSelectMaterial,
  onSelectFuel,
  onLaunch,
  onBack,
}: CustomizationOverlayProps) {
  const mat = SHUTTLE_MATERIALS[selectedMaterial];
  const fuel = SHUTTLE_FUELS[selectedFuel];
  const cost = calculateLaunchCostBreakdown(mat, fuel, 100);

  const suitabilityColor =
    mat.launchSuitability === 'Excellent' || mat.launchSuitability === 'Good'
      ? 'text-emerald-300'
      : mat.launchSuitability === 'Moderate'
      ? 'text-amber-300'
      : 'text-rose-400';

  return (
    <div
      className="fixed inset-0 z-20 flex flex-col justify-between p-3 sm:p-4 md:p-6 pointer-events-none"
      data-testid="customization-overlay"
    >
      {/* Top Minimal Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="hud-surface px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg pointer-events-auto">
          <h2 className="font-display text-xs sm:text-sm md:text-base font-bold tracking-[0.16em] text-white">
            SHUTTLE CONFIGURATION
          </h2>
          <p className="text-[11px] sm:text-xs text-sky-300/90 mt-0.5">
            Drag anywhere on the viewport to inspect the orbiter in 360°
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="nasa-btn-secondary pointer-events-auto px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg text-[11px] sm:text-xs font-display font-semibold tracking-[0.14em] text-slate-200 whitespace-nowrap cursor-pointer"
        >
          MAIN MENU
        </button>
      </div>

      {/* Unified Bottom Control Dock leaving center 3D shuttle 100% unobstructed */}
      <div className="w-full max-w-5xl mx-auto pointer-events-auto">
        <div className="hud-surface-strong rounded-xl p-3.5 sm:p-4 md:p-5 flex flex-col gap-3 max-h-[54vh] overflow-y-auto hud-scroll">
          {/* Material Selector + Launch Row */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" role="radiogroup" aria-label="Shuttle Hull Material">
              {MATERIAL_ORDER.map((id) => {
                const item = SHUTTLE_MATERIALS[id];
                const active = id === selectedMaterial;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onSelectMaterial(id)}
                    className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-display font-semibold tracking-[0.1em] flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
                      active
                        ? 'bg-sky-500/25 border border-sky-400 text-white shadow-[0_0_16px_rgba(56,189,248,0.35)]'
                        : 'bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:border-sky-400/60 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/40 shrink-0"
                      style={{ backgroundColor: item.swatchCss }}
                      aria-hidden="true"
                    />
                    <span>{item.name}</span>
                    <span className="font-mono-tabular text-[10px] sm:text-[11px] text-amber-300">
                      ${item.materialCostMillions}M
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onLaunch}
              className="nasa-btn-primary px-6 sm:px-7 py-2.5 sm:py-3 rounded-lg font-display text-xs sm:text-sm md:text-base font-extrabold tracking-[0.2em] text-white whitespace-nowrap cursor-pointer"
            >
              LAUNCH
            </button>
          </div>

          {/* Propellant / Fuel Grade Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-sky-500/15">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" role="radiogroup" aria-label="Shuttle Propellant Fuel">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 mr-1">
                Propellant:
              </span>
              {FUEL_ORDER.map((fid) => {
                const item = SHUTTLE_FUELS[fid];
                const active = fid === selectedFuel;
                return (
                  <button
                    key={fid}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    data-testid={`fuel-option-${fid}`}
                    onClick={() => onSelectFuel(fid)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] font-display font-semibold tracking-wider flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
                      active
                        ? 'bg-amber-500/20 border border-amber-400 text-white shadow-[0_0_14px_rgba(251,191,36,0.28)]'
                        : 'bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:border-amber-400/60 hover:text-white'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="font-mono-tabular text-[10px] text-amber-300">
                      ${item.fuelCostMillions}M
                    </span>
                    <span className="hidden md:inline text-[10px] font-sans font-normal text-slate-400">
                      ({item.efficiencyLabel})
                    </span>
                  </button>
                );
              })}
            </div>

            <span
              data-testid="budget-status"
              className={`px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-display font-bold tracking-wider whitespace-nowrap ${
                cost.withinBudget
                  ? 'bg-emerald-950/70 border border-emerald-400/50 text-emerald-300'
                  : 'bg-rose-950/70 border border-rose-400/50 text-rose-300'
              }`}
            >
              {cost.withinBudget
                ? `WITHIN $${MISSION_BUDGET_MILLIONS}M BUDGET`
                : `OVER $${MISSION_BUDGET_MILLIONS}M BUDGET`}
            </span>
          </div>

          {/* Dynamic Material & Costing Information Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 pt-2.5 border-t border-sky-500/20">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                Hull Material
              </span>
              <span className="font-display text-xs sm:text-sm font-bold text-white">{mat.name}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                Density
              </span>
              <span className="font-mono-tabular text-xs sm:text-sm font-semibold text-sky-300">
                {mat.densityLabel}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                Weight / Heat
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-100">
                {mat.weightClass} · {mat.heatResistance}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                Launch Suitability
              </span>
              <span className={`text-xs sm:text-sm font-bold ${suitabilityColor}`}>{mat.launchSuitability}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                Material Cost
              </span>
              <span className="font-mono-tabular text-xs sm:text-sm font-bold text-amber-300" data-testid="material-cost">
                ${cost.materialCostMillions.toFixed(1)}M
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                Fuel Tank (Est. Burn)
              </span>
              <span className="font-mono-tabular text-xs sm:text-sm font-bold text-sky-300" data-testid="fuel-cost">
                ${cost.fuelTankCostMillions.toFixed(1)}M
                <span className="text-[10px] text-slate-400 font-normal"> (~${cost.estimatedAscentFuelCostMillions.toFixed(1)}M)</span>
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                Total Launch Cost
              </span>
              <span
                className={`font-mono-tabular text-xs sm:text-sm font-extrabold ${
                  cost.withinBudget ? 'text-emerald-300' : 'text-rose-300'
                }`}
                data-testid="total-launch-cost"
              >
                ${cost.totalLaunchCostMillions.toFixed(1)}M
              </span>
            </div>
          </div>

          <p className="text-[10px] sm:text-[11px] text-slate-400 leading-snug">
            {MATERIAL_DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  );
}

