export async function POST(req) {
  try {
    const body = await req.json();

    const submissionId = body.submissionId || "";
    const feedback = body.feedback || "";

    if (!submissionId || !feedback) {
      return Response.json(
        { error: "Missing submissionId or feedback." },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
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
        action: "feedback",
        submissionId,
        feedback
      })
    });

    const text = await sheetRes.text();
    console.log("Feedback sheet response:", sheetRes.status, text);

    if (!sheetRes.ok) {
      return Response.json(
        { error: "Failed to save feedback." },
        { status: 500 }
      );
    }

    return Response.json({ ok: true });

  } catch (error) {
    console.error("FEEDBACK API ERROR:", error);

    return Response.json(
      { error: "Failed to save feedback." },
      { status: 500 }
    );
  }
}