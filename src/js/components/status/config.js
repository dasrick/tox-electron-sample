'use strict';
/**
 * @ngInject
 */
module.exports = {
  'app.base.status': {
    url: '/status',
    views: {
      'content': {
        templateUrl: './views/status/content.html',
        controller: 'StatusController as statusVm'
      }
    }
  }
};
