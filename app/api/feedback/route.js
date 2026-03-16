export async function POST(req) {
  try {
    const body = await req.json();

    const firstName = body.firstName || "";
    const lastName = body.lastName || "";
    const email = body.email || "";
    const detail = body.detail || "";
    const roast = body.roast || "";
    const feedback = body.feedback || "";

    if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      console.error("Missing GOOGLE_SHEETS_WEBHOOK_URL");
      return Response.json(
        { error: "Missing GOOGLE_SHEETS_WEBHOOK_URL" },
        { status: 500 }
      );
    }

    const sheetRes = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        detail,
        roast,
        feedback
      })
    });

    const sheetText = await sheetRes.text();
    console.log("Feedback sheet response:", sheetRes.status, sheetText);

    return Response.json({
      ok: true,
      sheetStatus: sheetRes.status,
      sheetText
    });
  } catch (error) {
    console.error("FEEDBACK API ERROR:", error);

    return Response.json(
      { error: "Failed to save feedback." },
      { status: 500 }
    );
  }
}