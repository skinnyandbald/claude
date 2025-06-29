# Memory Builder Configuration

Technical reference for the MemoryBuilder configuration system that processes YAML profiles into JSONL entities for Claude's memory system. Configure build behavior, validation rules, and output generation through `builder.yaml` settings.

## Build Settings

Controls profile processing order, file inclusion, and error handling behavior.

```yaml
build:
  commonDirectory: common
  autoDetectProfiles: false
  profiles:
    - creative.yaml
    - engineer.yaml
    - humanist.yaml
    - researcher.yaml
  profilesDirectory: profiles
  processCommonFirst: true
  processAdditionalFiles: false
  stopOnCriticalError: true
```

Key options:

- **`autoDetectProfiles`** - When `true`, automatically discovers all `.yaml` files; when `false`, uses explicit `profiles` list
- **`processCommonFirst`** - When `true`, processes common infrastructure files before individual profiles
- **`stopOnCriticalError`** - When `true`, halts build on any file processing error

## Path Configuration

Defines directory locations for external dependencies and tool integration.

```yaml
path:
  conversations: ~/github/claude/conversations
  diary: ~/github/claude/diary
  tool: ~/github/claude/tools/memory
```

> [!NOTE]
> The `conversations` and `diary` directory paths support flexible location configuration including network shares, NAS servers accessed through SMB/NFS mounts, or cloud storage mount points. Use absolute paths for external locations (e.g., `/Volumes/NAS/claude-data/conversations`) or relative paths from the repository root.

Profile YAML files can reference these paths using `{path.conversations}`, `{path.diary}`, and `{path.tool}` placeholders.

## Output Configuration

Controls generation and format of the memory system file.

```yaml
output:
  path: ./config/server.json
  format: jsonl
```

> [!IMPORTANT]
> Relative paths in `output.path` are resolved from the tool directory location.

Output is `jsonl` format with one entity per line.

## Performance Configuration

Controls build performance monitoring.

```yaml
performance:
  showStatistics: true
  showBuildTime: true
```

Monitoring options:

- **`showStatistics`** - Displays entity type counts and profile breakdown
- **`showBuildTime`** - Shows build duration and entities per second

## Logging Configuration

Controls console output verbosity and progress reporting.

```yaml
logging:
  showProgress: true
  showFileDetails: true
```

Logging options:

- **`showProgress`** - Displays build progress messages
- **`showFileDetails`** - Shows individual file processing status

## Configuration Examples

Development build:

```yaml
build:
  autoDetectProfiles: true
  stopOnCriticalError: false
logging:
  showFileDetails: true
```

Production build:

```yaml
build:
  autoDetectProfiles: false
  stopOnCriticalError: true
logging:
  showProgress: false
  showFileDetails: false
```

## File Processing Order

1. Common infrastructure files (if `processCommonFirst: true`)
2. Explicit profile files in `profiles` list order
3. Additional discovered files (if `processAdditionalFiles: true`)

## Error Handling Strategy

The `stopOnCriticalError` setting determines build behavior:
- **true:** Stop immediately on file processing errors
- **false:** Continue processing remaining files, skip failed ones
