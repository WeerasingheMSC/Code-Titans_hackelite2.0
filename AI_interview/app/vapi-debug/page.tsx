"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function VapiDebugPage() {
  const [testResults, setTestResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const results: any = {};

    try {
      // Test 1: Environment Variables
      console.log("🧪 Testing environment variables...");
      results.envVars = {
        hasAssistantId: !!process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
        hasWebToken: !!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN,
        assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
      };

      // Test 2: API Endpoints
      console.log("🧪 Testing API endpoints...");
      
      // Test store-interview-data endpoint
      try {
        const storeResponse = await fetch("/api/vapi/store-interview-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "Test Role",
            type: "test",
            level: "test",
            userId: "test-user",
            username: "Test User",
            interviewId: "test-interview",
            transcript: "Test transcript"
          })
        });
        results.storeEndpoint = {
          status: storeResponse.status,
          accessible: storeResponse.ok,
          response: await storeResponse.text()
        };
      } catch (error: any) {
        results.storeEndpoint = { error: error.message };
      }

      // Test webhook endpoint
      try {
        const webhookResponse = await fetch("/api/vapi/webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "call-ended",
            call: {
              id: "test-call",
              transcript: {
                messages: [
                  { role: "user", content: "Hello" },
                  { role: "assistant", content: "Hi! What role are you interviewing for?" },
                  { role: "user", content: "Software Developer" }
                ]
              }
            }
          })
        });
        results.webhookEndpoint = {
          status: webhookResponse.status,
          accessible: webhookResponse.ok,
          response: await webhookResponse.text()
        };
      } catch (error: any) {
        results.webhookEndpoint = { error: error.message };
      }

      // Test 3: Firebase Connection
      try {
        const firebaseResponse = await fetch("/api/test-interview");
        results.firebase = {
          status: firebaseResponse.status,
          accessible: firebaseResponse.ok,
          response: await firebaseResponse.text()
        };
      } catch (error: any) {
        results.firebase = { error: error.message };
      }

      setTestResults(results);
    } catch (error: any) {
      console.error("❌ Diagnostic failed:", error);
      results.error = error.message;
      setTestResults(results);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">🔧 Vapi Integration Diagnostics</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Quick Diagnostics</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            This tool will test your Vapi integration setup to identify potential issues.
          </p>
          
          <Button 
            onClick={runDiagnostics} 
            disabled={testing}
            className="mb-4"
          >
            {testing ? "🔄 Running Tests..." : "🧪 Run Diagnostics"}
          </Button>

          {Object.keys(testResults).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Results:</h3>
              
              {/* Environment Variables */}
              <div className="bg-white dark:bg-gray-900 p-4 rounded border">
                <h4 className="font-semibold text-green-600">✅ Environment Variables</h4>
                <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 overflow-x-auto">
                  {JSON.stringify(testResults.envVars, null, 2)}
                </pre>
              </div>

              {/* Store Endpoint */}
              <div className="bg-white dark:bg-gray-900 p-4 rounded border">
                <h4 className={`font-semibold ${testResults.storeEndpoint?.accessible ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.storeEndpoint?.accessible ? '✅' : '❌'} Store Interview Data Endpoint
                </h4>
                <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 overflow-x-auto">
                  {JSON.stringify(testResults.storeEndpoint, null, 2)}
                </pre>
              </div>

              {/* Webhook Endpoint */}
              <div className="bg-white dark:bg-gray-900 p-4 rounded border">
                <h4 className={`font-semibold ${testResults.webhookEndpoint?.accessible ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.webhookEndpoint?.accessible ? '✅' : '❌'} Webhook Endpoint
                </h4>
                <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 overflow-x-auto">
                  {JSON.stringify(testResults.webhookEndpoint, null, 2)}
                </pre>
              </div>

              {/* Firebase */}
              <div className="bg-white dark:bg-gray-900 p-4 rounded border">
                <h4 className={`font-semibold ${testResults.firebase?.accessible ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.firebase?.accessible ? '✅' : '❌'} Firebase Connection
                </h4>
                <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 overflow-x-auto">
                  {JSON.stringify(testResults.firebase, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">🔍 Common Issues & Solutions</h3>
          <div className="space-y-3 text-sm">
            <div>
              <strong>"Meeting ended due to ejection"</strong> usually means:
              <ul className="list-disc ml-5 mt-1">
                <li>Vapi assistant configuration is missing or incorrect</li>
                <li>Function calls aren't configured in the Vapi dashboard</li>
                <li>System message doesn't properly call the function</li>
              </ul>
            </div>
            <div>
              <strong>Next Steps:</strong>
              <ul className="list-disc ml-5 mt-1">
                <li>Configure your Vapi assistant in the dashboard</li>
                <li>Add the store_interview_data function</li>
                <li>Update the system message to call the function</li>
                <li>Test with the deployed endpoints</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">⚡ Quick Fixes</h3>
          <div className="space-y-2 text-sm">
            <p><strong>1. Vapi Dashboard Configuration:</strong></p>
            <p className="ml-4">Go to dashboard.vapi.ai → Your Assistant → Add Function:</p>
            <div className="ml-4 bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">
              Name: store_interview_data<br/>
              URL: https://your-domain.vercel.app/api/vapi/store-interview-data
            </div>
            
            <p><strong>2. System Message:</strong></p>
            <div className="ml-4 bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">
              "At the end of the interview, ALWAYS call store_interview_data function with all collected data."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
