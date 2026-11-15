import type { FuelId, MaterialId, ShuttleFuelSpec, ShuttleMaterialSpec } from '../types/game';

export const MATERIAL_ORDER: MaterialId[] = [
  'ALUMINIUM',
  'SILVER',
  'GOLD',
  'TITANIUM',
  'IRON',
];

export const SHUTTLE_MATERIALS: Record<MaterialId, ShuttleMaterialSpec> = {
  ALUMINIUM: {
    id: 'ALUMINIUM',
    name: 'ALUMINIUM',
    densityLabel: '2.70 g/cm³',
    densityValue: 2.7,
    weightClass: 'Lightweight',
    heatResistance: 'Medium',
    launchSuitability: 'Good',
    canLaunch: true,
    massKg: 1_950_000,
    fuelBurnMultiplier: 1.0,
    thrustMultiplier: 1.05,
    agilityMultiplier: 1.05,
    materialCostMillions: 45,
    colorHex: 0xd4dbe3,
    swatchCss: '#cbd5e1',
    metalness: 0.86,
    roughness: 0.24,
    clearcoat: 0.35,
    anisotropy: 0.75,
    envMapIntensity: 1.25,
  },
  SILVER: {
    id: 'SILVER',
    name: 'SILVER',
    densityLabel: '10.49 g/cm³',
    densityValue: 10.49,
    weightClass: 'Medium',
    heatResistance: 'Good',
    launchSuitability: 'Moderate',
    canLaunch: true,
    massKg: 2_620_000,
    fuelBurnMultiplier: 1.38,
    thrustMultiplier: 0.88,
    agilityMultiplier: 0.86,
    materialCostMillions: 210,
    colorHex: 0xf1f5f9,
    swatchCss: '#f8fafc',
    metalness: 0.96,
    roughness: 0.12,
    clearcoat: 0.55,
    anisotropy: 0.85,
    envMapIntensity: 1.45,
  },
  GOLD: {
    id: 'GOLD',
    name: 'GOLD',
    densityLabel: '19.32 g/cm³',
    densityValue: 19.32,
    weightClass: 'Very heavy',
    heatResistance: 'High',
    launchSuitability: 'Poor',
    canLaunch: false,
    massKg: 3_650_000,
    fuelBurnMultiplier: 1.9,
    thrustMultiplier: 0.78,
    agilityMultiplier: 0.65,
    materialCostMillions: 640,
    colorHex: 0xf4c44e,
    swatchCss: '#f59e0b',
    metalness: 0.96,
    roughness: 0.16,
    clearcoat: 0.6,
    anisotropy: 0.85,
    envMapIntensity: 1.45,
  },
  TITANIUM: {
    id: 'TITANIUM',
    name: 'TITANIUM',
    densityLabel: '4.51 g/cm³',
    densityValue: 4.51,
    weightClass: 'Lightweight',
    heatResistance: 'Very high',
    launchSuitability: 'Excellent',
    canLaunch: true,
    massKg: 2_040_000,
    fuelBurnMultiplier: 0.9,
    thrustMultiplier: 1.12,
    agilityMultiplier: 1.1,
    materialCostMillions: 128,
    colorHex: 0x9aa4b2,
    swatchCss: '#94a3b8',
    metalness: 0.9,
    roughness: 0.22,
    clearcoat: 0.4,
    anisotropy: 0.85,
    envMapIntensity: 1.3,
  },
  IRON: {
    id: 'IRON',
    name: 'IRON',
    densityLabel: '7.87 g/cm³',
    densityValue: 7.87,
    weightClass: 'Very heavy',
    heatResistance: 'Low',
    launchSuitability: 'Poor',
    canLaunch: false,
    massKg: 3_380_000,
    fuelBurnMultiplier: 1.75,
    thrustMultiplier: 0.8,
    agilityMultiplier: 0.7,
    materialCostMillions: 32,
    colorHex: 0x5c636e,
    swatchCss: '#64748b',
    metalness: 0.82,
    roughness: 0.42,
    clearcoat: 0.15,
    anisotropy: 0.65,
    envMapIntensity: 1.1,
  },
};

export const FUEL_ORDER: FuelId[] = ['STANDARD_LOX', 'CRYO_LH2', 'HYPER_PROP'];

export const SHUTTLE_FUELS: Record<FuelId, ShuttleFuelSpec> = {
  STANDARD_LOX: {
    id: 'STANDARD_LOX',
    name: 'LOX / RP-1',
    subtitle: 'Standard Kerolox',
    fuelCostMillions: 24,
    burnRateMultiplier: 1.0,
    thrustMultiplier: 1.0,
    efficiencyLabel: 'Standard',
  },
  CRYO_LH2: {
    id: 'CRYO_LH2',
    name: 'CRYO LH2',
    subtitle: 'Cryogenic Hydrolox',
    fuelCostMillions: 34,
    burnRateMultiplier: 0.78,
    thrustMultiplier: 1.06,
    efficiencyLabel: '-22% Burn',
  },
  HYPER_PROP: {
    id: 'HYPER_PROP',
    name: 'HYPER-BOOST',
    subtitle: 'High-Thrust Blend',
    fuelCostMillions: 46,
    burnRateMultiplier: 1.18,
    thrustMultiplier: 1.15,
    efficiencyLabel: '+15% Thrust',
  },
};

export const MISSION_BUDGET_MILLIONS = 200;

export interface LaunchCostBreakdown {
  materialCostMillions: number;
  fuelTankCostMillions: number;
  fuelBurnedPercent: number;
  fuelBurnCostMillions: number;
  estimatedAscentBurnPercent: number;
  estimatedAscentFuelCostMillions: number;
  totalLaunchCostMillions: number;
  withinBudget: boolean;
}

export function calculateLaunchCostBreakdown(
  material: ShuttleMaterialSpec,
  fuel: ShuttleFuelSpec,
  fuelPercentRemaining = 100
): LaunchCostBreakdown {
  const clampedFuel = Math.max(0, Math.min(100, fuelPercentRemaining));
  const fuelBurnedPercent = Number((100 - clampedFuel).toFixed(1));
  const fuelBurnCostMillions = Number(((fuelBurnedPercent / 100) * fuel.fuelCostMillions).toFixed(1));
  const estimatedAscentBurnPercent = Math.min(
    100,
    Math.round(32 * material.fuelBurnMultiplier * fuel.burnRateMultiplier)
  );
  const estimatedAscentFuelCostMillions = Number(
    ((estimatedAscentBurnPercent / 100) * fuel.fuelCostMillions).toFixed(1)
  );
  const totalLaunchCostMillions = Number((material.materialCostMillions + fuel.fuelCostMillions).toFixed(1));

  return {
    materialCostMillions: material.materialCostMillions,
    fuelTankCostMillions: fuel.fuelCostMillions,
    fuelBurnedPercent,
    fuelBurnCostMillions,
    estimatedAscentBurnPercent,
    estimatedAscentFuelCostMillions,
    totalLaunchCostMillions,
    withinBudget: totalLaunchCostMillions <= MISSION_BUDGET_MILLIONS,
  };
}

export const MATERIAL_DISCLAIMER =
  'These material and propellant properties are simplified game mechanics. Real spacecraft use multiple specialized alloys, composites, and multi-stage propellants.';

export const LAUNCH_FAILURE_REASON =
  'This material is too heavy / too dense. The thrust is not enough to lift the shuttle. Please try a lighter material like Aluminium or Titanium.';
