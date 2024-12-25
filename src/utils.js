// utils.gs - Basic utility functions

function cleanHtmlContent(content) {
  if (!content) return '';
  return content
    .replace(/<[^>]*>/g, '')     // Remove HTML tags
    .replace(/&quot;/g, '"')     // Fix quotes
    .replace(/&#39;/g, "'")      // Fix apostrophes
    .replace(/&amp;/g, '&')      // Fix ampersands
    .replace(/\s+/g, ' ')        // Normalize whitespace
    .trim();
}

function formatText(text, attributes) {
  if (!text) return '';
  
  // Clean up text
  text = text
    .replace(/\*/g, '')   // Remove existing asterisks
    .replace(/_/g, '')    // Remove existing underscores
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Handle links first
  if (attributes.LINK_URL) {
    text = `[${text}](${attributes.LINK_URL})`;
  }
  
  // Apply other formatting
  if (attributes.BOLD && !text.startsWith('**')) {
    text = `**${text}**`;
  }
  if (attributes.ITALIC && !text.startsWith('*')) {
    text = `*${text}*`;
  }
  if (attributes.STRIKETHROUGH) {
    text = `~~${text}~~`;
  }
  
  return text;
}

// For debugging
function logObject(obj, label = '') {
  Logger.log(`${label}${JSON.stringify(obj, null, 2)}`);
}