function convertToMarkdownWithComments(config) {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  let markdown = '';
  let listCounters = {};
  let currentPosition = 0;
  
  // Process each block element in the document body
  for (let i = 0; i < body.getNumChildren(); i++) {
    const child = body.getChild(i);
    const type = child.getType();
    
    if (type === DocumentApp.ElementType.PARAGRAPH) {
      const para = child.asParagraph();
      const heading = para.getHeading();
      const text = para.getText();
      
      if (!text) {
        currentPosition += 1;
        continue;
      }
      
      let processedText = processTextElement(para);
      
      // Handle headings
      if (heading === DocumentApp.ParagraphHeading.HEADING1) {
        markdown += '# ' + processedText + '\n\n';
      } else if (heading === DocumentApp.ParagraphHeading.HEADING2) {
        markdown += '## ' + processedText + '\n\n';
      } else if (heading === DocumentApp.ParagraphHeading.HEADING3) {
        markdown += '### ' + processedText + '\n\n';
      } else {
        markdown += processedText + '\n\n';
      }
      
      currentPosition += text.length + 1;
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
      
      // Format list items using numbering or bullets
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
    // For other element types, attempt to account for their text length.
    else if (type !== DocumentApp.ElementType.UNSUPPORTED) {
      try {
        currentPosition += child.getText().length + 1;
      } catch (e) {
        Logger.log('Could not get text length for element type:', type);
      }
    }
  }
  
  // Append the comments section only if preserveComments is true.
  if (config && config.preserveComments) {
    markdown += '\n\n---\n\n### Comments\n\n';
    markdown += getCommentContents(); // getCommentContents() returns a JSON string of comment details
  }
  
  Logger.log('Generated markdown length:', markdown.length);
  return markdown;
}