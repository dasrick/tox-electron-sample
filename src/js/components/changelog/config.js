'use strict';
/**
 * @ngInject
 */
module.exports = {
  'app.base.changelog': {
    url: '/changelog',
    views: {
      'content': {
        templateUrl: './views/changelog/content.html',
        controller: 'ChangelogController as changelogVm'
      }
    },
    resolve: {
      ReleaseNotesResource: 'ReleaseNotesResource',
      releaseNotes: function (ReleaseNotesResource) {
        return ReleaseNotesResource.query().$promise;
      }
    }
  }
};
