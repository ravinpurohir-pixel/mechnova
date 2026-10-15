import math
from typing import Dict, Any, List

class EngineeringService:
    @staticmethod
    def calculate_stress_strain(inputs: Dict[str, float]) -> Dict[str, Any]:
        """
        Calculates tensile/compressive stress and strain.
        Inputs: force (N), area (mm² or m²), original_length (mm or m), change_in_length (mm or m)
        """
        force = inputs.get("force")  # N
        area_mm2 = inputs.get("area")  # mm²
        orig_len = inputs.get("original_length")
        delta_len = inputs.get("change_in_length")

        if force is None or area_mm2 is None or area_mm2 <= 0:
            raise ValueError("Force and positive Area are required.")

        # Stress in MPa (N/mm²) and Pa (N/m²)
        stress_mpa = force / area_mm2
        stress_pa = stress_mpa * 1e6

        strain = None
        steps = [
            f"1. Given Force F = {force} N, Cross-sectional Area A = {area_mm2} mm²",
            f"2. Normal Stress σ = F / A = {force} / {area_mm2} = {stress_mpa:.4f} MPa (N/mm²)",
            f"3. In SI Units: σ = {stress_pa:.2e} Pa"
        ]

        if orig_len and delta_len is not None and orig_len > 0:
            strain = delta_len / orig_len
            steps.append(f"4. Given Original Length L₀ = {orig_len}, Elongation ΔL = {delta_len}")
            steps.append(f"5. Engineering Strain ε = ΔL / L₀ = {delta_len} / {orig_len} = {strain:.6f} (dimensionless, {strain * 100:.4f}%)")

        return {
            "result": {
                "stress_mpa": round(stress_mpa, 4),
                "stress_pa": stress_pa,
                "strain": round(strain, 6) if strain is not None else None,
                "strain_percentage": round(strain * 100, 4) if strain is not None else None
            },
            "formula": "σ = F / A,  ε = ΔL / L₀",
            "steps": steps,
            "assumptions": [
                "Uniaxial loading applied through the centroid",
                "Homogeneous and isotropic material behavior",
                "Elastic deformation within proportional limit"
            ]
        }

    @staticmethod
    def calculate_youngs_modulus(inputs: Dict[str, float]) -> Dict[str, Any]:
        stress_mpa = inputs.get("stress_mpa")
        strain = inputs.get("strain")

        if stress_mpa is None or strain is None or strain <= 0:
            raise ValueError("Stress and positive Strain are required.")

        youngs_gpa = (stress_mpa / strain) / 1000.0  # GPa
        youngs_mpa = stress_mpa / strain

        return {
            "result": {
                "youngs_modulus_gpa": round(youngs_gpa, 3),
                "youngs_modulus_mpa": round(youngs_mpa, 2)
            },
            "formula": "E = σ / ε",
            "steps": [
                f"1. Normal Stress σ = {stress_mpa} MPa",
                f"2. Strain ε = {strain}",
                f"3. Young's Modulus E = σ / ε = {stress_mpa} / {strain} = {youngs_mpa:.2f} MPa = {youngs_gpa:.3f} GPa"
            ],
            "assumptions": [
                "Hooke's Law is valid (within linear elastic region)",
                "No plastic yielding occurred"
            ]
        }

    @staticmethod
    def calculate_torque_power(inputs: Dict[str, float]) -> Dict[str, Any]:
        """
        Inputs: rpm (N), power_kw (kW) or torque_nm (Nm)
        """
        rpm = inputs.get("rpm")
        power_kw = inputs.get("power_kw")
        torque_nm = inputs.get("torque_nm")

        if rpm is None or rpm <= 0:
            raise ValueError("RPM must be greater than 0.")

        omega = (2 * math.pi * rpm) / 60.0  # rad/s

        if torque_nm is not None:
            # Calculate Power
            power_watts = torque_nm * omega
            calc_power_kw = power_watts / 1000.0
            calc_power_hp = calc_power_kw * 1.34102
            return {
                "result": {
                    "power_kw": round(calc_power_kw, 3),
                    "power_hp": round(calc_power_hp, 3),
                    "torque_nm": round(torque_nm, 2),
                    "angular_velocity_rad_s": round(omega, 3)
                },
                "formula": "P = (2 * π * N * T) / 60,000  [kW]",
                "steps": [
                    f"1. Rotational speed N = {rpm} RPM",
                    f"2. Angular velocity ω = 2πN / 60 = 2 * π * {rpm} / 60 = {omega:.3f} rad/s",
                    f"3. Applied Torque T = {torque_nm} N·m",
                    f"4. Power P = T * ω = {torque_nm} * {omega:.3f} = {power_watts:.2f} W = {calc_power_kw:.3f} kW ({calc_power_hp:.3f} HP)"
                ],
                "assumptions": ["Constant speed steady-state operation", "No frictional loss accounted in ideal torque-power relation"]
            }
        elif power_kw is not None:
            # Calculate Torque
            power_watts = power_kw * 1000.0
            calc_torque = power_watts / omega
            return {
                "result": {
                    "torque_nm": round(calc_torque, 3),
                    "power_kw": round(power_kw, 3),
                    "angular_velocity_rad_s": round(omega, 3)
                },
                "formula": "T = (60,000 * P) / (2 * π * N)  [N·m]",
                "steps": [
                    f"1. Power P = {power_kw} kW = {power_watts} W",
                    f"2. Rotational speed N = {rpm} RPM",
                    f"3. Angular velocity ω = 2πN / 60 = {omega:.3f} rad/s",
                    f"4. Shaft Torque T = P / ω = {power_watts} / {omega:.3f} = {calc_torque:.3f} N·m"
                ],
                "assumptions": ["Pure torsional loading without bending moments"]
            }
        else:
            raise ValueError("Provide either torque_nm or power_kw alongside rpm.")

    @staticmethod
    def calculate_gear_ratio(inputs: Dict[str, float]) -> Dict[str, Any]:
        """
        Inputs: driving_teeth (Z1), driven_teeth (Z2), input_rpm (N1)
        """
        z1 = inputs.get("driving_teeth")
        z2 = inputs.get("driven_teeth")
        n1 = inputs.get("input_rpm")

        if not z1 or not z2 or z1 <= 0 or z2 <= 0:
            raise ValueError("Number of teeth on driving (Z1) and driven (Z2) gears must be positive integers.")

        gear_ratio = z2 / z1
        output_rpm = (n1 / gear_ratio) if n1 else None

        steps = [
            f"1. Driving gear teeth Z₁ = {int(z1)}, Driven gear teeth Z₂ = {int(z2)}",
            f"2. Gear Ratio i = Z₂ / Z₁ = {int(z2)} / {int(z1)} = {gear_ratio:.4f}"
        ]
        if output_rpm is not None:
            steps.append(f"3. Input Speed N₁ = {n1} RPM")
            steps.append(f"4. Output Speed N₂ = N₁ / i = {n1} / {gear_ratio:.4f} = {output_rpm:.2f} RPM")
            torque_multiplier = gear_ratio
            steps.append(f"5. Ideal Torque Multiplier = {torque_multiplier:.4f}x (ignoring friction)")

        return {
            "result": {
                "gear_ratio": round(gear_ratio, 4),
                "reduction_type": "Speed Reduction / Torque Amplification" if gear_ratio > 1 else "Speed Increaser",
                "output_rpm": round(output_rpm, 2) if output_rpm else None
            },
            "formula": "i = Z₂ / Z₁ = N₁ / N₂",
            "steps": steps,
            "assumptions": ["Involute profile standard spur/helical gearing", "100% mechanical efficiency (ideal condition)"]
        }

    @staticmethod
    def calculate_mechanical_efficiency(inputs: Dict[str, float]) -> Dict[str, Any]:
        work_out = inputs.get("output_power")
        work_in = inputs.get("input_power")

        if work_out is None or work_in is None or work_in <= 0:
            raise ValueError("Output and positive Input power/work must be provided.")
        if work_out > work_in:
            raise ValueError("Output power cannot exceed Input power (Conservation of Energy).")

        efficiency = (work_out / work_in) * 100.0
        loss = work_in - work_out

        return {
            "result": {
                "efficiency_percent": round(efficiency, 2),
                "power_loss": round(loss, 3)
            },
            "formula": "η = (P_out / P_in) × 100%",
            "steps": [
                f"1. Output Power P_out = {work_out}",
                f"2. Input Power P_in = {work_in}",
                f"3. Efficiency η = ({work_out} / {work_in}) × 100 = {efficiency:.2f}%",
                f"4. Energy Loss (heat, friction, drag) = {loss:.3f} ({100 - efficiency:.2f}%)"
            ],
            "assumptions": ["Steady state operation"]
        }

    @staticmethod
    def calculate_pressure_force(inputs: Dict[str, float]) -> Dict[str, Any]:
        force_n = inputs.get("force_n")
        area_m2 = inputs.get("area_m2")
        pressure_bar = inputs.get("pressure_bar")

        if force_n is not None and area_m2 is not None and area_m2 > 0:
            p_pa = force_n / area_m2
            p_bar = p_pa / 100000.0
            p_psi = p_bar * 14.5038
            return {
                "result": {
                    "pressure_pa": round(p_pa, 2),
                    "pressure_bar": round(p_bar, 4),
                    "pressure_psi": round(p_psi, 3)
                },
                "formula": "P = F / A",
                "steps": [
                    f"1. Applied Force F = {force_n} N",
                    f"2. Contact Area A = {area_m2} m²",
                    f"3. Pressure P = {force_n} / {area_m2} = {p_pa:.2f} Pa = {p_bar:.4f} bar ({p_psi:.3f} psi)"
                ],
                "assumptions": ["Uniform pressure distribution over plane surface"]
            }
        elif pressure_bar is not None and area_m2 is not None:
            p_pa = pressure_bar * 100000.0
            f = p_pa * area_m2
            return {
                "result": {
                    "force_n": round(f, 2),
                    "force_kn": round(f / 1000.0, 3)
                },
                "formula": "F = P × A",
                "steps": [
                    f"1. Pressure P = {pressure_bar} bar = {p_pa} Pa",
                    f"2. Area A = {area_m2} m²",
                    f"3. Force F = P × A = {p_pa} × {area_m2} = {f:.2f} N = {f/1000.0:.3f} kN"
                ],
                "assumptions": ["Perpendicular applied pressure"]
            }
        else:
            raise ValueError("Provide valid Force and Area, or Pressure and Area.")

    @staticmethod
    def calculate_heat_transfer_conduction(inputs: Dict[str, float]) -> Dict[str, Any]:
        """
        Fourier's Law: Q = (k * A * (T_hot - T_cold)) / L
        """
        k = inputs.get("thermal_conductivity")  # W/m·K
        a = inputs.get("area_m2")
        t_hot = inputs.get("temp_hot")
        t_cold = inputs.get("temp_cold")
        thickness_m = inputs.get("thickness_m")

        if not all([k, a, thickness_m]) or thickness_m <= 0:
            raise ValueError("Thermal conductivity (k), Area (A), and positive Thickness (L) are required.")

        delta_t = abs(t_hot - t_cold)
        q_watts = (k * a * delta_t) / thickness_m
        heat_flux = q_watts / a

        return {
            "result": {
                "heat_transfer_rate_w": round(q_watts, 2),
                "heat_transfer_kw": round(q_watts / 1000.0, 4),
                "heat_flux_w_m2": round(heat_flux, 2)
            },
            "formula": "Q = (k · A · ΔT) / L",
            "steps": [
                f"1. Thermal Conductivity k = {k} W/m·K",
                f"2. Surface Area A = {a} m², Thickness L = {thickness_m} m",
                f"3. Temperature Difference ΔT = |{t_hot} - {t_cold}| = {delta_t:.2f} K or °C",
                f"4. Heat Flow Rate Q = ({k} × {a} × {delta_t}) / {thickness_m} = {q_watts:.2f} Watts",
                f"5. Heat Flux q'' = Q / A = {heat_flux:.2f} W/m²"
            ],
            "assumptions": ["1D steady-state conduction through flat wall", "Constant material thermal conductivity"]
        }

    @staticmethod
    def calculate_fluid_flow(inputs: Dict[str, float]) -> Dict[str, Any]:
        """
        Continuity: Q = A * v
        For round pipe: A = π * (d/2)²
        """
        diameter_mm = inputs.get("pipe_diameter_mm")
        velocity_m_s = inputs.get("flow_velocity_m_s")
        flow_rate_lpm = inputs.get("flow_rate_liters_min")

        if diameter_mm is None or diameter_mm <= 0:
            raise ValueError("Pipe diameter must be positive.")

        radius_m = (diameter_mm / 1000.0) / 2.0
        area_m2 = math.pi * (radius_m ** 2)

        if velocity_m_s is not None and velocity_m_s >= 0:
            q_m3_s = area_m2 * velocity_m_s
            q_liters_sec = q_m3_s * 1000.0
            q_lpm = q_liters_sec * 60.0
            return {
                "result": {
                    "pipe_area_m2": round(area_m2, 6),
                    "flow_rate_m3_s": round(q_m3_s, 6),
                    "flow_rate_liters_sec": round(q_liters_sec, 3),
                    "flow_rate_lpm": round(q_lpm, 2)
                },
                "formula": "Q = A × v  where A = π(D/2)²",
                "steps": [
                    f"1. Pipe inner diameter D = {diameter_mm} mm = {diameter_mm/1000.0} m",
                    f"2. Cross-sectional Area A = π × ({diameter_mm/2000.0})² = {area_m2:.6f} m²",
                    f"3. Flow velocity v = {velocity_m_s} m/s",
                    f"4. Volumetric Flow Q = A × v = {q_m3_s:.6f} m³/s = {q_lpm:.2f} Liters/min"
                ],
                "assumptions": ["Incompressible fluid", "Fully developed velocity profile"]
            }
        elif flow_rate_lpm is not None and flow_rate_lpm >= 0:
            q_m3_s = (flow_rate_lpm / 60.0) / 1000.0
            v_calc = q_m3_s / area_m2
            return {
                "result": {
                    "flow_velocity_m_s": round(v_calc, 3),
                    "pipe_area_m2": round(area_m2, 6)
                },
                "formula": "v = Q / A",
                "steps": [
                    f"1. Pipe inner diameter D = {diameter_mm} mm -> Area A = {area_m2:.6f} m²",
                    f"2. Volumetric Flow Q = {flow_rate_lpm} L/min = {q_m3_s:.6f} m³/s",
                    f"3. Mean Velocity v = Q / A = {v_calc:.3f} m/s"
                ],
                "assumptions": ["Uniform velocity approximation"]
            }
        else:
            raise ValueError("Provide either flow velocity or flow rate.")

    @staticmethod
    def calculate_thermodynamics(inputs: Dict[str, float]) -> Dict[str, Any]:
        """
        Carnot Thermal Efficiency: η = 1 - (T_cold / T_hot) [Temperatures in Kelvin]
        """
        t_hot_c = inputs.get("temp_hot_celsius")
        t_cold_c = inputs.get("temp_cold_celsius")

        if t_hot_c is None or t_cold_c is None:
            raise ValueError("Both hot and cold temperatures are required.")

        t_hot_k = t_hot_c + 273.15
        t_cold_k = t_cold_c + 273.15

        if t_cold_k >= t_hot_k:
            raise ValueError("Hot reservoir temperature must be strictly greater than cold reservoir temperature.")
        if t_cold_k <= 0:
            raise ValueError("Temperature cannot be at or below absolute zero.")

        carnot_eff = (1 - (t_cold_k / t_hot_k)) * 100.0

        return {
            "result": {
                "carnot_efficiency_percent": round(carnot_eff, 2),
                "t_hot_kelvin": round(t_hot_k, 2),
                "t_cold_kelvin": round(t_cold_k, 2)
            },
            "formula": "η_Carnot = 1 - (T_L / T_H)",
            "steps": [
                f"1. Reservoir Hot: {t_hot_c}°C + 273.15 = {t_hot_k:.2f} K",
                f"2. Reservoir Cold: {t_cold_c}°C + 273.15 = {t_cold_k:.2f} K",
                f"3. Ideal Carnot Efficiency η = 1 - ({t_cold_k:.2f} / {t_hot_k:.2f}) = {carnot_eff:.2f}%",
                "4. This represents the theoretical maximum efficiency possible by the Second Law of Thermodynamics."
            ],
            "assumptions": ["Reversible Carnot Cycle operating between two thermal reservoirs"]
        }
