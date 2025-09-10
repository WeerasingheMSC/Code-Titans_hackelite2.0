import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { createFeedback } from "@/lib/actions/general.action";

export async function POST(request: NextRequest) {
  try {
    console.log("📞 Assistant called store-interview-data function");
    
    const body = await request.json();
    console.log("📥 Received function call data:", JSON.stringify(body, null, 2));

    // Extract parameters from the function call
    const {
      role,
      type,
      level, 
      techstack,
      amount,
      userId,
      username,
      interviewId,
      callId,
      transcript,
      duration,
      assistantId
    } = body;

    console.log("🔍 Extracted parameters:", {
      role,
      type,
      level,
      techstack,
      amount,
      userId,
      username,
      interviewId,
      transcriptLength: transcript?.length || 0
    });

    // Validate required parameters
    if (!role || !type || !level || !techstack || !amount || !userId) {
      console.error("❌ Missing required parameters:", {
        role: !!role,
        type: !!type,
        level: !!level,
        techstack: !!techstack,
        amount: !!amount,
        userId: !!userId
      });
      
      return NextResponse.json({
        success: false,
        error: "Missing required parameters",
        missing: {
          role: !role,
          type: !type,
          level: !level,
          techstack: !techstack,
          amount: !amount,
          userId: !userId
        }
      }, { status: 400 });
    }

    // Store interview data in the interviews collection
    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(",").map((tech: string) => tech.trim()), // Clean up spacing
      userId: userId,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
      // Additional data from the voice interview
      callId: callId,
      duration: duration,
      interviewId: interviewId || callId || `interview-${Date.now()}`,
      assistantId: assistantId,
      amount: amount,
      // Enable retake functionality
      retakeable: true,
      retakeCount: 0,
      originalInterviewId: interviewId || callId || `interview-${Date.now()}`,
      // Interview completion status
      status: "completed",
      interviewSource: "voice-assistant",
      lastUpdated: new Date().toISOString()
    };

    console.log("💾 Attempting to store interview data...");
    const interviewDoc = await db.collection("interviews").add(interview);
    console.log("✅ Interview stored with ID:", interviewDoc.id);
    console.log("📄 Stored interview data:", JSON.stringify(interview, null, 2));

    // If we have transcript data, also create feedback
    let feedbackResult = null;
    if (transcript && transcript.length > 0) {
      try {
        console.log("🤖 Creating feedback from transcript...");
        const formattedTranscript = [
          {
            role: "system" as const,
            content: `Voice interview completed. Role: ${role}, Type: ${type}, Level: ${level}, Tech Stack: ${techstack}`
          },
          {
            role: "user" as const,
            content: `Candidate: ${username} (ID: ${userId})`
          },
          {
            role: "assistant" as const,
            content: transcript
          }
        ];
        
        console.log("📝 Formatted transcript for feedback:", JSON.stringify(formattedTranscript, null, 2));
        
        feedbackResult = await createFeedback({
          interviewId: interview.interviewId,
          userId: userId,
          transcript: formattedTranscript,
          feedbackId: undefined
        });
        
        console.log("✅ Feedback created successfully:", {
          success: feedbackResult.success,
          feedbackId: feedbackResult.feedbackId
        });
      } catch (feedbackError) {
        console.error("❌ Feedback creation failed:", feedbackError);
        console.error("Feedback error details:", {
          message: feedbackError instanceof Error ? feedbackError.message : 'Unknown error',
          stack: feedbackError instanceof Error ? feedbackError.stack : 'No stack trace'
        });
      }
    } else {
      console.log("⚠️ No transcript provided - skipping feedback creation");
    }

    // Return success response to the assistant
    return NextResponse.json({
      success: true,
      message: `Interview data stored successfully for ${username}`,
      data: {
        interviewId: interview.interviewId,
        interviewDocId: interviewDoc.id,
        feedbackId: feedbackResult?.feedbackId,
        role: role,
        type: type,
        level: level,
        techstack: techstack,
        userId: userId,
        timestamp: interview.createdAt
      },
      // Message the assistant can speak to the user
      assistantMessage: `Perfect! I've stored your ${type} interview for the ${role} position at ${level} level. Your interview ID is ${interview.interviewId}. ${feedbackResult ? 'Detailed feedback has been generated and you can view it in your dashboard. ' : ''}You can always retake this interview or try a different configuration anytime. Great job today!`
    });

  } catch (error) {
    console.error("Error in store-interview-data function:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      assistantMessage: "I apologize, but there was an issue storing your interview data. Please try again or contact support."
    }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS
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

// Add GET method for testing
export async function GET(request: NextRequest) {
  console.log("🧪 GET request to store-interview-data endpoint");
  return NextResponse.json({
    success: true,
    message: "store-interview-data endpoint is working",
    timestamp: new Date().toISOString(),
    endpoint: "/api/vapi/store-interview-data"
  });
}
