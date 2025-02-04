function buildCommentIndex(comments, bodyText) {
  const commentIndex = [];
  
  // First pass: Find section headers and their positions
  const sections = findSectionHeaders(bodyText);
  
  comments.forEach(comment => {
    try {
      if (comment.quotedText) {
        const quote = cleanHtmlContent(comment.quotedText);
        
        // First try to match against section headers
        const sectionMatch = sections.find(section => 
          section.title.toLowerCase().includes(quote.toLowerCase()) ||
          quote.toLowerCase().includes(section.title.toLowerCase())
        );
        
        if (sectionMatch) {
          commentIndex.push({
            position: sectionMatch.position,
            length: sectionMatch.title.length,
            content: comment.content,
            author: comment.author,
            created: comment.created,
            replies: comment.replies,
            quote: quote,
            isSection: true
          });
          Logger.log('Matched comment to section:', {
            section: sectionMatch.title,
            quote: quote,
            content: comment.content
          });
        } else {
          // Try exact text matching
          const position = bodyText.indexOf(quote);
          if (position >= 0) {
            commentIndex.push({
              position: position,
              length: quote.length,
              content: comment.content,
              author: comment.author,
              created: comment.created,
              replies: comment.replies,
              quote: quote
            });
            Logger.log('Found exact position for comment:', {
              quote: quote,
              position: position,
              content: comment.content
            });
          } else {
            // Try fuzzy matching as last resort
            const fuzzyMatch = findBestMatch(quote, bodyText);
            if (fuzzyMatch) {
              commentIndex.push({
                position: fuzzyMatch.index,
                length: fuzzyMatch.length,
                content: comment.content,
                author: comment.author,
                created: comment.created,
                replies: comment.replies,
                quote: quote,
                fuzzyMatched: true
              });
              Logger.log('Found fuzzy match for comment:', {
                quote: quote,
                position: fuzzyMatch.index,
                content: comment.content
              });
            } else {
              Logger.log('Could not find position for comment:', {
                quote: quote,
                content: comment.content
              });
            }
          }
        }
      } else {
        Logger.log('Comment missing quoted text:', comment);
      }
    } catch (e) {
      Logger.log('Error processing comment:', e.toString());
    }
  });
  
  // Sort comments by position
  return commentIndex.sort((a, b) => a.position - b.position);
}

function findSectionHeaders(bodyText) {
  const sections = [];
  const lines = bodyText.split('\n');
  let position = 0;
  
  lines.forEach(line => {
    // Match markdown headers (# or ## or ###)
    if (line.match(/^#{1,3}\s/)) {
      const title = line.replace(/^#+\s/, '').trim();
      sections.push({
        title: title,
        position: position,
        line: line
      });
    }
    position += line.length + 1; // +1 for newline
  });
  
  return sections;
}

function findBestMatch(needle, haystack) {
  // Normalize both strings
  needle = cleanHtmlContent(needle).toLowerCase();
  haystack = haystack.toLowerCase();
  
  let bestMatch = null;
  let bestLength = 0;
  const minMatchLength = 10;
  
  // Try to find the longest matching substring
  for (let i = 0; i < haystack.length - minMatchLength; i++) {
    for (let j = 0; j < needle.length; j++) {
      let k = 0;
      while (i + k < haystack.length && 
             j + k < needle.length && 
             haystack[i + k] === needle[j + k]) {
        k++;
      }
      if (k > bestLength && k >= minMatchLength) {
        bestLength = k;
        bestMatch = {
          index: i,
          length: k
        };
      }
    }
  }
  
  // Only return matches that are significant enough
  return bestLength > needle.length / 2 ? bestMatch : null;
}

function getCommentsForText(text, position, commentIndex, isHeader = false) {
  const textEnd = position + text.length;
  return commentIndex.filter(comment => {
    // For headers, match section comments specifically
    if (isHeader && comment.isSection) {
      return text.toLowerCase().includes(comment.quote.toLowerCase()) ||
             comment.quote.toLowerCase().includes(text.toLowerCase());
    }
    // For regular text, use position-based matching
    const commentEnd = comment.position + comment.length;
    return (position <= commentEnd && textEnd >= comment.position) &&
           (!comment.isSection || isHeader);
  });
}

function formatCommentFootnotes(footnoteMap) {
  if (footnoteMap.size === 0) return '';
  
  let footnotes = '\n---\n\n### Comments\n\n';
  
  // Sort by the assigned footnote number
  const sortedEntries = Array.from(footnoteMap.entries())
    .sort((a, b) => a[1].number - b[1].number);
  
  for (const [commentId, {number, comment}] of sortedEntries) {
    footnotes += `[^${number}]: **${comment.author}** `;
    footnotes += `(${new Date(comment.created).toLocaleString()}): ${comment.content}\n`;
    
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach(reply => {
        const replyDate = new Date(reply.created).toLocaleString();
        footnotes += `    > **${reply.author}** (${replyDate}): ${reply.content}\n`;
      });
    }
    footnotes += '\n';
  };
  
  return footnotes;
}