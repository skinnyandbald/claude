/**
 * Entity processing for MemoryBuilder
 * 
 * @module lib/processors/EntityProcessor
 * @author AXIVO
 * @license BSD-3-Clause
 */
const { EntityProcessingError } = require('../errors');

/**
 * Entity processor for creating memory system entities
 * 
 * Creates and formats individual entities with proper structure, validation, and error handling.
 * Ensures entities conform to the expected schema for the memory system.
 * 
 * @class EntityProcessor
 */
class EntityProcessor {
  /**
   * Processes and validates observations array
   * 
   * @private
   * @param {Array} observations - Raw observations array
   * @returns {Array<string>} Processed observations array
   */
  #processObservations(observations) {
    return observations
      .filter(obs => obs && typeof obs === 'string' && obs.trim().length > 0)
      .map(obs => obs.trim());
  }

  /**
   * Sanitizes entity name for consistency
   * 
   * @private
   * @param {string} name - Raw entity name
   * @returns {string} Sanitized entity name
   */
  #sanitizeEntityName(name) {
    return name.trim();
  }

  /**
   * Validates entity creation inputs
   * 
   * @private
   * @param {string} name - Entity name to validate
   * @param {string} entityType - Entity type to validate
   * @param {Array} observations - Observations array to validate
   * @throws {EntityProcessingError} When validation fails
   */
  #validateEntityInputs(name, entityType, observations) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new EntityProcessingError(
        'Entity name is required and must be a non-empty string',
        name || 'undefined',
        'validation',
        'Provide a valid entity name'
      );
    }
    if (!entityType || typeof entityType !== 'string' || entityType.trim().length === 0) {
      throw new EntityProcessingError(
        'Entity type is required and must be a non-empty string',
        name,
        'validation',
        'Ensure entity type is properly determined'
      );
    }
    if (!Array.isArray(observations)) {
      throw new EntityProcessingError(
        'Observations must be an array',
        name,
        'validation',
        'Convert observations to array format'
      );
    }
  }

  /**
   * Validates the created entity structure
   * 
   * @private
   * @param {Object} entity - Entity object to validate
   * @throws {EntityProcessingError} When structure validation fails
   */
  #validateEntityStructure(entity) {
    const requiredFields = ['type', 'name', 'entityType', 'observations'];
    for (const field of requiredFields) {
      if (!(field in entity)) {
        throw new EntityProcessingError(
          `Missing required field: ${field}`,
          entity.name || 'unknown',
          'structure_validation',
          'Ensure all required entity fields are present'
        );
      }
    }
    if (entity.type !== 'entity') {
      throw new EntityProcessingError(
        'Entity type field must be "entity"',
        entity.name,
        'structure_validation',
        'Set entity.type to "entity"'
      );
    }
    if (!Array.isArray(entity.observations)) {
      throw new EntityProcessingError(
        'Entity observations must be an array',
        entity.name,
        'structure_validation',
        'Convert observations to array format'
      );
    }
    if (entity.observations.length === 0) {
      throw new EntityProcessingError(
        'Entity must have at least one observation',
        entity.name,
        'structure_validation',
        'Add meaningful observations to the entity'
      );
    }
  }

  /**
   * Creates a new entity with proper structure and validation
   * 
   * @param {string} name - Entity name/identifier
   * @param {string} entityType - Entity type classification
   * @param {Array<string>} observations - Array of observation strings
   * @returns {Promise<Object>} Created entity object
   * @throws {EntityProcessingError} When entity creation fails
   */
  async createEntity(name, entityType, observations) {
    try {
      this.#validateEntityInputs(name, entityType, observations);
      const entity = {
        type: 'entity',
        name: this.#sanitizeEntityName(name),
        entityType: entityType,
        observations: this.#processObservations(observations)
      };
      this.#validateEntityStructure(entity);
      return entity;
    } catch (error) {
      if (error instanceof EntityProcessingError) {
        throw error;
      }
      throw new EntityProcessingError(
        `Entity creation failed: ${error.message}`,
        name,
        'unknown',
        'Check entity name, type, and observations format'
      );
    }
  }
}

module.exports = EntityProcessor;
