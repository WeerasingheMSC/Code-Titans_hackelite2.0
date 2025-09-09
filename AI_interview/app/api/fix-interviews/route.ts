import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    console.log("🔧 Fixing interviews with empty userId");
    
    const { targetUserId } = await request.json();
    
    if (!targetUserId) {
      return NextResponse.json({
        success: false,
        error: "targetUserId is required to assign interviews to"
      }, { status: 400 });
    }
    
    // Get all interviews with empty userId
    const emptyUserInterviews = await db
      .collection("interviews")
      .where("userId", "==", "")
      .get();
      
    console.log("📊 Found", emptyUserInterviews.docs.length, "interviews with empty userId");
    
    if (emptyUserInterviews.empty) {
      return NextResponse.json({
        success: true,
        message: "No interviews with empty userId found",
        fixed: 0
      });
    }
    
    // Update each interview to have the target userId
    const batch = db.batch();
    let count = 0;
    
    emptyUserInterviews.docs.forEach(doc => {
      batch.update(doc.ref, { userId: targetUserId });
      count++;
    });
    
    await batch.commit();
    
    console.log("✅ Fixed", count, "interviews - assigned to userId:", targetUserId);
    
    return NextResponse.json({
      success: true,
      message: `Fixed ${count} interviews`,
      fixed: count,
      assignedTo: targetUserId
    });
    
  } catch (error) {
    console.error("❌ Fix interviews error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Checking interviews with empty userId");
    
    // Get all interviews with empty userId
    const emptyUserInterviews = await db
      .collection("interviews")
      .where("userId", "==", "")
      .get();
      
    const interviews = emptyUserInterviews.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({
      success: true,
      count: interviews.length,
      interviews: interviews.map((i: any) => ({
        id: i.id,
        role: i.role,
        type: i.type,
        createdAt: i.createdAt,
        userId: i.userId
      }))
    });
    
  } catch (error) {
    console.error("❌ Check interviews error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
