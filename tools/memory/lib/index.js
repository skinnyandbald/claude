/**
 * Main library exports for MemoryBuilder
 * 
 * @module lib
 * @author AXIVO
 * @license BSD-3-Clause
 */

const MemoryBuilder = require('./MemoryBuilder');
const ConfigLoader = require('./ConfigLoader');
const PackageBuilder = require('./PackageBuilder');
const { FileProcessor, ProfileProcessor, EntityProcessor } = require('./processors');
const { EntityTypeAnalyzer } = require('./analyzers');
const { BuildError, ProfileFileError, YamlParseError, EntityProcessingError } = require('./errors');

/**
 * Complete MemoryBuilder library exports
 * 
 * Provides access to all components of the modular memory builder system
 * including orchestration, processing, analysis, project setup, and error handling.
 */
module.exports = {
  MemoryBuilder,
  ConfigLoader,
  PackageBuilder,
  FileProcessor,
  ProfileProcessor,
  EntityProcessor,
  EntityTypeAnalyzer,
  BuildError,
  ProfileFileError,
  YamlParseError,
  EntityProcessingError
};
