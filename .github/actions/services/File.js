/**
 * File service for file system operations
 * 
 * @module services/File
 * @author AXIVO
 * @license BSD-3-Clause
 */
const fs = require('fs/promises');
const path = require('path');
const Action = require('../core/Action');

/**
 * File service for file system operations
 * 
 * Provides comprehensive file system operations including YAML processing,
 * directory management, file filtering, and path manipulation utilities.
 * 
 * @class FileService
 */
class FileService extends Action {
  /**
   * Reads a file
   * 
   * @param {string} file - File to read
   * @param {Object} [options={}] - Read options
   * @param {string} [options.encoding] - File encoding
   * @returns {Promise<string|Buffer>} File contents
   */
  async read(file, options = {}) {
    return this.execute(`read '${file}' file`, async () => {
      return await fs.readFile(file, options.encoding || 'utf8');
    });
  }
}

module.exports = FileService;
