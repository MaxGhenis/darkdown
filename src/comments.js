function getCommentContents() {

    var commentDetails = getCommentIds();
  
    var commentString = getCommentDetailsWithReplies(commentDetails);
  
  }
  
  function getCommentIds() {
    var docId = DocumentApp.getActiveDocument().getId();
    var url = "https://www.googleapis.com/drive/v2/files/" + docId + "/comments";
    
    var params = {
      method: "get",
      headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
      muteHttpExceptions: true
    };
  
    var response = UrlFetchApp.fetch(url, params);
    var comments = JSON.parse(response.getContentText());
    
    if (!comments.items) {
      Logger.log("No comments found.");
      return [];
    }
    
    var commentIds = comments.items.map(function(comment) {
      return comment.commentId;
    });
  
    Logger.log("Comment IDs: " + commentIds);
    return commentIds;
  }
  
  function getCommentDetailsWithReplies(commentIds) {
    var docId = DocumentApp.getActiveDocument().getId();
    var url = "https://www.googleapis.com/drive/v2/files/" + docId + "/comments/";
    var headers = { Authorization: "Bearer " + ScriptApp.getOAuthToken() };
    var commentDetails = [];
  
    commentIds.forEach(function(commentId) {
      var response = UrlFetchApp.fetch(url + commentId, { method: "get", headers: headers });
      var comment = JSON.parse(response.getContentText());
  
      var commentData = JSON.parse(JSON.stringify({
        
        quotedText: comment.context ? comment.context.value : "No quoted text",
        createdTime: comment.createdDate || "Unknown", // Add created timestamp
        author: comment.author ? comment.author.displayName : "Unknown",
        content: comment.content,
        resolved: comment.status === "resolved" // Check resolution status
      }));
  
      // Check if there are replies
      if (comment.replies && comment.replies.length > 0) {
        var filteredReplies = comment.replies
          .filter(reply => reply.content && reply.content.trim() !== "") // Exclude empty replies
          .map(reply => ({
            author: reply.author ? reply.author.displayName : "Unknown",
            content: reply.content
          }));
  
        // Only add "replies" key if there are valid replies
        if (filteredReplies.length > 0) {
          commentData.replies = filteredReplies;
        }
      }
  
      commentDetails.push(commentData);
    });
  
    Logger.log("Comment Details with Replies: " + JSON.stringify(commentDetails, null, 2));
    return JSON.stringify(commentDetails, null, 2);
  }