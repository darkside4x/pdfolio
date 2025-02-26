// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ message: "Topic is required" });
  }

  const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";
  const API_KEY = process.env.HUGGINGFACE_API_KEY;
  
  if (!API_KEY) {
    console.error("HUGGINGFACE_API_KEY is not defined in environment variables");
    return res.status(500).json({ message: "Server configuration error" });
  }

  // Determine prompt based on input
  let promptText;
  if (topic.match(/^\s*[\d\s\+\-\*\/\(\)\.]+\s*$/)) {
    // If input is just a math expression
    promptText = `Calculate: ${topic}`;
  } else if (topic.toLowerCase().includes("write") && topic.toLowerCase().includes("code")) {
    // If asking for code generation
    promptText = `${topic} 
    Provide only the code with proper indentation and comments. Be concise and direct.`;
  } else {
    // For general questions
    promptText = `Answer the following briefly and directly: ${topic}`;
  }

  try {
    console.log(`Sending request to Hugging Face API with prompt: ${promptText.substring(0, 100)}...`);
    
    const hfResponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: promptText,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.5,
          top_p: 0.95,
          do_sample: true
        }
      })
    });

    // Check for timeout or network issues
    if (!hfResponse) {
      console.error("No response received from Hugging Face API");
      return res.status(504).json({ message: "Gateway Timeout: No response from AI service" });
    }

    // Log the status for debugging
    console.log(`Hugging Face API response status: ${hfResponse.status}`);

    if (!hfResponse.ok) {
      let errorText;
      try {
        const errorData = await hfResponse.json();
        console.error("Hugging Face API error:", errorData);
        errorText = JSON.stringify(errorData);
      } catch (jsonError) {
        errorText = await hfResponse.text();
        console.error("Error parsing JSON. Response text:", errorText);
      }
      
      return res.status(hfResponse.status || 500).json({ 
        message: "Error generating response from Hugging Face", 
        status: hfResponse.status,
        details: errorText 
      });
    }

    // Parse the response
    let data;
    try {
      data = await hfResponse.json();
      console.log("Received data from Hugging Face:", JSON.stringify(data).substring(0, 200) + "...");
    } catch (jsonError) {
      const text = await hfResponse.text();
      console.error("Error parsing response JSON:", jsonError);
      console.error("Response text:", text);
      return res.status(500).json({ 
        message: "Error parsing response from Hugging Face", 
        details: text.substring(0, 500)
      });
    }

    // Extract the generated text
    const generatedText = data && data[0] && data[0].generated_text
      ? data[0].generated_text.trim()
      : "No response generated.";
    
    // Process the response to extract meaningful content
    const processResponse = (text) => {
      // Remove the original prompt if it's included
      let cleanedText = text;
      if (text.includes(promptText)) {
        cleanedText = text.substring(text.indexOf(promptText) + promptText.length).trim();
      }
      
      // Handle code blocks - remove markdown indicators but preserve formatting
      if (cleanedText.includes('```')) {
        cleanedText = cleanedText.replace(/```\w*\n/g, '').replace(/```/g, '');
      }
      
      // Remove unnecessary preambles like "Here's the answer:"
      const preambles = [
        "Here's the answer:", 
        "The answer is:", 
        "Answer:", 
        "Here's a direct answer:",
        "To solve this problem:"
      ];
      
      for (const preamble of preambles) {
        if (cleanedText.startsWith(preamble)) {
          cleanedText = cleanedText.substring(preamble.length).trim();
        }
      }
      
      return cleanedText;
    };

    const processedText = processResponse(generatedText);
    console.log("Processed response:", processedText.substring(0, 100) + "...");
    
    return res.status(200).json({ response: processedText });
  } catch (error) {
    console.error("API request error:", error);
    return res.status(500).json({ 
      message: "Error processing request", 
      details: error.message 
    });
  }
}