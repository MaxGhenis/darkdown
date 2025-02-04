function convertToMarkdownWithComments() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  let markdown = '';
  let listCounters = {};
  let currentPosition = 0;
  
  // Get comments and build the index
  const comments = getDocumentComments();
  Logger.log('Total comments found:', comments.length);
  
  const bodyText = body.getText();
  const commentIndex = buildCommentIndex(comments, bodyText);
  Logger.log('Comments indexed:', commentIndex.length);
  
  // Map to store comment footnotes in order of appearance
  const footnoteMap = new Map();
  let footnoteCounter = 1;
  
  // Process each block element
  for (let i = 0; i < body.getNumChildren(); i++) {
    const child = body.getChild(i);
    const type = child.getType();
    
    if (type === DocumentApp.ElementType.PARAGRAPH) {
      const para = child.asParagraph();
      const heading = para.getHeading();
      const text = para.getText();
      
      if (!text) {
        currentPosition += 1; // Account for newline
        continue;
      }
      
      let processedText = processTextElement(para);
      
      // Check if this is a header
      const isHeader = heading !== DocumentApp.ParagraphHeading.NORMAL;
      
      // Get comments for this text
      const relevantComments = getCommentsForText(
        text, 
        currentPosition, 
        commentIndex,
        isHeader
      );
      
      if (relevantComments.length > 0) {
        Logger.log('Found comments for text:', {
          text: text.substring(0, 50) + '...',
          isHeader: isHeader,
          comments: relevantComments.map(c => ({
            quote: c.quote,
            isSection: c.isSection
          }))
        });
        
        // Add comment references in order of appearance
        relevantComments.forEach(comment => {
          // Generate unique ID for each comment
          const commentId = `${comment.position}-${comment.quote}`;
          
          // Assign footnote number if not already assigned
          if (!footnoteMap.has(commentId)) {
            footnoteMap.set(commentId, {
              number: footnoteCounter++,
              comment: comment
            });
          }
          
          const footnoteNumber = footnoteMap.get(commentId).number;
          processedText += ` [^${footnoteNumber}]`;
        });
      }
      
      // Handle different heading levels
      if (heading === DocumentApp.ParagraphHeading.HEADING1) {
        markdown += '# ' + processedText + '\n\n';
      } else if (heading === DocumentApp.ParagraphHeading.HEADING2) {
        markdown += '## ' + processedText + '\n\n';
      } else if (heading === DocumentApp.ParagraphHeading.HEADING3) {
        markdown += '### ' + processedText + '\n\n';
      } else {
        markdown += processedText + '\n\n';
      }
      
      currentPosition += text.length + 1; // +1 for newline
    } 
    else if (type === DocumentApp.ElementType.LIST_ITEM) {
      const listItem = child.asListItem();
      const nestLevel = listItem.getNestingLevel();
      const indent = '  '.repeat(nestLevel);
      const glyphType = listItem.getGlyphType();
      const text = listItem.getText();
      
      if (!text) {
        currentPosition += 1;
        continue;
      }
      
      let processedText = processTextElement(listItem);
      
      // Check for comments in list items
      const relevantComments = getCommentsForText(
        text, 
        currentPosition, 
        commentIndex,
        false
      );
      
      if (relevantComments.length > 0) {
        Logger.log('Found comments for list item:', {
          text: text.substring(0, 50) + '...',
          comments: relevantComments.length
        });
        
        // Add comment references in order
        relevantComments.forEach(comment => {
          const commentId = `${comment.position}-${comment.quote}`;
          
          if (!footnoteMap.has(commentId)) {
            footnoteMap.set(commentId, {
              number: footnoteCounter++,
              comment: comment
            });
          }
          
          const footnoteNumber = footnoteMap.get(commentId).number;
          processedText += ` [^${footnoteNumber}]`;
        });
      }
      
      if (glyphType === DocumentApp.GlyphType.NUMBER) {
        if (!listCounters[nestLevel]) {
          listCounters[nestLevel] = 1;
        }
        markdown += `${indent}${listCounters[nestLevel]}. ${processedText}\n`;
        listCounters[nestLevel]++;
      } else {
        markdown += `${indent}* ${processedText}\n`;
      }
      
      currentPosition += text.length + 1;
    }
    // Skip other element types but account for their text in position tracking
    else if (type !== DocumentApp.ElementType.UNSUPPORTED) {
      try {
        currentPosition += child.getText().length + 1;
      } catch (e) {
        // Some elements might not support getText()
        Logger.log('Could not get text length for element type:', type);
      }
    }
  }
  
  // Add comment footnotes
  markdown += formatCommentFootnotes(footnoteMap);
  
  Logger.log('Generated markdown length:', markdown.length);
  Logger.log('Footnotes map size:', footnoteMap.size);
  
  return markdown;
}