function testMarkdownExport() {
  const markdown = convertToMarkdownWithComments();
  Logger.log('Generated markdown length:', markdown.length);
  Logger.log('\nMarkdown content:');
  Logger.log(markdown);
  return markdown;
}