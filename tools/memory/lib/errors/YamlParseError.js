const ProfileFileError = require('./ProfileFileError');

/**
 * Error class for YAML parsing failures
 * 
 * Handles YAML syntax errors, malformed structure issues, and provides
 * detailed location information when available.
 * 
 * @class YamlParseError
 * @extends ProfileFileError
 */
class YamlParseError extends ProfileFileError {
  /**
   * Creates a new YamlParseError instance
   * 
   * @param {string} message - Error message describing the YAML issue
   * @param {string} fileName - Name of the YAML file with parsing errors
   * @param {Error} originalError - Original YAML parsing error object
   * @param {string} [suggestion] - Optional suggestion for fixing YAML syntax
   */
  constructor(message, fileName, originalError, suggestion = null) {
    let fullMessage = message;
    if (originalError && originalError.mark) {
      const { line, column } = originalError.mark;
      fullMessage += ` (line ${line}, column ${column})`;
    }
    super(fullMessage, fileName, suggestion);
    this.name = 'YamlParseError';
    this.originalError = originalError;
  }
}

module.exports = YamlParseError;
