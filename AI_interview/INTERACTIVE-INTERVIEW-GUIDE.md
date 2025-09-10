# Interactive Interview System - Complete Setup Guide

## 🎯 **Overview**
Your AI interviewer now collects interview preferences during the conversation, stores everything in the database, generates feedback, and allows users to retake interviews with the same or different configurations.

## 🔄 **Updated User Flow**

### **1. Interview Generation (Voice-Based Data Collection)**
```
User starts interview → Assistant asks for preferences → Collects data → Conducts interview → Stores in database → Generates feedback
```

**Data Collected During Conversation:**
- **Role:** "What job role are you preparing for?" (e.g., Software Developer)
- **Type:** "Technical, behavioral, or mixed interview?" (technical/behavioral/mixed)
- **Level:** "What's your experience level?" (entry-level/mid-level/senior/expert)
- **Tech Stack:** "What technologies should we focus on?" (React,Node.js,Python)
- **Amount:** "How many questions would you like?" (3-10)

### **2. Database Storage Structure**
```javascript
{
  role: "Software Developer",
  type: "mixed", 
  level: "mid-level",
  techstack: ["React", "Node.js", "TypeScript"],
  userId: "user123",
  finalized: true,
  coverImage: "random-cover.png",
  createdAt: "2025-09-09T10:30:00Z",
  
  // Voice interview specific data
  callId: "vapi-call-456",
  duration: 480, // seconds
  interviewId: "interview-789",
  assistantId: "939f22f3-48f1-4764-b199-9347e42afa12",
  amount: "6",
  
  // Retake functionality
  retakeable: true,
  retakeCount: 0,
  originalInterviewId: "interview-789",
  status: "completed",
  interviewSource: "voice-assistant",
  lastUpdated: "2025-09-09T10:35:00Z"
}
```

### **3. Feedback & Retake Options**
- **Feedback Generated:** Automatically created from conversation transcript
- **Retake Available:** Users can retake with same configuration or modify preferences
- **Dashboard Access:** Users see all interviews, feedback, and retake options

## 🛠 **Technical Implementation**

### **API Endpoints Created:**

1. **`/api/vapi/store-interview-data`** - Stores interview data from assistant function calls
2. **`/api/vapi/retake-interview`** - Handles retake requests and retrieves original configuration

### **Assistant Function Configuration:**

**Function Name:** `store_interview_data`

**Server URL:** 
```
https://ai-interviews-o2wpukqp2-sahan-champathi-weerasinghes-projects.vercel.app/api/vapi/store-interview-data
```

**Parameters Schema:**
```json
{
  "type": "object",
  "properties": {
    "role": {"type": "string", "description": "Job role"},
    "type": {"type": "string", "description": "Interview type"},
    "level": {"type": "string", "description": "Experience level"},
    "techstack": {"type": "string", "description": "Technologies (comma-separated)"},
    "amount": {"type": "string", "description": "Number of questions"},
    "userId": {"type": "string", "description": "User ID"},
    "username": {"type": "string", "description": "Candidate name"},
    "interviewId": {"type": "string", "description": "Interview ID"},
    "transcript": {"type": "string", "description": "Full conversation"}
  },
  "required": ["role", "type", "level", "techstack", "amount", "userId"]
}
```

## 🎪 **Complete Conversation Example**

```
AI: "Hello Sarah! Welcome to your personalized interview session. Let's start by setting up your interview. What job role are you preparing for today?"

User: "I'm preparing for a frontend developer position."

AI: "Excellent! And would you prefer a technical interview, behavioral interview, or a mixed approach that combines both?"

User: "I'd like a mixed approach please."

AI: "Perfect! What's your experience level - entry-level, mid-level, senior, or expert?"

User: "I'm at a mid-level."

AI: "Great! What technologies or skills should we focus on during this interview?"

User: "React, JavaScript, and CSS."

AI: "Wonderful! And how many questions would you like me to ask?"

User: "About 5 questions would be good."

AI: "Perfect! So we'll do a mixed interview for a Frontend Developer position at mid-level, focusing on React, JavaScript, and CSS with 5 questions. Let's begin! 

Tell me about your current role and your experience with React..."

[5-7 minutes of interview conversation...]

AI: "Thank you Sarah for your time today. You've provided excellent insights."

[Function Call: store_interview_data with all collected data]

AI: "Your mixed interview for the Frontend Developer position at mid-level has been completed and saved! You'll receive detailed feedback shortly, and you can always retake this interview or try a different configuration anytime. Great job today!"
```

## 🔧 **Setup Steps**

### **1. Add Function to Vapi Dashboard:**
- Navigate to your assistant (`939f22f3-48f1-4764-b199-9347e42afa12`)
- Add the `store_interview_data` function with the configuration above

### **2. Update Assistant Prompt:**
- Replace current prompt with the interactive prompt from the guide
- Assistant will now collect data during conversation

### **3. Test the Flow:**
```javascript
// Start interview (no predefined data needed)
{
  username: "Test User",
  userid: "test123",
  interviewId: "interview789"
}

// Assistant collects: role, type, level, techstack, amount
// Conducts interview based on preferences
// Stores everything in database
// Generates feedback automatically
```

## 🎯 **Key Benefits**

✅ **Dynamic Data Collection:** No pre-configuration needed
✅ **Personalized Interviews:** Based on user preferences
✅ **Automatic Storage:** Interview data stored with exact structure
✅ **Feedback Generation:** Automatic feedback from conversation
✅ **Retake Functionality:** Same or different configurations
✅ **User Dashboard:** View all interviews and feedback
✅ **Flexible Experience:** Users control their interview experience

## 🔍 **Monitoring & Debugging**

- **Vercel Logs:** Check function execution and data storage
- **Vapi Dashboard:** Monitor assistant conversations and function calls
- **Firebase Console:** Verify interview storage and feedback generation
- **User Dashboard:** Confirm interviews appear with retake options

This interactive approach gives users complete control over their interview experience while maintaining the exact data structure you specified!
