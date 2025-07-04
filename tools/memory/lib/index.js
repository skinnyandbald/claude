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
const Workflow = require('./Workflow');
const core = require('./core');
const loaders = require('./loaders');
const processors = require('./processors');
const generators = require('./generators');

module.exports = {
  MemoryBuilder,
  Workflow,
  core,
  loaders,
  processors,
  generators
};
