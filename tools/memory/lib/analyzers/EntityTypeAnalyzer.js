/**
 * YAML-First Entity Type Analyzer
 * 
 * @module lib/analyzers/EntityTypeAnalyzer
 * @author AXIVO
 * @license BSD-3-Clause
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Entity type analyzer using binary type classification
 * 
 * Uses YAML `type` field to distinguish between:
 * - `type: common` - Shared infrastructure across all profiles
 * - `type: standard` - Profile-specific functionality
 * 
 * No profile names are hardcoded - works with unlimited future profiles.
 * 
 * @class EntityTypeAnalyzer
 */
class EntityTypeAnalyzer {
  /**
   * Creates a new EntityTypeAnalyzer instance
   * 
   * @param {string} profilesDirectory - Path to profiles directory
   * @param {number} maxCacheSize - Maximum number of items in cache (default: 50)
   */
  constructor(profilesDirectory = 'profiles', maxCacheSize = 50) {
    this.profilesDirectory = profilesDirectory;
    this.profileCache = new Map();
    this.cacheAccessTimes = new Map();
    this.maxCacheSize = maxCacheSize;
  }

  /**
   * Evicts the least recently used item from cache
   * 
   * @private
   * @returns {void}
   */
  #evictLeastRecentlyUsed() {
    if (this.cacheAccessTimes.size === 0) {
      return;
    }
    let oldestKey = null;
    let oldestTime = Infinity;
    for (const [key, accessTime] of this.cacheAccessTimes.entries()) {
      if (accessTime < oldestTime) {
        oldestTime = accessTime;
        oldestKey = key;
      }
    }
    if (oldestKey) {
      this.profileCache.delete(oldestKey);
      this.cacheAccessTimes.delete(oldestKey);
    }
  }

  /**
   * Generates fallback entity type when profile type cannot be determined
   * 
   * @private
   * @param {string} profileKey - Profile identifier
   * @param {string} subCategoryKey - Subcategory identifier
   * @returns {string} Fallback entity type
   */
  #generateFallbackType(profileKey, subCategoryKey) {
    if (this.#isProfileHeader(subCategoryKey, profileKey)) {
      return `${profileKey.toLowerCase()}_description`;
    }
    return 'section';
  }

  /**
   * Gets profile structure from cache or loads from file
   * 
   * @private
   * @param {string} profileKey - Profile name to load
   * @returns {Object|null} Parsed profile structure or null if not found
   */
  #getProfileStructure(profileKey) {
    if (!profileKey || typeof profileKey !== 'string') {
      return null;
    }
    const safeProfileKeyPattern = /^[a-zA-Z0-9_-]+$/;
    if (!safeProfileKeyPattern.test(profileKey)) {
      console.warn(`⚠️ Invalid profile key format: ${profileKey}`);
      return null;
    }
    if (this.profileCache.has(profileKey)) {
      this.cacheAccessTimes.set(profileKey, Date.now());
      return this.profileCache.get(profileKey);
    }
    const baseProfilesDir = path.resolve(this.profilesDirectory);
    let profilePath = path.resolve(baseProfilesDir, `${profileKey}.yaml`);
    if (!profilePath.startsWith(baseProfilesDir)) {
      console.warn(`⚠️ Profile path outside allowed directory: ${profileKey}`);
      return null;
    }
    if (!fs.existsSync(profilePath)) {
      profilePath = path.resolve(baseProfilesDir, 'common', `${profileKey}.yaml`);
      if (!profilePath.startsWith(baseProfilesDir)) {
        console.warn(`⚠️ Common profile path outside allowed directory: ${profileKey}`);
        return null;
      }
    }
    if (!fs.existsSync(profilePath)) {
      return null;
    }
    try {
      const yamlContent = fs.readFileSync(profilePath, 'utf8');
      const profileStructure = yaml.load(yamlContent);
      if (this.profileCache.size >= this.maxCacheSize) {
        this.#evictLeastRecentlyUsed();
      }
      this.profileCache.set(profileKey, profileStructure);
      this.cacheAccessTimes.set(profileKey, Date.now());
      return profileStructure;
    } catch (error) {
      console.warn(`Warning: Could not parse profile ${profileKey}: ${error.message}`);
      return null;
    }
  }

  /**
   * Extracts the profile type from YAML structure
   * 
   * @private
   * @param {Object} profileStructure - Parsed YAML structure
   * @param {string} profileKey - Profile identifier
   * @returns {string|null} Profile type ('common' or 'standard') or null
   */
  #getProfileType(profileStructure, profileKey) {
    const profileSection = profileStructure[profileKey.toUpperCase()];
    if (profileSection && profileSection.type) {
      return profileSection.type;
    }
    return null;
  }

  /**
   * Checks if this is a documentation-related type
   * 
   * @private
   * @param {string} subCategoryKey - Subcategory to check
   * @returns {boolean} True if documentation-related
   */
  #isDocumentationType(subCategoryKey) {
    const docKeywords = ['logging', 'documentation', 'docs', 'log'];
    const normalizedKey = subCategoryKey.toLowerCase();
    return docKeywords.some(keyword => normalizedKey.includes(keyword));
  }

  /**
   * Checks if this is a profile header entity
   * 
   * @private
   * @param {string} subCategoryKey - Subcategory to check
   * @param {string} profileKey - Profile key
   * @returns {boolean} True if this is a profile header
   */
  #isProfileHeader(subCategoryKey, profileKey) {
    return subCategoryKey.toLowerCase() === profileKey.toLowerCase();
  }

  /**
   * Checks if this is a section header entity
   * 
   * @private
   * @param {string} subCategoryKey - Subcategory to check
   * @param {string} profileKey - Profile key
   * @returns {boolean} True if this is a section header
   */
  #isSectionHeader(subCategoryKey, profileKey) {
    const profileStructure = this.#getProfileStructure(profileKey);
    if (!profileStructure) return false;
    const profileSection = profileStructure[profileKey.toUpperCase()];
    if (!profileSection) return false;
    return Object.keys(profileSection).some(key =>
      key.toLowerCase() === subCategoryKey.toLowerCase() &&
      key !== 'description' &&
      key !== 'type'
    );
  }

  /**
   * Clears all internal caches
   * 
   * @returns {void}
   */
  clearCache() {
    this.profileCache.clear();
    this.cacheAccessTimes.clear();
  }

  /**
   * Determines entity type using binary classification
   * 
   * @param {string} profileKey - Main profile identifier
   * @param {string} subCategoryKey - Subcategory identifier
   * @param {string} itemKey - Item identifier within subcategory
   * @param {string} parentContext - Parent section context (for nested entities)
   * @returns {string} Determined entity type classification
   */
  determineEntityType(profileKey, subCategoryKey, itemKey, parentContext = null) {
    return this.#generateFallbackType(profileKey, subCategoryKey);
  }

  /**
   * Discovers all available profiles in the profiles directory
   * 
   * @returns {Array<string>} Array of discovered profile names
   */
  discoverProfiles() {
    const profiles = [];
    if (!fs.existsSync(this.profilesDirectory)) {
      return profiles;
    }
    const regularProfiles = fs.readdirSync(this.profilesDirectory)
      .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
      .filter(file => !file.startsWith('.'))
      .map(file => path.basename(file, path.extname(file)));
    profiles.push(...regularProfiles);
    const commonDir = path.join(this.profilesDirectory, 'common');
    if (fs.existsSync(commonDir)) {
      const commonProfiles = fs.readdirSync(commonDir)
        .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
        .filter(file => !file.startsWith('.'))
        .map(file => path.basename(file, path.extname(file)));
      profiles.push(...commonProfiles);
    }
    return profiles;
  }
}

module.exports = EntityTypeAnalyzer;
