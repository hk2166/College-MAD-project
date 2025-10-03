export async function askGemini(query) {
  const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  
  try {
    if (!API_KEY) {
      console.warn("Missing EXPO_PUBLIC_GEMINI_API_KEY in environment.");
      return "🔧 API key is not configured. Please add your Gemini API key to the environment variables.";
    }

    // Enhanced prompt for cooking context
    const cookingPrompt = `You are a professional cooking assistant and culinary expert. The user is asking: "${query}". 

Please provide a helpful, detailed response focused on cooking, recipes, ingredients, techniques, or food-related advice. Your response should be:

1. Practical and actionable for someone cooking in their kitchen
2. Include specific measurements, temperatures, or techniques when relevant
3. Mention cooking tips, substitutions, or variations when appropriate
4. Be encouraging and supportive
5. If the question is not cooking-related, politely redirect to cooking topics

Format your response in a clear, easy-to-read way. If providing a recipe, include ingredients and step-by-step instructions. Keep responses conversational but informative.`;

    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + API_KEY, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: cookingPrompt }] 
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API error:", data.error);
      return "🚫 Sorry, there was an issue with the AI service. Please try again.";
    }

    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      return "🤔 I didn't quite understand that. Could you ask me something about cooking, recipes, or ingredients?";
    }

    return generatedText;
  } catch (error) {
    console.error("Gemini API error:", error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return "🌐 Network error. Please check your internet connection and try again.";
    }
    
    return "⚠️ Sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
}
