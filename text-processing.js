function processTextElement(element) {
  let result = '';
  
  for (let i = 0; i < element.getNumChildren(); i++) {
    const child = element.getChild(i);
    if (child.getType() === DocumentApp.ElementType.TEXT) {
      const text = child.asText();
      let textStr = text.getText();
      
      if (!textStr) continue;
      
      const indices = text.getTextAttributeIndices();
      let currentIndex = 0;
      
      indices.forEach((index) => {
        if (index === currentIndex) return;
        
        let segment = textStr.substring(currentIndex, index);
        if (segment) {
          result += formatText(segment, text.getAttributes(currentIndex));
        }
        currentIndex = index;
      });
      
      if (currentIndex < textStr.length) {
        let segment = textStr.substring(currentIndex);
        if (segment) {
          result += formatText(segment, text.getAttributes(currentIndex));
        }
      }
    }
  }
  
  return result.trim();
}
