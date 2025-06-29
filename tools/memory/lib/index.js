/**
 * Main library exports for MemoryBuilder
 * 
 * @module lib
 * @author AXIVO
 * @license BSD-3-Clause
 */

// Main orchestrator
const MemoryBuilder = require('./MemoryBuilder');

// Configuration management
const ConfigLoader = require('./ConfigLoader');

// Processors
const { FileProcessor, ProfileProcessor, EntityProcessor } = require('./processors');

// Analyzers
const { EntityTypeAnalyzer } = require('./analyzers');

// Error classes
const { BuildError, ProfileFileError, YamlParseError, EntityProcessingError } = require('./errors');

/**
 * Complete MemoryBuilder library exports
 * 
 * Provides access to all components of the modular memory builder system
 * including orchestration, processing, analysis, and error handling.
 */
module.exports = {
  // Main classes
  MemoryBuilder,
  ConfigLoader,

  // Processors
  FileProcessor,
  ProfileProcessor,
  EntityProcessor,

  // Analyzers
  EntityTypeAnalyzer,

  // Error handling
  BuildError,
  ProfileFileError,
  YamlParseError,
  EntityProcessingError
};
