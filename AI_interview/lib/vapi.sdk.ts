import Vapi from "@vapi-ai/web";

// Get VAPI credentials from environment
const vapiWebToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

// Initialize VAPI with available credentials
// Try Public Key first (recommended), fallback to Web Token
const vapiCredentials = vapiPublicKey || vapiWebToken;

if (!vapiCredentials) {
  throw new Error("VAPI credentials not found. Please set NEXT_PUBLIC_VAPI_PUBLIC_KEY or NEXT_PUBLIC_VAPI_WEB_TOKEN");
}

console.log("Initializing VAPI with credentials:", vapiCredentials.substring(0, 8) + "...");

export const vapi = new Vapi(vapiCredentials);