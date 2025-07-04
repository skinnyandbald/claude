/**
 * Memory Builder Library
 * 
 * Main module exports for the simplified memory builder system
 * 
 * @module lib
 * @author AXIVO
 * @license BSD-3-Clause
 */

const MemoryBuilder = require('./MemoryBuilder');
const core = require('./core');
const loaders = require('./loaders');
const processors = require('./processors');
const generators = require('./generators');

module.exports = {
  MemoryBuilder,
  core,
  loaders,
  processors,
  generators
};
