# palettable-mcp

MCP server that gives AI agents color palette tools — generate harmonious palettes, check WCAG contrast, analyze accessibility, and explore color harmonies.

## Quick Setup

Add to your Claude Code settings (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "palettable": {
      "command": "npx",
      "args": ["palettable-mcp"]
    }
  }
}
```

Restart Claude Code. Done.

## Tools

| Tool | What it does |
|------|-------------|
| `generate_palette` | Generate harmonious colors using golden ratio hue distribution. Lock positions to keep colors you like. |
| `get_harmonies` | Get complementary, analogous, triadic, split-complementary, and tetradic harmonies for any color. |
| `check_contrast` | WCAG contrast ratio between two colors with AA/AAA pass/fail verdicts. |
| `suggest_text_color` | Best text color (white or black) for a given background. |
| `convert_color` | Convert between hex, RGB, and HSL formats. |
| `analyze_palette` | Audit an entire palette — contrast matrix, accessibility issues, per-color recommendations. |

## Flexible Input

Every tool accepts colors in any format:

- Hex: `#6C5CE7`, `6C5CE7`, `#6CE`
- RGB: `rgb(108, 92, 231)`
- HSL: `hsl(249, 75%, 63%)`

Every response includes all three formats.

## Example Usage

Once configured, just ask your AI agent things like:

- "Generate a color palette for my dashboard"
- "Check if white text is readable on #6C5CE7"
- "Analyze my app's colors for accessibility issues"
- "Get triadic harmonies for my brand color"

## License

MIT
