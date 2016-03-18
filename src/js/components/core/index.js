'use strict';

var ModuleName = 'core',
  RoutingConfig = require('./config');

module.exports = angular.module(ModuleName, [])

  .controller('CoreController', require('./controller/core-controller'))

  // routing
  .config(function ($stateProvider) {
    angular.forEach(RoutingConfig, function (config, name) {
      $stateProvider.state(name, config);
    });
  })

  //// translation
  //.config(function ($translatePartialLoaderProvider) {
  //  $translatePartialLoaderProvider.addPart(ModuleName);
  //})
;
