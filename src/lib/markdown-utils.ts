/**
 * Simple markdown-like parser for material content
 * Supports:
 * - Headings: # H1, ## H2, ### H3, etc.
 * - Newlines: Converts \n to <br>
 * - Preserves whitespace
 */

export function parseMarkdownToHtml(text: string): string {
  if (!text) return "";

  // Split by lines
  const lines = text.split("\n");
  const htmlLines: string[] = [];

  for (const line of lines) {
    // Check for headings (must be at start of line)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      const level = headingMatch[1].length; // Number of # symbols
      const content = headingMatch[2].trim();
      htmlLines.push(
        `<h${level} class="markdown-heading markdown-h${level}">${escapeHtml(
          content
        )}</h${level}>`
      );
    } else if (line.trim() === "") {
      // Empty line
      htmlLines.push("<br>");
    } else {
      // Regular text - preserve the line
      htmlLines.push(`<p class="markdown-paragraph">${escapeHtml(line)}</p>`);
    }
  }

  return htmlLines.join("\n");
}

/**
 * Convert simple text with newlines to HTML
 * Preserves newlines and basic formatting
 */
export function textToHtml(text: string): string {
  if (!text) return "";

  // Preserve newlines by converting to <br>
  return text
    .split("\n")
    .map((line) => {
      if (line.trim() === "") {
        return "<br>";
      }
      return `<p class="mb-2">${escapeHtml(line)}</p>`;
    })
    .join("\n");
}

/**
 * Enhanced markdown parser with more features
 * Supports:
 * - Headings: #, ##, ###, etc.
 * - Bold: **text** or __text__
 * - Italic: *text* or _text_
 * - Lists: - item or * item
 * - Numbered lists: 1. item
 * - Newlines preserved
 */
export function parseEnhancedMarkdown(text: string): string {
  if (!text) return "";

  const lines = text.split("\n");
  const htmlLines: string[] = [];
  let inList = false;
  let inOrderedList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      // Close any open lists
      if (inList) {
        htmlLines.push("</ul>");
        inList = false;
      }
      if (inOrderedList) {
        htmlLines.push("</ol>");
        inOrderedList = false;
      }

      const level = headingMatch[1].length;
      const content = parseInlineMarkdown(headingMatch[2].trim());
      htmlLines.push(
        `<h${level} class="font-bold text-${
          7 - level
        }xl mb-3 mt-4">${content}</h${level}>`
      );
      continue;
    }

    // Check for unordered lists
    const unorderedListMatch = line.match(/^[\-\*]\s+(.+)$/);
    if (unorderedListMatch) {
      if (inOrderedList) {
        htmlLines.push("</ol>");
        inOrderedList = false;
      }
      if (!inList) {
        htmlLines.push('<ul class="list-disc ml-6 mb-2">');
        inList = true;
      }
      const content = parseInlineMarkdown(unorderedListMatch[1]);
      htmlLines.push(`  <li class="mb-1">${content}</li>`);
      continue;
    }

    // Check for ordered lists
    const orderedListMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (orderedListMatch) {
      if (inList) {
        htmlLines.push("</ul>");
        inList = false;
      }
      if (!inOrderedList) {
        htmlLines.push('<ol class="list-decimal ml-6 mb-2">');
        inOrderedList = true;
      }
      const content = parseInlineMarkdown(orderedListMatch[2]);
      htmlLines.push(`  <li class="mb-1">${content}</li>`);
      continue;
    }

    // Close lists if we're in one and hit a non-list line
    if ((inList || inOrderedList) && line.trim() !== "") {
      if (inList) {
        htmlLines.push("</ul>");
        inList = false;
      }
      if (inOrderedList) {
        htmlLines.push("</ol>");
        inOrderedList = false;
      }
    }

    // Empty line
    if (line.trim() === "") {
      htmlLines.push('<div class="h-4"></div>'); // Spacer
      continue;
    }

    // Regular paragraph with inline markdown
    const content = parseInlineMarkdown(line);
    htmlLines.push(`<p class="mb-2 leading-relaxed">${content}</p>`);
  }

  // Close any remaining lists
  if (inList) {
    htmlLines.push("</ul>");
  }
  if (inOrderedList) {
    htmlLines.push("</ol>");
  }

  return htmlLines.join("\n");
}

/**
 * Parse inline markdown (bold, italic)
 */
function parseInlineMarkdown(text: string): string {
  let result = escapeHtml(text);

  // Bold: **text** or __text__
  result = result.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="font-bold">$1</strong>'
  );
  result = result.replace(
    /__(.+?)__/g,
    '<strong class="font-bold">$1</strong>'
  );

  // Italic: *text* or _text_ (but not if already in bold)
  result = result.replace(
    /(?<!\*)\*([^\*]+?)\*(?!\*)/g,
    '<em class="italic">$1</em>'
  );
  result = result.replace(
    /(?<!_)_([^_]+?)_(?!_)/g,
    '<em class="italic">$1</em>'
  );

  return result;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Render content with markdown support
 * Auto-detects if content has markdown syntax
 */
export function renderContent(
  text: string,
  enableMarkdown: boolean = true
): string {
  if (!text) return "";

  if (!enableMarkdown) {
    return textToHtml(text);
  }

  // Check if content has markdown syntax
  const hasMarkdown =
    /^#{1,6}\s|^\*\s|^-\s|^\d+\.\s|\*\*.+?\*\*|__.+?__|(?<!\*)\*[^\*]+?\*(?!\*)/.test(
      text
    );

  if (hasMarkdown) {
    return parseEnhancedMarkdown(text);
  } else {
    return textToHtml(text);
  }
}

/**
 * Strip HTML tags and convert back to plain text
 * Used when loading content for editing
 */
export function stripHtmlTags(html: string): string {
  if (!html) return "";

  // Create a temporary div to parse HTML
  const temp = document.createElement("div");
  temp.innerHTML = html;

  // Get text content (this automatically strips all HTML tags)
  let text = temp.textContent || temp.innerText || "";

  // Clean up extra whitespace and newlines
  text = text.replace(/\n\n+/g, "\n\n"); // Collapse multiple newlines to double
  text = text.trim();

  return text;
}

/**
 * Convert HTML back to markdown-like text for editing
 * This preserves the structure but removes HTML tags
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return "";

  let text = html;

  // Replace heading tags with markdown syntax
  text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  text = text.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
  text = text.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n");
  text = text.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");

  // Replace strong/bold tags with markdown
  text = text.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  text = text.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");

  // Replace em/italic tags with markdown
  text = text.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  text = text.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");

  // Replace list items
  text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");

  // Remove ul/ol tags
  text = text.replace(/<\/?ul[^>]*>/gi, "\n");
  text = text.replace(/<\/?ol[^>]*>/gi, "\n");

  // Replace <br> and </p> with newlines
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n");
  text = text.replace(/<p[^>]*>/gi, "");

  // Replace <div> with newlines
  text = text.replace(/<\/div>/gi, "\n");
  text = text.replace(/<div[^>]*>/gi, "");

  // Remove any remaining HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  const temp = document.createElement("div");
  temp.innerHTML = text;
  text = temp.textContent || temp.innerText || "";

  // Clean up whitespace
  text = text.replace(/\n\n\n+/g, "\n\n"); // Max 2 consecutive newlines
  text = text.replace(/^\n+|\n+$/g, ""); // Remove leading/trailing newlines
  text = text.trim();

  return text;
}
