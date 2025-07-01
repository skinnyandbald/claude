# Claude Desktop Setup

This comprehensive configuration guide covers the setup process for Claude Desktop with MCP tools required for full collaboration framework functionality, including installation, security configuration, and verification procedures.

## Prerequisites

> [!IMPORTANT]
> Claude Desktop with MCP tools is required for full profile functionality. Web interface and mobile apps provide conversation-only mode with limited capabilities.

Install Claude Desktop and required dependencies:

```bash
brew install --cask claude
```

Node.js and Python package managers are required for MCP tools:

- Node.js - Install via [nodejs.org](https://nodejs.org) or system package manager
- Python/uvx - For [time server](https://github.com/modelcontextprotocol/servers/tree/main/src/time) functionality

## Required Tools

The collaboration framework requires specific MCP tools for full functionality, divided into essential core components and optional enhancements that extend capabilities for specialized use cases.

### Core Tools

- **filesystem** - Profile building, configuration management, conversation logging
- **memory** - Multi-profile entity storage and retrieval  
- **sequential-thinking** - Complex problem-solving and analysis workflows
- **time** - Diary timestamps and session logging

### Optional Tools

- **kubernetes** - Infrastructure management for engineer profile
- **slack** - Team collaboration integration
- **puppeteer** - Web automation and testing capabilities

> [!NOTE]
> Core tools are essential for basic functionality. Optional tools enhance specific profile capabilities.

## Configuration

Run Claude Desktop once to initialize application structure, then close it.

### Configuration File

Create the Claude Desktop [configuration file](https://modelcontextprotocol.io/quickstart/user) with required MCP servers:

```json
{
  "globalShortcut": "",
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/github/claude"
      ]
    },
    "memory": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ],
      "env": {
        "MEMORY_FILE_PATH": "/Users/username/github/claude/tools/memory/config/server.json"
      }
    },
    "sequential-thinking": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sequential-thinking"
      ]
    },
    "time": {
      "command": "uvx",
      "args": [
        "mcp-server-time",
        "--local-timezone",
        "America/New_York"
      ]
    }
  }
}
```

> [!NOTE]
> Replace `/Users/username/github/claude` with your actual repository path and update `local-timezone` as needed.

### Secure Configuration

> [!IMPORTANT]
> Never commit unencrypted configuration files containing sensitive data. Use Ansible Vault encryption for files with API tokens or credentials.

Create symlink to configuration file:

```bash
cd ~/github/claude
rm -f ~/Library/Application\ Support/Claude/claude_desktop_config.json
ln -fs ./tools/desktop/configuration.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

Encrypt configuration for version control:

```bash
cd ~/github/claude
ansible-vault encrypt ./tools/desktop/configuration.json --output ./tools/desktop/configuration.json.enc
```

Decrypt configuration, when needed:

```bash
cd ~/github/claude
ansible-vault decrypt ./tools/desktop/configuration.json.enc --output ./tools/desktop/configuration.json
```

## Verification

Testing MCP tools functionality after configuration ensures proper integration and identifies any setup issues before beginning collaborative work sessions.

### Core Tool Testing

1. **Filesystem Access** - Claude can read/write repository files
2. **Memory System** - Profile loading works with `memory:read_graph`
3. **Time Functions** - Current time retrieval for diary entries
4. **Sequential Thinking** - Complex analysis workflows available

### Verification Steps

Start Claude Desktop and test functionality:

1. Begin conversation and verify profile acknowledgment
2. Request file reading to test filesystem access
3. Ask Claude to execute `memory:read_graph`
4. Test time functionality with diary entry creation

## Platform Adaptation

The collaboration framework automatically detects MCP tool availability:

- **MCP Available** - Full capabilities with Claude Desktop
- **MCP Unavailable** - Conversation-only mode for web/mobile interfaces

This enables optimal experience regardless of platform while maintaining consistent collaboration methodology.

## Troubleshooting

Common setup issues and systematic debugging procedures help resolve configuration problems and ensure reliable operation of the collaboration framework.

### Common Issues

- **Memory file not found** - Run memory builder to generate `server.json`
- **Filesystem access denied** - Check repository path permissions
- **Tools not loading** - Verify NPX/UVX installation and accessibility
- **Profile not acknowledging** - Confirm memory file path in configuration

### Debugging Process

1. Check Claude Desktop console for error messages
2. Verify configuration file syntax and paths
3. Ensure MCP server packages are available
4. Test individual tools using Claude Desktop inspection

## Related Documentation

- **[Profile System](./profile-system.md)** - Core collaboration architecture
- **[Builder Configuration](./builder-configuration.md)** - Memory builder reference
- **[Profile Creation](./profile-creation.md)** - Custom profile development
