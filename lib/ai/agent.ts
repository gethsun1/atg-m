/**
 * AI Agent for Treasury Management
 * Uses HuggingFace Inference API for decision-making
 */

import { HfInference } from "@huggingface/inference";
import { TreasuryState } from "../movement/executor";

export interface AIDecision {
  risk_level: "low" | "medium" | "high";
  action: "rebalance" | "hold";
  confidence: number; // 0.00 - 1.00
  reasoning: string;
  execution_payload?: {
    targetAllocation: number[];
  };
}

/**
 * Initialize HuggingFace client
 */
function getHfClient(): HfInference {
  const token = process.env.HF_ACCESS_TOKEN;
  if (!token) {
    throw new Error("HF_ACCESS_TOKEN not configured");
  }
  return new HfInference(token);
}

/**
 * Build structured prompt for AI decision-making
 */
function buildAnalysisPrompt(treasuryState: TreasuryState): string {
  const prompt = `You are an AI financial advisor analyzing a DAO treasury. Based on the following data, provide a structured decision.

Treasury Data:
- Balance: ${treasuryState.balance} MOVE
- Last Action: ${new Date(treasuryState.lastActionTimestamp * 1000).toLocaleString()}
- Has Pending Proposal: ${treasuryState.hasPendingProposal}

Your task:
1. Assess the risk level (low, medium, or high)
2. Decide on action (rebalance or hold)
3. Provide confidence score (0.00 to 1.00)
4. Explain reasoning
5. If rebalancing, suggest allocation percentages

Respond ONLY with valid JSON in this exact format:
{
  "risk_level": "low|medium|high",
  "action": "rebalance|hold",
  "confidence": 0.85,
  "reasoning": "Brief explanation of the decision",
  "execution_payload": {
    "targetAllocation": [40, 30, 20, 10]
  }
}

Important: 
- Always include execution_payload even if action is "hold" (use current allocation)
- Confidence should reflect market conditions
- Reasoning should be clear and concise
- Target allocation should sum to 100 (percentages)

JSON Response:`;

  return prompt;
}

/**
 * Parse AI response and extract structured decision
 */
function parseAIResponse(responseText: string): AIDecision {
  try {
    // Try to extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!parsed.risk_level || !parsed.action || typeof parsed.confidence !== "number") {
      throw new Error("Missing required fields in AI response");
    }

    // Ensure execution_payload exists
    if (!parsed.execution_payload || !Array.isArray(parsed.execution_payload.targetAllocation)) {
      parsed.execution_payload = {
        targetAllocation: [40, 30, 20, 10], // Default allocation
      };
    }

    return {
      risk_level: parsed.risk_level,
      action: parsed.action,
      confidence: Math.min(Math.max(parsed.confidence, 0), 1), // Clamp between 0 and 1
      reasoning: parsed.reasoning || "AI analysis complete",
      execution_payload: parsed.execution_payload,
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Invalid AI response format");
  }
}

/**
 * Generate fallback decision if AI fails
 */
function getFallbackDecision(treasuryState: TreasuryState): AIDecision {
  // Simple rule-based fallback
  const daysSinceLastAction = 
    (Date.now() / 1000 - treasuryState.lastActionTimestamp) / 86400;

  const shouldRebalance = daysSinceLastAction > 7 && !treasuryState.hasPendingProposal;

  return {
    risk_level: "low",
    action: shouldRebalance ? "rebalance" : "hold",
    confidence: 0.6,
    reasoning: "Fallback decision: " + 
      (shouldRebalance 
        ? "Treasury has not been rebalanced in over 7 days" 
        : "Recent activity detected, maintaining current position"),
    execution_payload: {
      targetAllocation: [40, 30, 20, 10],
    },
  };
}

/**
 * Analyze treasury state and generate AI decision
 */
export async function analyzeAndDecide(treasuryState: TreasuryState): Promise<AIDecision> {
  try {
    const hf = getHfClient();
    const prompt = buildAnalysisPrompt(treasuryState);

    // Use text-generation model
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      },
    });

    const decision = parseAIResponse(response.generated_text);
    
    console.log("AI Decision generated:", decision);
    return decision;

  } catch (error) {
    console.error("AI analysis failed, using fallback:", error);
    return getFallbackDecision(treasuryState);
  }
}

/**
 * Analyze treasury with mock data (for demo when treasury not initialized)
 */
export async function analyzeWithMockData(): Promise<AIDecision> {
  const mockState: TreasuryState = {
    balance: 100000,
    lastActionTimestamp: Math.floor(Date.now() / 1000) - 86400 * 10, // 10 days ago
    hasPendingProposal: false,
  };

  return analyzeAndDecide(mockState);
}

/**
 * Validate AI decision before execution
 */
export function validateDecision(decision: AIDecision): boolean {
  // Check risk level
  if (!["low", "medium", "high"].includes(decision.risk_level)) {
    return false;
  }

  // Check action
  if (!["rebalance", "hold"].includes(decision.action)) {
    return false;
  }

  // Check confidence range
  if (decision.confidence < 0 || decision.confidence > 1) {
    return false;
  }

  // Check execution payload if rebalancing
  if (decision.action === "rebalance" && decision.execution_payload) {
    const allocation = decision.execution_payload.targetAllocation;
    if (!Array.isArray(allocation) || allocation.length === 0) {
      return false;
    }
  }

  return true;
}

