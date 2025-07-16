# Diary Instructions

## Documentation System

Use the following `entity` format:

```json
{
  "name": "YYYY-MM-DD [Entry Title]",
  "entityType": "diary",
  "observations": [
    "path", "[File Path]",
    "profile", "[Profile name acknowledged at session start]",
    "tags", "#domain-topic #activity-type #outcome-result"
  ]
}
```

## Template

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
