/**
 * Main MemoryBuilder orchestrator
 * 
 * @module lib/MemoryBuilder
 * @author AXIVO
 * @license BSD-3-Clause
 */
const fs = require('fs');
const path = require('path');
const ConfigLoader = require('./ConfigLoader');
const { FileProcessor, ProfileProcessor, EntityProcessor } = require('./processors');
const { EntityTypeAnalyzer } = require('./analyzers');
const { BuildError } = require('./errors');

/**
 * Main MemoryBuilder orchestrator class
 * 
 * Coordinates the complete memory building process from YAML profile files to JSONL output.
 * Manages configuration loading, file processing, entity creation, and build statistics.
 * 
 * @class MemoryBuilder
 */
class MemoryBuilder {
  /**
   * Creates a new MemoryBuilder instance
   * 
   * @param {Object|null} [config=null] - Optional configuration object
   */
  constructor(config = null) {
    this.configLoader = new ConfigLoader();
    this.config = config || this.configLoader.load();
    
    // Initialize FileProcessor with security options
    const maxFileSize = this.config.security?.maxFileSize || (1024 * 1024); // Default 1MB
    this.fileProcessor = new FileProcessor(maxFileSize);
    this.profileProcessor = new ProfileProcessor(this.config);
    this.entityProcessor = new EntityProcessor();

    // Pass profiles directory to EntityTypeAnalyzer for dynamic analysis
    const profilesDirectory = this.config.build.profilesDirectory || 'profiles';
    this.entityTypeAnalyzer = new EntityTypeAnalyzer(profilesDirectory);

    this.buildStartTime = null;
    this.buildEndTime = null;
    this.entities = [];
    this.statistics = {
      filesProcessed: 0,
      entitiesCreated: 0,
      profilesProcessed: 0,
      entityTypes: {},
      profileBreakdown: {}
    };
  }

  /**
   * Executes the complete memory build process
   * 
   * @returns {Promise<boolean>} True if build succeeded, false otherwise
   */
  async build() {
    try {
      this.buildStartTime = Date.now();

      const buildConfig = this.config.build;
      const outputConfig = this.config.output;
      const loggingConfig = this.config.logging;

      if (loggingConfig.showProgress) {
        console.log('⚙️ Starting multi-file memory configuration build...');
      }

      this.entities = [];
      this.statistics = {
        filesProcessed: 0,
        entitiesCreated: 0,
        profilesProcessed: 0,
        entityTypes: {},
        profileBreakdown: {}
      };

      // Process common files first if configured
      if (buildConfig.processCommonFirst) {
        await this.processCommonFiles();
      }

      // Process profile files in order
      for (const fileName of buildConfig.profiles) {
        try {
          const entities = await this.processProfileFile(fileName);
          this.entities.push(...entities);
          this.statistics.filesProcessed++;
          this.statistics.profileBreakdown[fileName] = entities.length;
        } catch (error) {
          if (buildConfig.stopOnCriticalError) {
            throw new BuildError(`Critical error processing ${fileName}: ${error.message}`);
          }
          console.warn(`⚠️  Skipping ${fileName}: ${error.message}`);
        }
      }

      // Process additional files if configured
      if (buildConfig.processAdditionalFiles) {
        await this.processAdditionalFiles(buildConfig);
      }

      // Generate output
      await this.generateOutput(outputConfig);

      this.buildEndTime = Date.now();

      // Show build summary
      const buildTime = this.buildEndTime - this.buildStartTime;
      console.log(`✅ Generated ${this.entities.length} entities from ${this.statistics.filesProcessed} profile files in ${buildTime}ms`);

      // Show statistics
      if (this.config.performance.showStatistics) {
        this.showBuildStatistics();
      }

      return true;

    } catch (error) {
      this.buildEndTime = Date.now();
      console.error(`❌ Build failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Processes common infrastructure files
   * 
   * @private
   * @returns {Promise<void>}
   */
  async processCommonFiles() {
    const buildConfig = this.config.build;
    const loggingConfig = this.config.logging;
    const commonDir = path.join(buildConfig.profilesDirectory, buildConfig.commonDirectory);

    if (!fs.existsSync(commonDir)) {
      if (loggingConfig.showFileDetails) {
        console.log(`⚠️  Common directory not found: ${commonDir}`);
      }
      return;
    }

    const commonFiles = fs.readdirSync(commonDir)
      .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
      .sort();

    if (loggingConfig.showFileDetails) {
      console.log(`🛠️ Processing ${commonFiles.length} common infrastructure files...`);
    }

    for (const fileName of commonFiles) {
      try {
        const filePath = path.join(commonDir, fileName);
        const entities = await this.processCommonFile(filePath, fileName);
        this.entities.push(...entities);
        this.statistics.filesProcessed++;
        this.statistics.profileBreakdown[`common/${fileName}`] = entities.length;
      } catch (error) {
        if (buildConfig.stopOnCriticalError) {
          throw new BuildError(`Critical error processing common file ${fileName}: ${error.message}`);
        }
        console.warn(`⚠️  Skipping common file ${fileName}: ${error.message}`);
      }
    }
  }

  /**
   * Processes a single common infrastructure file
   * 
   * @private
   * @param {string} filePath - Full path to the common file
   * @param {string} fileName - File name for logging
   * @returns {Promise<Array>} Array of entities created from the file
   */
  async processCommonFile(filePath, fileName) {
    const loggingConfig = this.config.logging;

    if (loggingConfig.showFileDetails) {
      console.log(`📚 Processing common/${fileName} file...`);
    }

    const yamlData = await this.fileProcessor.loadYamlFile(filePath);
    const entities = [];

    for (const [profileKey, profileData] of Object.entries(yamlData)) {
      if (loggingConfig.showFileDetails) {
        console.log(`   Processing ${profileKey} common infrastructure...`);
      }

      const profileEntities = await this.profileProcessor.processProfile(
        profileKey,
        profileData,
        `common/${fileName}`,
        this.entityTypeAnalyzer,
        this.entityProcessor
      );

      entities.push(...profileEntities);
      this.statistics.profilesProcessed++;
    }

    return entities;
  }

  /**
   * Processes a single profile file
   * 
   * @param {string} fileName - Profile file name to process
   * @returns {Promise<Array>} Array of entities created from the file
   */
  async processProfileFile(fileName) {
    const buildConfig = this.config.build;
    const loggingConfig = this.config.logging;

    if (loggingConfig.showFileDetails) {
      console.log(`📖 Processing ${fileName} file...`);
    }

    const filePath = path.join(buildConfig.profilesDirectory, fileName);
    const yamlData = await this.fileProcessor.loadYamlFile(filePath);
    const entities = [];

    for (const [profileKey, profileData] of Object.entries(yamlData)) {
      if (loggingConfig.showFileDetails) {
        console.log(`   Processing ${profileKey} profile...`);
      }

      const profileEntities = await this.profileProcessor.processProfile(
        profileKey,
        profileData,
        fileName,
        this.entityTypeAnalyzer,
        this.entityProcessor
      );

      entities.push(...profileEntities);
      this.statistics.profilesProcessed++;
    }

    return entities;
  }

  /**
   * Processes additional files beyond the main profile order
   * 
   * @private
   * @param {Object} buildConfig - Build configuration object
   * @returns {Promise<void>}
   */
  async processAdditionalFiles(buildConfig) {
    const profileDir = buildConfig.profilesDirectory;

    if (!fs.existsSync(profileDir)) {
      return;
    }

    const allFiles = fs.readdirSync(profileDir)
      .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
      .filter(file => !buildConfig.profiles.includes(file));

    for (const fileName of allFiles) {
      try {
        const entities = await this.processProfileFile(fileName);
        this.entities.push(...entities);
        this.statistics.filesProcessed++;
        this.statistics.profileBreakdown[fileName] = entities.length;
      } catch (error) {
        console.warn(`⚠️ Skipping additional file ${fileName}: ${error.message}`);
      }
    }
  }

  /**
   * Generates the final output file
   * 
   * @private
   * @param {Object} outputConfig - Output configuration object
   * @returns {Promise<void>}
   */
  async generateOutput(outputConfig) {
    let outputPath = outputConfig.path;

    // Resolve relative path
    if (!path.isAbsolute(outputPath)) {
      outputPath = path.resolve(__dirname, '..', outputConfig.path);
    }

    let content;
    if (outputConfig.format === 'json') {
      content = JSON.stringify(this.entities, null, 2);
    } else {
      // Default to JSONL format
      content = this.entities.map(entity => JSON.stringify(entity)).join('\n');
    }

    fs.writeFileSync(outputPath, content, 'utf8');

    this.statistics.entitiesCreated = this.entities.length;

    // Count entity types
    for (const entity of this.entities) {
      const entityType = entity.entityType;
      this.statistics.entityTypes[entityType] = (this.statistics.entityTypes[entityType] || 0) + 1;
    }

    console.log(`📝 Output written to ${outputPath}`);
  }

  /**
   * Displays comprehensive build statistics
   * 
   * @private
   * @returns {void}
   */
  showBuildStatistics() {
    const performanceConfig = this.config.performance;

    if (!performanceConfig.showStatistics) {
      return;
    }

    console.log('\n🏷️ Entity Types:');
    const sortedEntityTypes = Object.entries(this.statistics.entityTypes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    for (const [type, count] of sortedEntityTypes) {
      console.log(`   ${type}: ${count}`);
    }

    console.log('\n📁 Profile Files:');
    const sortedProfiles = Object.entries(this.statistics.profileBreakdown)
      .sort(([, a], [, b]) => b - a);

    for (const [fileName, count] of sortedProfiles) {
      console.log(`   ${fileName}: ${count} entities`);
    }

    if (performanceConfig.showBuildTime) {
      const buildTime = this.buildEndTime - this.buildStartTime;
      const entitiesPerSecond = Math.round(this.statistics.entitiesCreated / (buildTime / 1000));

      console.log('\n⏱️ Build Performance:');
      console.log(`   Build time: ${buildTime}ms`);
      console.log(`   Files processed: ${this.statistics.filesProcessed}`);
      console.log(`   Entities per second: ${entitiesPerSecond}`);
    }
  }
}

module.exports = MemoryBuilder;
