# 🎯 Complete Vapi Assistant Setup for Interview Data Collection

## 1. Assistant Configuration in Vapi Dashboard

Go to [Vapi Dashboard](https://dashboard.vapi.ai) → Your Assistant (`645dcd47-9aa7-49b3-bc4d-f9f55c9ee6cb`)

### System Message:
```
You are SkillSync AI, a professional interview assistant. Your job is to:

1. COLLECT interview preferences from the user:
   - Role they're interviewing for
   - Experience level (Junior, Mid-level, Senior)
   - Interview type (Technical, Behavioral, Mix of both)
   - Technology stack/skills
   - Number of questions they want (10-20)

2. CONDUCT the interview based on their preferences

3. STORE the data using the storeInterviewData tool at the end

CRITICAL: You MUST call storeInterviewData tool at the end with ALL collected information.

Available variables: {{username}}, {{userid}}

Example flow:
- "Hi! I'm SkillSync AI. What role are you interviewing for today?"
- "What's your experience level - Junior, Mid-level, or Senior?"
- "Would you prefer Technical questions, Behavioral questions, or a Mix of both?"
- "What technologies/skills should we focus on?"
- "How many questions would you like? I recommend 15-18 questions."
- [Conduct interview]
- [Call storeInterviewData tool]
```

### API Request Tool Configuration:

**Tool Type:** `apiRequest`

**Tool Name:** `storeInterviewData`

**Description:** `Stores the collected interview data in Firebase database with questions, user preferences, and conversation transcript.`

**Method:** `POST`

**URL:** `https://ai-interviews-o2wpukqp2-sahan-champathi-weerasinghes-projects.vercel.app/api/vapi/store-interview`

⚠️ **IMPORTANT**: Make sure this URL is your current Vercel deployment URL. 
- Check your `.env.local` file for `NEXT_PUBLIC_BASE_URL`
- Or deploy your latest changes to Vercel to ensure the API endpoint is available
- Test the endpoint by running: `curl -X POST [YOUR_URL]/api/vapi/store-interview -H "Content-Type: application/json" -d '{"test":"data"}'`

**Headers:**
Add one header property:
- **Name:** `Content-Type`
- **Type:** `string` 
- **Default Value:** `application/json`
- **Required:** ✓

**Body Schema:**
Add these properties one by one in the Vapi dashboard:

1. **Property Name:** `role`
   - **Type:** `string`
   - **Description:** `Job role (e.g., Software Engineering, Data Analyst)`
   - **Required:** ✓

2. **Property Name:** `level`
   - **Type:** `string`
   - **Description:** `Experience level (Junior, Mid-level, Senior)`
   - **Required:** ✓

3. **Property Name:** `techstack`
   - **Type:** `string`
   - **Description:** `Comma-separated technology stack (e.g., JavaScript,React,Node.js)`
   - **Required:** ✓

4. **Property Name:** `type`
   - **Type:** `string`
   - **Description:** `Interview type (Technical, Behavioral, Mix of both)`
   - **Required:** ✓

5. **Property Name:** `amount`
   - **Type:** `string`
   - **Description:** `Number of questions (10-20)`
   - **Required:** ☐

6. **Property Name:** `userId`
   - **Type:** `string`
   - **Description:** `User ID from variables - use {{userid}}`
   - **Default Value:** `{{userid}}`
   - **Required:** ✓

7. **Property Name:** `username`
   - **Type:** `string`
   - **Description:** `Username from variables - use {{username}}`
   - **Default Value:** `{{username}}`
   - **Required:** ☐

8. **Property Name:** `interviewId`
   - **Type:** `string`
   - **Description:** `Unique interview identifier - generate unique ID`
   - **Required:** ✓

9. **Property Name:** `transcript`
   - **Type:** `string`
   - **Description:** `Full conversation transcript`
   - **Required:** ☐

## 2. Complete Tool Configuration (JSON Format)

Copy this JSON configuration when setting up the tool in Vapi Dashboard:

```json
{
  "type": "apiRequest",
  "function": {
    "name": "api_request_tool"
  },
  "name": "storeInterviewData",
  "description": "Stores the collected interview data in Firebase database with questions, user preferences, and conversation transcript.",
  "url": "https://ai-interviews-o2wpukqp2-sahan-champathi-weerasinghes-projects.vercel.app/api/vapi/store-interview",
  "method": "POST",
  "headers": {
    "type": "object",
    "properties": {
      "Content-Type": {
        "type": "string",
        "value": "application/json"
      }
    }
  },
  "body": {
    "type": "object",
    "properties": {
      "role": {
        "type": "string",
        "description": "Job role (e.g., Software Engineering, Data Analyst)"
      },
      "level": {
        "type": "string", 
        "description": "Experience level (Junior, Mid-level, Senior)"
      },
      "techstack": {
        "type": "string",
        "description": "Comma-separated technology stack (e.g., JavaScript,React,Node.js)"
      },
      "type": {
        "type": "string",
        "description": "Interview type (Technical, Behavioral, Mix of both)"
      },
      "amount": {
        "type": "string",
        "description": "Number of questions (10-20)"
      },
      "userId": {
        "type": "string", 
        "description": "User ID from variables - use {{userid}}"
      },
      "username": {
        "type": "string",
        "description": "Username from variables - use {{username}}"
      },
      "interviewId": {
        "type": "string",
        "description": "Unique interview identifier - generate unique ID"
      },
      "transcript": {
        "type": "string",
        "description": "Full conversation transcript"
      }
    },
    "required": ["role", "level", "techstack", "type", "userId", "interviewId"]
  },
  "timeoutSeconds": 30,
  "backoffPlan": {
    "type": "exponential",
    "maxRetries": 2,
    "baseDelaySeconds": 1
  }
}

```

## 3. Example Tool Call

At the end of the interview, the assistant will automatically call:

```json
{
  "role": "Software Engineering",
  "level": "Junior", 
  "techstack": "JavaScript,React,Node.js",
  "type": "Mix of both",
  "amount": "18",
  "userId": "{{userid}}",
  "username": "{{username}}",
  "interviewId": "interview_1726123456789",
  "transcript": "[FULL CONVERSATION TRANSCRIPT]"
}
```

## 4. Expected Firebase Structure

The API will create this structure in Firebase:

```json
{
  "id": "interview_1726123456789",
  "coverImage": "/covers/reddit.png",
  "createdAt": "2025-09-10T12:00:00.000Z",
  "finalized": true,
  "level": "Junior",
  "questions": [
    "Tell me about yourself and why you are interested in this Software Engineering role.",
    "Describe a time you faced a challenging technical problem. How did you approach solving it?",
    "What is your understanding of the software development lifecycle?",
    // ... more questions based on preferences
  ],
  "role": "Software Engineering",
  "techstack": ["JavaScript", "React", "Node.js"],
  "type": "Mix of both",
  "userId": "user123",
  "username": "John Doe",
  "transcript": "Full conversation transcript..."
}
```

## 5. Step-by-Step Setup Instructions

### Step 1: Go to Vapi Dashboard
1. Open [Vapi Dashboard](https://dashboard.vapi.ai)
2. Navigate to **Tools** in the left sidebar
3. Click **Create Tool**

### Step 2: Configure API Request Tool
1. **Tool Type:** Select `API Request`
2. **Tool Name:** `storeInterviewData`
3. **Description:** `Stores the collected interview data in Firebase database with questions, user preferences, and conversation transcript.`
4. **Method:** `POST`
5. **URL:** `https://ai-interviews-o2wpukqp2-sahan-champathi-weerasinghes-projects.vercel.app/api/vapi/store-interview`

### Step 3: Configure Headers
Add one header:
- Click **Add Property** in Headers section
- **Name:** `Content-Type`
- **Type:** `string`
- **Default Value:** `application/json`
- **Required:** Check the box

### Step 4: Configure Body Schema
For each property below, click **Add Property** in Request Body section:

**Property 1:**
- **Name:** `role`
- **Type:** `string`
- **Description:** `Job role (e.g., Software Engineering, Data Analyst)`
- **Required:** ✓

**Property 2:**
- **Name:** `level`
- **Type:** `string`
- **Description:** `Experience level (Junior, Mid-level, Senior)`
- **Required:** ✓

**Property 3:**
- **Name:** `techstack`
- **Type:** `string`
- **Description:** `Comma-separated technology stack (e.g., JavaScript,React,Node.js)`
- **Required:** ✓

**Property 4:**
- **Name:** `type`
- **Type:** `string`
- **Description:** `Interview type (Technical, Behavioral, Mix of both)`
- **Required:** ✓

**Property 5:**
- **Name:** `amount`
- **Type:** `string`
- **Description:** `Number of questions (10-20)`
- **Required:** ☐ (Optional)

**Property 6:**
- **Name:** `userId`
- **Type:** `string`
- **Description:** `User ID from variables`
- **Default Value:** `{{userid}}`
- **Required:** ✓

**Property 7:**
- **Name:** `username`
- **Type:** `string`
- **Description:** `Username from variables`
- **Default Value:** `{{username}}`
- **Required:** ☐ (Optional)

**Property 8:**
- **Name:** `interviewId`
- **Type:** `string`
- **Description:** `Unique interview identifier`
- **Required:** ✓

**Property 9:**
- **Name:** `transcript`
- **Type:** `string`
- **Description:** `Full conversation transcript`
- **Required:** ☐ (Optional)

### Step 5: Add Tool to Assistant
1. Go to **Assistants** → Select your assistant (`645dcd47-9aa7-49b3-bc4d-f9f55c9ee6cb`)
2. Navigate to **Tools** tab
3. Click **Add Tool** and select `storeInterviewData`
4. Update the **System Message** with the new system prompt above
5. **Save** your assistant configuration

## 6. Testing the Setup

1. **Test the API endpoint** directly: `/api/vapi/store-interview`
2. **Configure the assistant** with the system message and API request tool
3. **Run a test interview** and verify data appears in Firebase
4. **Check Vapi logs** for any tool call errors

## 7. Troubleshooting

- **Tool not called**: Check system message emphasizes calling the tool
- **Missing data**: Verify all required parameters are collected during conversation
- **Firebase errors**: Check console logs in the API endpoint
- **Vapi errors**: Check Vapi dashboard → Calls → View logs for your specific call
- **Network errors**: Verify the API endpoint URL is correct and accessible

## 8. Advantages of API Request Tool

✅ **Built-in reliability** - Vapi handles retries and error handling  
✅ **No webhook setup** - Direct API calls from Vapi to your endpoint  
✅ **Variable substitution** - Automatic {{userid}} and {{username}} replacement  
✅ **Timeout control** - Configurable timeout settings  
✅ **Retry logic** - Exponential backoff for failed requests  

This setup will automatically collect user preferences, conduct interviews, generate appropriate questions, and store everything in Firebase with the exact structure you specified using Vapi's reliable API Request tool.
