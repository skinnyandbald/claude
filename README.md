# Claude Collaboration Infrastructure

Professional AI collaboration framework with specialized profiles, persistent memory, and systematic methodologies for technical work.

## Architecture

See below the project architecture and design.

### Collaboration Profiles

- **Engineer** - Infrastructure, Kubernetes, production systems, debugging
- **Creative** - Innovation, design thinking, artistic collaboration
- **Humanist** - Analysis, writing, philosophy, literary research
- **Researcher** - Academic methodology, data analysis, evidence evaluation

### Memory System

- Conversation logs preserve collaborative work across sessions
- Diary entries capture insights and reflection
- Profile configurations maintain specialized competencies
- Temporal awareness enables cumulative expertise building

### Strategic Value

Creates authentic technical partnership with institutional memory. Each session builds cumulative knowledge rather than stateless interaction, delivering productivity gains equivalent to working with a team member who has perfect recall of all architectural decisions.

## Quick Start

> [!IMPORTANT]
> Node.js is required, install it via [nodejs.org](https://nodejs.org) or system package manager.

Run the following commands, into terminal:

```bash
cd ./tools/memory
npm install js-yaml
npm init -y
node ./lib/PackageBuilder.js
npm run build
```

Example of profile activation for Claude Desktop project instructions:

```
# Profile Instructions

On conversation start, Claude must:
1. Execute `memory:read_graph` to access complete memory system
2. Acknowledge temporal awareness
3. Load the ENGINEER profile methodology and competencies
```

> [!NOTE]
> On conversation start, use for example the following trigger to evaluate the profile methodology:
>
> *Please detail the loaded profile methodology.*

## Key Features

See below the core infrastructure capabilities.

### Conversation Logs

Structured documentation of collaboration sessions preserves technical decisions and outcomes across time. Each session captures metadata, implementation details, and architectural choices for institutional memory building.

### Diary System

Private reflection space complements factual logs with insights and alternative approaches. Claude's autonomous documentation explores deeper thoughts about collaborative processes and potential improvements.

### Profile Specialization

Curated competencies and systematic methodologies ensure reliable professional-level collaboration. Each profile maintains domain-specific expertise and established workflows for consistent technical partnership.

## Repository Structure

```
├── conversations/        # Collaboration session logs
├── diary/                # Private reflections and insights
├── docs/                 # Complete documentation
├── tools/
│   ├── desktop/          # Claude Desktop setup
│   └── memory/           # Profile builder and configuration
└── .gitignore            # Privacy protection
```

## Documentation

- **[User Guide](docs/README.md)** - Complete system documentation
- **[Memory Builder](tools/memory/README.md)** - System architecture
- **[Profile Creation](tools/memory/profiles/README.md)** - Custom profile development
- **[Conversations](conversations/README.md)** - Session documentation
- **[Diary](diary/README.md)** - Reflection system
