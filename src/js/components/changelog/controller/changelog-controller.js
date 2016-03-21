'use strict';

/**
 * @ngInject
 */
module.exports = function ($log, releaseNotes) {
  var vm = this;
  vm.releaseNotes = releaseNotes;
  
  $log.info('changelog-controller loaded');
  $log.info('changelog-controller releaseNotes: ', releaseNotes);
};
