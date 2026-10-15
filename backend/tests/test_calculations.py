import pytest
import math
from backend.services.engineering_service import EngineeringService

def test_stress_strain():
    res = EngineeringService.calculate_stress_strain({
        "force": 10000,
        "area": 50,
        "original_length": 200,
        "change_in_length": 0.2
    })
    assert res["result"]["stress_mpa"] == 200.0
    assert res["result"]["strain"] == 0.001
    assert res["result"]["strain_percentage"] == 0.1

def test_youngs_modulus():
    res = EngineeringService.calculate_youngs_modulus({
        "stress_mpa": 200.0,
        "strain": 0.001
    })
    assert res["result"]["youngs_modulus_gpa"] == 200.0
    assert res["result"]["youngs_modulus_mpa"] == 200000.0

def test_torque_power():
    # Power from Torque & RPM
    res = EngineeringService.calculate_torque_power({
        "rpm": 1500,
        "torque_nm": 100
    })
    # P = 2*pi*1500*100 / 60 = 15707.96 W = ~15.708 kW
    assert math.isclose(res["result"]["power_kw"], 15.708, rel_tol=1e-3)

    # Torque from Power & RPM
    res2 = EngineeringService.calculate_torque_power({
        "rpm": 1500,
        "power_kw": 15.708
    })
    assert math.isclose(res2["result"]["torque_nm"], 100.0, rel_tol=1e-3)

def test_gear_ratio():
    res = EngineeringService.calculate_gear_ratio({
        "driving_teeth": 20,
        "driven_teeth": 60,
        "input_rpm": 1800
    })
    assert res["result"]["gear_ratio"] == 3.0
    assert res["result"]["output_rpm"] == 600.0

def test_pressure_force():
    res = EngineeringService.calculate_pressure_force({
        "force_n": 50000,
        "area_m2": 0.05
    })
    assert res["result"]["pressure_pa"] == 1000000.0
    assert res["result"]["pressure_bar"] == 10.0

def test_thermodynamics_carnot():
    res = EngineeringService.calculate_thermodynamics({
        "temp_hot_celsius": 327,  # 600.15 K
        "temp_cold_celsius": 27   # 300.15 K
    })
    assert math.isclose(res["result"]["carnot_efficiency_percent"], 50.0, abs_tol=0.1)

def test_invalid_input_handling():
    with pytest.raises(ValueError):
        EngineeringService.calculate_stress_strain({"force": 100, "area": 0})
    with pytest.raises(ValueError):
        EngineeringService.calculate_mechanical_efficiency({"output_power": 120, "input_power": 100})
