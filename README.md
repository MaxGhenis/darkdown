# Darkdown

Google Docs to Markdown with comments — MCP server, CLI, and Google Workspace add-on.

## Overview

Darkdown gives you programmatic access to any Google Doc as clean Markdown with full comment context. Unlike Google's native markdown export, darkdown preserves comment threads with anchor text — the actual text each comment is attached to.

## Features

- Convert Google Docs to clean Markdown (headings, lists, tables, inline formatting)
- Preserve comment threads with anchor text context
- Inline footnote-style or appendix-style comment placement
- MCP server for Claude Code integration
- CLI for scripts and terminal use
- Google Workspace add-on for in-browser use

## Installation

```bash
# Clone and install
git clone https://github.com/MaxGhenis/darkdown.git
cd darkdown
uv sync
```

Requires a Google OAuth token at `~/.config/policyengine/google-token-policyengine.json` with `drive` and `documents` scopes.

## Usage

### CLI

```bash
# Read a doc as markdown with inline comments
darkdown read DOC_ID_OR_URL

# Appendix-style comments
darkdown read DOC_ID --comment-mode appendix

# Without comments
darkdown read DOC_ID --no-comments

# Save to file
darkdown read DOC_ID -o output.md

# List just the comments
darkdown comments DOC_ID

# Get doc metadata
darkdown metadata DOC_ID
```

### MCP server (Claude Code)

Register in your Claude Code config:

```bash
claude mcp add -s user darkdown uv --directory ~/darkdown run mcp run darkdown.mcp_server:mcp
```

Three tools available:
- **`read_doc`** — Full doc as markdown with comments
- **`list_comments`** — Just comments with anchor text
- **`doc_metadata`** — Title, owner, last modified

### Google Workspace add-on

The legacy add-on is in `apps-script/`. See the [Workspace Marketplace](https://workspace.google.com/marketplace) for installation.

## Development

```bash
uv sync --extra dev
uv run pytest -v          # 55 tests
uv run ruff check src/    # lint
```

## License

Apache 2.0
