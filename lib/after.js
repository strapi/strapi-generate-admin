'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const path = require('path');

// Public node modules.
const fs = require('fs-extra');

/**
 * Runs after this generator has finished
 *
 * @param {Object} scope
 * @param {Function} cb
 */

module.exports = function afterGenerate(scope, cb) {
  // Symlink for admin public assets folder.
  fs.symlinkSync('../api/admin/public/dist', path.resolve(scope.rootPath, 'public', 'admin'), 'junction');

  return cb();
};
