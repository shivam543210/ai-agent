const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function analyzeJob(jobDescription, userResume) {
  const prompt = `
    You are a career assistant. 
    Here is a user's resume summary: "${userResume}".
    Here is a job description: "${jobDescription}".
    
    1. Is this job a good fit? (Yes/No)
    2. What is the match percentage?
    3. List 3 key skills from the description that the user matches.
    
    Output JSON format: { "fit": "Yes/No", "matchWith": number, "skills": [] }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    // Cleanup markdown if present
    text = text.replace(/```json/g, "").replace(/```/g, "");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing job:", error);
    return null;
  }
}

async function generateCoverLetter(jobDescription, userDetails) {
  const prompt = `
    Write a professional and concise cover letter for the following job:
    "${jobDescription}"
    
    My details:
    Name: ${userDetails.name}
    Email: ${userDetails.email}
    Phone: ${userDetails.phone}
    
    Keep it under 300 words.
  `;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return "Error generating cover letter.";
  }
}

async function smartFill(fieldInfo, userProfile) {
  const prompt = `
    You are an AI filling out a job application form for a user.
    
    User Profile (Memory):
    ${JSON.stringify(userProfile)}
    
    The Field to Fill:
    - Label/Context: "${fieldInfo.label}"
    - HTML Name Attribute: "${fieldInfo.name}"
    - HTML ID: "${fieldInfo.id}"
    - Placeholder: "${fieldInfo.placeholder}"
    
    Task:
    Based strictly on the User Profile, what is the best string value to type into this field?
    - If it's a Yes/No question, return "Yes" or "No" based on the profile.
    - If the info is missing, return "N/A".
    - If it's a numeric field (e.g., years of experience), calculate it from experience if possible, otherwise guess reasonable or 0.
    
    Return ONLY the string value to type. No quotes or markdown.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let answer = response.text().trim();
    // Cleanup simple quotes if LLM added them
    if ((answer.startsWith('"') && answer.endsWith('"')) || (answer.startsWith("'") && answer.endsWith("'"))) {
        answer = answer.slice(1, -1);
    }
    return answer;
  } catch (error) {
    console.error("Error in smartFill:", error);
    return "";
  }
}

module.exports = { analyzeJob, generateCoverLetter, smartFill };
