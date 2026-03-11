import { z } from "zod";
import type { IntakeSummary } from "@lurnt/domain";
import { getAnthropicClient } from "../client";

const GeneratedNodeSchema = z.object({
  tempId: z.string(),
  title: z.string(),
  description: z.string(),
});

const GeneratedEdgeSchema = z.object({
  sourceTempId: z.string(),
  targetTempId: z.string(),
  relation: z.enum(["prerequisite", "related"]),
  justification: z.string(),
  weight: z.number(),
});

export const GeneratedGraphSchema = z.object({
  nodes: z.array(GeneratedNodeSchema),
  edges: z.array(GeneratedEdgeSchema),
});

export type GeneratedNode = z.infer<typeof GeneratedNodeSchema>;
export type GeneratedEdge = z.infer<typeof GeneratedEdgeSchema>;
export type GeneratedGraph = z.infer<typeof GeneratedGraphSchema>;

const SYSTEM_PROMPT = `You are an expert curriculum designer. Given a subject area and a student's intake summary, generate a knowledge graph of 15-25 topics (nodes) that form a comprehensive learning path.

Return ONLY raw valid JSON with no markdown formatting, no code fences, no explanation. Match this exact schema:

{
  "nodes": [
    {
      "tempId": "node_1",
      "title": "Short topic title",
      "description": "1-2 sentence description of what this topic covers"
    }
  ],
  "edges": [
    {
      "sourceTempId": "node_2",
      "targetTempId": "node_1",
      "relation": "prerequisite",
      "justification": "Brief explanation of why this relationship exists",
      "weight": 0.8
    }
  ]
}

Guidelines:
- Generate 15-25 nodes covering the subject comprehensively
- Use "prerequisite" edges for dependencies (source depends on target being learned first)
- Use "related" edges for conceptually linked but non-dependent topics
- Weight edges from 0 to 1 (1 = strongest relationship)
- Ensure the graph is a connected DAG for prerequisites (no cycles)
- Order nodes roughly from foundational to advanced
- Include both the student's gap areas and topics they should review
- Make node titles concise but specific (e.g., "Linear Regression" not "Regression")
- Use tempId format "node_1", "node_2", etc.`;

export async function generateKnowledgeGraph(
  expertiseTitle: string,
  summary: IntakeSummary,
): Promise<GeneratedGraph> {
  const client = getAnthropicClient();

  const userMessage = `Subject: ${expertiseTitle}

Student Profile:
- Overall Level: ${summary.overallLevel}
- Familiar Topics: ${summary.familiarTopics.join(", ") || "None"}
- Gap Areas: ${summary.gapAreas.join(", ") || "None identified"}
- Goals: ${summary.goals}
- Recommended Starting Point: ${summary.recommendedStartingPoint}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const rawText = textBlock?.text ?? "{}";
  const rawJson = rawText
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();

  const parsed = JSON.parse(rawJson);
  return GeneratedGraphSchema.parse(parsed);
}
