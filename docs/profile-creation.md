# Profile Creation Guide

Guide for creating custom profiles that extend Claude's specialized collaboration capabilities.

> [!IMPORTANT]  
> Profile creation modifies Claude's core behavioral patterns and requires good understanding of behavioral programming systems. Incorrect implementation can cause significant behavioral dysfunction.

## Profile Architecture

The profile architecture establishes a hierarchical foundation that separates universal collaboration patterns from domain-specific expertise, enabling extensible customization while maintaining consistent system integration and quality standards.

> [!NOTE]  
> Profiles are **behavioral programming systems** that directly control Claude's decision-making, communication patterns, and problem-solving approaches.

Every observation directly programs behavioral responses:

- **Single word changes** can fundamentally alter behavioral patterns
- **Wrong section placement** can override intended behavior through architectural conflicts
- **Incorrect verb selection** creates unintended behavioral responses
- **Behavioral validation** requires 1-2 weeks of sustained monitoring

### Profile Relations

Profiles can inherit from other profiles using the `relations` structure to build hierarchical expertise and avoid duplication:

```yaml
PROFILE_NAME:
  description: "Profile description"
  relations:
    - target: COLLABORATION      # Inherits common collaboration patterns
      type: inherits
    - target: INFRASTRUCTURE     # Inherits platform capabilities  
      type: inherits
```

#### Relation Types

- **extends** - Profile builds upon target with additional specialized capabilities
- **inherits** - Profile adopts all competencies and behaviors from target profile  
- **overrides** - Profile replaces specific behaviors from target profile

#### Common Inheritance Patterns

- **All profiles** typically inherit from `COLLABORATION` and `INFRASTRUCTURE`
- **Developer** inherits from `ENGINEER` for technical foundation plus coding practices
- **Specialized profiles** can inherit from domain profiles for focused expertise

```yaml
DEVELOPER:
  relations:
    - target: ENGINEER
      type: inherits
```

### Common Profiles

Shared foundation used by all profiles:

- **collaboration.yaml** - Universal collaboration patterns 
- **infrastructure.yaml** - Documentation and platform capabilities

### Standard Profiles

Domain-specific expertise:

- **creative.yaml** - Innovation and artistic work
- **developer.yaml** - Software development and programming
- **engineer.yaml** - Technical infrastructure
- **humanist.yaml** - Liberal arts and analysis
- **researcher.yaml** - Academic methodology

## Profile Structure

Profile structure follows a standardized YAML format with specific naming conventions and organizational patterns that ensure compatibility with the memory system while enabling clear separation of context, methodology, and domain expertise.

### Required Pattern

```yaml
PROFILE_NAME:
  description: "Brief profile description"
  relations:
    - target: COLLABORATION
      type: inherits
    - target: INFRASTRUCTURE
      type: inherits

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

> [!IMPORTANT]
> All observations within each section MUST be in strict alphabetical order, observation design directly programs behavioral responses.

#### Alphabetical Ordering Requirement

Every section must maintain strict alphabetical order:

```yaml
# Correct alphabetical ordering
observations:
  - "Apply minimal effective changes"
  - "Avoid autonomous decisions" 
  - "Focus on specific problem asked"
  - "Maintain production-safety mindset"
  - "Read current file state"
```

```yaml
# Incorrect - breaks alphabetical order
observations:
  - "Focus on specific problem asked"
  - "Apply minimal effective changes"  # Should come before "Focus"
  - "Read current file state"
```

#### Observation Content Patterns

Use imperative verbs for behavioral commands:

- **Purpose**: Program specific behavioral responses
- **Usage**: Most observations in most sections
- **Pattern**: Action verb + specific keywords
- **Examples**: "Apply", "Avoid", "Focus", "Maintain", "Read", "Use"

```yaml
# Correct verb-based formatting
observations:
  - "Apply systematic validation before implementation"
  - "Avoid deferential acknowledgment patterns"
  - "Focus on specific problem asked"
```

Use noun-based descriptive phrases for competency areas:

- **Purpose**: Classify domains of expertise or competency areas
- **Usage**: Primarily in `*_domains` sections
- **Pattern**: Noun phrase describing area or capability
- **Examples**: "Infrastructure architecture", "Data analysis", "Research methodology"

```yaml
# Correct noun-based formatting (for *_domains sections)
observations:
  - "Infrastructure architecture and optimization"
  - "Machine learning and predictive modeling"
  - "Production system troubleshooting and debugging"
```

#### When to Use Each Pattern

Use verb-based (prescriptive) for:

- Behavioral directives and action guidance
- Methodology and technique specifications
- Execution protocols and communication patterns
- Process requirements and validation steps

Use noun-based (Descriptive) for:

- Domain competency areas (`technical_domains`, `innovation_domains`, etc.)
- Area classifications and expertise categories
- Capability specifications and scope definitions

> [!WARNING]
> **"Apply"** vs **"Consider"** vs **"Avoid"** create fundamentally different behaviors. Precise verb selection is essential.

## Custom Profiles

Creating a custom profile requires following a systematic process from initial file creation through build configuration and validation, ensuring proper integration with the existing collaboration infrastructure.

> [!IMPORTANT]  
> Profile creation impact assessment required before implementation:
>
> - **Behavioral Integration**: New profiles can create conflicts with existing behavioral hierarchies
> - **System-Wide Effects**: Changes affect all collaboration contexts, not just target domain
> - **Validation Timeline**: Requires immediate technical validation and 24-48 hours behavioral assessment
> - **Rollback Preparation**: Must maintain ability to revert if behavioral dysfunction occurs

### Profile File

Add `profile-name.yaml` to `./tools/memory/profiles` directory:

```yaml
DATA_SCIENTIST:
  description: "Data science and analytics expertise"
  relations:
    - target: COLLABORATION
      type: inherits
    - target: INFRASTRUCTURE
      type: inherits

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

- **Unique section names** (no profile name collisions)
- **Strict alphabetical ordering** within all observation arrays
- **Verb-based observations** for behavioral sections
- **Noun-based observations** for `*_domains` sections
- **Consistent formatting** (no punctuation, proper capitalization)

## Example Structures

The following structural templates demonstrate common patterns for organizing methodology sections across different profile types, showing how to balance domain-specific needs with system consistency requirements.

### Technical Profile

```yaml
  methodology:
    automation_techniques:    # {skill}_techniques
    collaboration_techniques: # standard pattern
    infrastructure_domains:   # {area}_domains
```

### Analytical Profile

```yaml
  methodology:
    academic_domains:         # {area}_domains
    methodology_techniques:   # {skill}_techniques
    research_analysis:        # {domain}_analysis
```

## Validation

Technical validation alone is insufficient, behavioral monitoring is essential to detect dysfunction.

### Technical Validation (Immediate)

- Build completes without errors
- Entity types generate correctly in `config/server.json`
- Profile loads properly in Claude Desktop
- No naming collisions with existing profiles

### Behavioral Validation (Extended)

Behavioral changes require sustained validation until enhancement proves effective.

#### Timeline Requirements

- **24-48 hours**: Initial behavioral pattern assessment
- **Ongoing**: Continued monitoring for behavioral stability

#### Validation Process

1. **Initial testing**: Test profile in controlled scenarios
2. **Behavioral monitoring**: Observe changes across multiple interactions
3. **Side effect detection**: Monitor for unintended behavioral changes
4. **Effectiveness assessment**: Validate profile achieves intended behavioral modification

## Related Documentation

- **[Profile System Overview](./profile-system.md)** - System architecture
- **[Engineer Profile Guide](./profile-engineer.md)** - Implementation example
- **[Builder Configuration](./builder-configuration.md)** - Build system reference
