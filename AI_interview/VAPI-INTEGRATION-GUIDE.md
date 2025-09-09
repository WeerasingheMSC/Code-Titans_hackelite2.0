# 🎤 Complete Vapi Integration Guide for Interview Storage

## Overview
This guide shows how to properly integrate Vapi AI voice calls with your Firebase database to store interview data and generate feedback.

## 🔧 Vapi Platform Configuration

### 1. Assistant Configuration

**Go to Vapi Dashboard → Assistants → Your Assistant**

#### **Basic Settings:**
```json
{
  "name": "AI Interview Assistant",
  "model": {
    "provider": "openai",
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 150
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "rachel"
  }
}
```

#### **System Message:**
```
You are a professional AI interviewer conducting voice interviews for job candidates.

Your process:
1. Collect interview preferences (role, type, level, tech stack, number of questions)
2. Conduct the interview based on preferences
3. At the end, call the store_interview_data function with all collected information

Keep responses conversational and under 30 seconds when spoken.

Variables available:
- {{username}} - Candidate name
- {{userid}} - User ID
- {{interviewId}} - Interview ID

When ending the interview, ALWAYS call the store_interview_data function.
```

### 2. Function Configuration

**Add Function to Assistant:**

**Function Name:** `store_interview_data`

**Server URL:** 
```
https://ai-interviews-o2wpukqp2-sahan-champathi-weerasinghes-projects.vercel.app/api/vapi/store-interview-data
```

**Parameters Schema:**
```json
{
  "type": "object",
  "properties": {
    "role": {
      "type": "string",
      "description": "Job role (e.g., Software Developer)"
    },
    "type": {
      "type": "string",
      "description": "Interview type: technical, behavioral, or mixed"
    },
    "level": {
      "type": "string",
      "description": "Experience level: entry-level, mid-level, senior, expert"
    },
    "techstack": {
      "type": "string",
      "description": "Comma-separated technologies"
    },
    "amount": {
      "type": "string",
      "description": "Number of questions"
    },
    "userId": {
      "type": "string",
      "description": "User ID"
    },
    "username": {
      "type": "string",
      "description": "Candidate name"
    },
    "interviewId": {
      "type": "string",
      "description": "Interview ID"
    },
    "transcript": {
      "type": "string",
      "description": "Full conversation transcript"
    }
  },
  "required": ["role", "type", "level", "techstack", "amount", "userId"]
}
```

### 3. Webhook Configuration (Alternative Method)

If function calls don't work, you can use webhooks:

**Webhook URL:**
```
https://ai-interviews-o2wpukqp2-sahan-champathi-weerasinghes-projects.vercel.app/api/vapi/webhook
```

**Events to Subscribe:**
- `call-ended`
- `transcript-updated`

## 🔗 Frontend Integration

### 1. Environment Variables

**In your `.env.local`:**
```env
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token
NEXT_PUBLIC_VAPI_ASSISTANT_ID=939f22f3-48f1-4764-b199-9347e42afa12
```

### 2. Agent Component Update

Update your Agent component to pass proper variables:

```typescript
// In handleCall function
await vapi.start(assistantId, {
  variableValues: {
    username: userName,
    userid: userId,
    interviewId: interviewId || `interview-${Date.now()}`,
  },
});
```

## 🔌 Backend API Endpoints

### 1. Function Call Handler (Already Created)

**File:** `/api/vapi/store-interview-data/route.ts`

This endpoint receives function calls from Vapi and stores interview data.

### 2. Webhook Handler (New)

**File:** `/api/vapi/webhook/route.ts`

```typescript
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
  
  // Look for common patterns in the transcript
  const roleMatch = transcript.match(/(?:role|position|job).*?(?:is|for|as)\s+([a-zA-Z\s]+?)(?:\.|,|;|\n|$)/i);
  if (roleMatch) details.role = roleMatch[1].trim();
  
  const typeMatch = transcript.match(/(?:technical|behavioral|mixed)/i);
  if (typeMatch) details.type = typeMatch[0].toLowerCase();
  
  const levelMatch = transcript.match(/(?:entry-level|mid-level|senior|expert)/i);
  if (levelMatch) details.level = levelMatch[0].toLowerCase();
  
  // Extract tech stack
  const techMatch = transcript.match(/(?:technologies|tech stack|skills).*?(?:include|are|focus on)\s+([a-zA-Z,\s]+?)(?:\.|;|\n|$)/i);
  if (techMatch) {
    details.techstack = techMatch[1].split(',').map((tech: string) => tech.trim()).filter(Boolean);
  }
  
  const amountMatch = transcript.match(/(\d+)\s+questions/i);
  if (amountMatch) details.amount = amountMatch[1];
  
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
```

## 🧪 Testing the Integration

### 1. Test Function Call Endpoint

```bash
curl -X POST https://ai-interviews-o2wpukqp2-sahan-champathi-weerasinghes-projects.vercel.app/api/vapi/store-interview-data \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Software Developer",
    "type": "mixed",
    "level": "mid-level",
    "techstack": "React,Node.js,TypeScript",
    "amount": "5",
    "userId": "test123",
    "username": "Test User",
    "interviewId": "test456",
    "transcript": "Complete interview conversation here..."
  }'
```

### 2. Test Webhook Endpoint

```bash
curl -X POST https://ai-interviews-o2wpukqp2-sahan-champathi-weerasinghes-projects.vercel.app/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "call-ended",
    "data": {
      "call": {
        "id": "call-123",
        "duration": 300,
        "cost": 0.05
      },
      "transcript": "AI: Hello! What role are you interviewing for? User: Software Developer position. AI: Technical or behavioral interview? User: Mixed approach please...",
      "variableValues": {
        "userid": "user123",
        "username": "John Doe",
        "interviewId": "interview456"
      }
    }
  }'
```

## 🎯 Debug Steps

### 1. Check Vapi Call Logs
- Go to Vapi Dashboard → Calls
- Find your recent call
- Check if function was called or webhook was triggered

### 2. Check Vercel Logs
- Monitor `/api/vapi/store-interview-data` or `/api/vapi/webhook`
- Look for successful data storage logs

### 3. Check Firebase
- Verify new documents in `interviews` collection
- Check `userId` field is properly set

### 4. Test Live Interview
1. Start a voice interview
2. Complete the conversation
3. Let assistant call the function or trigger webhook
4. Check logs and database immediately

## 🔧 Troubleshooting

**Issue: Function Not Called**
- Verify function is added to assistant
- Check assistant system message includes function call instruction
- Ensure all required parameters are available

**Issue: Webhook Not Triggered**
- Verify webhook URL in Vapi dashboard
- Check webhook subscription events
- Ensure endpoint is accessible (test with curl)

**Issue: Data Not Stored**
- Check Vercel logs for errors
- Verify Firebase admin credentials
- Check userId is being passed correctly

**Issue: No Feedback Generated**
- Ensure transcript is being passed
- Check createFeedback function logs
- Verify feedback generation logic

This comprehensive setup should resolve your Vapi integration issues and ensure interview data is properly stored in Firebase with feedback generation.
