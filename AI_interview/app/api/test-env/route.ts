import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID ? "Set" : "Not Set",
      FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY ? "Set" : "Not Set",
      FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? "Set" : "Not Set",
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY ? "Set" : "Not Set",
      NEXT_PUBLIC_VAPI_ASSISTANT_ID: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ? "Set" : "Not Set",
    };
    
    console.log("🔧 Environment variables check:", env);
    
    return NextResponse.json({
      success: true,
      environment: env,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ Environment test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
