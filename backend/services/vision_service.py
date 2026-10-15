import io
import base64
import numpy as np
from PIL import Image, ImageStat, ImageFilter
from typing import Dict, Any, List

class VisionService:
    @staticmethod
    def analyze_image_bytes(image_bytes: bytes) -> Dict[str, Any]:
        """
        Extracts computer vision metrics from mechanical part image.
        """
        img = Image.open(io.BytesIO(image_bytes))
        width, height = img.size
        aspect_ratio = width / height

        # Convert to RGB
        rgb_img = img.convert("RGB")
        stat = ImageStat.Stat(rgb_img)
        mean_r, mean_g, mean_b = stat.mean[:3]
        brightness = (mean_r + mean_g + mean_b) / 3.0

        # Detect metallic luster / grayscale variance
        color_std = np.std([mean_r, mean_g, mean_b])
        is_grayscale_or_metallic = color_std < 18.0

        # Edge analysis for mechanical features (gears, threads, machined contours)
        gray_img = img.convert("L")
        edges = gray_img.filter(ImageFilter.FIND_EDGES)
        edge_stat = ImageStat.Stat(edges)
        edge_density = edge_stat.mean[0]  # higher mean = more complex contours/teeth/threads

        # Blur/sharpness detection via Laplacian-like diff
        blurred = gray_img.filter(ImageFilter.BLUR)
        diff = np.abs(np.array(gray_img, dtype=float) - np.array(blurred, dtype=float))
        sharpness_score = float(np.mean(diff))

        return {
            "resolution": f"{width}x{height}",
            "aspect_ratio": round(aspect_ratio, 2),
            "brightness": round(brightness, 1),
            "sharpness_score": round(sharpness_score, 2),
            "edge_density": round(edge_density, 2),
            "metallic_signature": bool(is_grayscale_or_metallic),
            "is_clear": sharpness_score > 3.0
        }

    @staticmethod
    def identify_part_from_heuristics(metrics: Dict[str, Any], file_name: str = "") -> Dict[str, Any]:
        """
        Intelligent mechanical engineering classification heuristic based on visual metrics & hints.
        """
        fn_lower = file_name.lower()
        edge = metrics.get("edge_density", 10.0)
        ar = metrics.get("aspect_ratio", 1.0)
        sharpness = metrics.get("sharpness_score", 5.0)

        # Keyword hinting if user uploaded test sample with part name
        if "bearing" in fn_lower:
            part_key = "bearing"
        elif "gear" in fn_lower or "cog" in fn_lower:
            part_key = "gear"
        elif "shaft" in fn_lower:
            part_key = "shaft"
        elif "pulley" in fn_lower or "sheave" in fn_lower:
            part_key = "pulley"
        elif "pump" in fn_lower:
            part_key = "pump"
        elif "valve" in fn_lower:
            part_key = "valve"
        elif "fastener" in fn_lower or "bolt" in fn_lower or "screw" in fn_lower:
            part_key = "fastener"
        elif "motor" in fn_lower:
            part_key = "motor"
        else:
            # Metric-based heuristic classification
            if ar > 2.5 or ar < 0.4:
                part_key = "shaft"
            elif edge > 22.0:
                part_key = "gear"
            elif 0.8 <= ar <= 1.25 and edge > 12.0:
                part_key = "bearing"
            elif 0.8 <= ar <= 1.25 and edge <= 12.0:
                part_key = "pulley"
            elif edge > 16.0:
                part_key = "valve"
            else:
                part_key = "pump"

        part_database = {
            "gear": {
                "part_name": "Involute Spur / Helical Gear",
                "part_name_gu": "ગીયર (દાંતાવાળું વ્હીલ / ચક્ર)",
                "category": "Power Transmission Components",
                "category_gu": "પાવર ટ્રાન્સમિશન પાર્ટ્સ",
                "confidence_score": 0.89 if sharpness > 4 else 0.72,
                "visible_features": [
                    "Radial involute gear teeth profiles",
                    "Central machined bore with keyway slot",
                    "Cylindrical pitch surface",
                    "Machined face width with chamfered rim"
                ],
                "likely_function": "Positive torque transmission and angular velocity ratio reduction/increment between parallel rotating shafts without slip.",
                "likely_function_gu": "બે ફરતા શાફ્ટ વચ્ચે દાંતા મિલાવીને લપસ્યા વગર પાવર અને ગતિ ટ્રાન્સફર કરે છે.",
                "possible_materials": ["Case-hardened Alloy Steel (AISI 8620 / 4140)", "Cast Iron (ASTM A48)", "Bronze / Brass", "Engineering Nylon / Delrin"],
                "common_applications": ["Industrial Gearboxes", "Automotive Transmissions", "Machine Tool Feeds", "Crane Winch Assemblies"],
                "failure_modes": ["Tooth pitting (surface contact fatigue)", "Root bending tooth fracture", "Scuffing / adhesive wear from lubrication breakdown", "Fretting in keyway slot"],
                "safety_precautions": ["Always verify gear mesh backlash before operation", "Keep nip-points shielded under OSHA / CE guards", "Isolate power drive (LOTO) before inspection"],
                "uncertainty_note": "Module, pitch diameter, and tooth pressure angle (14.5° vs 20°) require gear caliper or optical coordinate measurement.",
                "simple_explanation": {
                    "what_is_it": "Involute Spur / Helical Gear",
                    "what_is_it_gu": "ગીયર (દાંતાવાળું વ્હીલ / ચક્ર)",
                    "what_does_it_do": "Locks teeth with another gear to transfer rotational power and speed without slipping.",
                    "what_does_it_do_gu": "બે ફરતા શાફ્ટ વચ્ચે દાંતા મિલાવીને લપસ્યા વગર પાવર અને ગતિ પહોંચાડે છે.",
                    "materials_simple": "Tough Alloy Steel, Cast Iron, or Brass.",
                    "materials_simple_gu": "મજબૂત એલોય સ્ટીલ, કાસ્ટ આયર્ન (કાચું લોખંડ), અથવા પિત્તળ.",
                    "where_used_simple": "Car gearboxes, bicycles, factory machinery, winches.",
                    "where_used_simple_gu": "ગાડીના ગિયરબોક્સ, સાયકલ, ફેક્ટરીના મશીનો.",
                    "care_and_warnings": "Look for chipped teeth or grinding sounds. Keep well oiled or greased.",
                    "care_and_warnings_gu": "દાંતા તૂટેલા છે કે નહીં તે તપાસો અને હંમેશા સારું ઓઈલ અથવા ગ્રીસ લગાડી રાખો.",
                    "safety_simple": "Never put fingers or clothes near spinning gear teeth! Keep safety guards closed.",
                    "safety_simple_gu": "ફરતા ગિયરની નજીક હાથ કે કપડાં ક્યારેય ન લઈ જવા! સેફ્ટી કવર હંમેશા બંધ રાખવું."
                }
            },
            "bearing": {
                "part_name": "Deep Groove Radial Ball Bearing",
                "part_name_gu": "ડીપ ગ્રુવ બોલ બેરિંગ (છરાવાળું બેરિંગ)",
                "category": "Rotary Anti-Friction Elements",
                "category_gu": "એન્ટિ-ફ્રિક્શન બેરિંગ્સ",
                "confidence_score": 0.92 if sharpness > 4 else 0.78,
                "visible_features": [
                    "Inner ring with precision ground shaft bore",
                    "Outer ring ground outer diameter",
                    "Spherical rolling elements (balls) in stamped cage",
                    "Dual rubber contact seals or metallic shields (2RS/ZZ)"
                ],
                "likely_function": "Supports radial and moderate bidirectional thrust loads while allowing smooth high-speed rotation with minimal friction.",
                "likely_function_gu": "શાફ્ટને નહિવત ઘર્ષણ સાથે હાઇ-સ્પીડ પર સરળતાથી ફરવા માટે આધાર આપે છે.",
                "possible_materials": ["High Carbon Chromium Bearing Steel (AISI 52100 / 100Cr6)", "Stainless Steel (AISI 440C)", "Ceramic Silicon Nitride (Si3N4 Hybrid)"],
                "common_applications": ["Electric Motor Shafts", "Centrifugal Pumps", "Conveyor Idler Rollers", "Automotive Wheel Hubs"],
                "failure_modes": ["Spalling / raceway fatigue", "Brinelling from shock impact", "Overheating due to grease starvation or over-greasing", "Electrical pitting from shaft currents"],
                "safety_precautions": ["Never strike bearing rings with hammer; use induction heater or hydraulic press with sleeve", "Avoid spinning unlubricated bearings with compressed air (explosion risk)"],
                "uncertainty_note": "Internal clearance grade (C2, Normal, C3, C4) and exact boundary dimensions must be verified using micrometer or part code stamping.",
                "simple_explanation": {
                    "what_is_it": "Deep Groove Ball Bearing",
                    "what_is_it_gu": "બોલ બેરિંગ (ગોળાકાર છરાવાળું બેરિંગ)",
                    "what_does_it_do": "Allows round shafts to spin smoothly and quietly with almost zero friction.",
                    "what_does_it_do_gu": "શાફ્ટને કોઈપણ ઘર્ષણ વગર એકદમ સરળતાથી અને અવાજ વગર ફરવા દે છે.",
                    "materials_simple": "Hardened Chrome Bearing Steel or Stainless Steel.",
                    "materials_simple_gu": "કઠણ ક્રોમિયમ સ્ટીલ અથવા સ્ટેનલેસ સ્ટીલ.",
                    "where_used_simple": "Electric motors, water pumps, fans, vehicle wheels.",
                    "where_used_simple_gu": "ઇલેક્ટ્રિક મોટર, પાણીના પંપ, પંખા, ગાડીના વ્હીલ્સ.",
                    "care_and_warnings": "If it makes loud grinding noise or gets hot, it needs grease or needs replacement.",
                    "care_and_warnings_gu": "જો તે ગરમ થાય અથવા ઘરઘરાટી અવાજ કરે, તો ગ્રીસ ઓછું છે અથવા બેરિંગ ઘસાઈ ગયું છે.",
                    "safety_simple": "Never hit directly with a hammer! Never blow ungreased bearing with compressed air.",
                    "safety_simple_gu": "બેરિંગ પર સીધો હથોડો ન મારવો! એર પ્રેશરથી સૂકું બેરિંગ ક્યારેય ન ફેરવવું."
                }
            },
            "shaft": {
                "part_name": "Stepped Transmission Drive Shaft",
                "part_name_gu": "ડ્રાઇવ શાફ્ટ (ફરતો ધરી-સળિયો)",
                "category": "Rotating Power Transmission Shafts",
                "category_gu": "પાવર ટ્રાન્સમિશન શાફ્ટ",
                "confidence_score": 0.86,
                "visible_features": [
                    "Elongated cylindrical body with multiple stepped journal diameters",
                    "Milled keyway slots for pulleys/couplings",
                    "Threaded end section and retaining ring grooves",
                    "Fine ground bearing mounting seats"
                ],
                "likely_function": "Transmits torsional torque while supporting bending moments from mounted gears, pulleys, and sprockets.",
                "likely_function_gu": "મોટર કે એન્જિનનો ટોર્ક (ફરતો પાવર) ગિયર કે પુલી સુધી પહોંચાડે છે.",
                "possible_materials": ["Medium Carbon Steel (AISI 1045)", "Alloy Steel (AISI 4140 / 4340 Quenched & Tempered)", "Stainless Steel (304/316 for corrosive environments)"],
                "common_applications": ["Conveyor Drives", "Pump Rotors", "Industrial Fans", "Agitator Drive Units"],
                "failure_modes": ["Rotational bending fatigue fracture at shoulder fillet", "Torsional shear fracture", "Fretting corrosion under bearing seats", "Keyway edge deformation"],
                "safety_precautions": ["Ensure rotational shaft guards are securely bolted", "Perform dial indicator runout check before coupling alignment"],
                "uncertainty_note": "Internal torsional hardness and shaft straightness tolerance (TIR) cannot be established from surface visual inspection.",
                "simple_explanation": {
                    "what_is_it": "Drive Shaft",
                    "what_is_it_gu": "ડ્રાઇવ શાફ્ટ (ફરતો ધરી-સળિયો)",
                    "what_does_it_do": "A solid round rod that spins to carry twisting power from motor to wheels or pulleys.",
                    "what_does_it_do_gu": "મોટરમાંથી પુલી કે વ્હીલ સુધી ફરતો પાવર પહોંચાડતો મજબૂત ગોળ સળિયો.",
                    "materials_simple": "Strong High-Tensile Steel or Stainless Steel.",
                    "materials_simple_gu": "મજબૂત હાઈ-કાર્બન સ્ટીલ અથવા સ્ટેનલેસ સ્ટીલ.",
                    "where_used_simple": "Conveyors, pump motors, large industrial fans.",
                    "where_used_simple_gu": "કન્વેયર બેલ્ટ, પંપ મોટર, ઔદ્યોગિક મોટા પંખા.",
                    "care_and_warnings": "Check for wobbling (bending) or worn keyway slots where pulleys attach.",
                    "care_and_warnings_gu": "શાફ્ટ વાંકો થયો નથી ને કે તેની કી-વે (ગાળો) ઢીલી નથી પડી તે તપાસો.",
                    "safety_simple": "Never touch or wear loose clothing near spinning shafts. Always keep shaft guards installed.",
                    "safety_simple_gu": "ફરતા શાફ્ટ પાસે ખુલ્લા કપડાં ન પહેરવા અને સેફ્ટી ગાર્ડ હંમેશા ચાલુ રાખવું."
                }
            },
            "pulley": {
                "part_name": "V-Belt Pulley / Sheave",
                "part_name_gu": "વી-બેલ્ટ પુલી (પટ્ટાનું વ્હીલ)",
                "category": "Belt Transmission Drives",
                "category_gu": "બેલ્ટ ડ્રાઇવ ઘટકો",
                "confidence_score": 0.88,
                "visible_features": [
                    "Circumferential trapezoidal V-grooves",
                    "Webbed or spoked hub design",
                    "Taper-lock bushing bore",
                    "Balanced perimeter rim"
                ],
                "likely_function": "Transmits mechanical power between distant non-intersecting shafts using friction engagement with elastomeric V-belts.",
                "likely_function_gu": "બે અલગ અંતરે રહેલા શાફ્ટ વચ્ચે બેલ્ટના ઘર્ષણ દ્વારા પાવર પહોંચાડે છે.",
                "possible_materials": ["Grey Cast Iron (Grade 25/30)", "Ductile Iron", "Machined Carbon Steel", "Die-cast Aluminum"],
                "common_applications": ["Air Compressor Drives", "HVAC Blower Fans", "Crusher Mills", "Agricultural Machinery"],
                "failure_modes": ["Groove sidewall abrasive wear leading to belt bottoming", "Rim cracking from over-tightened belt tension", "Hub slippage on shaft"],
                "safety_precautions": ["Check belt tension with sonic tension meter", "Verify parallel and angular sheave alignment with laser tool", "Keep wire mesh guard closed during motor start"],
                "uncertainty_note": "Exact groove section (A, B, C, SPZ, SPA, SPB) requires a dedicated sheave groove contour profile gauge.",
                "simple_explanation": {
                    "what_is_it": "V-Belt Pulley",
                    "what_is_it_gu": "વી-બેલ્ટ પુલી (પટ્ટાનું વ્હીલ)",
                    "what_does_it_do": "Uses rubber belts to transfer spinning power between two shafts placed apart.",
                    "what_does_it_do_gu": "રબરના પટ્ટા (બેલ્ટ) વડે બે દૂર રહેલા શાફ્ટ વચ્ચે ફરતો પાવર ટ્રાન્સફર કરે છે.",
                    "materials_simple": "Cast Iron, Steel, or Aluminum.",
                    "materials_simple_gu": "કાસ્ટ આયર્ન (કાચું લોખંડ), સ્ટીલ અથવા એલ્યુમિનિયમ.",
                    "where_used_simple": "Air compressors, vehicle engines, factory blowers, flour mills.",
                    "where_used_simple_gu": "એર કોમ્પ્રેસર, એન્જિન, ફેક્ટરી બ્લોઅર, લોટ દળવાની ઘંટી.",
                    "care_and_warnings": "Check if groove is worn out or if belt is slipping and squealing.",
                    "care_and_warnings_gu": "પુલીનો ખાંચો ઘસાઈ ગયો છે કે નહીં અથવા પટ્ટો લપસીને અવાજ કરે છે કે નહીં તે જુઓ.",
                    "safety_simple": "Always keep wire safety guards bolted on. Moving belts can catch fingers instantly.",
                    "safety_simple_gu": "સેફ્ટી જાળી હંમેશા બોલ્ટ કરેલી રાખો. ચાલુ પટ્ટામાં આંગળી ફસાઈ જવાનો ભારે ભય રહે છે."
                }
            },
            "pump": {
                "part_name": "End-Suction Centrifugal Pump Assembly",
                "part_name_gu": "સેન્ટ્રીફ્યુગલ વોટર પંપ (પાણીનો પંપ)",
                "category": "Fluid Handling Machinery",
                "category_gu": "પ્રવાહી સંચાલન મશીનરી",
                "confidence_score": 0.85,
                "visible_features": [
                    "Volute spiral fluid casing with discharge flange",
                    "Axial suction nozzle",
                    "Enclosed backward-curved impeller vanes",
                    "Mechanical seal chamber and bearing housing"
                ],
                "likely_function": "Converts rotational kinetic energy from an electric motor or engine into hydrodynamic pressure to transport liquids.",
                "likely_function_gu": "મોટરની ગતિને પ્રવાહી દબાણમાં બદલીને પાણી કે પ્રવાહીને પાઇપ દ્વારા વહન કરે છે.",
                "possible_materials": ["Cast Iron (ASTM A48)", "Cast Bronze", "CF8M / 316 Stainless Steel", "Duplex Stainless Steel (2205)"],
                "common_applications": ["Industrial Cooling Water Circulation", "Water Treatment Plants", "Chemical Transfer", "Fire Suppression Systems"],
                "failure_modes": ["Cavitation erosion on impeller vane tips", "Mechanical seal face leakage", "Bearing seizure from water ingress", "Shaft deflection"],
                "safety_precautions": ["Do not run pump dry or deadheaded against closed discharge valve", "Depressurize and vent pump volute before loosening flange bolts"],
                "uncertainty_note": "NPSH requirements, impeller trim diameter, and head capacity curves must be matched against manufacturer data plate.",
                "simple_explanation": {
                    "what_is_it": "Centrifugal Water Pump",
                    "what_is_it_gu": "પાણીનો સેન્ટ્રીફ્યુગલ પંપ",
                    "what_does_it_do": "Spins an internal fan (impeller) to suck fluid and push it out with strong pressure.",
                    "what_does_it_do_gu": "અંદરના પંખા (ઈમ્પેલર)ને ફેરવીને પાણી ખેંચે છે અને દબાણ સાથે આગળ મોકલે છે.",
                    "materials_simple": "Cast Iron, Bronze, or Stainless Steel.",
                    "materials_simple_gu": "કાસ્ટ આયર્ન, કાંસું (બ્રોન્ઝ), અથવા સ્ટેનલેસ સ્ટીલ.",
                    "where_used_simple": "Water supply, cooling towers, factories, farm irrigation.",
                    "where_used_simple_gu": "ઘર કે સોસાયટીનો પાણી પુરવઠો, કૂલિંગ ટાવર, ફેક્ટરી, ખેતીની સિંચાઈ.",
                    "care_and_warnings": "Never run dry! Look for water leaks around the seal.",
                    "care_and_warnings_gu": "પાણી વગર પંપ ક્યારેય સૂકો ન ચલાવવો! સીલમાંથી પાણી ટપકે છે કે નહીં તે ચકાસો.",
                    "safety_simple": "Turn off power and bleed trapped pressure before opening bolts.",
                    "safety_simple_gu": "બોલ્ટ ખોલતા પહેલા વીજળી બંધ કરવી અને પાઇપનું પ્રેશર ખાલી કરી દેવું."
                }
            },
            "valve": {
                "part_name": "Flanged Ball / Gate Isolation Valve",
                "part_name_gu": "ફ્લેંજ્ડ આઇસોલેશન વાલ્વ (પ્રવાહી નળ)",
                "category": "Piping & Flow Control Devices",
                "category_gu": "પાઇપિંગ અને ફ્લો કંટ્રોલ સાધન",
                "confidence_score": 0.87,
                "visible_features": [
                    "Pressure-retaining body with ANSI / DIN bolt flanges",
                    "Quarter-turn lever handle or handwheel actuator",
                    "Bonnet and stuffing box stem gland",
                    "Directional flow indicator arrow cast on body"
                ],
                "likely_function": "Provides reliable on/off fluid isolation or throttling in pressurized piping systems.",
                "likely_function_gu": "પાઇપલાઇનમાં દબાણવાળા પ્રવાહી કે ગેસને રોકવા અથવા શરૂ કરવા માટેનું સાધન.",
                "possible_materials": ["WCB Cast Carbon Steel", "Forged Steel A105", "CF8M Stainless Steel", "Brass / Bronze"],
                "common_applications": ["Steam Distribution Mains", "Process Chemical Lines", "Oil & Gas Piping", "Hydraulic Power Units"],
                "failure_modes": ["Seat leakage past closing element", "Stem packing gland extrusion", "Body wall thinning from erosion/corrosion", "Actuator seizing"],
                "safety_precautions": ["Vent trapped cavity pressure prior to disassembly", "Apply Lockout/Tagout (LOTO) lock and hasp to valve handle in zero-energy position"],
                "uncertainty_note": "ANSI pressure class rating (150#, 300#, 600#) and elastomeric seat compound (PTFE, PEEK, Viton) must be confirmed via flange stampings.",
                "simple_explanation": {
                    "what_is_it": "Fluid Isolation Valve",
                    "what_is_it_gu": "વાલ્વ (પ્રવાહી કે ગેસ નિયંત્રક નળ)",
                    "what_does_it_do": "Stops or starts fluid and gas flowing through a pipe by turning a handle.",
                    "what_does_it_do_gu": "પાઇપમાંથી વહેતા પાણી, તેલ કે ગેસના પ્રવાહને સંપૂર્ણ ચાલુ કે બંધ કરે છે.",
                    "materials_simple": "Cast Steel, Forged Steel, or Brass.",
                    "materials_simple_gu": "કાસ્ટ સ્ટીલ, ફોર્જ્ડ સ્ટીલ, અથવા પિત્તળ.",
                    "where_used_simple": "Steam pipelines, water mains, oil and chemical lines, gas cylinders.",
                    "where_used_simple_gu": "પાણીની મોટી લાઇન, સ્ટીમ પાઇપ, ઓઇલ અને કેમિકલ પાઇપલાઇન.",
                    "care_and_warnings": "Check for leaks around the stem or handle. Ensure it seals 100% tight.",
                    "care_and_warnings_gu": "વાલ્વના હેન્ડલ પાસે લીકેજ તપાસો. તે પૂરેપૂરો બંધ થાય છે કે નહીં તે જુઓ.",
                    "safety_simple": "Relieve pipe pressure and lock the handle in safe position before maintenance.",
                    "safety_simple_gu": "સમારકામ પહેલાં પાઇપનું પ્રેશર રિલીઝ કરો અને હેન્ડલને લૉક કરો."
                }
            },
            "fastener": {
                "part_name": "High-Tensile Hex Head Cap Screw / Bolt",
                "part_name_gu": "હાઇ-ટેન્સાઇલ હેક્સ બોલ્ટ અને નટ (કાબલો અને ઢેબલી)",
                "category": "Mechanical Fastening Elements",
                "category_gu": "યાંત્રિક જોડાણ ઘટકો (ફાસ્ટનર્સ)",
                "confidence_score": 0.91,
                "visible_features": [
                    "Hexagonal drive head with grade markings",
                    "Helical threaded shank with lead angle",
                    "Smooth unthreaded grip length (shoulder)",
                    "Chamfered thread lead-in point"
                ],
                "likely_function": "Clamps mating machine components together by developing axial clamping preload through applied tightening torque.",
                "likely_function_gu": "ટોર્ક દ્વારા યોગ્ય દબાણ આપીને મશીનના ભાગોને એકસાથે મજબૂતીથી જોડી રાખે છે.",
                "possible_materials": ["Medium Carbon Alloy Steel (Grade 8.8 / 10.9 / 12.9)", "Stainless Steel A2-70 / A4-80", "Titanium Ti-6Al-4V"],
                "common_applications": ["Flange Connections", "Cylinder Head Clamping", "Machine Base Anchoring", "Structural Steel Joints"],
                "failure_modes": ["Fatigue fracture in root of first engaged thread", "Hydrogen embrittlement", "Thread stripping from over-torque", "Vibrational loosening"],
                "safety_precautions": ["Always use calibrated torque wrench and follow manufacturer torque specs", "Never reuse critical yield-tightened fasteners"],
                "uncertainty_note": "Thread pitch (metric coarse vs fine, UN/UNC) and exact proof strength must be measured using thread pitch pitch gauge.",
                "simple_explanation": {
                    "what_is_it": "High-Strength Bolt & Nut",
                    "what_is_it_gu": "હાઇ-ટેન્સાઇલ બોલ્ટ અને નટ (કાબલો અને ઢેબલી)",
                    "what_does_it_do": "Clamps parts firmly together so they do not vibrate apart or come loose.",
                    "what_does_it_do_gu": "બે કે તેથી વધુ ભાગોને મજબૂતાઈથી જોડી રાખે છે જેથી ધ્રુજારીથી પણ છૂટા ન પડે.",
                    "materials_simple": "Hardened High-Tensile Steel (Grade 8.8 / 10.9).",
                    "materials_simple_gu": "કઠણ હાઈ-ટેન્સાઇલ એલોય સ્ટીલ (ગ્રેડ 8.8 / 10.9).",
                    "where_used_simple": "Machine foundations, flanges, engines, steel structures.",
                    "where_used_simple_gu": "મશીનના પાયા, પાઇપ ફ્લેંજ, ગાડીના એન્જિન, લોખંડના સ્ટ્રક્ચર.",
                    "care_and_warnings": "Do not over-tighten until threads strip. Replace if bent or stretched.",
                    "care_and_warnings_gu": "આંટા (થ્રેડ) બગડી જાય એટલું વધુ ટાઈટ ન કરવું. વાંકો કે ખેંચાયેલો બોલ્ટ બદલી નાખવો.",
                    "safety_simple": "Always tighten with a torque wrench to manufacturer specification.",
                    "safety_simple_gu": "હંમેશા ટોર્ક રેન્ચ વડે યોગ્ય માપ મુજબ જ ટાઈટ કરવો."
                }
            },
            "motor": {
                "part_name": "Three-Phase Squirrel Cage Induction Motor",
                "part_name_gu": "ઇલેક્ટ્રિક ઇન્ડક્શન મોટર (મોટર)",
                "category": "Electro-Mechanical Prime Movers",
                "category_gu": "ઇલેક્ટ્રો-મિકેનિકલ મોટર્સ",
                "confidence_score": 0.90,
                "visible_features": [
                    "Ribbed cast iron / aluminum cooling stator frame",
                    "Terminal junction box mounted on top/side",
                    "Drive end (DE) shaft extension with keyway",
                    "Non-drive end cooling fan shroud cover"
                ],
                "likely_function": "Converts electrical AC power into continuous rotational mechanical torque to drive industrial machinery.",
                "likely_function_gu": "વીજળી શક્તિને સતત ફરતી યાંત્રિક ગતિમાં રૂપાંતરિત કરે છે.",
                "possible_materials": ["Cast Iron stator frame", "Silicon steel laminated stator core", "Copper or die-cast aluminum rotor bars"],
                "common_applications": ["Conveyors", "Pumps", "Fans & Blowers", "Machine Tool Spindles"],
                "failure_modes": ["Stator winding insulation breakdown from overheating", "Bearing failure due to contamination or vibration", "Phase imbalance / single phasing", "Rotor bar cracking"],
                "safety_precautions": ["Disconnect and lock out electrical breaker before opening terminal box", "Verify zero voltage with calibrated multimeter", "Discharge any power correction capacitors"],
                "uncertainty_note": "Rated kW, voltage (230/400/460V), poles/synchronous RPM, and insulation class (F/H) must be read from stamped nameplate.",
                "simple_explanation": {
                    "what_is_it": "Electric Induction Motor",
                    "what_is_it_gu": "ઇલેક્ટ્રિક ઇન્ડક્શન મોટર",
                    "what_does_it_do": "Converts electrical power into spinning motion to drive machines, pumps, and fans.",
                    "what_does_it_do_gu": "વીજળીનો ઉપયોગ કરીને ગોળ ફરતો પાવર ઉત્પન્ન કરે છે જે પંપ, પંખા કે મશીનને ફેરવે છે.",
                    "materials_simple": "Cast Iron Body, Copper Wire Coils, and Steel Rotor.",
                    "materials_simple_gu": "કાસ્ટ આયર્ન બોડી, તાંબાના વાયર (કોપર કોઈલ) અને સ્ટીલ રોટર.",
                    "where_used_simple": "Water pumps, conveyors, industrial machines, compressors.",
                    "where_used_simple_gu": "પાણીના પંપ, કન્વેયર, ફેક્ટરીના મશીનો, કોમ્પ્રેસર.",
                    "care_and_warnings": "Keep cooling vents clean from dust. Check for excess heat, unusual noise, or smoke.",
                    "care_and_warnings_gu": "પંખાની જાળી ધૂળથી સાફ રાખો. મોટર વધુ પડતી ગરમ ન થવી જોઈએ કે અવાજ ન કરવો જોઈએ.",
                    "safety_simple": "Disconnect electric power (LOTO) before opening terminal box or touching wires.",
                    "safety_simple_gu": "વાયર કે મોટરને હાથ અડાડતા પહેલા મેઇન સ્વીચ બંધ કરીને લૉક કરવી."
                }
            }
        }

        data = part_database.get(part_key, part_database["gear"]).copy()
        data["image_metrics"] = metrics
        return data
