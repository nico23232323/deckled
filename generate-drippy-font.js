const fs = require("fs");
const path = require("path");
const opentype = require("opentype.js");
const ttf2woff = require("ttf2woff");

const UPM = 1000;
const BASE_BOTTOM = 80;
const BASE_TOP = 820;
const CELL_WIDTH = 760;
const GAP = 42;
const SUPPORTED_CHARS = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  ..."abcdefghijklmnopqrstuvwxyz",
  ..."0123456789",
  ..." áéíóúüñÁÉÍÓÚÜÑ",
  ...".,;:!?¿¡'\"-_/\\()[]{}@#%&+=*",
];

function roundedOuter(glyphPath, left, right, bottom, top, radius) {
  glyphPath.moveTo(left + radius, bottom);
  glyphPath.lineTo(right - radius, bottom);
  glyphPath.curveTo(right, bottom, right, bottom, right, bottom + radius);
  glyphPath.lineTo(right, top - radius);
  glyphPath.curveTo(right, top, right, top, right - radius, top);
  glyphPath.lineTo(left + radius, top);
  glyphPath.curveTo(left, top, left, top, left, top - radius);
  glyphPath.lineTo(left, bottom + radius);
  glyphPath.curveTo(left, bottom, left, bottom, left + radius, bottom);
  glyphPath.close();
}

function counter(glyphPath, centerX, centerY, width, height) {
  const left = centerX - width / 2;
  const right = centerX + width / 2;
  const bottom = centerY - height / 2;
  const top = centerY + height / 2;
  const radius = Math.min(42, width / 3);

  glyphPath.moveTo(left + radius, bottom);
  glyphPath.curveTo(left, bottom, left, bottom, left, bottom + radius);
  glyphPath.lineTo(left, top - radius);
  glyphPath.curveTo(left, top, left, top, left + radius, top);
  glyphPath.lineTo(right - radius, top);
  glyphPath.curveTo(right, top, right, top, right, top - radius);
  glyphPath.lineTo(right, bottom + radius);
  glyphPath.curveTo(right, bottom, right, bottom, right - radius, bottom);
  glyphPath.close();
}

function drip(glyphPath, x, width = 24, length = 110) {
  const half = Math.max(8, width / 2);
  glyphPath.moveTo(x - half, BASE_BOTTOM + 18);
  glyphPath.curveTo(x - half, BASE_BOTTOM - length, x, BASE_BOTTOM - length - 22, x, BASE_BOTTOM - length - 22);
  glyphPath.curveTo(x + half, BASE_BOTTOM - length, x + half, BASE_BOTTOM + 18, x + half, BASE_BOTTOM + 18);
  glyphPath.close();
}

function drawGlyph(char) {
  const glyphPath = new opentype.Path();
  const left = 42;
  const right = CELL_WIDTH - 42;

  if (char === " ") return glyphPath;

  const referenceGlyph = bubbleReference.charToGlyph(char);
  const scale = 0.82;
  const sourceWidth = Math.max(referenceGlyph.advanceWidth, 1);
  const offsetX = (CELL_WIDTH - sourceWidth * scale) / 2;
  const sourcePath = referenceGlyph.getPath(offsetX, BASE_TOP, UPM * scale);

  for (const command of sourcePath.commands) {
    if (command.type === "M") glyphPath.moveTo(command.x, command.y);
    if (command.type === "L") glyphPath.lineTo(command.x, command.y);
    if (command.type === "C") glyphPath.curveTo(command.x1, command.y1, command.x2, command.y2, command.x, command.y);
    if (command.type === "Q") glyphPath.quadTo(command.x1, command.y1, command.x, command.y);
    if (command.type === "Z") glyphPath.close();
  }

  drip(glyphPath, left + 145, 22, 74);
  drip(glyphPath, CELL_WIDTH / 2, 28, 120);
  drip(glyphPath, right - 145, 22, 88);
  return glyphPath;
}

const bubbleReference = opentype.parse(
  fs.readFileSync("C:/Windows/Fonts/ariblk.ttf").buffer
);

const glyphs = [
  new opentype.Glyph({ name: ".notdef", advanceWidth: CELL_WIDTH, path: drawGlyph("M") }),
  new opentype.Glyph({ name: "space", unicode: 32, advanceWidth: 330, path: drawGlyph(" ") }),
];

for (const char of new Set(SUPPORTED_CHARS)) {
  if (char === " ") continue;
  const unicode = char.codePointAt(0);
  const glyphName = /[A-Za-z0-9]/.test(char)
    ? char
    : `uni${unicode.toString(16).toUpperCase().padStart(4, "0")}`;
  glyphs.push(new opentype.Glyph({
    name: glyphName,
    unicode,
    advanceWidth: CELL_WIDTH + GAP,
    path: drawGlyph(char),
  }));
}

const font = new opentype.Font({
  familyName: "Deck Led Drippy Bubble",
  styleName: "Regular",
  unitsPerEm: UPM,
  ascender: 900,
  descender: -220,
  glyphs,
});

async function saveWebFonts() {
  const fontsDir = path.join(__dirname, "assets", "fonts");
  const ttfBytes = Buffer.from(font.toArrayBuffer());
  const woffBytes = ttf2woff(ttfBytes);
  const { default: ttf2woff2 } = await import("ttf2woff2/jssrc/index.js");
  const woff2Bytes = ttf2woff2(ttfBytes);

  fs.mkdirSync(fontsDir, { recursive: true });
  fs.writeFileSync(path.join(fontsDir, "DeckLedDrippyBubble.ttf"), ttfBytes);
  fs.writeFileSync(path.join(fontsDir, "DeckLedDrippyBubble.woff"), Buffer.from(woffBytes.buffer));
  fs.writeFileSync(path.join(fontsDir, "DeckLedDrippyBubble.woff2"), woff2Bytes);
}

saveWebFonts().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});