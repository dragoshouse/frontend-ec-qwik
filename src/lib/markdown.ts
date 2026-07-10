export function convertWhatsAppMarkdown(text: string): string {
  if (!text) return "";
  let cleaned = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\\n/g, "\n");

  const boldPattern = /(^|[^\S\r\n\[\(\{>])\*(?!\s)([^*\n]+?)\*(?=[^\w*]|$)/g;
  cleaned = cleaned.replace(boldPattern, (_, leading, content) => `${leading}**${content}**`);

  const strikePattern = /(^|[^\S\r\n\[\(\{>])~(?!\s)([^~\n]+?)~(?=[^\w~]|$)/g;
  cleaned = cleaned.replace(strikePattern, (_, leading, content) => `${leading}~~${content}~~`);

  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  return cleaned.trim();
}

function cleanupMarkdown(input: string): string {
  let normalized = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\\n/g, "\n");
  normalized = normalized.replace(/\n{3,}/g, "\n\n");

  const lines = normalized.split("\n").map((line) => line.trimEnd());
  const buffer: string[] = [];
  let previousHadText = false;

  for (const line of lines) {
    const hasText = line.trim().length > 0;

    if (hasText && previousHadText) {
      buffer.push("");
    } else if (!hasText && previousHadText) {
      buffer.push("");
    } else if (!hasText) {
      previousHadText = false;
      continue;
    }

    buffer.push(line.trimEnd());
    previousHadText = hasText;
  }

  return buffer.join("\n").trim();
}

function renderParagraphs(
  text: string,
  paragraphClass: string,
  strongClass: string,
): string {
  const converted = convertWhatsAppMarkdown(cleanupMarkdown(text));
  if (!converted) return "";

  return converted
    .split("\n\n")
    .filter((p) => p.trim())
    .map((p) => {
      const withBold = p.replace(/\*\*([^*]+)\*\*/g, `<strong class="${strongClass}">$1</strong>`);
      const withStrike = withBold.replace(
        /~~([^~]+)~~/g,
        '<del class="line-through opacity-60">$1</del>',
      );
      return `<p class="${paragraphClass}">${withStrike.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("");
}

/** Hero description — centered, 14px mobile / 20px desktop */
export function renderCenteredMarkdown(text: string): string {
  return renderParagraphs(
    text,
    "mb-4 last:mb-0 text-sm md:text-xl text-navy tracking-[0.2px] leading-[1.5] font-normal text-center",
    "font-bold",
  );
}

/** Cancellation policy — centered, 14px mobile / 16px desktop */
export function renderPolicyMarkdown(text: string): string {
  return renderParagraphs(
    text,
    "mb-4 last:mb-0 text-sm md:text-base text-navy tracking-[0.2px] leading-[1.5] font-normal text-center",
    "font-bold",
  );
}

/** Default left-aligned markdown for experience pages */
export function renderMarkdown(text: string): string {
  return renderParagraphs(
    text,
    "mb-3 leading-relaxed",
    "font-semibold",
  );
}

export function convertWhatsAppMarkdownToPlain(text: string): string {
  return convertWhatsAppMarkdown(text);
}
