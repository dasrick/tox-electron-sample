'use strict';

var ModuleName = 'status',
  RoutingConfig = require('./config');

module.exports = angular.module(ModuleName, [])

  .controller('StatusController', require('./controller/status-controller'))

  // routing
  .config(function ($stateProvider) {
    angular.forEach(RoutingConfig, function (config, name) {
      $stateProvider.state(name, config);
    });
  })

  // translation
  .config(function ($translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart(ModuleName);
  })
;
