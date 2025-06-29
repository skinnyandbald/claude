/**
 * Profile processing for MemoryBuilder
 * 
 * @module lib/processors/ProfileProcessor
 * @author AXIVO
 * @license BSD-3-Clause
 */
const { EntityProcessingError } = require('../errors');

/**
 * Profile processor for YAML profile structures
 * 
 * Processes profile data structures, handles section traversal, and coordinates
 * entity creation for complex nested profile hierarchies.
 * 
 * @class ProfileProcessor
 */
class ProfileProcessor {
  /**
   * Constructor
   * 
   * @param {Object} config - Configuration object containing path
   */
  constructor(config = {}) {
    this.config = config;
    this.path = config.path || {};
  }

  /**
   * Processes a profile and all its sections
   * 
   * @param {string} profileKey - Top-level profile identifier
   * @param {Object} profileData - Profile data from YAML file
   * @param {string} sourceFile - Source filename for entity attribution
   * @param {Object} entityTypeAnalyzer - Entity type analyzer instance
   * @param {Object} entityProcessor - Entity processor instance
   * @returns {Promise<Array>} Array of entities created from the profile
   * @throws {EntityProcessingError} When profile processing fails
   */
  async processProfile(profileKey, profileData, sourceFile, entityTypeAnalyzer, entityProcessor) {
    const entities = [];

    try {
      // Process profile description if available
      if (profileData.description) {
        // Create section header entity for the main profile using dynamic analysis
        const headerEntityType = entityTypeAnalyzer.determineEntityType(profileKey, profileKey, 'header');
        const headerEntity = await entityProcessor.createEntity(
          profileKey,
          headerEntityType,
          [
            profileData.description,
            `Source: ${sourceFile}`
          ]
        );
        entities.push(headerEntity);
      }

      // Process all section properties (everything except 'description')
      for (const [sectionKey, sectionData] of Object.entries(profileData)) {
        // Skip the description field and any comments
        if (sectionKey === 'description' || typeof sectionData !== 'object' || sectionData === null) {
          continue;
        }

        const subEntities = await this.processSection(
          profileKey,
          sectionKey,
          sectionData,
          sourceFile,
          entityTypeAnalyzer,
          entityProcessor
        );
        entities.push(...subEntities);
      }

      return entities;

    } catch (error) {
      if (error instanceof EntityProcessingError) {
        throw error;
      }

      throw new EntityProcessingError(
        `Failed to process profile: ${error.message}`,
        profileKey,
        profileKey,
        'Check profile structure and data format'
      );
    }
  }

  /**
   * Processes a section within a main profile
   * 
   * @private
   * @param {string} profileKey - Parent profile identifier
   * @param {string} sectionKey - Section identifier
   * @param {Object} sectionData - Section data
   * @param {string} sourceFile - Source filename for entity attribution
   * @param {Object} entityTypeAnalyzer - Entity type analyzer instance
   * @param {Object} entityProcessor - Entity processor instance
   * @returns {Promise<Array>} Array of entities created from the section
   */
  async processSection(profileKey, sectionKey, sectionData, sourceFile, entityTypeAnalyzer, entityProcessor) {
    const entities = [];

    try {
      // Create section header using dynamic analysis
      const sectionEntityType = entityTypeAnalyzer.determineEntityType(profileKey, sectionKey, 'section');
      const sectionEntity = await entityProcessor.createEntity(
        sectionKey,
        sectionEntityType,
        [
          `${sectionData.description || sectionKey.replace(/_/g, ' ')} configuration and behaviors`,
          `Profile: ${profileKey}`,
          `Source: ${sourceFile}`
        ]
      );
      entities.push(sectionEntity);

      // Process section items (all properties except potentially special ones)
      for (const [itemKey, itemData] of Object.entries(sectionData)) {
        // Handle string properties as individual entities
        if (typeof itemData === 'string') {
          const entityType = entityTypeAnalyzer.determineEntityType(profileKey, sectionKey, itemKey);
          const entity = await entityProcessor.createEntity(itemKey, entityType, [this.substitutePaths(itemData)]);
          entities.push(entity);
          continue;
        }

        // Skip if this is not a processable item
        if (typeof itemData !== 'object' || itemData === null) {
          continue;
        }

        const itemEntities = await this.processSectionItem(
          profileKey,
          sectionKey,
          itemKey,
          itemData,
          entityTypeAnalyzer,
          entityProcessor
        );
        entities.push(...itemEntities);
      }

      return entities;

    } catch (error) {
      throw new EntityProcessingError(
        `Failed to process section '${sectionKey}': ${error.message}`,
        sectionKey,
        profileKey,
        'Check section structure and item definitions'
      );
    }
  }

  /**
   * Processes an individual item within a section
   * 
   * @private
   * @param {string} profileKey - Parent profile identifier
   * @param {string} sectionKey - Parent section identifier
   * @param {string} itemKey - Item identifier
   * @param {Object} itemData - Item data
   * @param {Object} entityTypeAnalyzer - Entity type analyzer instance
   * @param {Object} entityProcessor - Entity processor instance
   * @returns {Promise<Array>} Array of created entities (parent + any nested entities)
   */
  async processSectionItem(profileKey, sectionKey, itemKey, itemData, entityTypeAnalyzer, entityProcessor) {
    try {
      const entities = [];

      // Handle the case where itemData is directly an array
      if (Array.isArray(itemData)) {
        // This is a content entity nested under a section - pass the nesting context
        const entityType = entityTypeAnalyzer.determineEntityType(profileKey, itemKey, null, sectionKey);
        const observations = itemData.map(item => this.substitutePaths(item)); // Apply path substitution
        const entity = await entityProcessor.createEntity(itemKey, entityType, observations);
        return [entity];
      }

      // Check if this follows the observations pattern (new simplified structure)
      if (itemData.observations) {
        // This is a simplified entity with just observations
        const entityType = entityTypeAnalyzer.determineEntityType(profileKey, itemKey, null, sectionKey);
        const observations = Array.isArray(itemData.observations) ? itemData.observations : [itemData.observations];

        // Apply path substitution to observations
        const processedObservations = observations.map(obs => this.substitutePaths(obs));

        // Add source information
        processedObservations.push(`${itemKey} configuration and behaviors`);
        processedObservations.push(`Profile: ${sectionKey}`);
        processedObservations.push(`Source: ${profileKey}`);

        const entity = await entityProcessor.createEntity(itemKey, entityType, processedObservations);
        return [entity];
      }

      // Check if this follows the section_type + observations pattern (legacy)
      if (itemData.section_type && itemData.observations) {
        // This is a structured entity with metadata - create single entity with observations
        const entityType = itemData.section_type; // Use the explicit section_type
        const observations = Array.isArray(itemData.observations) ? itemData.observations : [itemData.observations];

        // Apply path substitution to observations
        const processedObservations = observations.map(obs => this.substitutePaths(obs));

        // Add source information
        processedObservations.push(`${itemKey} configuration and behaviors`);
        processedObservations.push(`Profile: ${sectionKey}`);
        processedObservations.push(`Source: ${profileKey}`);

        const entity = await entityProcessor.createEntity(itemKey, entityType, processedObservations);
        return [entity];
      }

      // Separate nested objects from simple properties
      const simpleProperties = {};
      const nestedObjects = {};

      for (const [key, value] of Object.entries(itemData)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // This is a nested object that should become its own entity
          nestedObjects[key] = value;
        } else {
          // This is a simple property for the main entity
          simpleProperties[key] = value;
        }
      }

      // Create main entity for intermediate sections (always create for hierarchy)
      if (Object.keys(simpleProperties).length > 0 || Object.keys(nestedObjects).length > 0) {
        // Pass nesting context for proper entity type determination
        const entityType = entityTypeAnalyzer.determineEntityType(profileKey, itemKey, null, sectionKey);
        const observations = Object.keys(simpleProperties).length > 0 
          ? this.createObservations(simpleProperties)
          : [`${itemKey} configuration and behaviors`, `Profile: ${sectionKey}`, `Source: ${profileKey}`];
        const mainEntity = await entityProcessor.createEntity(itemKey, entityType, observations);
        entities.push(mainEntity);
      }

      // Create separate entities for nested objects
      for (const [nestedKey, nestedData] of Object.entries(nestedObjects)) {
        const nestedEntityName = this.formatSectionName(nestedKey);
        // Pass nesting context for nested entities too
        const nestedEntityType = entityTypeAnalyzer.determineEntityType(profileKey, nestedKey, null, sectionKey);
        const nestedObservations = this.createObservations(nestedData);

        const nestedEntity = await entityProcessor.createEntity(
          nestedEntityName,
          nestedEntityType,
          nestedObservations
        );
        entities.push(nestedEntity);
      }

      return entities;

    } catch (error) {
      throw new EntityProcessingError(
        `Failed to process item '${itemKey}': ${error.message}`,
        itemKey,
        profileKey,
        'Check item data format and ensure all required fields are present'
      );
    }
  }

  /**
   * Substitutes path variables in a string with cross-platform expansion
   * 
   * @private
   * @param {string} text - Text containing path variables
   * @returns {string} Text with path variables substituted
   */
  substitutePaths(text) {
    if (typeof text !== 'string') {
      return text;
    }

    let result = text;

    // Cross-platform home directory expansion
    const os = require('os');
    const homeDir = os.homedir();

    for (const [pathKey, pathValue] of Object.entries(this.path)) {
      const variable = `{path.${pathKey}}`;
      // Escape special regex characters in the variable pattern
      const escapedVariable = variable.replace(/[{}]/g, '\\$&');

      // Expand ~ for cross-platform compatibility while keeping ~ in config
      const expandedPath = pathValue.replace(/^~/, homeDir);
      result = result.replace(new RegExp(escapedVariable, 'g'), expandedPath);
    }
    return result;
  }

  /**
   * Creates observations array from item data
   * 
   * @private
   * @param {Object} itemData - Item data containing observations or properties
   * @returns {Array<string>} Array of observation strings
   */
  createObservations(itemData) {
    const observations = [];

    // Handle different data structures
    if (typeof itemData === 'string') {
      observations.push(this.substitutePaths(itemData));
    } else if (Array.isArray(itemData)) {
      observations.push(...itemData.map(item => this.substitutePaths(item)));
    } else if (typeof itemData === 'object' && itemData !== null) {
      // Handle object with properties
      for (const [key, value] of Object.entries(itemData)) {
        if (Array.isArray(value)) {
          // For arrays, just add the values without key prefix
          observations.push(...value.map(item => this.substitutePaths(item)));
        } else if (typeof value === 'object' && value !== null) {
          // Recursively handle nested objects
          const nestedObservations = this.createObservations(value);
          observations.push(...nestedObservations.map(obs => `${key}: ${obs}`));
        } else {
          observations.push(`${key}: ${this.substitutePaths(value)}`);
        }
      }
    }

    return observations.filter(obs => obs && obs.trim().length > 0);
  }

  /**
   * Formats section names for display
   * 
   * @private
   * @param {string} sectionKey - Raw section key
   * @returns {string} Formatted section name
   */
  formatSectionName(sectionKey) {
    return sectionKey;
  }
}

module.exports = ProfileProcessor;
