/**
 * Package Builder
 * 
 * Enhances npm init -y output with memory-builder specific configuration
 * 
 * @module lib/PackageBuilder
 * @author AXIVO
 * @license BSD-3-Clause
 */
const fs = require('fs');
const path = require('path');

/**
 * Enhances package.json for memory builder project
 * 
 * @returns {Object} Enhanced package.json object
 */
function enhanceMemoryBuilderPackage() {
  const packagePath = path.resolve('./package.json');

  // Read current package.json
  if (!fs.existsSync(packagePath)) {
    throw new Error('package.json not found. Run "npm init -y" first.');
  }

  const currentPackage = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  // Enhance with memory-builder specific configuration
  const enhanced = {
    ...currentPackage,
    name: 'memory-builder',
    description: 'YAML to JSONL memory configuration builder for multi-profile collaboration system',
    main: 'builder.js',
    scripts: {
      'build': 'node builder.js',
      'build-sources': 'node builder.js --sources'
    },
    keywords: [
      'axivo',
      'collaboration',
      'engineering',
      'infrastructure',
      'mcp',
      'memory'
    ],
    directories: {
      ...currentPackage.directories,
      'lib': 'lib'
    }
  };

  // Write enhanced package.json
  fs.writeFileSync(packagePath, JSON.stringify(enhanced, null, 2) + '\n');

  console.log('✅ Enhanced package.json for AXIVO memory builder');
  console.log(`📦 Name: ${enhanced.name}`);
  console.log(`📝 Scripts: ${Object.keys(enhanced.scripts).join(', ')}`);

  return enhanced;
}

// Run when executed directly
if (require.main === module) {
  try {
    enhanceMemoryBuilderPackage();
  } catch (error) {
    console.error(`❌ Enhancement failed: ${error.message}`);
    process.exit(1);
  }
}

module.exports = enhanceMemoryBuilderPackage;
