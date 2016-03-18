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
      'header': {
        templateUrl: './views/core/header.html'
      },
      'main': {
        templateUrl: './views/core/sidebar.html'
      },
      'footer': {
        templateUrl: './views/core/footer.html'
      }
    }
  }
};
