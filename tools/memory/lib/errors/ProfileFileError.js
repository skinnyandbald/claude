const BuildError = require('./BuildError');

/**
 * Error class for profile file processing failures
 * 
 * Handles errors specific to profile file operations including missing files,
 * permission issues, and file format problems.
 * 
 * @class ProfileFileError
 * @extends BuildError
 */
class ProfileFileError extends BuildError {
  /**
   * Creates a new ProfileFileError instance
   * 
   * @param {string} message - Error message describing the file issue
   * @param {string} fileName - Name of the problematic profile file
   * @param {string} [suggestion] - Optional suggestion for resolving the file issue
   */
  constructor(message, fileName, suggestion = null) {
    const fullMessage = `Profile file error in ${fileName}: ${message}`;
    super(fullMessage, 1, suggestion);
    this.name = 'ProfileFileError';
    this.fileName = fileName;
  }
}

module.exports = ProfileFileError;
