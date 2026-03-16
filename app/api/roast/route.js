import OpenAI from "openai";
import crypto from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const body = await req.json();

    const firstName = body.firstName || "";
    const lastName = body.lastName || "";
    const email = body.email || "";
    const detail = body.detail || "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      return Response.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const prompt = `
You are a brutal stand-up comedian doing crowd work in a late night comedy club.

Roast the person using their first name and the provided detail.

Person:
First name: ${firstName}
Detail: ${detail || "No detail given"}

Rules:
- 1 sentence only
- Max 18 words
- Be mean, punchy, and funny
- Edgy and dirty jokes are allowed
- Roast them like a live comedian would
- Use the detail if possible
- Avoid generic AI phrasing
- No introductions
- No explanations
- No hashtags
- No protected class insults
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt
    });

    const roast =
      response.output_text?.trim() ||
      `${firstName} somehow gave us less than nothing.`;

    const submissionId = crypto.randomUUID();

    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      try {
        await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            action: "create",
            submissionId,
            firstName,
            lastName,
            email,
            detail,
            roast
          })
        });
      } catch (sheetError) {
        console.error("Google Sheets error:", sheetError);
      }
    }

    return Response.json({
      roast,
      submission: {
        submissionId,
        firstName,
        lastName,
        email,
        detail
      }
    });

  } catch (error) {
    console.error("ROAST API ERROR:", error);

    return Response.json(
      { error: "Server error generating roast." },
      { status: 500 }
    );
  }
}