# Memory Builder Configuration

Technical reference for the MemoryBuilder configuration system that processes YAML profiles into JSONL entities for Claude's memory system. Configure build behavior, validation rules, and output generation through `builder.yaml` settings.

## Build Settings

Controls profile processing order, file inclusion, error handling behavior, and output generation.

```yaml
build:
  processAdditionalFiles: false
  processCommonFirst: true
  stopOnCriticalError: true
  outputPath: ./config/server.json
  profiles:
    - creative.yaml
    - developer.yaml
    - engineer.yaml
    - humanist.yaml
    - researcher.yaml
  profilesPath:
    common: ./profiles/common
    standard: ./profiles
  relations:
    - extends
    - inherits
    - overrides
```

Key options:

- **`processAdditionalFiles`** - When `true`, processes additional files beyond the main profile list
- **`processCommonFirst`** - When `true`, processes common infrastructure files before individual profiles
- **`stopOnCriticalError`** - When `true`, halts build on any file processing error
- **`outputPath`** - Path to the generated memory server file (relative paths resolved from tool directory)
- **`profiles`** - Explicit list of profile files to process
- **`profilesPath.common`** - Path to shared infrastructure profiles directory
- **`profilesPath.standard`** - Path to individual profile files directory
- **`relations`** - Array of valid relation types for validation

## Logging Configuration

Controls console output verbosity and progress reporting.

```yaml
logging:
  showFileDetails: true
  showProgress: true
```

Logging options:

- **`showFileDetails`** - Shows individual file processing status
- **`showProgress`** - Displays build progress messages

## Path Configuration

Defines directory locations for external dependencies and tool integration.

```yaml
path:
  conversations: /Volumes/backup/claude/conversations
  diary: /Volumes/backup/claude/diary
  tool: ~/github/claude/tools/memory
```

Replace paths with your actual directory locations.

> [!NOTE]
> The `conversations` and `diary` directory paths support flexible location configuration including network shares, NAS servers accessed through SMB/NFS mounts, or cloud storage mount points. Use absolute paths for mounted directories (e.g., `/Volumes/backup/claude/conversations`) or home directory expansion (e.g., `~/Documents/claude/conversations`).

Profile YAML files can reference these paths using `{path.conversations}`, `{path.diary}`, and `{path.tool}` placeholders.

## Configuration Examples

Development build:

```yaml
build:
  stopOnCriticalError: false
  outputPath: ./config/server.json
  profiles:
    - engineer.yaml
logging:
  showFileDetails: true
```

Production build:

```yaml
build:
  stopOnCriticalError: true
  outputPath: ./config/server.json
  profiles:
    - creative.yaml
    - developer.yaml
    - engineer.yaml
    - humanist.yaml
    - researcher.yaml
logging:
  showProgress: false
  showFileDetails: false
```

Minimal configuration:

```yaml
build:
  outputPath: ./config/server.json
  profiles:
    - engineer.yaml
```

## File Processing Order

1. Common infrastructure files (if `processCommonFirst: true`)
2. Explicit profile files in `profiles` list order
3. Additional discovered files (if `processAdditionalFiles: true`)

## Error Handling Strategy

The `stopOnCriticalError` setting determines build behavior:

- **true:** Stop immediately on file processing errors
- **false:** Continue processing remaining files, skip failed ones
