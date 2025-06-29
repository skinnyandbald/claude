/**
 * Analyzer exports for MemoryBuilder
 * 
 * @module lib/analyzers
 * @author AXIVO
 * @license BSD-3-Clause
 */

const EntityTypeAnalyzer = require('./EntityTypeAnalyzer');

/**
 * Analysis components for memory builder system
 * 
 * Provides specialized analyzers for understanding and classifying
 * profile-based data structures:
 * - EntityTypeAnalyzer: Determines appropriate entity types for profiles
 */
module.exports = {
  EntityTypeAnalyzer
};
