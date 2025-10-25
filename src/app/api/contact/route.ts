import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  phone: z.string().min(10),
  budget: z.string().min(1),
  projectType: z.string().min(1),
  message: z.string().min(10),
  honeypot: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = contactSchema.parse(body);

    // Check honeypot field for spam protection
    if (validatedData.honeypot) {
      return NextResponse.json({ message: "Spam detected" }, { status: 400 });
    }

    // Create email content
    const emailContent = `
New Contact Form Submission

Name: ${validatedData.name}
Email: ${validatedData.email}
Company: ${validatedData.company}
Phone: ${validatedData.phone}
Budget: ${validatedData.budget}
Project Type: ${validatedData.projectType}

Message:
${validatedData.message}

---
Submitted at: ${new Date().toISOString()}
    `;

    // Save to backup file
    const backupData = {
      ...validatedData,
      timestamp: new Date().toISOString(),
      ip: request.ip || request.headers.get("x-forwarded-for") || "unknown",
    };

    const backupDir = path.join(process.cwd(), "data", "inbox");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupFile = path.join(
      backupDir,
      `${new Date().toISOString().split("T")[0]}-${Date.now()}.json`
    );
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));

    // Send email if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_TO || "contact@trioncreation.com",
        subject: `New Contact Form Submission from ${validatedData.name}`,
        text: emailContent,
        html: emailContent.replace(/\n/g, "<br>"),
      });
    }

    return NextResponse.json({ 
      message: "Thank you for your message. We'll get back to you soon!" 
    });

  } catch (error) {
    console.error("Contact form error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid form data", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
