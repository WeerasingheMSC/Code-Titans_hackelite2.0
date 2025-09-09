import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    console.log("📝 Generate endpoint called");
    
    const body = await request.json();
    console.log("📥 Received data:", JSON.stringify(body, null, 2));
    
    const { type, role, level, techstack, amount, userid } = body;

    // Validate required fields
    if (!type || !role || !level || !techstack || !amount) {
      console.error("❌ Missing required fields:", {
        type: !!type,
        role: !!role,
        level: !!level,
        techstack: !!techstack,
        amount: !!amount,
        userid: !!userid
      });
      return Response.json({ 
        success: false, 
        error: "Missing required fields",
        received: { type, role, level, techstack, amount, userid }
      }, { status: 400 });
    }

    // Handle missing or empty userId
    const finalUserId = userid && userid.trim() !== "" ? userid : "anonymous-user";
    console.log("👤 Using userId:", finalUserId);

    console.log("🤖 Generating questions with Gemini...");
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    console.log("✅ Questions generated:", questions);

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(",").map((tech: string) => tech.trim()),
      questions: JSON.parse(questions),
      userId: finalUserId,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log("💾 Storing interview in database:", JSON.stringify(interview, null, 2));
    const docRef = await db.collection("interviews").add(interview);
    console.log("✅ Interview stored with ID:", docRef.id);

    return Response.json({ 
      success: true, 
      interviewId: docRef.id,
      message: "Interview generated and stored successfully"
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in generate endpoint:", error);
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
