from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
import logging
import base64

from .models import (
    PartIdentificationResponse, ProblemSolverRequest, ProblemSolverResponse,
    FollowUpChatRequest, FollowUpChatResponse, StudyQueryRequest,
    CalculationRequest, CalculationResponse
)
from .services.ai_service import AIService
from .services.vision_service import VisionService
from .services.engineering_service import EngineeringService
from .services.study_curriculum import get_subjects, get_curriculum_topic

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mechnova.api")

app = FastAPI(
    title="MechNova API – Intelligent Mechanical Engineering Assistant",
    description="Backend services for AI mechanical part vision, problem troubleshooting, calculations, and curriculum.",
    version="1.0.0"
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MechNova Backend",
        "version": "1.0.0",
        "ai_engine": "Gemini-ready with embedded expert mechanical reasoning engine",
        "vision_engine": "Pillow / NumPy Feature Extractor active"
    }

@app.post("/api/ai/identify-part", response_model=PartIdentificationResponse)
async def identify_part(
    file: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None)
):
    """
    Analyzes mechanical part image to estimate part name, category, features,
    materials, applications, failure modes, and safety precautions.
    """
    image_bytes = None
    filename = "uploaded_part.jpg"

    if file:
        filename = file.filename or "uploaded_part.jpg"
        image_bytes = await file.read()
    elif image_base64:
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        image_bytes = base64.b64decode(image_base64)
    else:
        raise HTTPException(status_code=400, detail="No image provided. Please upload a file or base64 data.")

    if len(image_bytes) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image file exceeds 15MB limit.")

    try:
        metrics = VisionService.analyze_image_bytes(image_bytes)
        result = VisionService.identify_part_from_heuristics(metrics, filename)
        return PartIdentificationResponse(**result)
    except Exception as e:
        logger.error(f"Image analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")

@app.post("/api/ai/solve-problem", response_model=ProblemSolverResponse)
def solve_problem(req: ProblemSolverRequest):
    """
    Generates intelligent troubleshooting advisory for mechanical equipment.
    """
    try:
        return AIService.solve_mechanical_problem(req)
    except Exception as e:
        logger.error(f"Problem solver error: {e}")
        raise HTTPException(status_code=500, detail=f"Diagnostic service failed: {str(e)}")

@app.post("/api/ai/chat-followup", response_model=FollowUpChatResponse)
def chat_followup(req: FollowUpChatRequest):
    """
    Interactive conversational follow-up for diagnosing machinery.
    """
    try:
        return AIService.chat_follow_up(req)
    except Exception as e:
        logger.error(f"Chat follow-up error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat service failed: {str(e)}")

@app.get("/api/study/subjects")
def list_subjects():
    """
    Returns list of 10 mechanical engineering subjects with syllabus topics.
    """
    return get_subjects()

@app.post("/api/study/topic-content")
def get_topic_content(req: StudyQueryRequest):
    """
    Returns multilingual study notes, formulas, numerical solution, 5/10 mark exam guides, and MCQs.
    """
    try:
        return AIService.get_study_material(req)
    except Exception as e:
        logger.error(f"Study content retrieval error: {e}")
        raise HTTPException(status_code=500, detail=f"Study module failed: {str(e)}")

@app.post("/api/calculate", response_model=CalculationResponse)
def perform_calculation(req: CalculationRequest):
    """
    Executes precise computational mechanical calculations with step-by-step math.
    """
    calc_type = req.calculator_type.lower()
    inputs = req.inputs

    try:
        if calc_type in ["stress_strain", "stress", "strain"]:
            res = EngineeringService.calculate_stress_strain(inputs)
        elif calc_type in ["youngs_modulus", "young_modulus"]:
            res = EngineeringService.calculate_youngs_modulus(inputs)
        elif calc_type in ["torque_power", "torque", "power"]:
            res = EngineeringService.calculate_torque_power(inputs)
        elif calc_type in ["gear_ratio", "gear"]:
            res = EngineeringService.calculate_gear_ratio(inputs)
        elif calc_type in ["efficiency", "mechanical_efficiency"]:
            res = EngineeringService.calculate_mechanical_efficiency(inputs)
        elif calc_type in ["pressure_force", "pressure", "force"]:
            res = EngineeringService.calculate_pressure_force(inputs)
        elif calc_type in ["heat_transfer", "conduction"]:
            res = EngineeringService.calculate_heat_transfer_conduction(inputs)
        elif calc_type in ["fluid_flow", "pipe_flow"]:
            res = EngineeringService.calculate_fluid_flow(inputs)
        elif calc_type in ["thermodynamics", "carnot"]:
            res = EngineeringService.calculate_thermodynamics(inputs)
        else:
            raise HTTPException(status_code=400, detail=f"Unknown calculator type: {calc_type}")

        return CalculationResponse(
            calculator_type=calc_type,
            result=res["result"],
            formula=res["formula"],
            steps=res["steps"],
            assumptions=res["assumptions"],
            valid=True
        )
    except ValueError as ve:
        return CalculationResponse(
            calculator_type=calc_type,
            result={},
            formula="N/A",
            steps=[],
            assumptions=[],
            valid=False,
            message=str(ve)
        )
    except Exception as e:
        logger.error(f"Calculation error: {e}")
        raise HTTPException(status_code=500, detail=f"Calculation failed: {str(e)}")

@app.get("/api/knowledge-library")
def get_knowledge_library():
    """
    Provides comprehensive searchable machine knowledge library.
    """
    from .services.knowledge_base import KNOWLEDGE_ITEMS
    return KNOWLEDGE_ITEMS
