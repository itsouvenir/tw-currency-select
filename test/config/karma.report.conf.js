//Karma configuration for version 0.10

module.exports = function(config) {
    config.set({
        basePath: '../../',

        autoWatch: true,

        frameworks: ['jasmine', 'browserify'],

        reporters: ['junit'],

        browsers: ['PhantomJS'],
        //browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],

        plugins: [
            'karma-browserify',
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-phantomjs-launcher'
        ],

        files: [
            'libs/angular/angular.js',
            'libs/angular-mocks/angular-mocks.js',
            'libs/jquery/dist/jquery.js',
            'libs/bootstrap/dist/js/bootstrap.js',
            'libs/bootstrap-select/dist/js/bootstrap-select.js',
            'test/*.spec.js'
        ],

        preprocessors: {
            'test/*.js': [ 'browserify' ]
        },

        "browserify": {
            "debug": true,
            "transform": [
                "browserify-shim"
            ]
        },

        "browserify-shim": {
            "angular": "global:angular",
            "jquery": "global:jQuery"
        },

        "junitReporter": {
            "outputDir": 'build/test-results'
        }
    });
};
