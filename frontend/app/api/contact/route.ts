import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, to, recipientName } = body;

    // Validate required fields
    if (!name || !email || !message || !to) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In production, this would send an email using a service like:
    // - SendGrid
    // - AWS SES
    // - Resend
    // - Mailgun
    //
    // For now, we'll log the message and return success
    console.log("Contact form submission:", {
      from: { name, email },
      to,
      recipientName,
      message,
      timestamp: new Date().toISOString(),
    });

    // TODO: Implement email sending
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "noreply@revuu.com.br",
    //   to: to,
    //   subject: `Nova mensagem de ${name} via seu portfolio Revuu`,
    //   html: `
    //     <h2>Nova mensagem do seu portfolio</h2>
    //     <p><strong>De:</strong> ${name} (${email})</p>
    //     <p><strong>Mensagem:</strong></p>
    //     <p>${message}</p>
    //   `,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
