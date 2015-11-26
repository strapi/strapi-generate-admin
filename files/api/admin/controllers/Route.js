'use strict';

module.exports = {

  /**
   * List routes.
   */

  find: function * () {
    try {
      const routes = yield strapi.api.admin.services.routes.find();
      this.body = routes;
    } catch (err) {
      this.status = 500;
      this.body = err;
    }
  },

  /**
   * Update routes.
   */

  update: function * () {
    let routes;
    let routesFound;

    try {
      routes = this.request.body;
      yield strapi.api.admin.services.routes.update(routes);
      routesFound = yield strapi.api.admin.services.routes.find();
      this.body = routesFound;
    } catch (err) {
      this.status = 500;
      this.body = err;
    }
  }
};
