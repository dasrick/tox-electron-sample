//'use strict';
//var angular = require('angular');
//var path = require('path');
//
//
//var pathWebUtil = path.resolve(__dirname, 'utils', 'web-utils.js');
//console.log('pathWebUtil: ', pathWebUtil);
//
//var webUtils = require(pathWebUtil);
//webUtils.addLiveReload();


'use strict';

var appName = 'tox-electron-sample';
var angular = require('angular');

require('angular-resource');
require('angular-sanitize');
require('angular-ui-router');

var requires = [
  'ngResource',
  'ngSanitize',
  'ui.router',
  require('./components').name
];

angular.module(appName, requires)

  // redirect for unknown routes ///////////////////////////////////////////////////////////////////////////////////////
  //.config(function ($urlRouterProvider, $locationProvider, $resourceProvider, $httpProvider) {
  //  $urlRouterProvider.otherwise(function ($injector) {
  //    var $state;
  //    $state = $injector.get('$state');
  //    $state.go('app.management.chat');
  //  });
  //  //$httpProvider.interceptors.push('ResponseErrorInterceptor');
  //  $resourceProvider.defaults.stripTrailingSlashes = true;
  //})

;

angular.bootstrap(document, [appName]);
