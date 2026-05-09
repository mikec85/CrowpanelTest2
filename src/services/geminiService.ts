import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface HomeState {
  alarmStatus: 'armed' | 'disarmed' | 'pending';
  devices: { name: string; status: 'on' | 'off'; type: string }[];
  temperature: number;
}

export async function getAISuggestions(state: HomeState) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a smart home assistant. Based on this home state, provide 3 short, helpful suggestions.
      Current State:
      - Alarm: ${state.alarmStatus}
      - Temperature: ${state.temperature}°C
      - Devices: ${state.devices.map(d => `${d.name} (${d.status})`).join(', ')}
      
      Keep suggestions under 15 words each. Return as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error('Gemini error:', error);
    return ["Ensure all windows are closed before arming.", "Lower thermostat to save energy.", "Light in office is still on."];
  }
}
