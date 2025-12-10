function stripTags(input = "") {
  return String(input).replace(/<[^>]*>/g, "");
}

function clampLength(input = "", max = 2000) {
  const s = String(input);
  return s.length > max ? s.slice(0, max) : s;
}

function sanitizeText(input = "", max = 2000) {
  return clampLength(stripTags(input), max).trim();
}

module.exports = { stripTags, clampLength, sanitizeText };
