import json
import google.generativeai as genai
from app.core.config import settings

def configure_gemini():
    if settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)

async def assess_fraud_risk(user_id: int, policy_id: int, trigger_type: str, city: str) -> dict:
    """
    Uses Gemini as a proxy fraud detection model (Zero-Touch AI validation layer).
    """
    if not settings.GEMINI_API_KEY:
        return {
            "fraud_score": 0.05,
            "status": "approved",
            "reasoning": "Fallback zero-touch approval due to missing API Key."
        }
        
    configure_gemini()
    prompt = f"""
    You are an AI anti-fraud engine for an income protection platform.
    A zero-touch claim is being triggered automatically by an environmental/system event.
    Evaluate the fraud probability.
    - User ID: {user_id}
    - Policy ID: {policy_id}
    - Trigger Type: {trigger_type}
    - Location: {city}

    Because this is an automated external payload (parametrics), the fraud risk is generally low, but you should score it between 0.0 and 1.0 (where 1.0 is definitive fraud).
    Generate a JSON response:
    {{
      "fraud_score": float,
      "status": "approved" | "flagged_for_review",
      "reasoning": "A 1-sentence reasoning."
    }}
    Do not output markdown format. Only raw valid JSON.
    """
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        result = json.loads(response.text.strip().replace('```json', '').replace('```', ''))
        return result
    except Exception as e:
        print(f"Gemini Fraud API Error: {e}")
        return {
            "fraud_score": 0.1,
            "status": "approved",
            "reasoning": "Fallback automated approval due to API error."
        }
