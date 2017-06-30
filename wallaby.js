// Configuration for the Wallaby Visual Studio Code testing extension
// https://marketplace.visualstudio.com/items?itemName=WallabyJs.wallaby-vscode
// Note: Wallaby is not open source and costs money

module.exports = function(wallaby) {
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

      { pattern: 'src/lib/**/*.ts', instrument: true, load: false },
      { pattern: 'src/lib/**/*.html', instrument: false },
      { pattern: 'src/lib/**/*.css', instrument: false },
      { pattern: 'src/lib/**/*.spec.ts', ignore: true },
      { pattern: 'src/lib/**/*.d.ts', ignore: true }
    ],

    tests: [{ pattern: 'src/lib/src/**/*.spec.ts', load: false }],

    // inlining templates
    preprocessors: {
      'src/lib/src/component/*.ts': require('wallaby-gulp-adapter')(
        require('gulp-inline-ng2-template')({ base: 'src/lib/src/component', target: 'es5' })
      )
    },

    middleware: function(app, express) {
      app.use('/node_modules', express.static(require('path').join(__dirname, 'node_modules')));
    },

    testFramework: 'jasmine',

    compilers: {
      '**/*.ts': wallaby.compilers.typeScript({
        module: 'system', // or amd
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        noImplicitAny: false
      })
    },

    debug: true,

    setup: function(wallaby) {
      wallaby.delayStart();

      System.config({
        transpiler: 'none',
        meta: {
          'src/lib/*': {
            scriptLoad: true,
            format: 'register'
          }
        },
        paths: {
          'npm:': 'node_modules/'
        },

        // Assume npm: is set in `paths` in systemjs.config
        // Map the angular testing umd bundles
        map: {
          app: 'src/lib/',
          '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
          '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
          '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
          '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
          '@angular/platform-browser-dynamic':
            'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
          '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
          '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
          '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
          '@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
          '@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
          '@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
          '@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
          '@angular/platform-browser-dynamic/testing':
            'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
          '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
          '@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',
          '@angular/forms/testing': 'npm:@angular/forms/bundles/forms-testing.umd.js',
          rxjs: 'npm:rxjs',
          'ngx-toastr': 'npm:ngx-toastr/toastr.umd.js'
        },

        packages: {
          app: {
            main: './index.js',
            defaultExtension: 'js'
          },
          rxjs: {
            defaultExtension: 'js'
          }
        }
      });

      var promises = [
        Promise.all([
          System.import('@angular/core/testing'),
          System.import('@angular/platform-browser-dynamic/testing')
        ]).then(function(providers) {
          var coreTesting = providers[0];
          var browserTesting = providers[1];

          coreTesting.TestBed.initTestEnvironment(
            browserTesting.BrowserDynamicTestingModule,
            browserTesting.platformBrowserDynamicTesting()
          );
        })
      ];

      for (var i = 0, len = wallaby.tests.length; i < len; i++) {
        promises.push(System['import'](wallaby.tests[i]));
      }

      Promise.all(promises)
        .then(function() {
          wallaby.start();
        })
        .catch(function(e) {
          setTimeout(function() {
            throw e;
          }, 0);
        });
    }
  };
};
