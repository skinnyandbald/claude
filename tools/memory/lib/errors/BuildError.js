/**
 * Base error class for build-related failures
 * 
 * Provides structured error handling with exit codes, timestamps, and actionable suggestions.
 * Used for critical build failures that should terminate the build process.
 * 
 * @class BuildError
 * @extends Error
 */
class BuildError extends Error {
  /**
   * Creates a new BuildError instance
   * 
   * @param {string} message - Error message describing the failure
   * @param {number} [exitCode=1] - Process exit code for this error
   * @param {string} [suggestion] - Optional suggestion for resolving the error
   */
  constructor(message, exitCode = 1, suggestion = null) {
    super(message);
    this.name = 'BuildError';
    this.exitCode = exitCode;
    this.suggestion = suggestion;
    this.timestamp = new Date().toISOString();
  }
}

module.exports = BuildError;
