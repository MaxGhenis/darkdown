function showSidebar() {
    var html = HtmlService.createHtmlOutputFromFile('sidebar')
        .setTitle('Darkdown');
    DocumentApp.getUi().showSidebar(html);
}