function convertToMarkdown(config) {
    return convertToMarkdownWithComments(config);
}

function showSidebar() {
    var html = HtmlService.createHtmlOutputFromFile('sidebar')
        .setTitle('Darkdown');
    DocumentApp.getUi().showSidebar(html);
}