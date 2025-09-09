import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Processing interview retake request");
    
    const { originalInterviewId, userId } = await request.json();

    if (!originalInterviewId || !userId) {
      return NextResponse.json({
        success: false,
        error: "Missing originalInterviewId or userId"
      }, { status: 400 });
    }

    // Get the original interview data
    const interviewsRef = db.collection("interviews");
    const snapshot = await interviewsRef
      .where("originalInterviewId", "==", originalInterviewId)
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      // If no interview found with originalInterviewId, try with interviewId
      const fallbackSnapshot = await interviewsRef
        .where("interviewId", "==", originalInterviewId)
        .where("userId", "==", userId)
        .limit(1)
        .get();
      
      if (fallbackSnapshot.empty) {
        return NextResponse.json({
          success: false,
          error: "Original interview not found"
        }, { status: 404 });
      }
      
      const originalInterview = fallbackSnapshot.docs[0].data();
      
      return NextResponse.json({
        success: true,
        message: "Interview configuration retrieved for retake",
        data: {
          role: originalInterview.role,
          type: originalInterview.type,
          level: originalInterview.level,
          techstack: originalInterview.techstack,
          amount: originalInterview.amount,
          originalInterviewId: originalInterview.interviewId,
          retakeCount: (originalInterview.retakeCount || 0) + 1
        }
      });
    }

    const originalInterview = snapshot.docs[0].data();
    
    // Update retake count
    await snapshot.docs[0].ref.update({
      retakeCount: (originalInterview.retakeCount || 0) + 1,
      lastRetakeAt: new Date().toISOString()
    });

    console.log("✅ Interview retake configuration prepared", {
      originalInterviewId,
      retakeCount: (originalInterview.retakeCount || 0) + 1
    });

    return NextResponse.json({
      success: true,
      message: "Interview configuration retrieved for retake",
      data: {
        role: originalInterview.role,
        type: originalInterview.type,
        level: originalInterview.level,
        techstack: originalInterview.techstack,
        amount: originalInterview.amount,
        originalInterviewId: originalInterview.originalInterviewId || originalInterview.interviewId,
        retakeCount: (originalInterview.retakeCount || 0) + 1
      }
    });

  } catch (error) {
    console.error("Error in retake interview:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
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
