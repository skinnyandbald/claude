/**
 * GitHub Actions workflow handler for memory configuration builds
 * 
 * @module lib/Workflow
 * @author AXIVO
 * @license BSD-3-Clause
 */

const ConfigLoader = require('./ConfigLoader');

/**
 * Workflow handler for GitHub Actions memory configuration operations
 * 
 * @class Workflow
 */
class Workflow {
  /**
   * Creates a new Workflow instance
   * 
   * @param {Object} params - Workflow parameters
   * @param {Object} params.core - GitHub Actions core utilities
   * @param {Object} params.exec - GitHub Actions exec utilities
   */
  constructor({ core, exec }) {
    this.core = core;
    this.exec = exec;
    this.config = new ConfigLoader();
  }

  /**
   * Build memory tool
   * 
   * @private
   * @returns {Promise<void>}
   */
  async #build() {
    this.core.info('Building memory tool...');
    try {
      process.chdir('tools/memory');
      await this.exec.exec('npm', ['init', '-y']);
      await this.exec.exec('node', ['./lib/PackageBuilder.js']);
      await this.exec.exec('npm', ['install']);
      await this.exec.exec('npm', ['run', 'build']);
      this.core.info('Memory tool built successfully');
    } catch (error) {
      this.core.error(`Build failed: ${error.message}`);
    }
  }

  /**
   * Configure git for automated commits
   * 
   * @private
   * @returns {Promise<void>}
   */
  async #configureGit() {
    this.core.info('Configuring git repository...');
    try {
      const workflow = this.config.get('workflow.user');
      await this.exec.exec('git', ['config', '--local', 'user.email', workflow.email]);
      await this.exec.exec('git', ['config', '--local', 'user.name', workflow.name]);
    } catch (error) {
      this.core.error(`Git configuration failed: ${error.message}`);
    }
  }

  /**
   * Execute workflow
   * 
   * @returns {Promise<void>}
   */
  async execute() {
    try {
      await this.#configureGit();
      await this.#build();
    } catch (error) {
      this.core.setFailed(`Workflow failed: ${error.message}`);
    }
  }
}

module.exports = Workflow;
