import { NextRequest, NextResponse } from "next/server";
import { vapiAPI } from "@/lib/vapi.api";
import { db } from "@/firebase/admin";
import { createFeedback } from "@/lib/actions/general.action";
import { getRandomInterviewCover } from "@/lib/utils";

// Function to extract interview details from transcript
function extractInterviewDetails(transcript: any) {
  if (!transcript || !transcript.messages) {
    return null;
  }

  const messages = transcript.messages;
  let role = '';
  let type = '';
  let level = '';
  let techstack = '';
  let amount = '';

  // Look for patterns in the conversation
  for (const message of messages) {
    if (message.role === 'user') {
      const content = message.content.toLowerCase();
      
      // Extract role
      if (!role && (content.includes('developer') || content.includes('engineer') || content.includes('analyst'))) {
        if (content.includes('software') || content.includes('full stack') || content.includes('frontend') || content.includes('backend')) {
          role = content.includes('frontend') ? 'Frontend Developer' : 
                 content.includes('backend') ? 'Backend Developer' : 
                 content.includes('full stack') ? 'Full Stack Developer' : 'Software Developer';
        } else if (content.includes('data')) {
          role = 'Data Analyst';
        } else {
          role = 'Software Developer'; // default
        }
      }

      // Extract interview type
      if (!type && (content.includes('technical') || content.includes('behavioral') || content.includes('mixed'))) {
        type = content.includes('technical') ? 'technical' : 
               content.includes('behavioral') ? 'behavioral' : 'mixed';
      }

      // Extract level
      if (!level && (content.includes('junior') || content.includes('senior') || content.includes('mid') || content.includes('entry'))) {
        level = content.includes('senior') ? 'senior' : 
                content.includes('mid') ? 'mid-level' : 'junior';
      }

      // Extract tech stack
      if (content.includes('react') || content.includes('node') || content.includes('python') || content.includes('java')) {
        const techs = [];
        if (content.includes('react')) techs.push('React');
        if (content.includes('node')) techs.push('Node.js');
        if (content.includes('python')) techs.push('Python');
        if (content.includes('java') && !content.includes('javascript')) techs.push('Java');
        if (content.includes('typescript')) techs.push('TypeScript');
        if (content.includes('javascript')) techs.push('JavaScript');
        
        if (techs.length > 0) {
          techstack = techs.join(',');
        }
      }

      // Extract number of questions
      if (!amount) {
        const numbers = content.match(/\b(\d+)\b/g);
        if (numbers) {
          const num = parseInt(numbers[0]);
          if (num >= 3 && num <= 10) {
            amount = num.toString();
          }
        }
      }
    }
  }

  // Set defaults if not found
  return {
    role: role || 'Software Developer',
    type: type || 'mixed',
    level: level || 'mid-level',
    techstack: techstack || 'React,JavaScript',
    amount: amount || '5'
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 Processing most recent Vapi call...");
    
    const body = await request.json();
    const { userId, username, interviewId } = body;

    if (!userId || !username || !interviewId) {
      return NextResponse.json({ error: "User ID, username, and interview ID are required" }, { status: 400 });
    }

    // Get the most recent calls from Vapi
    console.log("📞 Fetching recent calls from Vapi API...");
    const recentCalls = await vapiAPI.listCalls(5); // Get last 5 calls
    
    if (!recentCalls || !recentCalls.data || recentCalls.data.length === 0) {
      console.error("❌ No recent calls found");
      return NextResponse.json({ error: "No recent calls found" }, { status: 404 });
    }

    // Find the most recent completed call (assuming it's our interview)
    const latestCall = recentCalls.data.find((call: any) => 
      call.status === 'ended' && call.transcript && call.transcript.messages
    ) || recentCalls.data[0];

    if (!latestCall) {
      console.error("❌ No suitable call found");
      return NextResponse.json({ error: "No suitable call found" }, { status: 404 });
    }

    console.log("✅ Found latest call:", {
      id: latestCall.id,
      status: latestCall.status,
      hasTranscript: !!latestCall.transcript
    });

    // If the call doesn't have a transcript yet, try to fetch it
    let callData = latestCall;
    if (!callData.transcript) {
      console.log("🔄 Fetching full call data...");
      callData = await vapiAPI.getCall(latestCall.id);
    }

    // Extract interview details from transcript
    const interviewDetails = extractInterviewDetails(callData.transcript);
    
    if (!interviewDetails) {
      console.log("⚠️ Could not extract interview details, using defaults");
    }

    // Create full transcript string
    const fullTranscript = callData.transcript?.messages
      ?.map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n') || 'No transcript available';

    // Store interview data in Firebase
    console.log("💾 Storing interview data in Firebase...");
    
    const interviewData = {
      id: interviewId,
      userId: userId,
      username: username,
      role: interviewDetails?.role || 'Software Developer',
      type: interviewDetails?.type || 'mixed',
      level: interviewDetails?.level || 'mid-level',
      techstack: interviewDetails?.techstack?.split(',') || ['React', 'JavaScript'],
      amount: parseInt(interviewDetails?.amount || '5'),
      transcript: fullTranscript,
      callId: callData.id,
      cover: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
      finalized: true,
      feedbackGenerated: false
    };

    // Save to Firebase
    await db.collection("interviews").doc(interviewId).set(interviewData);
    
    console.log("✅ Interview data stored successfully");

    // Generate feedback
    console.log("🤖 Generating feedback...");
    const messages = callData.transcript?.messages?.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    })) || [];

    const feedbackResult = await createFeedback({
      interviewId,
      userId,
      transcript: messages,
      feedbackId: `feedback_${interviewId}_${Date.now()}`
    });

    if (feedbackResult.success) {
      // Update interview to mark feedback as generated
      await db.collection("interviews").doc(interviewId).update({
        feedbackGenerated: true,
        feedbackId: feedbackResult.feedbackId
      });
      
      console.log("✅ Feedback generated successfully");
    } else {
      console.error("❌ Failed to generate feedback");
    }

    return NextResponse.json({ 
      success: true, 
      message: "Interview data processed and stored successfully",
      interviewId,
      feedbackId: feedbackResult.feedbackId,
      callId: callData.id,
      data: {
        ...interviewDetails,
        transcript: fullTranscript.substring(0, 200) + '...'
      }
    });

  } catch (error: any) {
    console.error("❌ Error processing recent call:", error);
    return NextResponse.json({ 
      error: "Failed to process recent call", 
      details: error.message 
    }, { status: 500 });
  }
}
