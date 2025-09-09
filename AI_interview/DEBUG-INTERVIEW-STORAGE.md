# 🐛 Debugging Guide: Interview Data Not Storing

## Step-by-Step Troubleshooting

### 1. **Verify Function Endpoint is Working**

First, test if your endpoint is reachable:

**Test URL:** 
```
https://ai-interviews-o2wpukqp2-sahan-champathi-weerasinghes-projects.vercel.app/api/vapi/store-interview-data
```

Open this URL in your browser. You should see:
```json
{
  "success": true,
  "message": "store-interview-data endpoint is working",
  "timestamp": "2025-09-09T...",
  "endpoint": "/api/vapi/store-interview-data"
}
```

### 2. **Check Vapi Function Configuration**

In your Vapi Dashboard:

**Assistant Settings → Functions → Check:**
- ✅ Function name: `store_interview_data`
- ✅ Server URL is correct (copy from above)
- ✅ Function is enabled/active
- ✅ Parameters schema matches exactly

**Parameter Schema Should Be:**
```json
{
  "type": "object",
  "properties": {
    "role": {"type": "string", "description": "Job role"},
    "type": {"type": "string", "description": "Interview type"},
    "level": {"type": "string", "description": "Experience level"},
    "techstack": {"type": "string", "description": "Technologies"},
    "amount": {"type": "string", "description": "Number of questions"},
    "userId": {"type": "string", "description": "User ID"},
    "username": {"type": "string", "description": "Candidate name"},
    "interviewId": {"type": "string", "description": "Interview ID"},
    "transcript": {"type": "string", "description": "Full conversation"}
  },
  "required": ["role", "type", "level", "techstack", "amount", "userId"]
}
```

### 3. **Test Assistant Prompt**

Your assistant prompt should include this **EXACT** instruction:

```
**PHASE 3: Data Storage & Completion**
When the interview is complete:

1. Thank the candidate: "Thank you [Name] for your time today. You've provided excellent insights."

2. **IMMEDIATELY call the store_interview_data function** with the collected information:
   ```
   store_interview_data({
     "role": "[COLLECTED ROLE]",
     "type": "[COLLECTED TYPE]", 
     "level": "[COLLECTED LEVEL]",
     "techstack": "[COLLECTED TECHSTACK]",
     "amount": "[COLLECTED AMOUNT]",
     "userId": "{{userid}}",
     "username": "{{username}}",
     "interviewId": "{{interviewId}}",
     "transcript": "[FULL CONVERSATION INCLUDING DATA COLLECTION]"
   })
   ```

3. After successful storage: "Your interview has been completed and saved!"
```

### 4. **Monitor Logs During Interview**

**During an interview, check these logs:**

1. **Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → Functions → Logs
   - Look for `/api/vapi/store-interview-data` calls
   - Check for errors or missing data

2. **Vapi Dashboard:**
   - Go to Calls → Select your recent call
   - Check "Function Calls" section
   - Look for `store_interview_data` function execution

### 5. **Common Issues & Fixes**

**Issue 1: Function Not Called**
```
Symptoms: No function calls appear in Vapi logs
Solutions:
- Ensure assistant prompt includes the function call instruction
- Check function is added to the correct assistant
- Verify assistant ID matches in your code
```

**Issue 2: Function Called But No Data Stored**
```
Symptoms: Function appears in Vapi logs but no database entry
Solutions:
- Check Vercel logs for parameter validation errors
- Verify Firebase admin credentials
- Check required parameters are being passed
```

**Issue 3: Missing Parameters**
```
Symptoms: "Missing required parameters" error in logs
Solutions:
- Ensure assistant collects ALL 5 pieces of data
- Check parameter names match exactly (case-sensitive)
- Verify data is passed in correct format
```

**Issue 4: Feedback Not Generated**
```
Symptoms: Interview stored but no feedback created
Solutions:
- Check transcript is being passed with the function call
- Verify createFeedback action is working
- Check Vercel logs for feedback creation errors
```

### 6. **Manual Test Function Call**

You can test the function manually using curl:

```bash
curl -X POST https://ai-interviews-o2wpukqp2-sahan-champathi-weerasinghes-projects.vercel.app/api/vapi/store-interview-data \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Software Developer",
    "type": "mixed",
    "level": "mid-level",
    "techstack": "React,Node.js,TypeScript",
    "amount": "5",
    "userId": "test123",
    "username": "Test User",
    "interviewId": "test456",
    "transcript": "Test conversation transcript"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Interview data stored successfully for Test User",
  "data": {
    "interviewId": "test456",
    "interviewDocId": "...",
    "feedbackId": "...",
    ...
  }
}
```

### 7. **Live Debugging Steps**

**To debug in real-time:**

1. Start an interview with the assistant
2. Open Vercel logs in another tab
3. Complete the interview and let assistant call the function
4. Immediately check:
   - Vercel logs for function execution
   - Firebase console for new interview document
   - Vapi dashboard for function call status

### 8. **Environment Variables Check**

Verify these are set in Vercel:
```
NEXT_PUBLIC_VAPI_ASSISTANT_ID=939f22f3-48f1-4764-b199-9347e42afa12
FIREBASE_ADMIN_PROJECT_ID=ai-interviews-753c2
[Other Firebase credentials]
```

### 9. **Quick Fixes to Try**

1. **Re-deploy your Vercel app** to ensure latest code is live
2. **Re-save your assistant** in Vapi dashboard to refresh function config
3. **Clear browser cache** and test with a fresh interview
4. **Check Firebase rules** allow writes to the interviews collection

### 10. **Success Indicators**

You'll know it's working when you see:

✅ **Vercel Logs:** "📞 Assistant called store-interview-data function"
✅ **Vercel Logs:** "✅ Interview stored with ID: [document-id]"  
✅ **Vercel Logs:** "✅ Feedback created successfully"
✅ **Firebase Console:** New document in `interviews` collection
✅ **Vapi Dashboard:** Function call marked as successful

If you're still having issues after following this guide, share the specific error messages from Vercel logs and I'll help you debug further!
