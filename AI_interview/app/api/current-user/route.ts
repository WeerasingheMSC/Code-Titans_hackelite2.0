import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET(request: NextRequest) {
  try {
    console.log("👤 Getting current user information");
    
    const user = await getCurrentUser();
    
    console.log("Current user:", user);
    
    return NextResponse.json({
      success: true,
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email
      } : null,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ Current user error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
