import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Testing database connection and data");
    
    // Get all interviews
    const allInterviews = await db.collection("interviews").get();
    console.log("📊 Total interviews in database:", allInterviews.docs.length);
    
    const interviews = allInterviews.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Group by user
    const groupedByUser = interviews.reduce((acc: any, interview: any) => {
      const userId = interview.userId || 'unknown';
      if (!acc[userId]) acc[userId] = [];
      acc[userId].push({
        id: interview.id,
        role: interview.role,
        type: interview.type,
        finalized: interview.finalized,
        createdAt: interview.createdAt
      });
      return acc;
    }, {});
    
    console.log("👥 Interviews grouped by user:", groupedByUser);
    
    return NextResponse.json({
      success: true,
      totalInterviews: interviews.length,
      groupedByUser,
      allInterviews: interviews.map((i: any) => ({
        id: i.id,
        role: i.role,
        type: i.type,
        userId: i.userId,
        finalized: i.finalized,
        createdAt: i.createdAt
      }))
    });
    
  } catch (error) {
    console.error("❌ Database test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "userId is required"
      }, { status: 400 });
    }
    
    console.log("🔍 Testing specific user interviews for:", userId);
    
    // Get user interviews
    const userInterviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .get();
      
    console.log("👤 User interviews found:", userInterviews.docs.length);
    
    const userInterviewsData = userInterviews.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get latest interviews (excluding this user)
    const latestInterviews = await db
      .collection("interviews")
      .where("finalized", "==", true)
      .where("userId", "!=", userId)
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();
      
    console.log("📚 Latest interviews found:", latestInterviews.docs.length);
    
    const latestInterviewsData = latestInterviews.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({
      success: true,
      userId,
      userInterviews: userInterviewsData,
      latestInterviews: latestInterviewsData
    });
    
  } catch (error) {
    console.error("❌ User test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
