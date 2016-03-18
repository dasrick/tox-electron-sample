'use strict';
/**
 * @ngInject
 */
module.exports = {
  'app': {
    url: '',
    abstract: true,
    views: {
      'app': {
        controller: 'CoreController as coreVm'
      }
    }
  },
  'app.base': {
    url: '/base',
    //abstract: true,
    views: {
      'main': {
        templateUrl: './views/core/sidebar.html'
      },
      'footer': {
        templateUrl: './views/core/footer.html'
      }
    }
  }
};
