import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function analyzeTurnoutFactors(constituencyName: string, stateName: string, stateDescription: string, dynamics: string) {
  try {
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
