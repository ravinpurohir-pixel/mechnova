from typing import Dict, Any, List

SUBJECTS_LIST = [
    {"id": "mechanics", "name": "Engineering Mechanics", "gu_name": "એન્જિનિયરિંગ મિકેનિક્સ", "hi_name": "इंजीनियरिंग मैकेनिक्स", "topics": ["Lami's Theorem & Equilibrium", "Friction & Angle of Repose", "Centroid & Moment of Inertia", "Trusses & Method of Joints"]},
    {"id": "thermodynamics", "name": "Thermodynamics", "gu_name": "થર્મોડાયનેમિક્સ", "hi_name": "ऊष्माप्रवैगिकी", "topics": ["First Law of Thermodynamics", "Second Law & Carnot Cycle", "Entropy & Exergy Analysis", "Steam Cycles & Rankine Cycle"]},
    {"id": "fluid_mechanics", "name": "Fluid Mechanics", "gu_name": "ફ્લુઇડ મિકેનિક્સ", "hi_name": "तरल यांत्रिकी", "topics": ["Bernoulli's Equation & Venturi", "Continuity & Navier-Stokes", "Boundary Layer Theory", "Pipe Losses & Darcy-Weisbach"]},
    {"id": "strength_materials", "name": "Strength of Materials", "gu_name": "સ્ટ્રેન્થ ઓફ મટિરિયલ્સ (SOM)", "hi_name": "पदार्थों का सामर्थ्य", "topics": ["Stress-Strain & Hooke's Law", "Shear Force & Bending Moment (SFD/BMD)", "Torsion of Circular Shafts", "Euler's Column Theory"]},
    {"id": "theory_machines", "name": "Theory of Machines", "gu_name": "થિયરી ઓફ મશીન્સ (TOM)", "hi_name": "मशीनों का सिद्धांत", "topics": ["Kinematic Chains & Inversions", "Flywheel & Turning Moment", "Governors & Sensitiveness", "Gear Trains & Epicyclic Gears"]},
    {"id": "machine_design", "name": "Machine Design", "gu_name": "મશીન ડિઝાઇન (DME)", "hi_name": "मशीन डिजाइन", "topics": ["Theories of Failure (Tresca, Von Mises)", "Design of Shafts & Keys", "Welded & Bolted Joints", "Journal Bearings & Petroff's Law"]},
    {"id": "manufacturing", "name": "Manufacturing Processes", "gu_name": "મેન્યુફેક્ચરિંગ પ્રોસેસીસ", "hi_name": "विनिर्माण प्रक्रियाएं", "topics": ["Lathe & Milling Operations", "Arc & TIG/MIG Welding", "Casting & Solidification", "CNC Programming & G/M Codes"]},
    {"id": "heat_transfer", "name": "Heat Transfer", "gu_name": "હીટ ટ્રાન્સફર", "hi_name": "ऊष्मा अंतरण", "topics": ["Conduction & Fourier's Law", "Convection & Nusselt Number", "Radiation & Stefan-Boltzmann", "Heat Exchangers & LMTD/NTU"]},
    {"id": "materials", "name": "Engineering Materials", "gu_name": "એન્જિનિયરિંગ મટિરિયલ્સ", "hi_name": "इंजीनियरिंग सामग्री", "topics": ["Iron-Carbon Phase Diagram", "Heat Treatment (Annealing, Quenching)", "Non-Ferrous Alloys (Al, Cu, Ti)", "Composite Materials & Polymers"]},
    {"id": "mathematics", "name": "Engineering Mathematics", "gu_name": "એન્જિનિયરિંગ મેથેમેટિક્સ", "hi_name": "इंजीनियरिंग गणित", "topics": ["Differential Equations & Laplace", "Linear Algebra & Eigenvalues", "Vector Calculus (Gauss, Stokes)", "Numerical Methods (Newton-Raphson)"]}
]

def get_subjects():
    return SUBJECTS_LIST

def get_curriculum_topic(subject_id: str, topic_name: str, language: str = "en", format_type: str = "concept") -> Dict[str, Any]:
    lang = language.lower() if language in ["en", "gu", "hi"] else "en"

    # Deep topic material repository
    if "first law" in topic_name.lower() or "thermo" in subject_id.lower():
        if lang == "gu":
            concept_title = "થર્મોડાયનેમિક્સનો પ્રથમ નિયમ (First Law of Thermodynamics)"
            explanation = (
                "થર્મોડાયનેમિક્સનો પ્રથમ નિયમ ઊર્જા સંરક્ષણનો નિયમ છે. ઊર્જાનું સર્જન કે વિનાશ થઈ શકતો નથી, "
                "પરંતુ તેને એક સ્વરૂપમાંથી બીજા સ્વરૂપમાં રૂપાંતરિત કરી શકાય છે.\n"
                "બંધ સિસ્ટમ (Closed System) માટે સૂત્ર: Q = ΔU + W\n"
                "જ્યાં Q = સિસ્ટમને અપાતી ગરમી (Heat supplied), ΔU = આંતરિક ઊર્જામાં ફેરફાર (Change in Internal Energy), "
                "W = સિસ્ટમ દ્વારા થતું કાર્ય (Work done by the system)."
            )
            five_mark = (
                "પ્રશ્ન: થર્મોડાયનેમિક્સનો પ્રથમ નિયમ સમજાવો અને સાયકલ તથા પ્રોસેસ માટેનું સમીકરણ તારવો. (5 માર્ક્સ)\n\n"
                "જવાબ:\n"
                "1. વ્યાખ્યા: જ્યારે કોઈ સિસ્ટમ સાયકલ પૂર્ણ કરે છે, ત્યારે નેટ હીટ ટ્રાન્સફર એ નેટ વર્ક ટ્રાન્સફર બરાબર હોય છે: ∮δQ = ∮δW.\n"
                "2. પ્રોસેસ માટેનું સમીકરણ: δQ = dU + δW.\n"
                "3. સાબિતી: આંતરિક ઊર્જા (Internal Energy) એ પોઇન્ટ ફંક્શન (Point function) અને પ્રોપર્ટી છે.\n"
                "4. PMM-1: પર્પેચ્યુઅલ મોશન મશીન ઓફ ફર્સ્ટ કાઇન્ડ શક્ય નથી (એવું મશીન જે કોઈપણ ઊર્જાના વપરાશ વગર સતત કાર્ય આપે)."
            )
            ten_mark = (
                "પ્રશ્ન: સ્ટેડી ફ્લો એનર્જી ઇક્વેશન (SFEE) તારવો અને તેને નોઝલ અને ટર્બાઇન માટે લાગુ કરો. (10 માર્ક્સ)\n\n"
                "જવાબ રૂપરેખા:\n"
                "1. સ્ટેડી ફ્લો સિસ્ટમની ધારણાઓ (Steady flow assumptions).\n"
                "2. નિયંત્રણ વોલ્યુમ (Control Volume) પર એનર્જી બેલેન્સ: m[h₁ + V₁²/2 + gz₁] + Q = m[h₂ + V₂²/2 + gz₂] + W.\n"
                "3. નોઝલ માટે: કાર્ય W = 0, Q = 0, z₁ = z₂ => V₂ = √(2(h₁ - h₂) + V₁²).\n"
                "4. ટર્બાઇન માટે: એડિયાબેટિક Q = 0, ગતિ ઊર્જા અને સ્થિતિ ઊર્જા નહિવત => W = m(h₁ - h₂)."
            )
            formulas = [
                {"name": "ક્લોઝ્ડ સિસ્ટમ એનર્જી સમીકરણ", "formula": "Q = ΔU + W", "units": "Joules (J)"},
                {"name": "સ્ટેડી ફ્લો એનર્જી સમીકરણ (SFEE)", "formula": "h₁ + (V₁²/2000) + gz₁/1000 + q = h₂ + (V₂²/2000) + gz₂/1000 + w", "units": "kJ/kg"},
                {"name": "આદર્શ વાયુ આંતરિક ઊર્જા", "formula": "ΔU = m · Cᵥ · (T₂ - T₁)", "units": "kJ"}
            ]
            numerical = {
                "problem": "એક બંધ સિસ્ટમ 300 kJ હીટ મેળવે છે અને 120 kJ નું કાર્ય કરે છે. સિસ્ટમની આંતરિક ઊર્જામાં થતો ફેરફાર (ΔU) શોધો.",
                "solution_steps": [
                    "પગલું 1: આપેલી વિગત: Q = +300 kJ (ગરમી ઉમેરાઈ), W = +120 kJ (કાર્ય સિસ્ટમ દ્વારા થયું).",
                    "પગલું 2: પ્રથમ નિયમ: Q = ΔU + W.",
                    "પગલું 3: ΔU = Q - W = 300 - 120 = 180 kJ.",
                    "જવાબ: આંતરિક ઊર્જામાં 180 kJ નો વધારો થાય છે."
                ]
            }
            mcqs = [
                {
                    "question": "પ્રથમ નિયમ અનુસાર, એડિયાબેટિક પ્રક્રિયા (Adiabatic process) માટે કયું સાચું છે?",
                    "options": ["Q = 0", "W = 0", "ΔU = 0", "T = અચળ"],
                    "correct": 0,
                    "explanation": "એડિયાબેટિક પ્રક્રિયામાં સિસ્ટમ અને આજુબાજુ વચ્ચે કોઈ હીટ ટ્રાન્સફર થતી નથી (Q = 0)."
                },
                {
                    "question": "આંતરિક ઊર્જા (Internal Energy) એ કેવું ફંક્શન છે?",
                    "options": ["પાથ ફંક્શન (Path function)", "પોઇન્ટ ફંક્શન (Point function)", "કામચલાઉ ફંક્શન", "કંઈપણ નહીં"],
                    "correct": 1,
                    "explanation": "આંતરિક ઊર્જા માત્ર સ્થિતિ પર આધાર રાખે છે, તેથી તે પોઇન્ટ ફંક્શન અને થર્મોડાયનેમિક પ્રોપર્ટી છે."
                }
            ]
        elif lang == "hi":
            concept_title = "ऊष्माप्रवैगिकी का प्रथम नियम (First Law of Thermodynamics)"
            explanation = (
                "ऊष्माप्रवैगिकी का पहला नियम ऊर्जा संरक्षण का नियम है। ऊर्जा को न तो बनाया जा सकता है और न ही नष्ट किया जा सकता है, "
                "केवल एक रूप से दूसरे रूप में परिवर्तित किया जा सकता है।\n"
                "बंद प्रणाली (Closed System) के लिए: Q = ΔU + W\n"
                "जहाँ Q = प्रदान की गई ऊष्मा, ΔU = आंतरिक ऊर्जा में परिवर्तन, W = प्रणाली द्वारा किया गया कार्य।"
            )
            five_mark = (
                "प्रश्न: ऊष्माप्रवैगिकी के प्रथम नियम को समझाइए और एक चक्र के लिए समीकरण लिखिए। (5 अंक)\n\n"
                "उत्तर:\n"
                "1. चक्रीय प्रक्रिया के लिए: ∮δQ = ∮δW\n"
                "2. गैर-प्रवाह प्रक्रिया के लिए: δQ = dU + δW\n"
                "3. निष्कर्ष: आंतरिक ऊर्जा एक गुणधर्म (Property) और बिंदु फलन (Point function) है।\n"
                "4. PMM-1: पहली तरह की सतत गति मशीन असंभव है।"
            )
            ten_mark = (
                "प्रश्न: स्थिर प्रवाह ऊर्जा समीकरण (SFEE) व्युत्पन्न करें और नोजल और स्टीम टरबाइन के लिए लागू करें। (10 अंक)"
            )
            formulas = [
                {"name": "बंद प्रणाली समीकरण", "formula": "Q = ΔU + W", "units": "Joules (J)"},
                {"name": "SFEE समीकरण", "formula": "h₁ + V₁²/2 + gz₁ + q = h₂ + V₂²/2 + gz₂ + w", "units": "kJ/kg"}
            ]
            numerical = {
                "problem": "एक बंद प्रणाली 400 kJ ऊष्मा ग्रहण करती है और 150 kJ कार्य करती है। आंतरिक ऊर्जा में परिवर्तन की गणना करें।",
                "solution_steps": [
                    "चरण 1: दिया है Q = +400 kJ, W = +150 kJ",
                    "चरण 2: Q = ΔU + W सूत्र से, ΔU = Q - W",
                    "चरण 3: ΔU = 400 - 150 = 250 kJ"
                ]
            }
            mcqs = [
                {
                    "question": "रुद्धोष्म प्रक्रिया (Adiabatic Process) में क्या शून्य होता है?",
                    "options": ["ऊष्मा अंतरण (Heat Transfer Q = 0)", "कार्य (Work W = 0)", "आंतरिक ऊर्जा ΔU = 0", "दाब"],
                    "correct": 0,
                    "explanation": "रुद्धोष्म प्रणाली में ऊष्मा का विनिमय नहीं होता है।"
                }
            ]
        else:
            concept_title = "First Law of Thermodynamics & Energy Conservation"
            explanation = (
                "The First Law of Thermodynamics is the mechanical application of the Law of Conservation of Energy. "
                "Energy can neither be created nor destroyed, only transformed between thermal energy (heat) and mechanical energy (work).\n"
                "For a closed system undergoing a process: Q = ΔU + W\n"
                "Where Q is heat transferred to the system, ΔU is change in internal energy, and W is work done by the system."
            )
            five_mark = (
                "Question: State the First Law of Thermodynamics for a closed system and prove that Internal Energy is a property. (5 Marks)\n\n"
                "Answer:\n"
                "1. Statement: When a closed system executes a cyclic process, the cyclic integral of heat is equal to the cyclic integral of work: ∮δQ = ∮δW.\n"
                "2. For a non-flow process between state 1 and 2: δQ - δW = dE = dU (neglecting kinetic and potential changes).\n"
                "3. Proof as Property: Consider two paths A and B between states 1 and 2, and return path C. (δQ - δW)_A + (δQ - δW)_C = 0 and (δQ - δW)_B + (δQ - δW)_C = 0. "
                "Subtracting yields (δQ - δW)_A = (δQ - δW)_B. Thus, dU is independent of the path and depends solely on end states, proving U is a point function and thermodynamic property.\n"
                "4. PMM-1: Perpetual Motion Machine of the First Kind is impossible."
            )
            ten_mark = (
                "Question: Derive the Steady Flow Energy Equation (SFEE) from the first principles of conservation of mass and energy. Apply it to an adiabatic steam turbine and a convergent-divergent nozzle. (10 Marks)\n\n"
                "Answer Breakdown:\n"
                "1. Assumptions: Steady state, one-dimensional uniform flow, constant properties across control surface.\n"
                "2. General SFEE Formulation:\n"
                "   ṁ · [h₁ + (V₁² / 2000) + (g · z₁ / 1000)] + Q̇ = ṁ · [h₂ + (V₂² / 2000) + (g · z₂ / 1000)] + Ẇ\n"
                "   where h = specific enthalpy (kJ/kg), V = velocity (m/s), z = elevation (m), Q̇ = heat rate (kW), Ẇ = shaft work (kW).\n"
                "3. Application to Steam Turbine:\n"
                "   - Insulated casing => Q̇ = 0\n"
                "   - Inlet/outlet elevation difference negligible => z₁ ≈ z₂\n"
                "   - Kinetic energy changes negligible compared to large enthalpy drop => ΔKE ≈ 0\n"
                "   - Work Output: Ẇ_turbine = ṁ · (h₁ - h₂)\n"
                "4. Application to Supersonic/Subsonic Nozzle:\n"
                "   - No shaft work extracted => Ẇ = 0\n"
                "   - High velocity flow, adiabatic => Q̇ = 0, z₁ ≈ z₂\n"
                "   - Exit velocity formula: V₂ = √[2 · (h₁ - h₂) + V₁²]"
            )
            formulas = [
                {"name": "Closed System First Law", "formula": "Q = ΔU + W", "units": "kJ or Joules"},
                {"name": "Boundary Work (Quasi-static)", "formula": "W = ∫ P · dV", "units": "kJ"},
                {"name": "Ideal Gas Internal Energy", "formula": "ΔU = m · C_v · (T₂ - T₁)", "units": "kJ"},
                {"name": "Steady Flow Energy Equation", "formula": "h₁ + V₁²/2 + gz₁ + q = h₂ + V₂²/2 + gz₂ + w", "units": "kJ/kg"}
            ]
            numerical = {
                "problem": "A gas is compressed in a cylinder from a volume of 0.08 m³ to 0.03 m³ at a constant pressure of 400 kPa. During the compression process, 28 kJ of heat is rejected to the surroundings. Calculate the change in internal energy (ΔU) of the gas.",
                "solution_steps": [
                    "Step 1: Identify given parameters:\nP = 400 kPa = 400 × 10³ N/m²\nV₁ = 0.08 m³, V₂ = 0.03 m³\nQ = -28 kJ (heat rejected is negative)",
                    "Step 2: Calculate work done at constant pressure:\nW = P × (V₂ - V₁) = 400 × (0.03 - 0.08) = 400 × (-0.05) = -20 kJ\n(Negative indicates work done on the gas)",
                    "Step 3: Apply the First Law of Thermodynamics:\nQ = ΔU + W\n-28 kJ = ΔU + (-20 kJ)",
                    "Step 4: Solve for ΔU:\nΔU = -28 - (-20) = -28 + 20 = -8 kJ",
                    "Conclusion: The internal energy of the gas decreases by 8 kJ."
                ]
            }
            mcqs = [
                {
                    "question": "Which thermodynamic property is proven to exist by the First Law of Thermodynamics?",
                    "options": ["Entropy", "Temperature", "Internal Energy", "Pressure"],
                    "correct": 2,
                    "explanation": "The First Law establishes that the net difference between heat and work for any process between two states is independent of path, defining Internal Energy (U)."
                },
                {
                    "question": "In a free expansion process of an ideal gas against a vacuum in an insulated chamber, what is the work done (W) and change in temperature (ΔT)?",
                    "options": ["W > 0, ΔT < 0", "W = 0, ΔT = 0", "W < 0, ΔT > 0", "W = 0, ΔT > 0"],
                    "correct": 1,
                    "explanation": "In Joule's free expansion into vacuum, opposing pressure is zero (W = 0), and insulation means Q = 0. By First Law ΔU = 0, so for an ideal gas ΔT = 0."
                },
                {
                    "question": "A Perpetual Motion Machine of the First Kind (PMM-1) is a hypothetical device that violates:",
                    "options": ["Zeroth Law", "First Law of Thermodynamics", "Second Law of Thermodynamics", "Third Law of Thermodynamics"],
                    "correct": 1,
                    "explanation": "PMM-1 produces work output without consuming any equivalent energy, directly violating the First Law (Conservation of Energy)."
                }
            ]
    else:
        # Generic comprehensive engineering template for any selected subject & topic
        subj_name = next((s["name"] for s in SUBJECTS_LIST if s["id"] == subject_id), "Mechanical Engineering")
        concept_title = f"{topic_name} – Core Engineering Principles"
        explanation = (
            f"Comprehensive technical overview of {topic_name} in {subj_name}.\n"
            f"This chapter covers physical laws, governing differential equations, boundary conditions, "
            f"and industrial design criteria essential for university examinations and professional mechanical practice."
        )
        five_mark = f"Question: Define and explain the fundamental significance of {topic_name} with mathematical expressions. (5 Marks)\n\nAnswer:\n1. Technical Definition and Assumptions.\n2. Governing equations with proper sign conventions and SI units.\n3. Physical interpretation and schematic diagram.\n4. Practical industrial engineering applications."
        ten_mark = f"Question: Carry out a comprehensive analytical derivation for {topic_name}. Discuss failure modes, safety factors, and solve an industrial case study. (10 Marks)"
        formulas = [
            {"name": "Standard Equilibrium / Flow Relation", "formula": "Σ F = 0,  Σ M = 0", "units": "N, N·m"},
            {"name": "Stress & Resistance", "formula": "σ = E · ε", "units": "MPa"},
            {"name": "Power & Rate Relation", "formula": "P = F · v = T · ω", "units": "Watts (W)"}
        ]
        numerical = {
            "problem": f"A machine component designed under {topic_name} experiences an applied load of 25 kN with an allowable yield stress of 150 MPa. Calculate the required minimum dimension with a design factor of safety of 2.0.",
            "solution_steps": [
                "Step 1: Permissible design stress σ_allow = σ_yield / FOS = 150 / 2.0 = 75 MPa.",
                "Step 2: Required load-bearing area A = F / σ_allow = 25,000 N / 75 N/mm² = 333.33 mm².",
                "Step 3: Minimum circular diameter d = √(4 · A / π) = √(4 · 333.33 / 3.1416) = 20.6 mm.",
                "Conclusion: Standard engineering bar diameter selected = 22 mm or 24 mm."
            ]
        }
        mcqs = [
            {
                "question": f"Which fundamental physical principle governs {topic_name}?",
                "options": ["Conservation of Energy & Momentum", "Arbitrary empirical factor", "Unconstrained dilation", "Pure kinematic guess"],
                "correct": 0,
                "explanation": "All mechanical engineering systems adhere rigorously to Newtonian mechanics and conservation laws."
            }
        ]

    return {
        "subject_id": subject_id,
        "topic": topic_name,
        "language": lang,
        "format_type": format_type,
        "concept_title": concept_title,
        "explanation": explanation,
        "five_mark_exam_answer": five_mark,
        "ten_mark_exam_answer": ten_mark,
        "key_formulas": formulas,
        "worked_numerical": numerical,
        "practice_mcqs": mcqs
    }
