import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getAI() {
  if (!genAI) {
    let apiKey: string | undefined;

    try {
      // Safely try to get API key from environment
      if (typeof process !== 'undefined' && process.env) {
        apiKey = process.env.GEMINI_API_KEY;
      }
    } catch (e) {
      console.warn("Could not access process.env safely", e);
    }

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI features will be disabled.");
      return null;
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export async function analyzeTurnoutFactors(constituencyName: string, stateName: string, stateDescription: string, dynamics: string) {
  try {
    const ai = getAI();
    if (!ai) throw new Error("AI service not initialized. Check API key.");
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As a political strategist, analyze the factors influencing voter turnout for the ${constituencyName} constituency in ${stateName}. 
      
      State Context: ${stateDescription}
      Additional Dynamics: ${dynamics}
      
      Provide a concise 3-paragraph analysis focusing on:
      1. Socio-economic factors (urbanization, literacy, infrastructure).
      2. Political mobilizations (local strongmen, alliance effects, anti-incumbency).
      3. Demographic influences (caste/religious consolidation, youth aspirations).
      
      Keep the tone analytical and objective. Do not include introductory or concluding pleasantries. Use bullet points for key takeaways.`,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate AI analysis. Please check your connection and API key.");
  }
}
