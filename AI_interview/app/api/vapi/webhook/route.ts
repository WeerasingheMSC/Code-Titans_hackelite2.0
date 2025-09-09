import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { createFeedback } from "@/lib/actions/general.action";

export async function POST(request: NextRequest) {
  try {
    console.log("🎣 Vapi webhook called");
    
    const body = await request.json();
    console.log("📥 Webhook data:", JSON.stringify(body, null, 2));

    const { type, data } = body;

    if (type === "call-ended") {
      const {
        call,
        transcript,
        summary,
        variableValues
      } = data;

      console.log("📞 Call ended, processing data...");
      console.log("Variables:", variableValues);
      console.log("Transcript length:", transcript?.length || 0);

      // Extract user data from variables
      const userId = variableValues?.userid;
      const username = variableValues?.username;
      const interviewId = variableValues?.interviewId || call.id;

      if (!userId) {
        console.log("⚠️ No userId in webhook, skipping storage");
        return NextResponse.json({ success: true, message: "No userId provided" });
      }

      // Check if we have interview preferences in the transcript
      const fullTranscript = transcript || summary || "Interview completed";
      
      // Try to extract interview details from transcript
      const interviewDetails = extractInterviewDetails(fullTranscript);
      
      if (interviewDetails.role) {
        // Store interview data
        const interview = {
          role: interviewDetails.role,
          type: interviewDetails.type || "mixed",
          level: interviewDetails.level || "mid-level",
          techstack: interviewDetails.techstack || ["General"],
          userId: userId,
          finalized: true,
          coverImage: getRandomInterviewCover(),
          createdAt: new Date().toISOString(),
          callId: call.id,
          duration: call.duration,
          cost: call.cost,
          interviewId: interviewId,
          amount: interviewDetails.amount || "5",
          retakeable: true,
          retakeCount: 0,
          originalInterviewId: interviewId,
          status: "completed",
          interviewSource: "voice-webhook",
          lastUpdated: new Date().toISOString()
        };

        const interviewDoc = await db.collection("interviews").add(interview);
        console.log("✅ Interview stored via webhook:", interviewDoc.id);

        // Create feedback
        if (fullTranscript && fullTranscript.length > 50) {
          const feedbackResult = await createFeedback({
            interviewId: interviewId,
            userId: userId,
            transcript: [
              {
                role: "system" as const,
                content: `Voice interview completed via webhook. Role: ${interview.role}, Type: ${interview.type}`
              },
              {
                role: "user" as const,
                content: `Candidate: ${username} (ID: ${userId})`
              },
              {
                role: "assistant" as const,
                content: fullTranscript
              }
            ],
            feedbackId: undefined
          });
          
          console.log("✅ Feedback created via webhook:", feedbackResult.feedbackId);
        }

        return NextResponse.json({
          success: true,
          message: "Interview data stored successfully",
          interviewId: interviewDoc.id
        });
      } else {
        console.log("⚠️ No interview details found in transcript");
        return NextResponse.json({
          success: true,
          message: "Call ended but no interview details extracted"
        });
      }
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// Helper function to extract interview details from transcript
function extractInterviewDetails(transcript: string) {
  const details: any = {};
  
  console.log("🔍 Extracting interview details from transcript...");
  
  // Look for common patterns in the transcript
  const roleMatch = transcript.match(/(?:role|position|job).*?(?:is|for|as)\s+([a-zA-Z\s]+?)(?:\.|,|;|\n|$)/i);
  if (roleMatch) {
    details.role = roleMatch[1].trim();
    console.log("Found role:", details.role);
  }
  
  const typeMatch = transcript.match(/(?:technical|behavioral|mixed)/i);
  if (typeMatch) {
    details.type = typeMatch[0].toLowerCase();
    console.log("Found type:", details.type);
  }
  
  const levelMatch = transcript.match(/(?:entry-level|mid-level|senior|expert)/i);
  if (levelMatch) {
    details.level = levelMatch[0].toLowerCase();
    console.log("Found level:", details.level);
  }
  
  // Extract tech stack
  const techMatch = transcript.match(/(?:technologies|tech stack|skills).*?(?:include|are|focus on)\s+([a-zA-Z,\s]+?)(?:\.|;|\n|$)/i);
  if (techMatch) {
    details.techstack = techMatch[1].split(',').map((tech: string) => tech.trim()).filter(Boolean);
    console.log("Found techstack:", details.techstack);
  }
  
  const amountMatch = transcript.match(/(\d+)\s+questions/i);
  if (amountMatch) {
    details.amount = amountMatch[1];
    console.log("Found amount:", details.amount);
  }
  
  console.log("Extracted details:", details);
  return details;
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Test endpoint
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Vapi webhook endpoint is working",
    timestamp: new Date().toISOString(),
    endpoint: "/api/vapi/webhook"
  });
}
