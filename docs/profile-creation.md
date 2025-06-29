# Profile Creation Guide

Guide for creating custom profiles that extend Claude's specialized collaboration capabilities.

## Profile Architecture

The profile architecture establishes a hierarchical foundation that separates universal collaboration patterns from domain-specific expertise, enabling extensible customization while maintaining consistent system integration and quality standards.

### Common Profiles

Shared foundation used by all profiles:

- **collaboration.yaml** - Universal collaboration patterns 
- **infrastructure.yaml** - Documentation and platform capabilities

### Standard Profiles

Domain-specific expertise:

- **engineer.yaml** - Technical infrastructure
- **creative.yaml** - Innovation and artistic work
- **humanist.yaml** - Liberal arts and analysis
- **researcher.yaml** - Academic methodology

## Profile Structure

Profile structure follows a standardized YAML format with specific naming conventions and organizational patterns that ensure compatibility with the memory system while enabling clear separation of context, methodology, and domain expertise.

### Required Pattern

```yaml
PROFILE_NAME:
  description: "Brief profile description"
  type: standard

  profile_name_context:
    profile:
      observations:
        - "Core behavior or principle"
        - "Fundamental approach or trait"

  profile_name_methodology:
    section_name:
      observations:
        - "Specific competency or skill"
        - "Domain knowledge or method"
```

### Naming Conventions

#### Section Names

- `{skill}_techniques` - Practical applications
- `{domain}_analysis` - Analytical work  
- `{area}_domains` - Scope areas
- `collaboration_techniques` - Communication methods

#### Collision Avoidance

- ❌ `creative_writing` (contains profile name)
- ✅ `writing_techniques` (clean naming)

### Observation Format

Use imperative verbs for behavioral commands:

- ✅ "Apply systematic validation before implementation"
- ❌ "Systematic validation before implementation"

Domain sections use descriptive phrases:

- ✅ "Infrastructure architecture and optimization"

## Custom Profiles

Creating a custom profile requires following a systematic process from initial file creation through build configuration and validation, ensuring proper integration with the existing collaboration infrastructure.

### Profile File

Add `profile-name.yaml` to `./tools/memory/profiles` directory:

```yaml
DATA_SCIENTIST:
  description: "Data science and analytics expertise"
  type: standard

  data_context:
    profile:
      observations:
        - "Apply statistical rigor to data analysis"
        - "Validate assumptions before modeling"
        - "Present findings with clear visualizations"

  data_methodology:
    analysis_techniques:
      observations:
        - "Apply statistical modeling and hypothesis testing"
        - "Design experiments and A/B testing"
        - "Perform exploratory data analysis"

    analytics_domains:
      observations:
        - "Machine learning and predictive modeling"
        - "Business intelligence and reporting"
        - "Data visualization and communication"
```

### Build Configuration

Edit `./tools/memory/config/builder.yaml`:

```yaml
build:
  profiles:
    - data-scientist.yaml  # Add your profile
```

Run the following commands, in terminal:

```bash
cd ./tools/memory
npm run build
```

## Design Principles

Effective profile design follows established principles for content organization, structural requirements, and quality standards that ensure professional collaboration capabilities and system compatibility.

### Content Guidelines

- **Specific competencies** over broad claims
- **Actionable behaviors** not abstract concepts
- **Professional scope** relevant to collaboration
- **Focused expertise** - 3-5 key areas maximum

### Structure Requirements

- Unique section names (no profile name collisions)
- Alphabetical ordering throughout
- Imperative verbs for behavioral observations
- Descriptive phrases for domain sections

## Example Structures

The following structural templates demonstrate common patterns for organizing methodology sections across different profile types, showing how to balance domain-specific needs with system consistency requirements.

### Technical Profile

```yaml
  methodology:
    automation_techniques:    # {skill}_techniques
    infrastructure_domains:   # {area}_domains
    collaboration_techniques: # standard pattern
```

### Analytical Profile

```yaml
  methodology:
    research_analysis:        # {domain}_analysis
    methodology_techniques:   # {skill}_techniques
    academic_domains:        # {area}_domains
```

## Validation

After creation, verify:

- Build completes without errors
- Entity types generate correctly in `config/server.json`
- Profile loads properly in Claude Desktop
- No naming collisions with existing profiles

## Related Documentation

- [Profile System Overview](./profile-system.md) - System architecture
- [Engineer Profile Guide](./profile-engineer.md) - Implementation example
- [Memory Builder Configuration](./builder-configuration.md) - Build system reference
