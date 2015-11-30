'use strict';

var angular = require('angular');
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
        initHideNameClasses();
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

    function initHideNameClasses() {
        var hideNameClasses = [];
        if (vm.hideNameOptions && vm.hideNameOptions.length > 0) {
            hideNameClasses.push(constants.CLASS_HIDE_NAME_OPTIONS);
        }
        if (vm.hideNameSelected && vm.hideNameSelected.length > 0) {
            hideNameClasses.push(constants.CLASS_HIDE_NAME_SELECTED);
        }
        vm.hideNameClasses = hideNameClasses.join(' ');
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
