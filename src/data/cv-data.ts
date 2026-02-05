import type {
  CvAward,
  CvData,
  CvEducation,
  CvExperience,
  CvProfile,
  CvSkillGroup,
} from "@/src/data/cv-types";
import { readFile } from "fs/promises";
import path from "path";

const CV_LATEX_PATH = path.join(process.cwd(), "cv.latex");

export async function getCvData(): Promise<CvData> {
  const rawLatex = await readFile(CV_LATEX_PATH, "utf8");
  return parseCvLatex(rawLatex);
}

function parseCvLatex(rawLatex: string): CvData {
  const name = matchOrThrow(rawLatex, /\\textbf\{\\Huge\s+([^}]+)\}/, "name");

  const headerLine = matchOptional(
    rawLatex,
    /\\small\s+(.+?)\s+\$\\\|\$\s+(.+?)\s*\\\\/,
  );

  const location = headerLine ? sanitizeLatexInline(headerLine[1]!) : "";
  const phone = headerLine ? sanitizeLatexInline(headerLine[2]!) : undefined;

  const email =
    matchOptional(rawLatex, /\\href\{mailto:([^}]+)\}/)?.[1] ?? undefined;
  const linkedin =
    matchOptional(rawLatex, /\\href\{(https:\/\/linkedin\.com\/in\/[^}]+)\}/)
      ?.[1] ?? undefined;
  const github =
    matchOptional(rawLatex, /\\href\{(https:\/\/github\.com\/[^}]+)\}/)?.[1] ??
    undefined;

  const professionalSummary = extractSectionBodySingleLine(
    rawLatex,
    "Professional Summary",
  );

  const headline = deriveHeadline(professionalSummary);

  const profile: CvProfile = {
    name: sanitizeLatexInline(name),
    headline,
    location,
    phone,
    email,
    linkedin,
    github,
  };

  const skills = parseSkills(rawLatex);
  const experience = parseExperience(rawLatex);
  const education = parseEducation(rawLatex);
  const awards = parseAwards(rawLatex);

  return {
    profile,
    professionalSummary,
    skills,
    experience,
    education,
    awards,
    rawLatex,
  };
}

function deriveHeadline(summary: string) {
  const trimmed = summary.trim();
  const idx = trimmed.toLowerCase().indexOf(" with ");
  if (idx > 0) return trimmed.slice(0, idx).trim();
  return trimmed;
}

function parseSkills(rawLatex: string): CvSkillGroup[] {
  const block = sliceBetweenSections(rawLatex, "Technical Skills", "Experience");
  const matches = [...block.matchAll(/\\titleItem\{([^}]+)\}\{:\s*([^}]+)\}/g)];

  return matches.map((m) => {
    const category = sanitizeLatexInline(m[1] ?? "");
    const rawItems = sanitizeLatexInline(m[2] ?? "");
    const items = rawItems
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return { category, items };
  });
}

function parseExperience(rawLatex: string): CvExperience[] {
  const block = sliceBetweenSections(rawLatex, "Experience", "Education");
  const entries: CvExperience[] = [];
  const cmd = "\\resumeProjectHeading";
  let idx = 0;

  while (idx < block.length) {
    const cmdIdx = block.indexOf(cmd, idx);
    if (cmdIdx === -1) break;

    let i = cmdIdx + cmd.length;
    i = skipWhitespace(block, i);

    const firstBrace = block.indexOf("{", i);
    if (firstBrace === -1) break;
    const headingArg = readBraced(block, firstBrace);
    i = skipWhitespace(block, headingArg.nextIndex);

    const secondBrace = block.indexOf("{", i);
    if (secondBrace === -1) break;
    const dateArg = readBraced(block, secondBrace);
    i = dateArg.nextIndex;

    const listStart = block.indexOf("\\resumeItemListStart", i);
    const listEnd =
      listStart === -1 ? -1 : block.indexOf("\\resumeItemListEnd", listStart);

    const bulletsBlock =
      listStart !== -1 && listEnd !== -1
        ? block.slice(listStart, listEnd)
        : "";

    const heading = headingArg.value;
    const dateRange = sanitizeLatexInline(dateArg.value);

    const titleRaw = findCommandArg(heading, "titleItem");
    const companyRaw = findCommandArg(heading, "emph");

    const title = sanitizeLatexInline(titleRaw ?? heading);
    const company = sanitizeLatexInline(companyRaw ?? "");

    const bullets = extractCommandArgs(bulletsBlock, "resumeItem")
      .map((t) => sanitizeLatexInline(t))
      .filter(Boolean);

    entries.push({
      id: toId(`${company}-${title}-${dateRange}`),
      title,
      company,
      dateRange,
      bullets,
    });

    idx = listEnd !== -1 ? listEnd + "\\resumeItemListEnd".length : i;
  }

  return entries;
}

function parseEducation(rawLatex: string): CvEducation[] {
  const block = sliceBetweenSections(
    rawLatex,
    "Education",
    "Hackathons \\& Awards",
  );

  const matches = [
    ...block.matchAll(
      /\\resumeSubheading\s*[\r\n]+\s*\{([^}]+)\}\{([^}]+)\}\s*[\r\n]+\s*\{([^}]+)\}\{([^}]+)\}/g,
    ),
  ];

  return matches.map((m) => ({
    id: toId(`${m[1]}-${m[3]}-${m[4]}`),
    school: sanitizeLatexInline(m[1] ?? ""),
    location: sanitizeLatexInline(m[2] ?? ""),
    degree: sanitizeLatexInline(m[3] ?? ""),
    dateRange: sanitizeLatexInline(m[4] ?? ""),
  }));
}

function parseAwards(rawLatex: string): CvAward[] {
  const block = sliceBetweenSections(rawLatex, "Hackathons \\& Awards", "end");
  const items = extractCommandArgs(block, "resumeItem").filter(Boolean);

  const awards: CvAward[] = [];

  for (const item of items) {
    const [leftRaw, dateRaw] = item.split("\\hfill");
    const date = sanitizeLatexInline(dateRaw ?? "");
    const left = leftRaw ?? "";

    const title =
      sanitizeLatexInline(matchOptional(left, /\\textbf\{([^}]+)\}/)?.[1] ?? "") ||
      sanitizeLatexInline(left);

    const detail = sanitizeLatexInline(
      left
        .replace(/\\textbf\{[^}]+\}/, "")
        .replace(/^\s*-\s*/, "")
        .trim(),
    );

    awards.push({
      id: toId(`${title}-${date}`),
      title,
      detail,
      date,
    });
  }

  return awards;
}

function extractSectionBodySingleLine(rawLatex: string, sectionName: string) {
  const block = sliceBetweenSections(rawLatex, sectionName, "next");
  const lines = block
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const firstContentLine = lines.find((l) => !l.startsWith("\\section{"));
  return sanitizeLatexInline(firstContentLine ?? "");
}

function sliceBetweenSections(rawLatex: string, from: string, to: string) {
  const fromToken = `\\section{${from}}`;
  const fromIndex = rawLatex.indexOf(fromToken);
  if (fromIndex < 0) return "";

  const afterFrom = rawLatex.slice(fromIndex + fromToken.length);

  if (to === "end") return afterFrom;

  const toToken = to === "next" ? "\\section{" : `\\section{${to}}`;
  const toIndex = afterFrom.indexOf(toToken);
  if (toIndex < 0) return afterFrom;

  return afterFrom.slice(0, toIndex);
}

function matchOrThrow(source: string, re: RegExp, label: string) {
  const m = re.exec(source);
  if (!m) throw new Error(`cv-data: could not parse ${label}`);
  return m[1] ?? "";
}

function matchOptional(source: string, re: RegExp) {
  return re.exec(source) ?? undefined;
}

function sanitizeLatexInline(input: string) {
  return input
    .replace(/\\textbf\{([^}]*)\}/g, "$1")
    .replace(/\\emph\{([^}]*)\}/g, "$1")
    .replace(/\\href\{[^}]*\}\{([^}]*)\}/g, "$1")
    .replace(/\\&/g, "&")
    .replace(/\$\s*\|\s*\$/g, "|")
    .replace(/\s+/g, " ")
    .trim();
}

function toId(input: string) {
  return sanitizeLatexInline(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function skipWhitespace(source: string, i: number) {
  while (i < source.length && /\s/.test(source[i]!)) i += 1;
  return i;
}

function readBraced(source: string, openBraceIndex: number) {
  if (source[openBraceIndex] !== "{") {
    throw new Error("cv-data: expected '{' while parsing");
  }
  let i = openBraceIndex + 1;
  let depth = 1;
  let out = "";

  while (i < source.length) {
    const ch = source[i]!;
    if (ch === "{") {
      depth += 1;
      out += ch;
      i += 1;
      continue;
    }
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) return { value: out, nextIndex: i + 1 };
      out += ch;
      i += 1;
      continue;
    }

    out += ch;
    i += 1;
  }

  throw new Error("cv-data: unterminated '{...}' block");
}

function findCommandArg(source: string, commandName: string) {
  const needle = `\\${commandName}{`;
  const idx = source.indexOf(needle);
  if (idx === -1) return undefined;
  const braceIdx = idx + needle.length - 1; // points to '{'
  return readBraced(source, braceIdx).value;
}

function extractCommandArgs(source: string, commandName: string) {
  const needle = `\\${commandName}{`;
  const args: string[] = [];
  let idx = 0;

  while (idx < source.length) {
    const hit = source.indexOf(needle, idx);
    if (hit === -1) break;
    const braceIdx = hit + needle.length - 1; // '{'
    const arg = readBraced(source, braceIdx);
    args.push(arg.value);
    idx = arg.nextIndex;
  }

  return args;
}

