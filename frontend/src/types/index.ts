export type Language = 'en' | 'gu' | 'hi';

export type UserRole = 'student' | 'technician' | 'engineer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferredLanguage: Language;
  role: UserRole;
  organization?: string;
  savedCount: number;
}

export interface PartIdentificationResult {
  id?: string;
  timestamp?: string;
  part_name: string;
  part_name_gu?: string;
  category: string;
  category_gu?: string;
  confidence_score: number;
  visible_features: string[];
  likely_function: string;
  likely_function_gu?: string;
  possible_materials: string[];
  common_applications: string[];
  failure_modes: string[];
  safety_precautions: string[];
  uncertainty_note: string;
  simple_explanation?: {
    what_is_it: string;
    what_is_it_gu?: string;
    what_does_it_do: string;
    what_does_it_do_gu?: string;
    materials_simple: string;
    materials_simple_gu?: string;
    where_used_simple: string;
    where_used_simple_gu?: string;
    care_and_warnings: string;
    care_and_warnings_gu?: string;
    safety_simple: string;
    safety_simple_gu?: string;
  };
  image_metrics?: {
    resolution: string;
    aspect_ratio: number;
    brightness: number;
    sharpness_score: number;
    edge_density: number;
    metallic_signature: boolean;
    is_clear: boolean;
  };
  image_url?: string;
}

export interface LikelyCause {
  cause: string;
  probability: 'High' | 'Medium' | 'Low';
  explanation: string;
}

export interface DiagnosticItem {
  step: number;
  action: string;
  expected_observation: string;
  safety_check: string;
}

export interface ProblemSolverResult {
  id?: string;
  timestamp?: string;
  equipment_type: string;
  problem_description: string;
  problem_summary: string;
  possible_causes: LikelyCause[];
  step_by_step_checks: DiagnosticItem[];
  corrective_actions: string[];
  required_tools_parts: string[];
  preventive_maintenance: string[];
  safety_warnings: string[];
  loto_required: boolean;
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggested_checks?: string[];
  safety_notice?: string;
}

export interface EquipmentRecord {
  id: string;
  name: string;
  machine_id: string;
  category: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  installation_date: string;
  status: 'Operational' | 'Maintenance Due' | 'Critical' | 'Under Repair';
  last_service_date: string;
  next_service_date: string;
  location: string;
  operator_name: string;
  maintenance_history: {
    id: string;
    date: string;
    fault_description: string;
    action_taken: string;
    parts_replaced: string;
    technician: string;
    cost: number;
  }[];
}

export interface StudySubject {
  id: string;
  name: string;
  gu_name: string;
  hi_name: string;
  topics: string[];
}

export interface TopicContent {
  subject_id: string;
  topic: string;
  language: Language;
  format_type: string;
  concept_title: string;
  explanation: string;
  five_mark_exam_answer: string;
  ten_mark_exam_answer: string;
  key_formulas: { name: string; formula: string; units: string }[];
  worked_numerical: {
    problem: string;
    solution_steps: string[];
  };
  practice_mcqs: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
}

export interface CalculationResult {
  calculator_type: string;
  result: Record<string, any>;
  formula: string;
  steps: string[];
  assumptions: string[];
  valid: boolean;
  message?: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  source: string;
  is_ai_generated: boolean;
  tags: string[];
}
