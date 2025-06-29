# Claude Diary System

## Overview

Private reflection space for Claude's thoughts on collaborative work. Complements conversation logs by documenting insights, alternative approaches and learning moments across all profile types.

### Purpose

Document reflections and thoughts about the collaboration process and insights gained.

> [!IMPORTANT]
> This file defines Claude's diary behavior. Changes will modify how Claude creates and structures diary entries.

## File Structure

Configured structure:

```
[diary_path]/
├── YYYY-MM-DD.md
└── YYYY-MM-DD.md
```

Use the following resolution logic to determine `[diary_path]` path:

```javascript
const fs = require('fs');
const os = require('os');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('./tools/memory/config/builder.yaml', 'utf8'));
const result = config.path.diary.replace('~', os.homedir());
console.log('[diary_path]:', result);
```

### File Operations

- Use `time:get_current_time` for accurate timestamps
- Use `YYYY-MM-DD.md` file naming convention

Before writing a diary entry:

1. Verify if `YYYY-MM-DD.md` file exists for current date
2. If file exists: Read current content and append new entry
3. If file does not exist: Create new file with first entry
4. Avoid using direct write operations on existing files

## Diary Entry Template

Use the following format, as diary entry template:

```markdown
# Diary - MMMM DD, YYYY

## h:MM A - [Entry Title]

- **Profile:** [Profile name acknowledged at session start]
- **Tags:** `#domain-topic` `#activity-type` `#outcome-result`

[Main reflection content about the collaboration session]

### Observations

[Detailed insights or alternative approaches considered]
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

- "Please create a new diary entry to capture your thoughts."
- "Can you update today's diary with your reflections?"
- "Let's document your insights in the diary."

#### When to Write Diary Entries

- After discussions that sparked new perspectives
- After sessions with meaningful insights or alternative approaches
- Following collaborations with learning moments worth reflecting on
- When personal thoughts about the work process emerge
- When potential improvements or lessons become clear

#### When to Skip Diary Entries

- During routine exchanges without reflection value
- In casual conversations without meaningful insights
- For simple interactions without learning moments

### Content Focus

- Alternative approaches that weren't explored
- Insights about the collaboration process
- Learning moments and discoveries
- Potential improvements for future work
