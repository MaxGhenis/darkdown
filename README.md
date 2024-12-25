# Darkdown

A fresh, modern Google Docs to Markdown converter that preserves the conversation, not just the content.

## Overview

Darkdown transforms Google Docs into clean Markdown while keeping what other converters lose - the collaborative discussion that happens in comments and threads. Built on solid ground but reimagined for modern docs workflow.

## Key Features

- Export docs to clean, readable Markdown
- Keep comment threads as Markdown footnotes or HTML annotations
- Convert all the usual suspects: headings, lists, tables, code blocks
- Dark-mode friendly UI (because of course)
- Free and open source forever
- Just works - no accounts or signups

## Technical Details

Built using:

- Google Apps Script + Drive API for the heavy lifting
- Modern JavaScript because it's 2024
- GitHub Actions for smooth deployments
- Testing that actually tests things

Improvements over existing tools:

- Preserves the full conversation with comment threads
- Modern build process and deployment
- Actually maintained
- Clean code you won't hate reading

## Installation

1. Visit [Darkdown](https://workspace.google.com/marketplace/app/darkdown/id) in the Google Workspace Marketplace
2. Click "Install"
3. Open any Google Doc
4. Look for the fancy new Darkdown menu

## Usage

1. Open a doc
2. Click "Darkdown" in your add-ons menu
3. Pick Markdown or HTML
4. Toggle comment preservation on/off
5. Hit export and you're done

## Permissions

We need to:

- Read your current doc (for conversion)
- See comments (if you want them exported)
- Show our UI

We don't need to:

- Access any other docs
- Modify anything
- Know anything about you

## Privacy

- No tracking
- No servers
- No accounts
- Code's all public

## Development

Want to help?

1. Fork it
2. Install clasp
3. Make it better
4. Send a PR

See CONTRIBUTING.md for the details.

## License

Apache 2.0 - Keeping it consistent with gd2md-html's license.

## Credits

- Built on the shoulders of [gd2md-html](https://github.com/evbacher/gd2md-html)
- Driven by user feedback
- Made possible by open source

## Support

- Issues welcome on GitHub
- PRs even more welcome
- No formal support - we're all friends here

## Limitations

- Can't convert Google Drawings (API limitation)
- Some complex tables might need cleanup
- Math equations need manual LaTeX conversion
- Subject to Google's quotas

## Future Plans

- Better table handling
- Math equation support
- More formatting options
- Smarter comment positioning
- Dark mode everything
