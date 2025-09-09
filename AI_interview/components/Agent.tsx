"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  role,
  interviewType,
  level,
  techstack,
  amount,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      console.log("📞 Call ended - checking for feedback generation");
      setCallStatus(CallStatus.FINISHED);
      
      // Set a timeout to check if feedback was generated
      setTimeout(() => {
        if (type === "generate" && interviewId) {
          console.log("🔄 Redirecting to feedback page after workflow completion");
          router.push(`/interview/${interviewId}/feedback`);
        }
      }, 3000); // Wait 3 seconds for workflow to complete
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
      
      // Listen for function calls from the assistant
      if (message.type === "function-call" && message.functionCall?.name === "trigger_workflow") {
        console.log("🔗 Assistant triggered workflow:", message.functionCall);
        // The workflow will be handled by the API endpoint
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error("❌ Vapi Error:", error);
      
      // Handle specific error types
      if (error.message.includes("Meeting ended due to ejection")) {
        console.log("🔄 Call was ejected - this usually means the assistant configuration needs attention");
        setCallStatus(CallStatus.FINISHED);
        
        // Show user-friendly message
        alert("The interview session ended unexpectedly. Please check your Vapi assistant configuration and try again.");
      } else if (error.message.includes("connection")) {
        console.log("🔗 Connection error detected");
        alert("Connection error occurred. Please check your internet connection and try again.");
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    try {
      console.log("🚀 Starting Vapi call - Type:", type);
      
      if (type === "generate") {
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID; // This should be 645dcd47-9aa7-49b3-bc4d-f9f55c9ee6cb
        
        console.log("🎤 Starting Vapi assistant call");
        console.log("Assistant ID:", assistantId);
        
        if (!assistantId) {
          throw new Error("NEXT_PUBLIC_VAPI_ASSISTANT_ID is not set");
        }

        // Use Assistant ID for the voice call with interactive data collection
        await vapi.start(assistantId, {
          variableValues: {
            username: userName,
            userid: userId,
            interviewId: interviewId || `interview-${Date.now()}`,
          },
        });
      } else {
        // For existing interviews, check if user wants to retake with same config
        let interviewConfig = null;
        
        if (interviewId && role && interviewType && level && techstack) {
          // Use existing interview configuration for potential retake
          interviewConfig = {
            role: role,
            type: interviewType,
            level: level,
            techstack: techstack.join(","),
            amount: amount || questions?.length?.toString() || "5",
            isRetake: true,
            originalInterviewId: interviewId
          };
        }

        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        console.log("Using interviewer assistant for custom interview");
        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
            username: userName,
            userid: userId,
            interviewId: interviewId || `interview-${Date.now()}`,
            // Include interview config for potential retake
            ...(interviewConfig && {
              role: interviewConfig.role,
              type: interviewConfig.type,
              level: interviewConfig.level,
              techstack: interviewConfig.techstack,
              amount: interviewConfig.amount,
              isRetake: "true",
              originalInterviewId: interviewConfig.originalInterviewId
            })
          },
        });
      }
      
      console.log("✅ Vapi call started successfully");
    } catch (error: any) {
      console.error("❌ Vapi call failed:", error);
      setCallStatus(CallStatus.INACTIVE);
      alert(`Failed to start interview: ${error.message || error}`);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
