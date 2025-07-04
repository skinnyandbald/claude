/**
 * MemoryBuilder Class
 * 
 * Main orchestrator for the memory builder system.
 * Coordinates configuration loading, profile processing, and output generation.
 * 
 * @class MemoryBuilder
 * @author AXIVO
 * @license BSD-3-Clause
 */

const fs = require('fs');
const path = require('path');
const { ConfigLoader, FileLoader } = require('../loaders');
const { ProfileProcessor } = require('../processors');
const { RelationGenerator, OutputGenerator } = require('../generators');
const MemoryBuilderError = require('./Error');

/**
 * Main orchestrator class for memory builder operations
 * 
 * Coordinates the entire build process from configuration loading through output generation.
 * Handles error recovery and provides build statistics.
 * 
 * @class MemoryBuilder
 */
class MemoryBuilder {
  /**
   * Creates a new MemoryBuilder instance
   * 
   * @param {Object} [config] - Optional configuration object
   */
  constructor(config = null) {
    this.config = config;
    this.configLoader = new ConfigLoader();
    this.fileLoader = new FileLoader();
    this.stats