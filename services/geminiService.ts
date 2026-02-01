import { GoogleGenAI, Type } from "@google/genai";
import { Fixture, MatchRecommendation, Referee } from "../types";

// Initialize Gemini
// Safety check: if process is undefined (e.g. strict browser env), handle gracefully
const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getSmartMatchRecommendations = async (
  fixture: Fixture,
  availableReferees: Referee[]
): Promise<MatchRecommendation[]> => {
  if (!ai) {
    console.warn("No API Key provided for Gemini.");
    // Return empty mock if no key
    return [];
  }

  const prompt = `
    Act as a professional Football Association Referee Appointment Officer for the Southampton, UK area.
    
    Task: Rank the available referees for the following specific fixture.
    
    Fixture Details:
    - Club: ${fixture.opponent ? `vs ${fixture.opponent}` : 'Home Game'}
    - League: ${fixture.league}
    - Age Group: ${fixture.ageGroup}
    - Location: ${fixture.location} (Southampton)
    - Date/Time: ${fixture.date} at ${fixture.time}
    
    Available Referees:
    ${JSON.stringify(availableReferees)}
    
    Logic to apply:
    1. Proximity: Referees closer to the location (in Southampton context) are better.
    2. Experience: Higher badge levels (Level 4/5) are better for Senior/Adult games. Level 7 is fine for U14/Junior.
    3. Experience Years: More is better for tough leagues.
    
    Output Format:
    Return a JSON array of objects. Each object must have:
    - refereeId (string)
    - score (number, 0-100)
    - reasoning (string, explain why they are a good match in 1 sentence)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              refereeId: { type: Type.STRING },
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
            },
            required: ["refereeId", "score", "reasoning"],
            propertyOrdering: ["refereeId", "score", "reasoning"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    
    const data = JSON.parse(text) as MatchRecommendation[];
    return data.sort((a, b) => b.score - a.score); // Ensure sorted by score desc
  } catch (error) {
    console.error("Gemini Matchmaking Error:", error);
    return [];
  }
};

export const generatePreMatchBrief = async (fixture: Fixture, refereeName: string): Promise<string> => {
    if (!ai) return "Have a great game!";

    const prompt = `
      Write a short, encouraging, and professional pre-match email brief from the App to the Referee (${refereeName}) for a game in Southampton.
      
      Details:
      - Location: ${fixture.location}
      - League: ${fixture.league}
      - Teams: vs ${fixture.opponent}
      
      Keep it under 50 words. Mention local Southampton weather or spirit if possible.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });
        return response.text || "Have a good game!";
    } catch (e) {
        return "Good luck with the match!";
    }
}