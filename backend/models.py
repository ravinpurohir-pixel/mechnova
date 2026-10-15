from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class PartIdentificationResponse(BaseModel):
    part_name: str
    part_name_gu: Optional[str] = None
    category: str
    category_gu: Optional[str] = None
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    visible_features: List[str]
    likely_function: str
    likely_function_gu: Optional[str] = None
    possible_materials: List[str]
    common_applications: List[str]
    failure_modes: List[str]
    safety_precautions: List[str]
    uncertainty_note: str
    simple_explanation: Optional[Dict[str, str]] = None
    image_metrics: Optional[Dict[str, Any]] = None

class ProblemSolverRequest(BaseModel):
    equipment_type: str
    problem_description: str
    symptoms: List[str] = []
    operating_conditions: Optional[str] = None
    image_base64: Optional[str] = None

class LikelyCause(BaseModel):
    cause: str
    probability: str  # High, Medium, Low
    explanation: str

class DiagnosticItem(BaseModel):
    step: int
    action: str
    expected_observation: str
    safety_check: str

class ProblemSolverResponse(BaseModel):
    problem_summary: str
    possible_causes: List[LikelyCause]
    step_by_step_checks: List[DiagnosticItem]
    corrective_actions: List[str]
    required_tools_parts: List[str]
    preventive_maintenance: List[str]
    safety_warnings: List[str]
    loto_required: bool
    disclaimer: str

class FollowUpChatRequest(BaseModel):
    equipment_type: str
    problem_summary: str
    conversation_history: List[Dict[str, str]]
    user_message: str

class FollowUpChatResponse(BaseModel):
    reply: str
    suggested_checks: List[str]
    safety_notice: Optional[str] = None

class StudyQueryRequest(BaseModel):
    subject: str
    topic: str
    language: str = "en"  # en, gu, hi
    format_type: str = "concept"  # concept, numerical, formula, exam_5mark, exam_10mark, mcq

class CalculationRequest(BaseModel):
    calculator_type: str
    inputs: Dict[str, float]
    units: Optional[Dict[str, str]] = None

class CalculationResponse(BaseModel):
    calculator_type: str
    result: Dict[str, Any]
    formula: str
    steps: List[str]
    assumptions: List[str]
    valid: bool
    message: Optional[str] = None
