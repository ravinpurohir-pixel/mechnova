import React, { useState } from 'react';
import { ApiService } from '../services/api';
import { CalculationResult } from '../types';
import {
  Calculator as CalcIcon,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileCheck2,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const Calculator: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<string>('stress_strain');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calcResult, setCalcResult] = useState<CalculationResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Input states for each calculator
  const [inputs, setInputs] = useState<Record<string, number>>({
    force: 15000,
    area: 75,
    original_length: 250,
    change_in_length: 0.15,
    rpm: 1450,
    torque_nm: 220,
    driving_teeth: 18,
    driven_teeth: 54,
    input_rpm: 1450,
    output_power: 18.5,
    input_power: 21.0,
    pressure_bar: 6.5,
    area_m2: 0.025,
    thermal_conductivity: 45, // W/mK for steel
    temp_hot: 180,
    temp_cold: 35,
    thickness_m: 0.015,
    pipe_diameter_mm: 50,
    flow_velocity_m_s: 2.2,
    temp_hot_celsius: 350,
    temp_cold_celsius: 40,
    stress_mpa: 250,
    strain: 0.0012,
    mass_kg: 85,
    volume_m3: 0.011,
    convert_value: 100,
  });

  const [unitMode, setUnitMode] = useState<string>('bar_to_psi');

  const calculatorList = [
    { id: 'stress_strain', label: 'Stress & Strain', category: 'Solid Mechanics' },
    { id: 'youngs_modulus', label: "Young's Modulus (E)", category: 'Materials' },
    { id: 'torque_power', label: 'Torque & Power', category: 'Machinery' },
    { id: 'gear_ratio', label: 'Gear Ratio & Speed', category: 'Transmission' },
    { id: 'efficiency', label: 'Mechanical Efficiency', category: 'Thermodynamics' },
    { id: 'pressure_force', label: 'Pressure & Force', category: 'Fluids & Hydraulics' },
    { id: 'heat_transfer', label: 'Heat Conduction (Fourier)', category: 'Thermal' },
    { id: 'fluid_flow', label: 'Pipe Flow & Velocity', category: 'Fluid Mechanics' },
    { id: 'thermodynamics', label: 'Carnot Efficiency', category: 'Thermodynamics' },
    { id: 'density', label: 'Density & Specific Weight', category: 'Fluids' },
    { id: 'unit_conversion', label: 'Engineering Unit Converter', category: 'Conversions' }
  ];

  const handleInputChange = (field: string, val: string) => {
    const num = parseFloat(val);
    setInputs((prev) => ({ ...prev, [field]: isNaN(num) ? 0 : num }));
    setValidationError(null);
  };

  const runCalculation = async () => {
    setLoading(true);
    setValidationError(null);

    try {
      if (activeCalc === 'unit_conversion') {
        // Direct exact physical unit conversion
        const val = inputs.convert_value || 0;
        let converted = 0;
        let fromUnit = '';
        let toUnit = '';
        let formulaStr = '';

        if (unitMode === 'bar_to_psi') {
          converted = val * 14.5038;
          fromUnit = 'bar';
          toUnit = 'psi';
          formulaStr = '1 bar = 14.5038 psi';
        } else if (unitMode === 'psi_to_bar') {
          converted = val / 14.5038;
          fromUnit = 'psi';
          toUnit = 'bar';
          formulaStr = '1 psi = 0.0689476 bar';
        } else if (unitMode === 'kw_to_hp') {
          converted = val * 1.34102;
          fromUnit = 'kW';
          toUnit = 'Metric / Imperial HP';
          formulaStr = '1 kW = 1.34102 HP';
        } else if (unitMode === 'mpa_to_psi') {
          converted = val * 145.038;
          fromUnit = 'MPa';
          toUnit = 'psi';
          formulaStr = '1 MPa = 145.038 psi';
        } else if (unitMode === 'c_to_k') {
          converted = val + 273.15;
          fromUnit = '°C';
          toUnit = 'Kelvin (K)';
          formulaStr = 'K = °C + 273.15';
        }

        setCalcResult({
          calculator_type: 'unit_conversion',
          result: {
            input_value: val,
            converted_value: parseFloat(converted.toFixed(4)),
            from_unit: fromUnit,
            to_unit: toUnit
          },
          formula: formulaStr,
          steps: [
            `1. Input: ${val} ${fromUnit}`,
            `2. Multiplied by conversion standard constant`,
            `3. Result: ${converted.toFixed(4)} ${toUnit}`
          ],
          assumptions: ['Standard international scientific conversion constants'],
          valid: true
        });
      } else if (activeCalc === 'density') {
        const m = inputs.mass_kg || 0;
        const v = inputs.volume_m3 || 1;
        if (v <= 0) throw new Error('Volume must be strictly positive.');
        const rho = m / v;
        const spec_weight = rho * 9.80665;
        const spec_gravity = rho / 1000.0;

        setCalcResult({
          calculator_type: 'density',
          result: {
            density_kg_m3: parseFloat(rho.toFixed(2)),
            specific_weight_n_m3: parseFloat(spec_weight.toFixed(2)),
            specific_gravity: parseFloat(spec_gravity.toFixed(4))
          },
          formula: 'ρ = m / V,  γ = ρ × g,  SG = ρ / 1000',
          steps: [
            `1. Mass m = ${m} kg, Volume V = ${v} m³`,
            `2. Density ρ = ${m} / ${v} = ${rho.toFixed(2)} kg/m³`,
            `3. Specific Weight γ = ${rho.toFixed(2)} × 9.80665 = ${spec_weight.toFixed(2)} N/m³`,
            `4. Specific Gravity SG (relative to pure water @ 4°C) = ${spec_gravity.toFixed(4)}`
          ],
          assumptions: ['Uniform homogeneous material density distribution'],
          valid: true
        });
      } else {
        const res = await ApiService.calculate(activeCalc, inputs);
        if (!res.valid) {
          setValidationError(res.message || 'Calculation input invalid.');
        } else {
          setCalcResult(res);
        }
      }
    } catch (e: any) {
      setValidationError(e?.message || 'Error executing calculation.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCalcResult(null);
    setValidationError(null);
  };

  const handleCopy = () => {
    if (!calcResult) return;
    const text = `MechNova Engineering Calculation:\nType: ${calcResult.calculator_type}\nFormula: ${calcResult.formula}\nResults: ${JSON.stringify(calcResult.result, null, 2)}\nSteps:\n${calcResult.steps.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-navy-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">Engineering Calculator</h1>
          <span className="text-[10px] font-bold bg-primary/20 border border-primary/40 text-cyan-accent px-2 py-0.5 rounded-full uppercase">
            Rigorous Physics
          </span>
        </div>
        <p className="text-xs text-slate-300 mt-1">
          Exact computational calculators with formula derivations, step-by-step intermediate calculations, unit selections, and explicit assumptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Calculator Selector */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
            Choose Calculation (12 Categories)
          </span>
          <div className="space-y-1.5">
            {calculatorList.map((calc) => {
              const isSelected = activeCalc === calc.id;
              return (
                <button
                  key={calc.id}
                  onClick={() => {
                    setActiveCalc(calc.id);
                    setCalcResult(null);
                    setValidationError(null);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-glow-primary'
                      : 'bg-navy-900 border-navy-800 text-slate-300 hover:border-navy-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CalcIcon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-cyan-accent'}`} />
                    <span>{calc.label}</span>
                  </div>
                  <span className={`text-[9px] uppercase font-mono ${isSelected ? 'text-cyan-accent font-bold' : 'text-slate-300'}`}>
                    {calc.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Dynamic Inputs & Output Results */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 shadow-card-soft space-y-5">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-accent" />
                <span>
                  {calculatorList.find((c) => c.id === activeCalc)?.label || 'Engineering Calculator'}
                </span>
              </h2>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Inputs Grid depending on active calculator */}
            {activeCalc === 'stress_strain' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Applied Force F (N)</label>
                  <input
                    type="number"
                    value={inputs.force}
                    onChange={(e) => handleInputChange('force', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cross-sectional Area A (mm²)</label>
                  <input
                    type="number"
                    value={inputs.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Original Gauge Length L₀ (mm)</label>
                  <input
                    type="number"
                    value={inputs.original_length}
                    onChange={(e) => handleInputChange('original_length', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Elongation / Deflection ΔL (mm)</label>
                  <input
                    type="number"
                    value={inputs.change_in_length}
                    onChange={(e) => handleInputChange('change_in_length', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>
            )}

            {activeCalc === 'youngs_modulus' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Normal Stress σ (MPa)</label>
                  <input
                    type="number"
                    value={inputs.stress_mpa}
                    onChange={(e) => handleInputChange('stress_mpa', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Engineering Strain ε (dimensionless)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={inputs.strain}
                    onChange={(e) => handleInputChange('strain', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>
            )}

            {activeCalc === 'torque_power' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rotational Speed N (RPM)</label>
                  <input
                    type="number"
                    value={inputs.rpm}
                    onChange={(e) => handleInputChange('rpm', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Applied Torque T (N·m)</label>
                  <input
                    type="number"
                    value={inputs.torque_nm}
                    onChange={(e) => handleInputChange('torque_nm', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>
            )}

            {activeCalc === 'gear_ratio' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Driving Pinion Teeth (Z₁)</label>
                  <input
                    type="number"
                    value={inputs.driving_teeth}
                    onChange={(e) => handleInputChange('driving_teeth', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Driven Gear Teeth (Z₂)</label>
                  <input
                    type="number"
                    value={inputs.driven_teeth}
                    onChange={(e) => handleInputChange('driven_teeth', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Input Speed N₁ (RPM)</label>
                  <input
                    type="number"
                    value={inputs.input_rpm}
                    onChange={(e) => handleInputChange('input_rpm', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>
            )}

            {activeCalc === 'efficiency' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Output Power (kW)</label>
                  <input
                    type="number"
                    value={inputs.output_power}
                    onChange={(e) => handleInputChange('output_power', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Input Power (kW)</label>
                  <input
                    type="number"
                    value={inputs.input_power}
                    onChange={(e) => handleInputChange('input_power', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>
            )}

            {activeCalc === 'pressure_force' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">System Pressure (bar)</label>
                  <input
                    type="number"
                    value={inputs.pressure_bar}
                    onChange={(e) => handleInputChange('pressure_bar', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Surface Area (m²)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={inputs.area_m2}
                    onChange={(e) => handleInputChange('area_m2', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>
            )}

            {activeCalc === 'heat_transfer' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Conductivity k (W/m·K)</label>
                  <input
                    type="number"
                    value={inputs.thermal_conductivity}
                    onChange={(e) => handleInputChange('thermal_conductivity', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Wall Surface Area (m²)</label>
                  <input
                    type="number"
                    value={inputs.area_m2}
                    onChange={(e) => handleInputChange('area_m2', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Wall Thickness (m)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={inputs.thickness_m}
                    onChange={(e) => handleInputChange('thickness_m', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hot Temp T₁ (°C)</label>
                  <input
                    type="number"
                    value={inputs.temp_hot}
                    onChange={(e) => handleInputChange('temp_hot', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cold Temp T₂ (°C)</label>
                  <input
                    type="number"
                    value={inputs.temp_cold}
                    onChange={(e) => handleInputChange('temp_cold', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>
            )}

            {activeCalc === 'fluid_flow' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pipe Inner Diameter (mm)</label>
                  <input
                    type="number"
                    value={inputs.pipe_diameter_mm}
                    onChange={(e) => handleInputChange('pipe_diameter_mm', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mean Velocity v (m/s)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.flow_velocity_m_s}
                    onChange={(e) => handleInputChange('flow_velocity_m_s', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>
            )}

            {activeCalc === 'thermodynamics' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hot Reservoir T_H (°C)</label>
                  <input
                    type="number"
                    value={inputs.temp_hot_celsius}
                    onChange={(e) => handleInputChange('temp_hot_celsius', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cold Reservoir T_L (°C)</label>
                  <input
                    type="number"
                    value={inputs.temp_cold_celsius}
                    onChange={(e) => handleInputChange('temp_cold_celsius', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>
            )}

            {activeCalc === 'density' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mass m (kg)</label>
                  <input
                    type="number"
                    value={inputs.mass_kg}
                    onChange={(e) => handleInputChange('mass_kg', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Displaced Volume V (m³)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={inputs.volume_m3}
                    onChange={(e) => handleInputChange('volume_m3', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>
            )}

            {activeCalc === 'unit_conversion' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Conversion Mode</label>
                  <select
                    value={unitMode}
                    onChange={(e) => setUnitMode(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  >
                    <option value="bar_to_psi">Pressure: Bar to PSI</option>
                    <option value="psi_to_bar">Pressure: PSI to Bar</option>
                    <option value="kw_to_hp">Power: Kilowatt (kW) to Horsepower (HP)</option>
                    <option value="mpa_to_psi">Stress: MPa to PSI</option>
                    <option value="c_to_k">Temperature: Celsius (°C) to Kelvin (K)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Magnitude to Convert</label>
                  <input
                    type="number"
                    value={inputs.convert_value}
                    onChange={(e) => handleInputChange('convert_value', e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {validationError && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Submit Calculate Button */}
            <button
              onClick={runCalculation}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-cyan-muted hover:from-primary-hover hover:to-primary text-white text-xs font-bold py-3 rounded-xl shadow-glow-primary transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CalcIcon className="w-4 h-4" />
              <span>{loading ? 'Computing Formulas...' : 'Calculate Step-by-Step Result'}</span>
            </button>

            {/* Calculation Output Card */}
            {calcResult && (
              <div className="mt-4 pt-4 border-t border-navy-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-accent uppercase tracking-wider">
                    Mathematical Output & Derivation
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-xs bg-navy-800 hover:bg-navy-700 border border-navy-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Primary Result Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(calcResult.result).map(([key, val]) => (
                    <div key={key} className="bg-navy-950 p-3 rounded-xl border border-navy-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider truncate block">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <p className="text-lg font-black text-white font-mono mt-1">
                        {typeof val === 'number' ? val.toLocaleString() : String(val)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Formula Box */}
                <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">Governing Formula:</span>
                  <span className="text-sm font-mono font-bold text-cyan-accent">{calcResult.formula}</span>
                </div>

                {/* Derivation Steps */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-300 block mb-1">Step-by-Step Derivation</span>
                  {calcResult.steps.map((st, i) => (
                    <div key={i} className="text-xs font-mono text-slate-200 bg-navy-950/70 p-2.5 rounded-lg border border-navy-800">
                      {st}
                    </div>
                  ))}
                </div>

                {/* Physical Assumptions */}
                {calcResult.assumptions && calcResult.assumptions.length > 0 && (
                  <div className="text-[11px] text-slate-400 bg-navy-950/40 p-3 rounded-xl border border-navy-800 space-y-1">
                    <span className="font-bold text-slate-300 block">Engineering Assumptions Applied:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {calcResult.assumptions.map((asmp, i) => (
                        <li key={i}>{asmp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
