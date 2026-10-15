import os
import json
import logging
from typing import Dict, Any, List, Optional
from ..models import (
    ProblemSolverRequest, ProblemSolverResponse, LikelyCause,
    DiagnosticItem, FollowUpChatRequest, FollowUpChatResponse,
    StudyQueryRequest
)

logger = logging.getLogger("mechnova.ai")

class AIService:
    @staticmethod
    def _is_api_key_available() -> bool:
        return bool(os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY"))

    @staticmethod
    def solve_mechanical_problem(req: ProblemSolverRequest) -> ProblemSolverResponse:
        """
        Processes equipment troubleshooting query using AI API or verified mechanical diagnostic engine.
        """
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if api_key:
            try:
                # Optional live Gemini call if configured
                import requests
                prompt = f"""
                You are MechNova's Senior Industrial Mechanical Reliability Engineer.
                Analyze this machinery issue:
                - Equipment: {req.equipment_type}
                - Problem: {req.problem_description}
                - Symptoms: {', '.join(req.symptoms)}
                - Operating Conditions: {req.operating_conditions or 'Standard industrial operating conditions'}

                Output strict JSON with fields:
                problem_summary (str),
                possible_causes (array of objects: cause, probability [High/Medium/Low], explanation),
                step_by_step_checks (array of objects: step [int], action, expected_observation, safety_check),
                corrective_actions (array of str),
                required_tools_parts (array of str),
                preventive_maintenance (array of str),
                safety_warnings (array of str),
                loto_required (bool),
                disclaimer (str)
                """
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"response_mime_type": "application/json"}
                }
                res = requests.post(url, json=payload, timeout=12)
                if res.status_code == 200:
                    data = res.json()
                    raw_text = data['candidates'][0]['content']['parts'][0]['text']
                    parsed = json.loads(raw_text)
                    return ProblemSolverResponse(**parsed)
            except Exception as e:
                logger.warning(f"External AI API call failed or timed out: {e}. Falling back to domain knowledge engine.")

        # Robust Domain-Expert Mechanical Diagnostic Engine
        return AIService._generate_domain_diagnostic(req)

    @staticmethod
    def _generate_domain_diagnostic(req: ProblemSolverRequest) -> ProblemSolverResponse:
        eq = req.equipment_type.lower()
        prob = req.problem_description.lower()
        symps = [s.lower() for s in req.symptoms]
        all_text = f"{eq} {prob} {' '.join(symps)}"

        # Default causes & diagnostics based on mechanical phenomena
        causes: List[LikelyCause] = []
        checks: List[DiagnosticItem] = []
        correctives: List[str] = []
        tools: List[str] = []
        preventives: List[str] = []
        warnings: List[str] = []
        loto_needed = True

        if any(w in all_text for w in ["vibrat", "noise", "bearing", "shak"]):
            causes.append(LikelyCause(
                cause="Rotational Shaft Misalignment or Angular Soft-Foot",
                probability="High",
                explanation="Coupling angularity or offset induces 1X/2X rotational frequency harmonic vibrations, stressing motor and driven bearings."
            ))
            causes.append(LikelyCause(
                cause="Bearing Raceway Spalling or Lubricant Starvation",
                probability="High",
                explanation="Ball or roller element impact against micro-spalled raceways creates characteristic BPFI/BPFO high-frequency peak acceleration."
            ))
            causes.append(LikelyCause(
                cause="Dynamic Rotor Unbalance",
                probability="Medium",
                explanation="Mass eccentric center of rotation generates a sinusoidal 1X radial force increasing quadratically with operating RPM."
            ))
            checks.append(DiagnosticItem(
                step=1,
                action="Collect tri-axial vibration spectrum (Horizontal, Vertical, Axial) using accelerometer.",
                expected_observation="1X dominant peak indicates unbalance; 2X with strong axial indicates angular misalignment; high peak > 1 kHz indicates bearing defect.",
                safety_check="Keep measurement probe and hands clear of rotating exposed shafting and couplings."
            ))
            checks.append(DiagnosticItem(
                step=2,
                action="Check casing surface temperature at Drive End (DE) and Non-Drive End (NDE) bearing housings using infrared thermography.",
                expected_observation="Normal operating temperature is between 45°C - 70°C. Temperature > 85°C indicates excessive friction, over-greasing, or impending seizure.",
                safety_check="Do not touch bare metal surfaces; verify thermal camera emissivity setting (0.95 for painted iron)."
            ))
            checks.append(DiagnosticItem(
                step=3,
                action="Perform laser shaft alignment check across flexible coupling.",
                expected_observation="Parallel offset < 0.05 mm (0.002 in); angular error < 0.05 mm per 100 mm coupling diameter.",
                safety_check="De-energize prime mover breaker and attach LOTO padlock with tag."
            ))
            correctives = [
                "Re-align machine train to within precision tolerance using 316 stainless pre-cut shims under machine feet.",
                "Purge deteriorated grease and re-lubricate with manufacturer-specified ISO VG EP synthetic grease to exact calculated volume.",
                "Replace compromised bearing unit using induction heating method (heat to 110°C; do not exceed 120°C).",
                "Perform in-situ two-plane dynamic field balancing using trial weight vectors."
            ]
            tools = [
                "Tri-axial Vibration FFT Analyzer & Stroboscope",
                "Laser Alignment Tool System",
                "Calibrated Torque Wrench (20 - 250 Nm)",
                "Infrared Thermometer / FLIR Camera",
                "Induction Bearing Heater",
                "Dial Indicator with Magnetic Base"
            ]
            preventives = [
                "Establish baseline vibration velocity RMS route monitoring every 30 days per ISO 10816-3 standards.",
                "Implement ultrasound acoustic lubrication listening program to prevent over-lubrication.",
                "Verify torque on anchor base foundation bolts during quarterly inspection."
            ]
            warnings = [
                "HIGH KINETIC HAZARD: Never perform physical checks or touch couplings while the machine is spinning.",
                "THERMAL HAZARD: Bearing housing surfaces may cause severe burns if operating above thermal threshold.",
                "Lockout / Tagout (LOTO) is mandatory before opening belt guards, coupling guards, or rotating enclosures."
            ]

        elif any(w in all_text for w in ["leak", "pressur", "pump", "seal", "cavitat", "flow"]):
            causes.append(LikelyCause(
                cause="Mechanical Seal Face Degradation / Thermal Shock",
                probability="High",
                explanation="Lapping distortion, dry running, or elastomeric secondary O-ring hardening permits process liquid bypass across seal faces."
            ))
            causes.append(LikelyCause(
                cause="Suction Net Positive Suction Head (NPSH) Margin Depletion (Cavitation)",
                probability="High",
                explanation="Available NPSHa dropping below required NPSHr causes vapor bubble collapse on impeller vane inlet tips, producing gravel-like noise."
            ))
            causes.append(LikelyCause(
                cause="Clogged Suction Strainer or Entrained Air Ingress",
                probability="Medium",
                explanation="Restricted suction line starves flow, causing pressure drop and hydraulic surging."
            ))
            checks.append(DiagnosticItem(
                step=1,
                action="Observe suction and discharge differential pressure gauges against pump OEM H-Q performance curve.",
                expected_observation="Total dynamic head (TDH) should match operating flow point. Lower TDH with high motor current signifies internal recirculation or wear ring clearance opening.",
                safety_check="Verify gauge isolation valves are operational before bleeding."
            ))
            checks.append(DiagnosticItem(
                step=2,
                action="Inspect seal gland drain weep hole and mechanical seal barrier fluid reservoir level.",
                expected_observation="Seal weepage must be less than 5 drops/minute for mechanical packing; zero visible drip for cartridge mechanical seal.",
                safety_check="Wear chemical-resistant nitrile gloves and face shield when inspecting potentially corrosive media."
            ))
            checks.append(DiagnosticItem(
                step=3,
                action="Check suction suction strainer differential pressure indicator (ΔP).",
                expected_observation="Clean basket ΔP < 0.2 bar. If ΔP > 0.5 bar, strainer is choked.",
                safety_check="Isolate suction isolation valve before opening basket cover."
            ))
            correctives = [
                "Clean suction basket strainer and inspect foot valve seal.",
                "Replace mechanical seal cartridge assembly (Silicon Carbide / Tungsten Carbide faces).",
                "Adjust discharge throttling valve to move pump operating point closer to Best Efficiency Point (BEP).",
                "Inspect impeller wear ring clearance; replace if clearance exceeds 2x original design tolerance."
            ]
            tools = [
                "Calibrated Differential Pressure Gauges",
                "Acoustic Ultrasound Stethoscope for Cavitation Detection",
                "Flange Spreader & Gasket Scraper",
                "Mechanic Seal Setting Gauge Kit",
                "Torque Wrench for Flange Studs"
            ]
            preventives = [
                "Monitor suction line strainers weekly.",
                "Verify barrier fluid pressure in dual seal systems is 1.5 - 2.0 bar above stuffing box pressure.",
                "Avoid continuous low-flow operation below minimum continuous stable flow (MCSF)."
            ]
            warnings = [
                "PRESSURIZED MEDIA HAZARD: Depressurize, drain, and flush chemical or hot media from pump casing before loosening any bolts.",
                "Lockout/Tagout of both electric motor drive and suction/discharge process valves is mandatory."
            ]

        else:
            # Generalized Mechanical Transmission & Power System Diagnostic
            causes.append(LikelyCause(
                cause="Abnormal Component Mechanical Wear / Fatigue Deterioration",
                probability="High",
                explanation=f"Operating stress combined with cyclical loading in {req.equipment_type} has degraded mechanical clearance."
            ))
            causes.append(LikelyCause(
                cause="Lubrication Breakdown or Contamination",
                probability="Medium",
                explanation="Oxidation, moisture ingress, or particulate contamination has reduced hydrodynamic film thickness."
            ))
            causes.append(LikelyCause(
                cause="Structural Looseness / Fastener Preload Loss",
                probability="Medium",
                explanation="Vibration has loosened mounting hardware, inducing excessive deflection under operational load."
            ))
            checks.append(DiagnosticItem(
                step=1,
                action=f"Perform visual and audible inspection around {req.equipment_type} under idle and rated load conditions.",
                expected_observation="Smooth, consistent operation without cyclic knocking, chatter, or thermal hotspots.",
                safety_check="Maintain safe boundary distance from moving linkages and nip points."
            ))
            checks.append(DiagnosticItem(
                step=2,
                action="Inspect lubricant level, color, viscosity, and check magnetic drain plug for ferrous particles.",
                expected_observation="Oil must be clear/amber without cloudy emulsion (water) or metallic sparkle.",
                safety_check="Allow system to cool below 50°C before taking oil sample."
            ))
            checks.append(DiagnosticItem(
                step=3,
                action="Check torque on all foundation anchoring and housing assembly fasteners.",
                expected_observation="All fasteners tightened to engineered torque specifications without stripped threads.",
                safety_check="Ensure machine is stationary and locked out."
            ))
            correctives = [
                "Torque all structural fasteners in criss-cross pattern to specified Nm values.",
                "Drain and flush lubrication reservoir; refill with fresh certified lubricant.",
                "Replace worn mechanical mating parts and adjust functional backlash/clearances.",
                "Inspect drive belts / chains / couplings for proper tension and alignment."
            ]
            tools = [
                "Mechanical Tool Set (Metric & Imperial Sockets)",
                "Calibrated Torque Wrench",
                "Infrared Thermometer",
                "Dial Caliper and Feeler Gauges",
                "Lubrication Sampling Kit"
            ]
            preventives = [
                "Institute a structured Total Productive Maintenance (TPM) Autonomous Inspection checklist.",
                "Establish quarterly oil laboratory analysis (viscosity, TAN, particle count per ISO 4406).",
                "Record weekly operating parameters in maintenance logbook."
            ]
            warnings = [
                "ISOLATE STORED ENERGY: Bleed hydraulic, pneumatic, and spring tension reservoirs before work.",
                "Apply full OSHA Lockout/Tagout (LOTO) protocols to main electrical breaker."
            ]

        summary = f"Comprehensive diagnostic assessment for {req.equipment_type} presenting '{req.problem_description}'. Primary investigation points to mechanical misalignment, wear, or lubrication distress."

        return ProblemSolverResponse(
            problem_summary=summary,
            possible_causes=causes,
            step_by_step_checks=checks,
            corrective_actions=correctives,
            required_tools_parts=tools,
            preventive_maintenance=preventives,
            safety_warnings=warnings,
            loto_required=loto_needed,
            disclaimer="MechNova AI Diagnostic Advisory: Diagnostic recommendations are intended for technical assistance. Qualified maintenance engineers must execute procedures adhering strictly to workplace safety standards and OEM manuals."
        )

    @staticmethod
    def chat_follow_up(req: FollowUpChatRequest) -> FollowUpChatResponse:
        """
        Provides interactive troubleshooting answers to technician follow-up inquiries.
        """
        user_q = req.user_message.lower()

        if "vibration" in user_q or "spectrum" in user_q:
            reply = f"For {req.equipment_type}, analyzing the vibration spectrum is critical. If you observe dominant 1X vibration in radial axes, this indicates static/dynamic unbalance. If you see elevated 2X peaks along with prominent axial vibration, this confirms shaft angular misalignment. Check your coupling gap and run a laser alignment check."
            checks = ["Laser coupling alignment check", "Dial indicator total indicated runout (TIR)", "Foundation soft-foot verification"]
            notice = "Ensure equipment is de-energized and tagged out before placing physical measurement fixtures."
        elif "bearing" in user_q or "noise" in user_q:
            reply = f"High-pitched screeching or rumbling in {req.equipment_type} typically originates from bearing raceway deterioration or lack of grease. If grease was applied recently, remember that over-lubrication causes churning and overheating (>80°C). Use an acoustic ultrasound gun while pumping grease slowly until decibel level stabilizes."
            checks = ["Measure housing temperature with IR thermometer", "Inspect purged grease for metal particles", "Check bearing clearance with feeler gauge"]
            notice = "Do not touch hot bearing housings. Operating above 90°C can result in catastrophic seizure."
        elif "torque" in user_q or "bolt" in user_q:
            reply = f"When securing machine fasteners on {req.equipment_type}, always clean threads and use calibrated torque wrenches. Lubricated threads (moly grease/anti-seize) reduce friction coefficient to ~0.10, so torque should be adjusted according to manufacturer specification. For critical joints, torque in 3 stages: 30%, 70%, then 100% in a star pattern."
            checks = ["Verify fastener proof grade (e.g., 8.8, 10.9)", "Inspect threads for galling or stretching", "Calibrate torque wrench before use"]
            notice = "Never reuse yield-tightened (torque-to-yield) head bolts."
        else:
            reply = f"Regarding {req.user_message}: In {req.equipment_type}, begin by verifying operating parameters (temperatures, pressures, motor current draw, and fluid levels) against baseline values. If symptoms persist under load, conduct an inspection of the drive line and mechanical couplings."
            checks = ["Measure motor running current against nameplate FLA", "Inspect belt/chain tension and pulley wear", "Check oil level in sight glass"]
            notice = "Follow site LOTO procedures before removing guards or covers."

        return FollowUpChatResponse(
            reply=reply,
            suggested_checks=checks,
            safety_notice=notice
        )

    @staticmethod
    def get_study_material(req: StudyQueryRequest) -> Dict[str, Any]:
        """
        Generates comprehensive topic lesson, formula, numerical solutions, MCQs,
        5-mark and 10-mark exam formats in English, Gujarati, and Hindi!
        """
        from .study_curriculum import get_curriculum_topic
        return get_curriculum_topic(req.subject, req.topic, req.language, req.format_type)
