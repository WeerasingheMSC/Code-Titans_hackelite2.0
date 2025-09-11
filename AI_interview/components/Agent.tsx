"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { AgentProps } from "@/types";

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
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
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
      console.log("Error:", error);
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
      console.log("User ID:", userId);
      console.log("Username:", userName);
      console.log("Interview ID:", interviewId);

      if (type === "generate") {
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
        
        console.log("Assistant ID:", assistantId);
        
        if (!assistantId) {
          throw new Error("NEXT_PUBLIC_VAPI_ASSISTANT_ID is not configured");
        }

        // Generate a unique interview ID for this session
        const newInterviewId = `interview_${Date.now()}`;
        
        console.log("Generated Interview ID:", newInterviewId);

        // Start the assistant with user variables
        await vapi.start(assistantId, {
          variableValues: {
            username: userName || "User",
            userid: userId || "anonymous",
            interviewId: newInterviewId,
          },
        });
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        console.log("Using Interviewer config");

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
            username: userName || "User",
            userid: userId || "anonymous",
          },
        });
      }

      console.log("✅ Vapi call started successfully");
    } catch (error: any) {
      console.error("❌ Vapi call failed:", error);
      setCallStatus(CallStatus.INACTIVE);
      alert(`Failed to start interview: ${error.message || "Unknown error"}`);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="space-y-8">
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer animate-scaleIn mt-10">
          <div className="avatar">
            <div className="p-2 bg-gradient-to-r from-primary-100 to-primary-200 rounded-xl shadow-lg">
            <svg width="64" height="56" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 10L16 6L24 10L16 14L8 10Z" fill="#020408" fillOpacity="0.8"/>
              <path d="M8 14L16 10L24 14L16 18L8 14Z" fill="#020408" fillOpacity="0.6"/>
              <path d="M8 18L16 14L24 18L16 22L8 18Z" fill="#020408" fillOpacity="0.8"/>
              <circle cx="16" cy="14" r="2" fill="#020408"/>
            </svg>
          </div>
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>SkillSync AI</h3>
          <div className="text-center mt-3">
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
              {
                "bg-gray-500/20 text-gray-300": callStatus === "INACTIVE" || callStatus === "FINISHED",
                "bg-yellow-500/20 text-yellow-300": callStatus === "CONNECTING",
                "bg-success-100/20 text-success-100": callStatus === "ACTIVE"
              }
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full",
                {
                  "bg-gray-400": callStatus === "INACTIVE" || callStatus === "FINISHED",
                  "bg-yellow-500 animate-pulse": callStatus === "CONNECTING",
                  "bg-success-100 animate-pulse": callStatus === "ACTIVE"
                }
              )} />
              {callStatus === "INACTIVE" && "Ready to start"}
              {callStatus === "CONNECTING" && "Connecting..."}
              {callStatus === "ACTIVE" && "Interview active"}
              {callStatus === "FINISHED" && "Session ended"}
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="card-border animate-scaleIn mt-10" style={{ animationDelay: '0.1s' }}>
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="Your Profile"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
            <p className="text-center text-light-100 text-sm mt-2">
              Interview Candidate
            </p>
          </div>
        </div>
      </div>

      {/* Transcript Display */}
      {messages.length > 0 && (
        <div className="transcript-border animate-fadeIn">
          <div className="transcript">
            <div className="text-center mb-3">
  
            </div>
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

      {/* Action Button - Main Focus */}
      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button 
            className="relative btn-call animate-scaleIn group shadow-2xl hover:shadow-primary-200/20" 
            onClick={() => handleCall()}
            disabled={callStatus === "CONNECTING"}
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative flex items-center gap-3 text-lg px-4">
              {callStatus === "INACTIVE" || callStatus === "FINISHED" ? (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="currentColor"/>
                  </svg>
                  Start Interview
                </>
              ) : (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connecting...
                </>
              )}
            </span>
          </button>
        ) : (
          <button 
            className="btn-disconnect animate-scaleIn flex items-center gap-2 shadow-2xl" 
            onClick={() => handleDisconnect()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.69 6.45 9.06 7.57C9.18 7.92 9.09 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
              <path d="M21 6L15 12M15 6L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            End Interview
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;