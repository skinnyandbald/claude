const BuildError = require('./BuildError');

/**
 * Error class for entity processing failures
 * 
 * Handles errors during entity creation, type detection, and data transformation.
 * Provides context about which entity caused the failure.
 * 
 * @class EntityProcessingError
 * @extends BuildError
 */
class EntityProcessingError extends BuildError {
  /**
   * Creates a new EntityProcessingError instance
   * 
   * @param {string} message - Error message describing the entity processing issue
   * @param {string} entityName - Name of the entity that failed to process
   * @param {string} profileKey - Profile containing the problematic entity
   * @param {string} [suggestion] - Optional suggestion for resolving the entity issue
   */
  constructor(message, entityName, profileKey, suggestion = null) {
    const fullMessage = `Entity processing error in profile '${profileKey}', entity '${entityName}': ${message}`;
    super(fullMessage, 1, suggestion);
    this.name = 'EntityProcessingError';
    this.entityName = entityName;
    this.profileKey = profileKey;
  }
}

module.exports = EntityProcessingError;
