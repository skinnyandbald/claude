# Claude Conversation Log System

## Overview

Documents collaborative work sessions to preserve context, decisions, and outcomes for future reference. Conversation logs capture the factual record of what happened during collaboration, including the actual work performed, insights developed, decisions made and outcomes achieved.

### Purpose

Record what happened during collaboration sessions and key outcomes achieved.

> [!IMPORTANT]
> This file defines Claude's conversation logging behavior. Changes will modify how Claude creates and structures logs.

## File Structure

Configured structure:

```
[conversations_path]/
├── YYYY-MM-DD-[topic-slug].md
└── YYYY-MM-DD-[another-topic-slug].md
```

Use the following resolution logic to determine `[conversations_path]` path:

```javascript
const fs = require('fs');
const os = require('os');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('./tools/memory/config/builder.yaml', 'utf8'));
const result = config.path.conversations.replace('~', os.homedir());
console.log('[conversations_path]:', result);
```

### File Operations

- Use `time:get_current_time` for accurate timestamps
- Use `YYYY-MM-DD-[topic-slug].md` file naming convention

### Topic Slug Guidelines

- Use 2-4 words maximum
- Use lowercase with hyphens
- Use `[domain]-[activity]` format

## Conversation Log Template

Use the following format, as conversation log template:

```markdown
# [Session Title]

- **Date:** MMMM DD, YYYY
- **Time:** h:MM A
- **Profile:** [Profile name acknowledged at session start]
- **Summary:** [Brief description]
- **Tags:** `#domain-topic` `#activity-type` `#outcome-result`

## Session Overview

[What was accomplished and main objectives]

## Key Accomplishments

[Topics covered, decisions made, outcomes achieved]

## Details

[Specific work, examples, methods, and implementation details]

## Outcomes and Next Steps

[What was completed and follow-up work identified]

---

**Session Duration:** [H hours M minutes]
**Collaboration Quality:** [Brief assessment]
```

### Tag Guidelines

- Include main subject area or domain covered in the session
- Include outcome or result type if applicable
- Include type of collaboration or activity performed
- Keep tags descriptive and searchable for future reference
- Use 2-4 content tags for searchability based on content evaluation
- Use lowercase with hyphens for multi-word tags

## Writing Guidelines

Trigger phrase examples:

- "Please document this session into a new conversation log."
- "Can you update the latest conversation log?"
- "Let's capture this collaboration for future reference."

### When to Write Conversation logs

- Collaborative sessions with meaningful work
- Development and creation work
- Knowledge transfer sessions
- Significant collaborations with major insights
- Strategic planning discussions

#### When to Skip Conversation logs

- Brief status checks
- Casual conversations
- Simple information requests

### Content Focus

- Actual dialogue and exchanges
- Collaboration dynamics
- Context and details
- Decision rationale
- Specific examples and methods
