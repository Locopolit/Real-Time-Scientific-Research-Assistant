
import { GoogleGenAI, Type } from "@google/genai";
import type { Task } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const researchAgentPrompt = (userQuery: string): string => `
You are a multi-agent AI system for advanced scientific research. Your goal is to receive a complex query, break it down, simulate execution by specialized agents, and synthesize the findings.

User Query: "${userQuery}"

Follow these steps:
1.  **Decompose Query:** Break down the user's query into a series of 5 logical research tasks.
2.  **Assign Agents:** For each task, assign a hypothetical specialized agent (e.g., Research Agent, Biology Expert Agent, Data Analysis Agent, Synthesis Agent) and the tools it would use (e.g., PubMed Search, PDF Parser, Clinical Trials Database).
3.  **Simulate Findings:** For each task, create a realistic, plausible, but invented summary of the findings. For example, invent a 'Nature paper' title, an 'XYZ protein pathway' description, 'small-molecule therapies', and their 'side effects' based on your training data. Make the summaries concise (1-2 sentences).
4.  **Synthesize Report:** Act as a Synthesis Agent. Combine all simulated findings into a detailed, well-structured Markdown report. The report must be comprehensive and include citations for all claims, referencing the simulated sources you invented (e.g., the Nature paper, clinical trial IDs).

Your final output MUST be a single JSON object matching the provided schema.
`;

export const runResearchAssistant = async (userQuery: string): Promise<{ tasks: Omit<Task, 'status'>[], report: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: researchAgentPrompt(userQuery),
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              description: "The decomposed list of tasks for the research workflow.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER, description: "Task identifier."},
                  description: { type: Type.STRING, description: "Description of the task."},
                  agent: { type: Type.STRING, description: "The agent assigned to the task."},
                  summary: { type: Type.STRING, description: "A simulated, concise summary of the task's findings."}
                },
                required: ["id", "description", "agent", "summary"]
              }
            },
            report: {
              type: Type.STRING,
              description: "The final, synthesized report in Markdown format."
            }
          },
          required: ["tasks", "report"]
        },
      },
    });

    const jsonString = response.text;
    const parsedResult = JSON.parse(jsonString);
    return parsedResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI. The model may be unable to fulfill the request for this query.");
  }
};
