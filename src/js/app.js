'use strict';

var appName = 'tox-electron-sample';
var angular = require('angular');

require('angular-loading-bar');
require('angular-resource');
require('angular-sanitize');
require('angular-translate');
require('angular-translate-loader-partial');
require('angular-ui-router');

var requires = [
  'angular-loading-bar',
  'ngResource',
  'ngSanitize',
  'pascalprecht.translate',
  'ui.router',
  require('./components').name
];

angular.module(appName, requires)

  // redirect for unknown routes ///////////////////////////////////////////////////////////////////////////////////////
  .config(['$urlRouterProvider', '$locationProvider', '$resourceProvider', function ($urlRouterProvider, $locationProvider, $resourceProvider) {
    $urlRouterProvider.otherwise(function ($injector) {
      var $state;
      $state = $injector.get('$state');
      $state.go('app.base.status');
    });
    //$httpProvider.interceptors.push('ResponseErrorInterceptor');
    $resourceProvider.defaults.stripTrailingSlashes = true;
  }])
  // ===================================================================================================================

  // translation stuff /////////////////////////////////////////////////////////////////////////////////////////////////
  .config(function ($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: 'i18n/{part}/{lang}.json'
    });
    // add translation table
    $translateProvider
      .registerAvailableLanguageKeys(['en', 'de'], {
        'en_*': 'en',
        'de_*': 'de'
      })
      .determinePreferredLanguage();

    /*
     The fallback language is not working ...
     $translateProvider.fallbackLanguage('en');
     The following workaround sets the preferred language to english,
     if the detection failed or the detected language is not known.
     */
    var language = $translateProvider.preferredLanguage();
    if ((language !== null) || !language.match(/(de).*/)) {
      return $translateProvider.preferredLanguage('de');
    }
  })
  // ===================================================================================================================

  // angular-loading-bar ///////////////////////////////////////////////////////////////////////////////////////////////
  .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])
  // ===================================================================================================================

;

angular.element(document).ready(function() {
  angular.bootstrap(document, [appName]);
});