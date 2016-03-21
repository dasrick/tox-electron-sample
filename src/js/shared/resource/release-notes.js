'use strict';
module.exports = {
  'ReleaseNotesResource': {
    'url': 'https://tox-electron-sample-nuts.herokuapp.com/notes',
    'actions': {
      'query': {
        method: 'GET',
        isArray: false,
        headers: {
        // //   'Accept': 'text/html,application/xhtml+xml,application/xml'
        // //   'Accept': 'text/html,application/xhtml+xml,application/xml',
        //   'Content-Type': 'text/plain'
        },
        // responseType: 'text'
      }
    }
  }
};
