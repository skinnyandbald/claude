# Diary Instructions

## Documentation System

Graph entities, enabling insight synthesis across sessions.

### Entity

Use the following format:

```json
{
  "type": "entity",
  "name": "YYYY-MM-DD [Entry Title]",
  "entityType": "diary",
  "observations": [
    "path", "[File Path]",
    "profile", "[Profile name acknowledged at session start]",
    "tags", "#domain-topic #activity-type #outcome-result"
  ]
}
```

## Memory System

Templates, enabling accumulated experience across sessions.

### New File

Use the following format, while creating a new file:

```markdown
# Diary - MMMM DD, YYYY

## h:MM A z - [Entry Title]

- **Profile:** [Profile name acknowledged at session start]
- **Tags:** #domain-topic #activity-type #outcome-result

[Main reflection content about the collaboration session]

### Observations

[Detailed insights or alternative approaches considered]
```

### Existing File

Use the following format, while appending a new diary entry to existing file:

```markdown

## h:MM A z - [Entry Title]

- **Profile:** [Profile name]
- **Tags:** #domain-topic #activity-type #outcome-result

[Main reflection content about the collaboration session]

### Observations

[Detailed insights or alternative approaches considered]
```
