'use strict';

/**
 * @ngInject
 */
module.exports = require('angular')
  .module('shared', [
  ])

  // mi-angular-resource-builder ///////////////////////////////////////////////////////////////////////////////////////
  .config(['ResourceBuilderProvider', function (ResourceBuilderProvider) {
    // append url based on environment
    // var apiUrl = process.env.apiUrl;
    var resources = require('./resource/index');
    // for (var resource in resources) {
    //   if (resources.hasOwnProperty(resource)) {
    //     if (resources[resource].hasOwnProperty('url')) {
    //       resources[resource].url = apiUrl + resources[resource].url;
    //     }
    //   }
    // }
    ResourceBuilderProvider.addResources(resources);
  }])
  // ===================================================================================================================
;
