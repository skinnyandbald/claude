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
   * Creates a new FileProcessor instance
   * 
   * @param {number} maxFileSize - Maximum file size in bytes (default: 1MB)
   */
  constructor(maxFileSize = 1024 * 1024) {
    this.maxFileSize = maxFileSize;
  }
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

      // Security: Check file size before reading
      const fileStats = fs.statSync(filePath);
      if (fileStats.size > this.maxFileSize) {
        throw new ProfileFileError(
          `File too large: ${fileStats.size} bytes (max: ${this.maxFileSize})`,
          filePath,
          'Profile files should be reasonably sized. Consider splitting large configurations.'
        );
      }

      // Read file content
      const fileContent = fs.readFileSync(filePath, 'utf8');

      // Parse YAML with error handling
      try {
        // Security: Use safer YAML parsing options
        const yamlData = yaml.load(fileContent, {
          schema: yaml.DEFAULT_SCHEMA,  // More restrictive than EXTENDED_SCHEMA
          json: true,                   // Stricter parsing mode
          onWarning: (warning) => {
            console.warn(`⚠️ YAML Warning in ${filePath}: ${warning.message}`);
          }
        });
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
