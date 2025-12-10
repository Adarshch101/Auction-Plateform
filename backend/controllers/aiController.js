const express = require("express");

// Simple stubbed AI controller. Replace implementations with real providers when ready.

// POST /ai/summarize
// body: { messages: string[] }
exports.summarize = async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    if (!messages.length) return res.json({ summary: "No messages to summarize." });

    // Very naive heuristic: take last N, dedupe slightly, and compress
    const last = messages.slice(-50).map((t) => String(t || "").trim()).filter(Boolean);
    const unique = [];
    const seen = new Set();
    for (const t of last) {
      const k = t.toLowerCase().slice(0, 64);
      if (!seen.has(k)) { unique.push(t); seen.add(k); }
    }
    const joined = unique.join("\n");
    // Trim to ~1000 chars
    const summary = joined.length > 1000 ? (joined.slice(0, 980) + " ...") : joined;

    return res.json({ summary });
  } catch (e) {
    return res.status(500).json({ message: "Summarization failed" });
  }
};

// POST /ai/transcribe
// body: { audioDataUrl: string }
exports.transcribe = async (req, res) => {
  try {
    const dataUrl = String(req.body?.audioDataUrl || "");
    if (!dataUrl.startsWith("data:")) {
      return res.status(400).json({ message: "Invalid audio data" });
    }
    // Stubbed: we don't run actual ASR here. Return a placeholder with duration hint if possible.
    // Optionally, you can parse the data URL size to give a hint.
    const base64 = dataUrl.split(",")[1] || "";
    const byteLen = Math.ceil(base64.length * 3 / 4);
    const approxSeconds = Math.max(3, Math.min(15, Math.round(byteLen / 8000))); // rough heuristic
    const text = `Voice note (~${approxSeconds}s). Transcription service not configured.`;
    return res.json({ text });
  } catch (e) {
    return res.status(500).json({ message: "Transcription failed" });
  }
};
