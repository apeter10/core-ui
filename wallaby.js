// Configuration for the Wallaby Visual Studio Code testing extension
// https://marketplace.visualstudio.com/items?itemName=WallabyJs.wallaby-vscode
// Note: Wallaby is not open source and costs money

module.exports = function (wallaby) {

  var compilerOptions = require('./src/lib/tsconfig.spec.json').compilerOptions;

  return {
    files: [
      // Polyfills
      { pattern: 'node_modules/core-js/client/shim.min.js', instrument: false },

      { pattern: 'node_modules/systemjs/dist/system.src.js', instrument: false },
      { pattern: 'node_modules/systemjs/dist/system-polyfills.js', instrument: false },

      { pattern: 'node_modules/zone.js/dist/zone.js', instrument: false },
      { pattern: 'node_modules/zone.js/dist/long-stack-trace-zone.js', instrument: false },
      { pattern: 'node_modules/zone.js/dist/proxy.js', instrument: false },
      { pattern: 'node_modules/zone.js/dist/sync-test.js', instrument: false },
      { pattern: 'node_modules/zone.js/dist/jasmine-patch.js', instrument: false },
      { pattern: 'node_modules/zone.js/dist/async-test.js', instrument: false },
      { pattern: 'node_modules/zone.js/dist/fake-async-test.js', instrument: false },

      // { pattern: 'node_modules/rxjs/**/*.js', instrument: false },

      { pattern: 'src/demo/systemjs.config.js', instrument: false },

      { pattern: 'src/lib/**/*+(ts|html|css)', load: false },
      { pattern: 'src/lib/**/*.spec.ts', ignore: true }
    ],

    tests: [
      { pattern: 'src/lib/**/*.spec.ts', load: false }
    ],

    middleware: function (app, express) {
      app.use('/node_modules', express.static(require('path').join(__dirname, 'node_modules')));
    },

    testFramework: 'jasmine',

    compilers: {
      '**/*.ts': wallaby.compilers.typeScript(compilerOptions)
    },

    preprocessors: {
      '**/*.js': function (file) {
        return file.content.replace('moduleId: module.id', 'moduleId: __moduleName');
      }
    },

    debug: true,

    bootstrap: function (wallaby) {
      wallaby.delayStart();

      System.config({
        transpiler: 'none',
        packages: {
          'src/lib': {
            meta: {
              './*.js': {
                scriptLoad: true
              }
            }
          }
        },

        paths: {
          'npm:': 'node_modules/'
        },

        // Assume npm: is set in `paths` in systemjs.config
        // Map the angular testing umd bundles
        map: {
          '@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
          '@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
          '@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
          '@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
          '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
          '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
          '@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',
          '@angular/forms/testing': 'npm:@angular/forms/bundles/forms-testing.umd.js'
        }
      });

      var promises = [
        Promise.all([
          System.import('@angular/core/testing'),
          System.import('@angular/platform-browser-dynamic/testing')
        ])

          .then(function (providers) {
            var coreTesting = providers[0];
            var browserTesting = providers[1];

            coreTesting.TestBed.initTestEnvironment(
              browserTesting.BrowserDynamicTestingModule,
              browserTesting.platformBrowserDynamicTesting());
          })
      ];

      for (var i = 0, len = wallaby.tests.length; i < len; i++) {
        promises.push(System['import'](wallaby.tests[i]));
      }

      Promise.all(promises).then(function () {
        wallaby.start();
      }).catch(function (e) {
        setTimeout(function () {
          throw e;
        }, 0);
      });
    }

  };
};
