'use strict';

var ModuleName = 'changelog',
  RoutingConfig = require('./config');

module.exports = angular.module(ModuleName, [])

  .controller('ChangelogController', require('./controller/changelog-controller'))

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
