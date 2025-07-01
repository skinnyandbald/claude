/**
 * Processor exports for MemoryBuilder
 * 
 * @module lib/processors
 * @author AXIVO
 * @license BSD-3-Clause
 */

const FileProcessor = require('./FileProcessor');
const ProfileProcessor = require('./ProfileProcessor');
const EntityProcessor = require('./EntityProcessor');

/**
 * Processing components for memory builder system
 * 
 * Provides specialized processors for different aspects of the build pipeline:
 * - FileProcessor: YAML file I/O and parsing
 * - ProfileProcessor: Profile structure traversal
 * - EntityProcessor: Entity creation and validation
 */
module.exports = {
  FileProcessor,
  ProfileProcessor,
  EntityProcessor
};
