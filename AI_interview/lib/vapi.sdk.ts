import Vapi from "@vapi-ai/web";

// export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);

// Initialize with your Public Key, not a Web Token.
export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);