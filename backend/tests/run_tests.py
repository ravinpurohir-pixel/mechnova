import unittest
import math
import sys
import os

# Add parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from backend.services.engineering_service import EngineeringService
from backend.services.vision_service import VisionService
from backend.services.study_curriculum import get_subjects, get_curriculum_topic
from backend.models import ProblemSolverRequest
from backend.services.ai_service import AIService

class TestEngineeringCalculations(unittest.TestCase):
    def test_stress_strain(self):
        res = EngineeringService.calculate_stress_strain({
            "force": 10000,
            "area": 50,
            "original_length": 200,
            "change_in_length": 0.2
        })
        self.assertEqual(res["result"]["stress_mpa"], 200.0)
        self.assertEqual(res["result"]["strain"], 0.001)
        self.assertEqual(res["result"]["strain_percentage"], 0.1)

    def test_youngs_modulus(self):
        res = EngineeringService.calculate_youngs_modulus({
            "stress_mpa": 200.0,
            "strain": 0.001
        })
        self.assertEqual(res["result"]["youngs_modulus_gpa"], 200.0)
        self.assertEqual(res["result"]["youngs_modulus_mpa"], 200000.0)

    def test_torque_power(self):
        res = EngineeringService.calculate_torque_power({
            "rpm": 1500,
            "torque_nm": 100
        })
        self.assertTrue(math.isclose(res["result"]["power_kw"], 15.708, rel_tol=1e-3))

    def test_gear_ratio(self):
        res = EngineeringService.calculate_gear_ratio({
            "driving_teeth": 20,
            "driven_teeth": 60,
            "input_rpm": 1800
        })
        self.assertEqual(res["result"]["gear_ratio"], 3.0)
        self.assertEqual(res["result"]["output_rpm"], 600.0)

    def test_thermodynamics(self):
        res = EngineeringService.calculate_thermodynamics({
            "temp_hot_celsius": 327,
            "temp_cold_celsius": 27
        })
        self.assertTrue(math.isclose(res["result"]["carnot_efficiency_percent"], 50.0, abs_tol=0.2))

    def test_vision_heuristic(self):
        metrics = {
            "resolution": "800x600",
            "aspect_ratio": 1.0,
            "brightness": 120.0,
            "sharpness_score": 6.5,
            "edge_density": 25.0,
            "metallic_signature": True,
            "is_clear": True
        }
        res = VisionService.identify_part_from_heuristics(metrics, "gear_sample.jpg")
        self.assertEqual(res["category"], "Power Transmission Components")
        self.assertIn("Involute", res["part_name"])

    def test_problem_solver(self):
        req = ProblemSolverRequest(
            equipment_type="Centrifugal Pump",
            problem_description="Loud cavitation noise and bearing overheating",
            symptoms=["Excessive Vibration", "Cavitation", "Overheating"]
        )
        res = AIService.solve_mechanical_problem(req)
        self.assertTrue(res.loto_required)
        self.assertGreater(len(res.possible_causes), 0)
        self.assertGreater(len(res.step_by_step_checks), 0)

    def test_study_multilingual(self):
        res_gu = get_curriculum_topic("thermodynamics", "First Law of Thermodynamics", "gu", "concept")
        self.assertEqual(res_gu["language"], "gu")
        self.assertIn("પ્રથમ નિયમ", res_gu["concept_title"])

if __name__ == '__main__':
    unittest.main()
