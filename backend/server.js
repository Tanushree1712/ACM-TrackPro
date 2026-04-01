import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvFile(join(__dirname, ".env"));

const PORT = Number(process.env.PORT || 8787);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";
const MAX_BODY_BYTES = 1024 * 1024;
const FACULTY_EMAILS = (process.env.FACULTY_EMAILS || "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, statusCode, payload) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;
      if (rawBody.length > MAX_BODY_BYTES) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });

    req.on("error", reject);
  });
}

function toNonEmptyString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function toOptionalEmail(value) {
  const email = toNonEmptyString(value);
  return email.includes("@") ? email : "";
}

function toStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function toAttendeeCount(value) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return null;
}

function buildChecklist(payload) {
  const proposal = payload?.proposal ?? {};
  const documentation = payload?.documentation ?? {};

  const members = toStringArray(documentation.members);
  const photoFiles = toStringArray(documentation.photoFiles);
  const attendeeCount = toAttendeeCount(documentation.attendees);

  const checklist = [
    {
      label: "Event objective",
      completed: Boolean(toNonEmptyString(proposal.objective)),
      note: "Needed so the report can compare actual outcomes with the original goal.",
    },
    {
      label: "Planned requirements",
      completed: Boolean(toNonEmptyString(proposal.requirements)),
      note: "Needed to compare what was requested with what was actually used.",
    },
    {
      label: "Coordinator list",
      completed: Boolean(toNonEmptyString(proposal.coordinators)),
      note: "Needed for ownership, acknowledgements, and admin sign-off.",
    },
    {
      label: "Organizing members",
      completed: members.length > 0,
      note: "Add the members or volunteers who helped conduct the event.",
    },
    {
      label: "Resources used",
      completed: Boolean(toNonEmptyString(documentation.resources)),
      note: "Describe the room, equipment, software, or budget items actually used.",
    },
    {
      label: "Attendee count",
      completed: attendeeCount !== null,
      note: "Add the final number of participants to measure turnout.",
    },
    {
      label: "Event poster",
      completed: Boolean(toNonEmptyString(documentation.posterFile)),
      note: "Upload the approved poster so the event archive is complete.",
    },
    {
      label: "Event photos",
      completed: photoFiles.length > 0,
      note: "Upload at least one photo as proof of execution and for publicity.",
    },
    {
      label: "Feedback sheet",
      completed: Boolean(toNonEmptyString(documentation.feedbackFile)),
      note: "Upload the feedback export so participant sentiment can be summarized.",
    },
  ];

  return {
    checklist,
    missingItems: checklist.filter((item) => !item.completed).map((item) => item.label),
    completedCount: checklist.filter((item) => item.completed).length,
    totalRequired: checklist.length,
  };
}

function createAiInput(payload, checklistData) {
  const proposal = payload?.proposal ?? {};
  const documentation = payload?.documentation ?? {};

  return {
    proposal: {
      eventName: toNonEmptyString(proposal.eventName),
      description: toNonEmptyString(proposal.description),
      objective: toNonEmptyString(proposal.objective),
      date: toNonEmptyString(proposal.date),
      requirements: toNonEmptyString(proposal.requirements),
      coordinators: toNonEmptyString(proposal.coordinators),
      status: toNonEmptyString(proposal.status),
    },
    documentation: {
      members: toStringArray(documentation.members),
      resourcesUsed: toNonEmptyString(documentation.resources),
      attendees: toAttendeeCount(documentation.attendees),
      posterFile: toNonEmptyString(documentation.posterFile),
      photoFiles: toStringArray(documentation.photoFiles),
      feedbackFile: toNonEmptyString(documentation.feedbackFile),
    },
    checklist: checklistData.checklist,
    missingItems: checklistData.missingItems,
    generationConstraints: [
      "Do not invent attendance statistics, survey percentages, quotes, or file contents.",
      "If information is missing, explicitly mention that it is not yet provided.",
      "Treat uploaded files as filenames only because the file contents are not being sent yet.",
    ],
  };
}

function extractOutputText(responsePayload) {
  const output = Array.isArray(responsePayload?.output) ? responsePayload.output : [];
  const parts = [];

  for (const item of output) {
    if (item?.type !== "message" || !Array.isArray(item.content)) {
      continue;
    }

    for (const contentItem of item.content) {
      if (contentItem?.type === "output_text" && typeof contentItem.text === "string") {
        parts.push(contentItem.text);
      }
    }
  }

  return parts.join("").trim();
}

function isEmailConfigured() {
  return Boolean(
    FACULTY_EMAILS.length &&
      SMTP_HOST &&
      SMTP_PORT &&
      SMTP_USER &&
      SMTP_PASS &&
      SMTP_FROM
  );
}

function createMailTransport() {
  if (!isEmailConfigured()) {
    throw new Error(
      "Faculty email delivery is not configured. Add FACULTY_EMAILS and SMTP settings in backend/.env."
    );
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function stripDataUrlPrefix(value) {
  const trimmed = toNonEmptyString(value);
  const dataUrlPrefixMatch = trimmed.match(/^data:.*;base64,/);
  return dataUrlPrefixMatch ? trimmed.slice(dataUrlPrefixMatch[0].length) : trimmed;
}

function createProposalEmailBody(payload) {
  const proposal = payload?.proposal ?? {};
  const submittedBy = payload?.submittedBy ?? {};

  const eventName = toNonEmptyString(proposal.eventName);
  const description = toNonEmptyString(proposal.description);
  const objective = toNonEmptyString(proposal.objective);
  const date = toNonEmptyString(proposal.date);
  const requirements = toNonEmptyString(proposal.requirements);
  const coordinators = toNonEmptyString(proposal.coordinators);
  const submitterName = toNonEmptyString(submittedBy.name) || "Not provided";
  const submitterEmail = toOptionalEmail(submittedBy.email) || "Not provided";

  return [
    "A new ACM event proposal has been submitted.",
    "",
    `Event Name: ${eventName}`,
    `Description: ${description}`,
    `Objective: ${objective}`,
    `Proposed Date: ${date}`,
    `Requirements: ${requirements}`,
    `Coordinators: ${coordinators}`,
    "",
    `Submitted By: ${submitterName}`,
    `Submitter Email: ${submitterEmail}`,
    "",
    "The proposal PDF is attached to this email.",
  ].join("\n");
}

async function emailProposalToFaculty(payload) {
  const proposal = payload?.proposal ?? {};
  const pdfAttachment = payload?.pdfAttachment ?? {};
  const submittedBy = payload?.submittedBy ?? {};

  const eventName = toNonEmptyString(proposal.eventName);
  const fileName = toNonEmptyString(pdfAttachment.name) || `${eventName || "proposal"}.pdf`;
  const contentType = toNonEmptyString(pdfAttachment.type) || "application/pdf";
  const base64Content = stripDataUrlPrefix(pdfAttachment.dataBase64);

  if (!eventName) {
    throw new Error("Event name is required before emailing the proposal.");
  }

  if (!base64Content) {
    throw new Error("A proposal PDF is required for faculty email delivery.");
  }

  const attachmentBuffer = Buffer.from(base64Content, "base64");
  if (!attachmentBuffer.length) {
    throw new Error("The attached proposal PDF could not be read.");
  }

  const transporter = createMailTransport();
  const submitterEmail = toOptionalEmail(submittedBy.email);

  return transporter.sendMail({
    from: SMTP_FROM,
    to: FACULTY_EMAILS.join(", "),
    replyTo: submitterEmail || undefined,
    subject: `New ACM Proposal: ${eventName}`,
    text: createProposalEmailBody(payload),
    attachments: [
      {
        filename: fileName,
        content: attachmentBuffer,
        contentType,
      },
    ],
  });
}

async function generateAiReport(payload, checklistData) {
  const aiInput = createAiInput(payload, checklistData);
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      reasoning: { effort: "low" },
      input: [
        {
          role: "system",
          content:
            "You write ACM event documentation reports. Be practical, concise, and accurate. Use only the provided data.",
        },
        {
          role: "user",
          content:
            "Generate a documentation review and final report draft for this event. Focus on what is complete, what is missing, and what the organizing team should do next.\n\n" +
            JSON.stringify(aiInput, null, 2),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "event_documentation_report",
          strict: true,
          schema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              action_items: {
                type: "array",
                items: { type: "string" },
              },
              report_markdown: { type: "string" },
              confidence_note: { type: "string" },
            },
            required: ["summary", "action_items", "report_markdown", "confidence_note"],
            additionalProperties: false,
          },
        },
      },
    }),
  });

  const responsePayload = await response.json();

  if (!response.ok) {
    const errorMessage =
      responsePayload?.error?.message || "OpenAI request failed while generating the event report.";
    throw new Error(errorMessage);
  }

  const rawText = extractOutputText(responsePayload);
  if (!rawText) {
    throw new Error("The model returned no report text.");
  }

  const parsed = JSON.parse(rawText);

  return {
    summary: parsed.summary,
    actionItems: Array.isArray(parsed.action_items) ? parsed.action_items : [],
    reportMarkdown: parsed.report_markdown,
    confidenceNote: parsed.confidence_note,
  };
}

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && requestUrl.pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      model: OPENAI_MODEL,
      aiConfigured: Boolean(OPENAI_API_KEY),
      emailConfigured: isEmailConfigured(),
    });
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/proposals/submit") {
    try {
      const payload = await readJsonBody(req);

      if (!payload?.proposal?.eventName) {
        sendJson(res, 400, {
          error: "Proposal details are required.",
        });
        return;
      }

      if (!payload?.pdfAttachment?.dataBase64) {
        sendJson(res, 400, {
          error: "Attach a proposal PDF before submitting.",
        });
        return;
      }

      const emailResult = await emailProposalToFaculty(payload);

      sendJson(res, 200, {
        ok: true,
        recipients: FACULTY_EMAILS,
        messageId: emailResult.messageId,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error while emailing the proposal PDF.";

      sendJson(res, 500, {
        error: message,
      });
    }
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/reports/generate") {
    let checklistData = {
      checklist: [],
      missingItems: [],
      completedCount: 0,
      totalRequired: 0,
    };

    try {
      const payload = await readJsonBody(req);
      checklistData = buildChecklist(payload);

      if (!payload?.proposal?.eventName) {
        sendJson(res, 400, {
          error: "Proposal data is required to generate an event report.",
          ...checklistData,
          aiReport: null,
          model: null,
        });
        return;
      }

      if (!OPENAI_API_KEY) {
        sendJson(res, 200, {
          ...checklistData,
          aiReport: null,
          model: null,
          warning:
            "OPENAI_API_KEY is not configured in backend/.env yet. The checklist is available, but AI text generation is disabled.",
        });
        return;
      }

      const aiReport = await generateAiReport(payload, checklistData);

      sendJson(res, 200, {
        ...checklistData,
        aiReport,
        model: OPENAI_MODEL,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error while generating the event report.";

      sendJson(res, 200, {
        ...checklistData,
        aiReport: null,
        model: null,
        warning: message,
      });
    }
    return;
  }

  sendJson(res, 404, { error: "Route not found." });
});

server.listen(PORT, () => {
  console.log(`ACM TrackPro backend running on http://localhost:${PORT}`);
});
