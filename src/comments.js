// comments.gs

function processCommentReplies(reply) {
  return {
    content: reply.content,
    author: reply.author.displayName,
    created: reply.createdTime
  };
}

function getDocumentComments() {
  const doc = DocumentApp.getActiveDocument();
  const docId = doc.getId();
  
  try {
    const commentsResponse = Drive.Comments.list(docId, {
      maxResults: 100,
      fields: '*'
    });
    
    if (!commentsResponse.comments) return [];
    
    return commentsResponse.comments.map(comment => ({
      id: comment.id,
      content: cleanHtmlContent(comment.content),
      author: comment.author.displayName,
      created: comment.createdTime,
      quotedText: comment.quotedFileContent ? 
        cleanHtmlContent(comment.quotedFileContent.value) : null,
      replies: (comment.replies || []).map(processCommentReplies)
    }));
  } catch (e) {
    Logger.log('Error getting comments:', e.toString());
    return [];
  }
}