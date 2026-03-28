import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import http from "http";
import { Resend } from "resend";
import { Server } from "socket.io";
dotenv.config();

const app = express();
const server = http.createServer(app);

const port = Number(process.env.PORT || 5000);
const clientOrigin = process.env.CLIENT_ORIGIN || "*";
const resendApiKey = process.env.RESEND_API_KEY || "";
const resendFromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const resendToEmail = process.env.RESEND_TO_EMAIL || "";
const resend = resendApiKey ? new Resend(resendApiKey) : null;

if (!resendApiKey) {
  console.warn("[resend] RESEND_API_KEY is missing in .env");
}

if (!resendToEmail) {
  console.warn("[resend] RESEND_TO_EMAIL is missing in .env");
}

const allowedOrigins = clientOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (clientOrigin === "*") return true;
  if (allowedOrigins.includes(origin)) return true;

  // Allow localhost/127.0.0.1 on any dev port to avoid CORS breakage when Vite auto-switches ports.
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("CORS blocked for this origin"));
  },
};

app.use(cors(corsOptions));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("CORS blocked for this origin"));
    },
  },
});

const escapeHtml = (input) =>
  String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body ?? {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }

  if (!resend || !resendToEmail) {
    return res.status(500).json({
      error: "Email service is not configured. Add RESEND_API_KEY and RESEND_TO_EMAIL.",
    });
  }

  try {
    const resendResponse = await resend.emails.send({
      from: resendFromEmail,
      to: resendToEmail,
      replyTo: email,
      subject: `[Dyslexis Contact] ${subject}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
      `,
    });

    if (resendResponse?.error) {
      const resendErrorMessage = resendResponse.error.message || "Resend rejected the email request.";
      return res.status(502).json({ error: resendErrorMessage });
    }

    const resendId = resendResponse?.data?.id || resendResponse?.id || null;
    console.log("[resend] email accepted", {
      id: resendId,
      to: resendToEmail,
      subject,
    });

    return res.status(200).json({
      message: "Message sent successfully.",
      resendId,
    });
  } catch (error) {
    const errorMessage = error?.message || "Failed to send message.";
    console.error("[resend] send failed", errorMessage);
    return res.status(500).json({ error: errorMessage });
  }
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("ready");
  });

  socket.on("offer", (offer, roomId) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", (answer, roomId) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate, roomId) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
