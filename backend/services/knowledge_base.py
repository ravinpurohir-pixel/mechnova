from typing import List, Dict, Any

KNOWLEDGE_ITEMS: List[Dict[str, Any]] = [
    {
        "id": "bearing_types",
        "title": "Industrial Rolling Element Bearings: Selection & Sizing",
        "category": "Components",
        "description": "Classification of Deep Groove Ball Bearings, Cylindrical Roller, Tapered Roller, and Spherical Roller Bearings.",
        "content": """
### 1. Classification & Operating Capacities
- **Deep Groove Ball Bearings (6000 series):** High radial speeds, moderate bilateral axial thrust, low friction torque.
- **Spherical Roller Bearings (22200 series):** Dual barrel rollers accommodating heavy shock loads and dynamic angular shaft misalignment up to ±2.5°.
- **Tapered Roller Bearings (30000 series):** Conical raceways designed to accept combined heavy radial and single-direction axial thrust loads.
- **Cylindrical Roller Bearings (NU/NJ series):** High radial load capacity with separable rings for easy thermal expansion floating.

### 2. ISO L10 Life Rating Formulation
$$L_{10} = \\left(\\frac{C}{P}\\right)^p \\times 10^6 \\text{ revolutions}$$
Where:
- $C$ = Basic dynamic load rating (kN)
- $P$ = Equivalent dynamic bearing load ($X \\cdot F_r + Y \\cdot F_a$)
- $p = 3$ for ball bearings, $p = 10/3 \\approx 3.33$ for roller bearings

### 3. Lubrication Selection Matrix
- **Operating speed factor $nd_m < 300,000$:** Lithium complex NLGI 2 mineral grease.
- **High speed $nd_m > 500,000$ or elevated temperature > 120°C:** Polyurea / Synthetic PAO oil circulation with cooling.
""",
        "source": "ISO 281:2007 Rolling bearings — Dynamic load ratings and rating life",
        "is_ai_generated": False,
        "tags": ["Bearings", "L10 Life", "Tribology", "Components"]
    },
    {
        "id": "gear_design",
        "title": "AGMA Involute Spur & Helical Gear Design Fundamentals",
        "category": "Mechanical Systems",
        "description": "Bending stress (Lewis equation), pitting resistance, contact ratio, and backlash specifications.",
        "content": """
### 1. Involute Geometry Parameters
- **Module ($m$):** $m = \\frac{d}{Z}$ (mm)
- **Circular Pitch ($p$):** $p = \\pi \\cdot m$
- **Base Circle Diameter ($d_b$):** $d_b = d \\cdot \\cos(\\alpha)$, where standard pressure angle $\\alpha = 20^\\circ$.

### 2. Lewis Bending Stress Equation
$$\\sigma_b = \\frac{F_t}{b \\cdot m \\cdot Y}$$
Where:
- $F_t$ = Tangential tooth load ($2000 \\cdot T / d$)
- $b$ = Face width of gear (typically $8m$ to $12m$)
- $Y$ = Form factor dependent on tooth count $Z$

### 3. AGMA Pitting Resistance (Hertz Contact Stress)
$$\\sigma_c = Z_E \\sqrt{\\frac{F_t}{b \\cdot d_1 \\cdot I} \\cdot K_v \\cdot K_o \\cdot K_m}$$
Surface endurance limits require case-carburizing to 58-62 HRC for heavy industrial drives.
""",
        "source": "AGMA 2001-D04 / ISO 6336 Gear Calculation Standards",
        "is_ai_generated": False,
        "tags": ["Gears", "AGMA", "Bending Stress", "Transmission"]
    },
    {
        "id": "shaft_design",
        "title": "ASME Design of Transmission Shafts under Combined Bending & Torsion",
        "category": "Engineering Formulas",
        "description": "Standard shaft sizing using ASME Code equation with shock and fatigue factors (Km, Kt).",
        "content": """
### 1. Maximum Shear Stress Theory (Tresca Formulation)
The maximum shear stress in a solid circular shaft subjected to bending moment $M$ and torque $T$:
$$\\tau_{max} = \\frac{16}{\\pi d^3} \\sqrt{(K_m M)^2 + (K_t T)^2}$$

### 2. Required Shaft Diameter
$$d = \\left( \\frac{16}{\\pi \\cdot [\\tau]} \\sqrt{(K_m M)^2 + (K_t T)^2} \\right)^{1/3}$$
Where:
- $[\\tau]$ = Allowable shear stress = $\\min(0.30 \\cdot S_{yt}, 0.18 \\cdot S_{ut})$ (reduced by 25% if keyways are present).
- $K_m$ = Numerical bending fatigue factor (1.5 - 2.0 for minor/heavy shock).
- $K_t$ = Torsional fatigue factor (1.0 - 1.5).
""",
        "source": "ASME Code for Design of Transmission Shafting (B106.1M)",
        "is_ai_generated": False,
        "tags": ["Shafts", "Torsion", "Fatigue", "ASME"]
    },
    {
        "id": "welding_methods",
        "title": "Industrial Welding Processes: SMAW, GMAW (MIG), and GTAW (TIG)",
        "category": "Manufacturing Methods",
        "description": "Comparison of arc welding methodologies, shielding gases, joint preparations, and weld defect inspection.",
        "content": """
### 1. Process Comparison
- **SMAW (Shielded Metal Arc / Stick):** Heavy construction, outdoor piping, portable. Flux-coated electrode generates shielding vapor.
- **GMAW (Gas Metal Arc / MIG):** Continuous wire feed, high deposition rate, automated robotic production. Gas: 75% Ar / 25% CO2 for carbon steels.
- **GTAW (Gas Tungsten Arc / TIG):** Non-consumable tungsten electrode with 100% pure Argon. Highest quality weld beads for thin sheets, stainless steel, and aerospace aluminum alloys.

### 2. Quality Non-Destructive Examination (NDE)
- Visual Testing (VT): Direct illumination, fillet weld gauges.
- Liquid Penetrant (PT): Surface-breaking cracks and porosity.
- Magnetic Particle (MT): Sub-surface discontinuities in ferromagnetic steels.
- Ultrasonic Testing (UT) & Radiography (RT): Volumetric interior defects (lack of fusion, slag inclusions).
""",
        "source": "AWS D1.1 Structural Welding Code — Steel",
        "is_ai_generated": False,
        "tags": ["Welding", "Manufacturing", "NDE", "Fabrication"]
    },
    {
        "id": "loto_procedures",
        "title": "Industrial Lockout / Tagout (LOTO) & Hazardous Energy Isolation",
        "category": "Maintenance Procedures",
        "description": "The 6-step OSHA energy control procedure to protect technicians from unexpected machinery energization.",
        "content": """
### Step-by-Step Energy Isolation Protocol
1. **Preparation:** Identify all energy sources (Electrical, Pneumatic, Hydraulic, Mechanical Springs, Gravitational head, Thermal, Chemical).
2. **Notification:** Notify all affected operating personnel that equipment will be taken offline.
3. **Shutdown:** Depower machinery via normal stopping controls.
4. **Isolation:** Physically disconnect primary power breakers, close fluid isolation valves, and insert mechanical blocks/chocks.
5. **Lockout & Tagout:** Affix standardized safety padlocks and danger tags with technician identity and phone number to hasps. Each worker must have an individual lock.
6. **Zero-Energy Verification (Tryout):** Bleed trapped hydraulic pressure, purge pipelines, discharge capacitor banks, and press startup pushbuttons to verify zero energy state.
""",
        "source": "OSHA 29 CFR 1910.147 Control of Hazardous Energy",
        "is_ai_generated": False,
        "tags": ["Safety", "LOTO", "OSHA", "Maintenance"]
    },
    {
        "id": "steels_properties",
        "title": "Mechanical Metallurgy: Structural Steels & Heat Treatment",
        "category": "Material Properties",
        "description": "AISI/SAE designation, yield strength, tensile strength, hardness, and thermal heat treatment regimes.",
        "content": """
### Common Industrial Alloys
- **AISI 1018 (Low Carbon):** $S_y \\approx 370\\text{ MPa}, S_u \\approx 440\\text{ MPa}$, 126 HB. Excellent weldability and case hardening.
- **AISI 1045 (Medium Carbon):** $S_y \\approx 450\\text{ MPa}, S_u \\approx 620\\text{ MPa}$, 170 HB. Induction-hardenable for pins, crankshafts, and shafts.
- **AISI 4140 (Chromium-Molybdenum):** $S_y \\approx 655\\text{ MPa}, S_u \\approx 1020\\text{ MPa}$ (Q&T), 302 HB. High toughness, fatigue resistance for high-stress drivetrain components.
- **AISI 316 Stainless Steel:** Austenitic with 2-3% Molybdenum. Exceptional pitting corrosion resistance in marine and chemical environments.

### Heat Treatment Stages
- **Annealing:** Slow furnace cooling to relieve internal stress and optimize ductility.
- **Quenching:** Rapid oil/water cooling transforming austenite to hard, brittle martensite.
- **Tempering:** Reheating to 200°C-650°C to restore fracture toughness while maintaining required hardness.
""",
        "source": "ASM International Metals Handbook Vol 1: Properties and Selection: Irons, Steels",
        "is_ai_generated": False,
        "tags": ["Materials", "Steel", "Heat Treatment", "Metallurgy"]
    }
]
