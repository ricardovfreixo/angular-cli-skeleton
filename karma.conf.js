/*
 * MIT License
 *
 * Copyright (c) 2017 Stefano Cappa
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const os = require('os');

console.log(`Starting Karma with isCI=${!!isCI()}`);

function isCI() {
  return process.env.CI || process.env.APPVEYOR || process.env.TRAVIS;
}

function getBrowsers() {
  if (process.env.CI) {
    if (process.env.APPVEYOR) { // variable defined by APPVEYOR itself
      // only for AppVeyor
      return ['Chrome', 'Firefox' /*, 'IE'*/];
    } else if (process.env.TRAVIS) { // variable defined by TRAVIS itself
      return ['ChromeHeadless', 'Chrome', 'Firefox'];
    } else if (process.env.CIRCLECI) { // variable defined by CIRCLECI itself
      return ['ChromeHeadless', 'Chrome', 'Firefox'];
    }
  } else {
    switch(os.platform()) {
      case 'win32': // Windows
        return ['ChromeHeadless', 'Chrome', 'Firefox' /*'IE'*/];
      case 'darwin': // macOS
        return ['ChromeHeadless', 'Chrome', 'Firefox'/*, 'Safari'*/];
      default: // other (linux, freebsd, openbsd, sunos, aix)
        return ['ChromeHeadless', 'Chrome', 'Firefox'];
    }
  }
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-edge-launcher'),
      require('karma-firefox-launcher'),
      require('karma-ie-launcher'),
      require('karma-safari-launcher'),
      require('karma-coverage'),
      require('karma-jasmine-diff-reporter'),
      require('karma-jasmine-html-reporter'),
      require('karma-mocha-reporter'),
      require('karma-remap-coverage'),
      require('karma-sonarqube-unit-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly', 'json' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'mocha', 'kjhtml', 'coverage', 'remap-coverage', 'sonarqubeUnit'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: getBrowsers(),
    singleRun: false,

    coverageReporter: {
      type: 'in-memory'
    },

    sonarQubeUnitReporter: {
      sonarQubeVersion: '5.x',
      outputFile: 'reports/ut_report.xml',
      overrideTestDescription: true,
      testPath: 'src',
      testFilePattern: '.spec.ts',
      useBrowserName: false
    },

    remapCoverageReporter: {
      'text-summary': null,
      'json': './coverage/coverage.json',
      'html': './coverage/html',
      'lcovonly': './coverage/lcov.info'
    },

    jasmineDiffReporter: {
      multiline: true
    },

    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          ' --remote-debugging-port=9222',
        ]
      }
    },

    // For AppVeyor and TravisCI to prevent timeouts
    browserNoActivityTimeout: 60000
  });
};