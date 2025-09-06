"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { createFeedback } from "@/lib/actions/general.action";
import { AgentProps, SavedMessage } from "@/types";

enum CallStatus {
  INACTIVE = "inactive",
  CONNECTING = "connecting",
  ACTIVE = "active",
  FINISHED = "finished",
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
      console.log("Call started");
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      console.log("Call ended");
    };

    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { 
          role: message.role, 
          content: message.transcript 
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const onError = (error: any) => {
      console.error("VAPI Error:", error);
      setCallStatus(CallStatus.INACTIVE);
    };

    // Add event listeners
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    // Cleanup
    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
      
      // Check if vapi.stop exists before calling it
      if (typeof vapi.stop === "function") {
        vapi.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      if (!interviewId || !userId) {
        console.error("Missing interviewId or userId");
        router.push("/");
        return;
      }

      try {
        const { success, feedbackId: newFeedbackId } = await createFeedback({
          interviewId,
          userId,
          transcript: messages,
          feedbackId,
        });

        if (success) {
          router.push(`/interview/${interviewId}/feedback${newFeedbackId ? `?feedbackId=${newFeedbackId}` : ''}`);
        } else {
          console.error("Failed to create feedback");
          router.push("/");
        }
      } catch (error) {
        console.error("Error generating feedback:", error);
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED && type === "interview") {
      handleGenerateFeedback(messages);
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    if (callStatus === CallStatus.ACTIVE || callStatus === CallStatus.CONNECTING) {
      return;
    }

    setCallStatus(CallStatus.CONNECTING);

    try {
      const metadata: any = {
        userName,
        userId: userId || "",
        type,
        interviewId: interviewId || "",
      };

      if (type === "interview" && questions && questions.length > 0) {
        metadata.questions = questions;
      }

      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!, {
        metadata,
      });

    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    // Check if vapi.stop exists before calling it
    if (typeof vapi.stop === "function") {
      vapi.stop();
    }
    setCallStatus(CallStatus.FINISHED);
  };

  const getButtonState = () => {
    switch (callStatus) {
      case CallStatus.INACTIVE:
      case CallStatus.FINISHED:
        return { text: "Start Call", disabled: false };
      case CallStatus.CONNECTING:
        return { text: "Connecting...", disabled: true };
      case CallStatus.ACTIVE:
        return { text: "End Call", disabled: false };
      default:
        return { text: "Start Call", disabled: false };
    }
  };

  const buttonState = getButtonState();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      {/* Call View */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 w-full max-w-4xl">
        {/* AI Interviewer Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <div className="relative mb-4">
            <Image
              src="/ai-avatar.png"
              alt="AI Interviewer"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            {isSpeaking && (
              <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-800">AI Interviewer</h3>
          <p className="text-gray-600 text-sm mt-2">Ready to assist you</p>
        </div>

        {/* User Profile Card */}
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <div className="mb-4">
            <Image
              src="/user-avatar.png"
              alt="User Profile"
              width={80}
              height={80}
              className="rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{userName}</h3>
          <p className="text-gray-600 text-sm mt-2">Participant</p>
        </div>
      </div>

      {/* Transcript Display */}
      {messages.length > 0 && (
        <div className="w-full max-w-4xl mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Live Transcript</h4>
            <span className="text-sm text-gray-500">{messages.length} messages</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
            {lastMessage ? (
              <p className={cn("text-gray-700 leading-relaxed", "animate-fadeIn")}>
                {lastMessage}
              </p>
            ) : (
              <p className="text-gray-500 text-center">Waiting for conversation...</p>
            )}
          </div>
        </div>
      )}

      {/* Call Control Button */}
      <div className="w-full max-w-md">
        {callStatus === CallStatus.ACTIVE ? (
          <button
            onClick={handleDisconnect}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition-colors duration-200 flex items-center justify-center"
          >
            <span className="mr-2">●</span>
            End Call
          </button>
        ) : (
          <button
            onClick={handleCall}
            disabled={buttonState.disabled}
            className={cn(
              "w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition-colors duration-200",
              buttonState.disabled && "opacity-50 cursor-not-allowed",
              callStatus === CallStatus.CONNECTING && "relative overflow-hidden"
            )}
          >
            {callStatus === CallStatus.CONNECTING && (
              <span className="absolute inset-0 bg-white opacity-20 animate-ping rounded-full" />
            )}
            {buttonState.text}
          </button>
        )}
      </div>

      {/* Status Indicator */}
      <div className="mt-4 text-sm text-gray-600">
        Status:{" "}
        <span
          className={cn(
            "font-medium",
            callStatus === CallStatus.ACTIVE && "text-green-600",
            callStatus === CallStatus.CONNECTING && "text-yellow-600",
            callStatus === CallStatus.INACTIVE && "text-gray-600",
            callStatus === CallStatus.FINISHED && "text-blue-600"
          )}
        >
          {callStatus.charAt(0).toUpperCase() + callStatus.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default Agent;