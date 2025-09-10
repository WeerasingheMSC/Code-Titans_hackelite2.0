// Vapi API client for fetching call data
export class VapiAPI {
  private apiKey: string;
  private baseUrl = 'https://api.vapi.ai';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Get call details by call ID
  async getCall(callId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/call/${callId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch call: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching call:', error);
      throw error;
    }
  }

  // Get transcript for a call
  async getTranscript(callId: string) {
    try {
      const call = await this.getCall(callId);
      return call.transcript || null;
    } catch (error) {
      console.error('Error fetching transcript:', error);
      throw error;
    }
  }

  // List recent calls (for debugging)
  async listCalls(limit = 10) {
    try {
      const response = await fetch(`${this.baseUrl}/call?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to list calls: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error listing calls:', error);
      throw error;
    }
  }
}

// Initialize Vapi API client
export const vapiAPI = new VapiAPI(process.env.VAPI_PRIVATE_KEY || '');
