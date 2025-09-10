import { NextRequest, NextResponse } from "next/server";
import { vapiAPI } from "@/lib/vapi.api";

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Testing Vapi API connection...");
    
    // Check if API key is configured
    const apiKey = process.env.VAPI_PRIVATE_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: "VAPI_PRIVATE_KEY not configured",
        note: "Add your Vapi private API key to environment variables"
      }, { status: 500 });
    }

    // Test the API by listing recent calls
    const recentCalls = await vapiAPI.listCalls(1);
    
    return NextResponse.json({ 
      success: true,
      message: "Vapi API connection successful",
      hasApiKey: !!apiKey,
      recentCallsCount: recentCalls?.data?.length || 0,
      sampleCall: recentCalls?.data?.[0] ? {
        id: recentCalls.data[0].id,
        status: recentCalls.data[0].status,
        hasTranscript: !!recentCalls.data[0].transcript
      } : null
    });

  } catch (error: any) {
    console.error("❌ Vapi API test failed:", error);
    return NextResponse.json({ 
      error: "Vapi API test failed", 
      details: error.message,
      suggestion: "Check your VAPI_PRIVATE_KEY environment variable"
    }, { status: 500 });
  }
}
