'use strict';

/**
 * `strapi.orm.collections[model]` controller
 */

module.exports = {

  // List every entries of a model.
  find: function * () {
    try {
      const entry = yield strapi.hooks.blueprints.find(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  // Count entries of a model.
  count: function * () {
    const Model = strapi.hooks.blueprints.actionUtil.parseModel(this);
    const countQuery = Model.count().where(strapi.hooks.blueprints.actionUtil.parseCriteria(this));
    const count = yield countQuery;
    this.body = count;
  },

  // Show a specific entry.
  findOne: function * () {
    try {
      const entry = yield strapi.hooks.blueprints.findOne(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  // Create a new entry.
  create: function * () {
    try {
      const entry = yield strapi.hooks.blueprints.create(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  // Update a specific entry.
  update: function * () {
    // Password encryption for `user` model.
    if (this.params.model === 'user' && this.request.body.password) {
      this.request.body.password = yield strapi.api.user.services.user.hashPassword(this.request.body.password);
    }

    try {
      const entry = yield strapi.hooks.blueprints.update(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  // Destroy a specific entry.
  destroy: function * () {
    try {
      const entry = yield strapi.hooks.blueprints.destroy(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  }
};
