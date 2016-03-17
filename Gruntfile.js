var path = require('path');
var execFile = require('child_process').execFile;
var packagejson = require('./package.json');
var electron = require('electron-prebuilt');
var webpack = require('webpack');
//
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  //var target = grunt.option('target') || 'development';
//  var beta = grunt.option('beta') || false;
//  var alpha = grunt.option('alpha') || false;
  var env = process.env;
  env.NODE_PATH = '..:' + env.NODE_PATH;
  //env.NODE_ENV = target;

//  var certificateFile = grunt.option('certificateFile');
//
//  var version = function (str) {
//    var match = str.match(/(\d+\.\d+\.\d+)/);
//    return match ? match[1] : null;
//  };
//
  var BASENAME = 'toxElectronSample';
  var OSX_APPNAME = BASENAME + ' (Alpha)';
  var WINDOWS_APPNAME = BASENAME + ' (Alpha)';
  var LINUX_APPNAME = BASENAME + ' (Alpha)';
  var OSX_OUT = './dist';
  var OSX_OUT_X64 = OSX_OUT + '/' + OSX_APPNAME + '-darwin-x64';
  var OSX_FILENAME = OSX_OUT_X64 + '/' + OSX_APPNAME + '.app';

  // pathes ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var PathJsSrc = path.resolve(__dirname, 'src', 'js', 'app.js');
  var PathJsDst = path.resolve(__dirname, 'build', 'js');

  grunt.initConfig({
    IDENTITY: 'Developer ID Application: dasrick',
    OSX_FILENAME: OSX_FILENAME,
    OSX_FILENAME_ESCAPED: OSX_FILENAME.replace(/ /g, '\\ ').replace(/\(/g, '\\(').replace(/\)/g, '\\)'),

    // electron
    electron: {
      windows: {
        options: {
          name: BASENAME,
          dir: 'build/',
          out: 'dist',
          version: packagejson['electron-version'],
          platform: 'win32',
          arch: 'x64',
          asar: true,
          icon: 'assets/win/icon.ico'  // ToDo korektes icon setzen
        }
      },
      osx: {
        options: {
          name: OSX_APPNAME,
          dir: 'build/',
          out: 'dist',
          version: packagejson['electron-version'],
          platform: 'darwin',
          arch: 'x64',
          asar: true,
          'app-version': packagejson.version
        }
      },
      linux: {
        options: {
          name: LINUX_APPNAME,
          dir: 'build/',
          out: 'dist',
          version: packagejson['electron-version'],
          platform: 'linux',
          arch: 'x64',
          asar: true,
          'app-bundle-id': 'de.dasrick.tox-electron-sample',
          'app-version': packagejson.version
        }
      }
    },

    rcedit: {
      exes: {
        files: [{
          expand: true,
          cwd: 'dist/' + BASENAME + '-win32-x64',
          src: [BASENAME + '.exe']
        }],
        options: {
          icon: 'assets/win/icon.ico',
          'file-version': packagejson.version,
          'product-version': packagejson.version,
          'version-string': {
            'CompanyName': 'dasrick',
            'ProductVersion': packagejson.version,
            'ProductName': WINDOWS_APPNAME,
            'FileDescription': WINDOWS_APPNAME,
            'InternalName': BASENAME + '.exe',
            'OriginalFilename': BASENAME + '.exe',
            'LegalCopyright': 'Copyright 2016 dasrick. All rights reserved.'
          }
        }
      }
    },

//    // images
    copy: {
      dev: {
        files: [
          {
            expand: true,
            cwd: '.',
            src: ['package.json', 'settings.json', 'index.html', 'index.dark.html', 'main.js', 'inject-onload.js'],
            dest: 'build/'
          },
          {
            expand: true,
            cwd: 'node_modules/font-awesome/fonts/',
            src: ['**/*'],
            dest: 'build/fonts/font-awesome/'
          },
          {
            expand: true,
            cwd: 'node_modules/npm-font-source-sans-pro/fonts/',
            src: ['**/*'],
            dest: 'build/fonts/source-sans-pro/'
          }
        ]
      },
      windows: {
        //files: [{
        //  expand: true,
        //  cwd: 'resources',
        //  src: ['ssh.exe', 'OPENSSH_LICENSE', 'msys-*'],
        //  dest: 'dist/' + BASENAME + '-win32-x64/resources/resources'
        //}],
        options: {
          mode: true
        }
      },
      osx: {
        files: [{
          expand: true,
          cwd: 'resources',
          src: ['terminal'],
          dest: '<%= OSX_FILENAME %>/Contents/Resources/resources/'
        }, {
          src: 'assets/osx/icon.icns',  // ToDo vielleicht noch woanders und besser und und und
          dest: '<%= OSX_FILENAME %>/Contents/Resources/atom.icns'  // ToDo vielleicht noch woanders - does it works?
        }],
        options: {
          mode: true
        }
      }
    },
//
//    rename: {
//      installer: {
//        src: 'dist/Setup.exe',
//        dest: 'dist/' + BASENAME + 'Setup-' + packagejson.version + '-Windows-Alpha.exe'
//      }
//    },

    // styles
    less: {
      options: {
        sourceMapFileInline: true
      },
      dist: {
        files: {
          'build/css/theme.dark.css': 'src/less/theme.dark.less',
          'build/css/theme.light.css': 'src/less/theme.light.less'
        }
      }
    },

    // webpackinger
    webpack: {
      buildinger: {
        entry: PathJsSrc,
        output: {
          path: PathJsDst,
          filename: 'app.js'
        }
      }
    },

    shell: {
      electron: {
        command: electron + ' ' + 'build',
        options: {
          async: true,
          execOptions: {
            env: env
          }
        }
      },
      sign: {
        options: {
          failOnError: false
        },
        command: [
          'codesign --deep -v -f -s "<%= IDENTITY %>" <%= OSX_FILENAME_ESCAPED %>/Contents/Frameworks/*',
          'codesign -v -f -s "<%= IDENTITY %>" <%= OSX_FILENAME_ESCAPED %>',
          'codesign -vvv --display <%= OSX_FILENAME_ESCAPED %>',
          'codesign -v --verify <%= OSX_FILENAME_ESCAPED %>'
        ].join(' && ')
      },
      zip: {
        command: 'ditto -c -k --sequesterRsrc --keepParent <%= OSX_FILENAME_ESCAPED %> release/' + BASENAME + '-' + packagejson.version + '-Mac.zip'
      }
    },

    clean: {
      release: ['build/', 'dist/']
    },

    compress: {
      windows: {
        options: {
          archive: './release/' + BASENAME + '-' + packagejson.version + '-Windows.zip',
          mode: 'zip'
        },
        files: [{
          expand: true,
          dot: true,
          cwd: './dist/' + BASENAME + '-win32-x64',
          src: '**/*'
        }]
      }
    },

    // livereload
    watchChokidar: {
      options: {
        spawn: true
        //spawn: false
      },
      livereload: {
        options: {livereload: true},
        files: ['build/**/*']
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['webpack']
      },
      less: {
        files: ['src/less/**/*.less', 'src/less/*.less'],
        tasks: ['less']
      },
      copy: {
        files: ['images/*', 'index.html', 'fonts/*'],
        tasks: ['newer:copy:dev']
      }
    }
  });
//
//  grunt.registerTask('default', ['newer:babel', 'less', 'newer:copy:dev', 'shell:electron', 'watchChokidar']);
  grunt.registerTask('default', ['less', 'webpack', 'newer:copy:dev', 'shell:electron', 'watchChokidar']);
//  grunt.registerTask('release', ['clean:release', 'babel', 'less', 'copy:dev', 'electron', 'copy:osx', 'shell:sign', 'shell:zip', 'copy:windows', 'rcedit:exes', 'compress']);
  grunt.registerTask('release', ['clean:release', 'less', 'webpack', 'copy:dev', 'electron', 'copy:osx', 'shell:sign', 'shell:zip', 'copy:windows', 'rcedit:exes', 'compress']);

  process.on('SIGINT', function () {
    grunt.task.run(['shell:electron:kill']);
    process.exit(1);
  });
};
