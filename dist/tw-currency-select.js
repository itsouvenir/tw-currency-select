(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'; module.exports = angular.module("tw-currency-select-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("templates/currencySelect.html","<select\n        class=\"selectpicker currencies\"\n        data-live-search=\"{{vm.useSearch}}\"\n        data-live-search-placeholder=\"{{vm.calculatedSearchPlaceholder}}\"\n        data-none-results-text=\"{{vm.calculatedNoResultsText}}\"\n        data-none-selected-text=\"{{vm.calculatedNoneSelectedText}}\"\n        data-style=\"btn-input\">\n    <option data-hidden=\"true\"></option>\n    <option ng-repeat=\"currency in vm.mappedCurrencies track by currency.code\"\n            data-content=\n                    \"<div class=\'flag-currency-code\'>\n                        <div class=\'flag-wrapper\'>\n                            <div class=\'dropdown-flag flag24_{{vm.flagCode(currency.code)}}\'></div>\n                        </div>\n                        <span class=\'currency-code\'>{{currency.code}}</span>\n                    </div>\"\n            value=\"{{currency.code}}\">\n        {{currency.code}}\n    </option>\n</select>\n");}]);
},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
var currencyCountryMap = require('./currencyCountryMap');
var constants = require('./constants');

module.exports = function CurrencySelectController($scope, $timeout) {
    var vm = this;
    var currencyMap;
    vm.flagCode = flagCode;
    vm.onChangeHandler = mappedModelChangedHandler;

    init();

    function init() {
        initMapperAndExtractor();
        initCurrencies();
        initMappedCurrencies();
        initMappedModel();
        initSearch();
        initNoneSelectedText();
        initWatchers();
    }

    function initMapperAndExtractor() {
        vm.extractor = (typeof vm.extractor === 'function') ? vm.extractor : defaultExtractorAndMapper;
        vm.mapper = (typeof vm.mapper === 'function') ? vm.mapper : defaultExtractorAndMapper;
    }

    function initCurrencies() {
        vm.currencies = (vm.currencies) ? vm.currencies : [];
    }

    function initMappedCurrencies() {
        currencyMap = {};
        vm.mappedCurrencies = vm.currencies.map(vm.mapper);
        vm.mappedCurrencies.forEach(function(x) {
            currencyMap[x.code] = x;
        });
    }

    function initMappedModel() {
        vm.mappedModel = (vm.ngModel) ? vm.mapper(vm.ngModel) : undefined;
    }

    function initSearch() {
        vm.useSearch = vm.noSearch !== constants.ATTR_NO_SEARCH;

        vm.calculatedSearchPlaceholder = vm.searchPlaceholder;

        vm.calculatedNoResultsText = vm.noResultsText;
        if (vm.noResultsText === '' || vm.noResultsText === '0' || (!vm.noResultsText)) {
            vm.calculatedNoResultsText = constants.DEFAULT_NO_RESULTS_PLACEHOLDER;
        }
    }

    function initNoneSelectedText() {
        vm.calculatedNoneSelectedText = vm.noneSelectedText || '';
    }

    function initWatchers() {
        $scope.$watch('vm.ngModel', ngModelChangedHandler);
        $scope.$watch('vm.currencies', currencyListChangedHandler, true);
    }

    function currencyListChangedHandler(current) {
        if (!current) {
            return;
        }
        initCurrencies();
        initMappedCurrencies();
        initMappedModel();
    }

    function mappedModelChangedHandler(currentCode) {
        var newMappedModel = currencyMap[currentCode];
        var newNgModel = (newMappedModel) ? vm.extractor(newMappedModel) : undefined;
        if (!angular.equals(vm.ngModel, newNgModel)) {
            vm.ngModel = newNgModel;
            $timeout(vm.ngChange);
        }
    }

    function ngModelChangedHandler(current) {
        var newInternalModel = (current) ? vm.mapper(current) : undefined;
        if (!angular.equals(vm.mappedModel, newInternalModel)) {
            vm.mappedModel = newInternalModel;
        }
    }

    function flagCode(currency) {
        return currencyCountryMap[currency];
    }

    function defaultExtractorAndMapper(currency) {
        return currency;
    }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./constants":4,"./currencyCountryMap":5}],3:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

module.exports = function CurrencySelectDirective($timeout) {
    return {
        templateUrl: 'templates/currencySelect.html',
        bindToController: true,
        controller: 'CurrencySelectController',
        restrict: 'E',
        controllerAs: 'vm',
        scope: {
            currencies: '=',
            ngModel: '=',
            extractor: '=?',
            mapper: '=?',
            ngChange: '&',
            noSearch: '@',
            searchPlaceholder: '@',
            noResultsText: '@',
            noneSelectedText: '@'
        }, compile: function() {
            return function(scope, element) {
                var $selectElement = $(element).find('select');

                $selectElement.on('change', function() {
                    var value = this.value;
                    $timeout(function() {
                        scope.vm.onChangeHandler(value);
                    });
                });

                scope.$watch('vm.mappedModel', function(current) {
                    $timeout(function() {
                        if (current && current.code) {
                            $selectElement.selectpicker('val', current.code);
                        } else {
                            $selectElement.selectpicker('val', '');
                        }
                    });
                });

                scope.$watch('vm.mappedCurrencies', function (newVal) {
                    if (!newVal) {
                        return;
                    }
                    $timeout(function () {
                        $selectElement.selectpicker('refresh');
                    });
                }, true);

                $timeout(function() {
                    $selectElement.selectpicker();
                });
            };
        }
    };
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
'use strict';

var constants = {};

constants.ATTR_NO_SEARCH = 'no-search';

constants.DEFAULT_SEARCH_PLACEHOLDER = 'Search...';
constants.DEFAULT_NO_RESULTS_PLACEHOLDER = 'No results';

module.exports = constants;
},{}],5:[function(require,module,exports){
'use strict';

module.exports = {
	EUR: 'EU',
	AUD: 'AU',
	BGN: 'BG',
	BRL: 'BR',
	CAD: 'CA',
	CHF: 'CH',
	CNY: 'CN',
	CZK: 'CZ',
	DKK: 'DK',
	GBP: 'GB',
	GEL: 'GE',
	HKD: 'HK',
	HUF: 'HU',
	INR: 'IN',
	MYR: 'MY',
	MXN: 'MX',
	NOK: 'NO',
	NZD: 'NZ',
	PLN: 'PL',
	RON: 'RO',
	SEK: 'SE',
	SGD: 'SG',
	THB: 'TH',
	NGN: 'NG',
	PKR: 'PK',
	TRY: 'TR',
	USD: 'US',
	ZAR: 'ZA',
	JPY: 'JP',
	PHP: 'PH',
	MAD: 'MA',
	COP: 'CO',
	AED: 'AE',
	IDR: 'ID',
	CLP: 'CL',
	UAH: 'UA',
	GHS: 'GH',
	RUB: 'RU'
};

},{}],6:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
var CurrencySelectDirective = require('./CurrencySelectDirective');
var CurrencySelectController = require('./CurrencySelectController');
var templates = require('../build/tw-currency-select-templates');

var currencySelectModule = angular.module('tw-currency-select', [templates.name]);
currencySelectModule.controller('CurrencySelectController', ['$scope', '$timeout', CurrencySelectController]);
currencySelectModule.directive('currencySelect', ['$timeout', CurrencySelectDirective]);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../build/tw-currency-select-templates":1,"./CurrencySelectController":2,"./CurrencySelectDirective":3}]},{},[6]);
