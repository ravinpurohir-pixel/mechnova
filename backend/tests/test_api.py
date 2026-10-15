from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_study_subjects():
    response = client.get("/api/study/subjects")
    assert response.status_code == 200
    subjects = response.json()
    assert len(subjects) == 10
    assert any(s["id"] == "thermodynamics" for s in subjects)

def test_calculate_endpoint():
    payload = {
        "calculator_type": "stress_strain",
        "inputs": {"force": 20000, "area": 100}
    }
    response = client.post("/api/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is True
    assert data["result"]["stress_mpa"] == 200.0

def test_solve_problem_endpoint():
    payload = {
        "equipment_type": "Centrifugal Pump",
        "problem_description": "Excessive bearing temperature and loud cavitation noise",
        "symptoms": ["Overheating", "Vibration", "Cavitation"]
    }
    response = client.post("/api/ai/solve-problem", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["possible_causes"]) > 0
    assert len(data["step_by_step_checks"]) > 0
    assert data["loto_required"] is True

def test_knowledge_library():
    response = client.get("/api/knowledge-library")
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 5
