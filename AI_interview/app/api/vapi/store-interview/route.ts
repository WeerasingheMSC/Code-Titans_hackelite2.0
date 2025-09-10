import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { createFeedback } from "@/lib/actions/general.action";

// Function to get random cover image
function getRandomCoverImage(): string {
  const covers = [
    "/covers/reddit.png",
    "/covers/facebook.png", 
    "/covers/amazon.png",
    "/covers/spotify.png",
    "/covers/telegram.png",
    "/covers/tiktok.png",
    "/covers/quora.png",
    "/covers/pinterest.png",
    "/covers/skype.png",
    "/covers/yahoo.png",
    "/covers/hostinger.png",
    "/covers/adobe.png"
  ];
  return covers[Math.floor(Math.random() * covers.length)];
}

// Function to generate questions based on role, level, techstack, and type
async function generateInterviewQuestions(
  role: string, 
  level: string, 
  techstack: string[], 
  type: string,
  amount: number = 18
): Promise<string[]> {
  const baseQuestions = [
    "Tell me about yourself and why you are interested in this role.",
    "Do you have any questions for me about the role or the company?"
  ];

  const technicalQuestions = [
    `What is your understanding of the ${role.toLowerCase()} development lifecycle?`,
    `Describe a challenging technical problem you've faced in ${techstack[0] || 'your technology stack'}. How did you solve it?`,
    `Explain the key concepts and best practices in ${techstack[0] || 'your primary technology'}.`,
    `How do you approach debugging in ${techstack.join(' and ')}?`,
    `What are some performance optimization techniques you've used?`,
    `Describe your experience with testing frameworks and methodologies.`,
    `How do you ensure code quality and maintainability?`,
    `What design patterns are you familiar with?`,
    `How do you stay up-to-date with the latest trends in technology?`
  ];

  const behavioralQuestions = [
    "Describe a time you worked with a team to achieve a goal. What was your role?",
    "Tell me about a time you received constructive criticism. How did you handle it?",
    "Describe a project you are particularly proud of. What challenges did you overcome?",
    "How do you handle tight deadlines and pressure?",
    "Tell me about a time you had to learn a new technology quickly.",
    "Describe a situation where you had to resolve a conflict with a colleague.",
    "How do you prioritize tasks when you have multiple deadlines?",
    "What motivates you in your work?"
  ];

  const mixedQuestions = [...technicalQuestions, ...behavioralQuestions];
  
  let selectedQuestions: string[] = [...baseQuestions];
  let sourceQuestions: string[] = [];

  if (type.toLowerCase().includes('technical')) {
    sourceQuestions = technicalQuestions;
  } else if (type.toLowerCase().includes('behavioral')) {
    sourceQuestions = behavioralQuestions;
  } else {
    sourceQuestions = mixedQuestions;
  }

  // Randomly select questions to reach the desired amount
  const remainingSlots = Math.max(0, amount - baseQuestions.length);
  const shuffled = sourceQuestions.sort(() => 0.5 - Math.random());
  selectedQuestions.push(...shuffled.slice(0, remainingSlots));

  return selectedQuestions;
}

export async function POST(request: NextRequest) {
  try {
    console.log("📋 Storing interview data in Firebase...");
    
    const body = await request.json();
    const { 
      role, 
      level, 
      techstack, 
      type, 
      amount, 
      userId, 
      username,
      interviewId,
      transcript 
    } = body;

    console.log("Received data:", { role, level, techstack, type, amount, userId, username, interviewId });

    if (!role || !level || !techstack || !type || !userId || !interviewId) {
      return NextResponse.json({ 
        error: "Missing required fields: role, level, techstack, type, userId, interviewId" 
      }, { status: 400 });
    }

    // Generate questions based on the interview parameters
    const questions = await generateInterviewQuestions(
      role, 
      level, 
      Array.isArray(techstack) ? techstack : techstack.split(','), 
      type, 
      parseInt(amount) || 18
    );

    // Create the interview data structure matching your Firebase format
    const interviewData = {
      id: interviewId,
      coverImage: getRandomCoverImage(),
      createdAt: new Date().toISOString(),
      finalized: true,
      level: level,
      questions: questions,
      role: role,
      techstack: Array.isArray(techstack) ? techstack : techstack.split(','),
      type: type,
      userId: userId,
      username: username || "Anonymous",
      transcript: transcript || "No transcript available"
    };

    console.log("📝 Storing interview:", interviewData);

    // Store in Firebase
    await db.collection("interviews").doc(interviewId).set(interviewData);
    
    console.log("✅ Interview stored successfully in Firebase");

    // Generate feedback if we have transcript
    let feedbackId = null;
    if (transcript && transcript.length > 0) {
      console.log("🤖 Generating feedback...");
      
      const messages = typeof transcript === 'string' 
        ? [{ role: 'user', content: transcript }]
        : transcript;

      const feedbackResult = await createFeedback({
        interviewId,
        userId,
        transcript: messages,
        feedbackId: `feedback_${interviewId}_${Date.now()}`
      });

      if (feedbackResult.success) {
        feedbackId = feedbackResult.feedbackId;
        
        // Update interview to mark feedback as generated
        await db.collection("interviews").doc(interviewId).update({
          feedbackGenerated: true,
          feedbackId: feedbackId
        });
        
        console.log("✅ Feedback generated successfully");
      }
    }

    return NextResponse.json({ 
      success: true,
      message: "Interview data stored successfully",
      interviewId,
      feedbackId,
      data: {
        role,
        level,
        techstack,
        type,
        questionsCount: questions.length,
        coverImage: interviewData.coverImage
      }
    });

  } catch (error: any) {
    console.error("❌ Error storing interview data:", error);
    return NextResponse.json({ 
      error: "Failed to store interview data", 
      details: error.message 
    }, { status: 500 });
  }
}