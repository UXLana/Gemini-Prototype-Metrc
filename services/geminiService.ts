import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

// This service is used to "Create" a new product if one isn't found, satisfying the "Find or Create" requirement.
export const generateProductFromDescription = async (description: string): Promise<Product | null> => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing. Returning mock data.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a realistic cannabis product entry based on this description: "${description}". 
      If the description is vague, invent plausible details for a premium brand named 'Wyld' or similar.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            licenseNumber: { type: Type.STRING },
            brand: { type: Type.STRING },
            category: { type: Type.STRING },
            potency: { type: Type.STRING },
            markets: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            totalMarkets: { type: Type.INTEGER }
          },
          required: ["id", "name", "licenseNumber", "brand", "category", "potency", "markets", "totalMarkets"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        ...data,
        imageUrl: "https://images.unsplash.com/photo-1603909223429-69bb7df01f9c?auto=format&fit=crop&q=80&w=800" // Cannabis flower in jar
      };
    }
    return null;

  } catch (error) {
    console.error("Gemini generation failed:", error);
    return null;
  }
};