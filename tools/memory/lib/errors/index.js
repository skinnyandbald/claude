/**
 * Structured error exports for MemoryBuilder
 * 
 * @module lib/errors
 * @author AXIVO
 * @license BSD-3-Clause
 */

const BuildError = require('./BuildError');
const ProfileFileError = require('./ProfileFileError');
const YamlParseError = require('./YamlParseError');
const EntityProcessingError = require('./EntityProcessingError');

/**
 * Error handling components for memory builder system
 * 
 * Provides specialized error classes for different failure scenarios:
 * - BuildError: General build process failures
 * - ProfileFileError: Profile file access and format issues
 * - YamlParseError: YAML syntax and structure errors
 * - EntityProcessingError: Entity creation and processing failures
 */
module.exports = {
  BuildError,
  ProfileFileError,
  YamlParseError,
  EntityProcessingError
};
