/**
 * File processing utilities for MemoryBuilder
 * 
 * @module lib/processors/FileProcessor
 * @author AXIVO
 * @license BSD-3-Clause
 */
const fs = require('fs');
const yaml = require('js-yaml');
const { ProfileFileError, YamlParseError } = require('../errors');

/**
 * File processor for YAML profile files
 * 
 * Handles file I/O operations, YAML parsing, and file validation for the memory builder system.
 * Provides error handling and recovery for common file operation failures.
 * 
 * @class FileProcessor
 */
class FileProcessor {
  /**
   * Loads and parses a YAML file
   * 
   * @param {string} filePath - Path to the YAML file to load
   * @returns {Promise<Object>} Parsed YAML data object
   * @throws {ProfileFileError} When file cannot be accessed
   * @throws {YamlParseError} When YAML parsing fails
   */
  async loadYamlFile(filePath) {
    try {
      // Check file existence and accessibility
      if (!fs.existsSync(filePath)) {
        throw new ProfileFileError(
          `File not found: ${filePath}`,
          filePath,
          'Ensure the profile file exists and is readable'
        );
      }

      // Read file content
      const fileContent = fs.readFileSync(filePath, 'utf8');

      // Parse YAML with error handling
      try {
        const yamlData = yaml.load(fileContent);
        return yamlData || {};
      } catch (yamlError) {
        throw new YamlParseError(
          'YAML syntax error',
          filePath,
          yamlError,
          'Check YAML indentation and syntax. Common issues: incorrect indentation, missing colons, unescaped quotes'
        );
      }

    } catch (error) {
      // Re-throw our custom errors
      if (error instanceof ProfileFileError || error instanceof YamlParseError) {
        throw error;
      }

      // Handle unexpected file system errors
      throw new ProfileFileError(
        `Unexpected file error: ${error.message}`,
        filePath,
        'Check file permissions and disk space'
      );
    }
  }
}

module.exports = FileProcessor;
