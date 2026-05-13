import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API routes
app.post("/api/analyze", async (req, res) => {
  const { dilemma } = req.body;

  if (!dilemma) {
    return res.status(400).json({ error: "Dilemma is required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following decision or dilemma. Provide a comprehensive breakdown including pros and cons, a SWOT analysis, and if applicable, a comparison between options. 
      Identify the language of the request (English or Spanish) and respond in that same language.
      
      Dilemma: "${dilemma}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            language: { type: Type.STRING, description: "The language detected ('en' or 'es')" },
            decisionSummary: { type: Type.STRING, description: "A punchy summary of the decision to be made" },
            prosCons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["pro", "con"] }
                },
                required: ["text", "type"]
              }
            },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["strengths", "weaknesses", "opportunities", "threats"]
            },
            comparisonOptions: {
              type: Type.ARRAY,
              description: "Only if comparing specific options, otherwise empty",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  bestFor: { type: Type.STRING },
                  riskLevel: { type: Type.STRING }
                },
                required: ["name", "bestFor", "riskLevel"]
              }
            },
            recommendation: { type: Type.STRING, description: "A direct, 'tiebreaker' recommendation" }
          },
          required: ["language", "decisionSummary", "prosCons", "swot", "recommendation"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to analyze dilemma" });
  }
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
