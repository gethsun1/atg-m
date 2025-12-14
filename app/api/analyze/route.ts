/**
 * AI Analysis API Route
 * Accepts treasury state and returns AI decision
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeAndDecide, analyzeWithMockData, validateDecision } from "@/lib/ai/agent";
import { TreasuryState } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let decision;

    // If treasury state is provided, analyze it
    if (body.treasuryState) {
      const treasuryState: TreasuryState = {
        balance: Number(body.treasuryState.balance),
        lastActionTimestamp: Number(body.treasuryState.lastActionTimestamp),
        hasPendingProposal: Boolean(body.treasuryState.hasPendingProposal),
      };

      decision = await analyzeAndDecide(treasuryState);
    } else {
      // Use mock data for demo
      decision = await analyzeWithMockData();
    }

    // Validate decision
    if (!validateDecision(decision)) {
      return NextResponse.json(
        { error: "Invalid AI decision generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      decision,
    });

  } catch (error: any) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "AI analysis failed",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "AI Analysis API",
    usage: "POST /api/analyze with { treasuryState?: TreasuryState }",
  });
}

