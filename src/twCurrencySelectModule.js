'use strict';

var angular = require('angular');
var CurrencySelectDirective = require('./CurrencySelectDirective');
var CurrencySelectController = require('./CurrencySelectController');
var templates = require('../build/tw-currency-select-templates');

var currencySelectModule = angular.module('tw-currency-select', [templates.name]);
currencySelectModule.controller('CurrencySelectController', ['$scope', '$timeout', CurrencySelectController]);
currencySelectModule.directive('currencySelect', ['$timeout', CurrencySelectDirective]);
