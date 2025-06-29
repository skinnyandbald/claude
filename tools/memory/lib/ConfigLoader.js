/**
 * Configuration loader for MemoryBuilder
 * 
 * @module lib/ConfigLoader
 * @author AXIVO
 * @license BSD-3-Clause
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Configuration loader for MemoryBuilder
 * 
 * Loads and validates external JSON configuration files for the memory builder system.
 * Provides structured access to configuration sections and validates required settings.
 * 
 * @class ConfigLoader
 */
class ConfigLoader {
  /**
   * Creates a new ConfigLoader instance
   * 
   * @param {string|null} [configPath=null] - Custom configuration file path
   */
  constructor(configPath = null) {
    this.configPath = configPath || path.join(__dirname, '../config/builder.yaml');
    this.config = null;
  }

  /**
   * Loads configuration from external JSON file
   * 
   * @returns {Object} Loaded configuration object
   * @throws {Error} When configuration file is missing or invalid
   */
  load() {
    try {
      if (!fs.existsSync(this.configPath)) {
        throw new Error(`Configuration file not found: ${this.configPath}`);
      }

      const configContent = fs.readFileSync(this.configPath, 'utf8');

      // Support both YAML and JSON configuration files
      if (this.configPath.endsWith('.yaml') || this.configPath.endsWith('.yml')) {
        this.config = yaml.load(configContent);
      } else {
        this.config = JSON.parse(configContent);
      }

      // Auto-detect profiles if enabled
      if (this.config.build.autoDetectProfiles) {
        this.config.build.profiles = this.detectProfiles();
      }

      // Validate configuration structure
      if (!this.validateConfig(this.config)) {
        throw new Error('Invalid configuration structure');
      }

      console.log(`📋 Loading ${this.configPath} configuration...`);
      return this.config;

    } catch (error) {
      console.error(`❌ Error loading configuration: ${error.message}`);
      throw error;
    }
  }

  /**
   * Auto-detects available profile files in the profiles directory
   * 
   * @returns {string[]} Array of profile filenames found in profiles directory
   */
  detectProfiles() {
    const profilesDir = path.resolve(path.join(__dirname, '../profiles'));
    const allowedDir = path.resolve(__dirname, '..');

    // Security: Ensure profiles directory is within allowed path
    if (!profilesDir.startsWith(allowedDir)) {
      console.error('❌ Security: Profiles directory outside allowed path');
      return [];
    }

    if (!fs.existsSync(profilesDir)) {
      console.warn(`⚠️ Profiles directory not found: ${profilesDir}`);
      return [];
    }

    try {
      const files = fs.readdirSync(profilesDir, { withFileTypes: true });
      const profileFiles = files
        .filter(dirent => {
          // Include .yaml files but exclude common/ directory
          return dirent.isFile() &&
            dirent.name.endsWith('.yaml') &&
            dirent.name !== 'common';
        })
        .map(dirent => dirent.name)
        .sort(); // Consistent ordering

      console.log(`🔍 Auto-detected ${profileFiles.length} profiles: ${profileFiles.join(', ')}`);
      return profileFiles;

    } catch (error) {
      console.error(`❌ Error reading profiles directory: ${error.message}`);
      return [];
    }
  }

  /**
   * Validates configuration structure and required sections
   * 
   * @param {Object} config - Configuration object to validate
   * @returns {boolean} True if configuration is valid
   */
  validateConfig(config) {
    const requiredSections = ['build', 'output', 'performance', 'logging'];

    for (const section of requiredSections) {
      if (!config[section]) {
        console.warn(`⚠️ Missing configuration section: ${section}`);
        return false;
      }
    }

    // Validate critical build settings
    if (!config.build.autoDetectProfiles && (!config.build.profiles || !Array.isArray(config.build.profiles))) {
      console.error('❌ Invalid profiles configuration - must specify profiles or enable autoDetectProfiles');
      return false;
    }

    if (config.build.autoDetectProfiles && (!config.build.profiles || config.build.profiles.length === 0)) {
      console.error('❌ Auto-detection failed - no profiles found');
      return false;
    }

    if (config.build.processCommonFirst && !config.build.commonDirectory) {
      console.error('❌ processCommonFirst enabled but commonDirectory not specified');
      return false;
    }

    if (!config.output.path) {
      console.error('❌ Invalid output path configuration');
      return false;
    }

    return true;
  }

  /**
   * Gets a specific configuration section
   * 
   * @param {string} section - Configuration section name
   * @returns {Object} Configuration section object
   */
  getSection(section) {
    if (!this.config) {
      this.config = this.load();
    }
    return this.config[section] || {};
  }

  /**
   * Gets build configuration section
   * 
   * @returns {Object} Build configuration with profile order and processing settings
   */
  getBuildConfig() {
    return this.getSection('build');
  }

  /**
   * Gets output configuration section
   * 
   * @returns {Object} Output configuration with path and format settings
   */
  getOutputConfig() {
    return this.getSection('output');
  }

  /**
   * Gets performance configuration section
   * 
   * @returns {Object} Performance configuration with statistics and timing settings
   */
  getPerformanceConfig() {
    return this.getSection('performance');
  }

  /**
   * Gets logging configuration section
   * 
   * @returns {Object} Logging configuration with level and display settings
   */
  getLoggingConfig() {
    return this.getSection('logging');
  }

  /**
   * Reloads configuration from file
   * 
   * @returns {Object} Reloaded configuration object
   */
  reload() {
    this.config = null;
    return this.load();
  }
}

module.exports = ConfigLoader;
