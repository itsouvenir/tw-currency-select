'use strict';

require('../src/twCurrencySelectModule');
var constants = require('../src/constants');

describe('Directive: CurrencySelect', function() {
    var $compile,
        $rootScope,
        $scope,
        $httpBackend,
        $q,
        $timeout;

    beforeEach(angular.mock.module('tw-currency-select'));

    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        $q = $injector.get('$q');
        $compile = $injector.get('$compile');
        $timeout = $injector.get('$timeout');
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('currencies list', function() {
        describe('when no currencies are defined', function() {
            it('should be empty', function() {
                var directiveElement = getCompiledElement();
                togglePopup(directiveElement);
                var listElements = directiveElement[0].querySelectorAll('div.ui-select-choices-row');
                expect(listElements.length).toEqual(0);
            });
        });

        describe('when given a list of currencies', function() {
            var directiveElement;
            beforeEach(function() {
                $scope.currencies = [
                    {code: 'GBP', symbol: '£'},
                    {code: 'EUR', symbol: '€'}
                ];
                directiveElement = getCompiledElement();
            });

            it('should create an option for each specified currency', function() {
                togglePopup(directiveElement);

                var listElements = getAllCurrencyOptions(directiveElement);
                expect(listElements.length).toEqual(3);
                expect(listElements[1].textContent).toContain('GBP');
                expect(listElements[2].textContent).toContain('EUR');
            });

            it('should properly select the clicked element', function() {
                togglePopup(directiveElement);
                selectOptionWithIndex(directiveElement, 1);
                expect($scope.selectedCurrency).toEqual($scope.currencies[1]);
            });

            it('should update the list when the list is redefined', function() {
                $scope.currencies = [
                    {code: 'GBP', symbol: '£'},
                    {code: 'EUR', symbol: '€'},
                    {code: 'USD', symbol: '$'}
                ];
                $scope.$digest();

                var isolateScope = directiveElement.isolateScope();

                expect(isolateScope.vm.mappedCurrencies).toEqual($scope.currencies);
            });
        });
    });

    describe('mapper & extractor', function() {
        beforeEach(function() {
            $scope.mapper = function(currencyCode) {
                return {code: currencyCode};
            };
            $scope.extractor = function(currency) {
                return currency.code;
            }
        });

        it('should map the provided currency to the expected format', function() {
            $scope.currencies = ['EUR', 'GBP'];
            var directiveElement = getCompiledElementWithWithMapperAndExtractor();
            var isolateScope = directiveElement.isolateScope();

            expect(isolateScope.vm.mappedCurrencies).toEqual([
                {code: 'EUR'}, {code: 'GBP'}
            ]);
        });

        it('should extract the currency in the format defined in the extractor', function() {
            $scope.currencies = ['EUR', 'GBP'];
            var directiveElement = getCompiledElementWithWithMapperAndExtractor();

            togglePopup(directiveElement);
            selectOptionWithIndex(directiveElement, 1);
            expect($scope.selectedCurrency).toEqual('GBP');
        });
    });

    describe('ngModel', function() {
        var directiveElement;
        beforeEach(function() {
            $scope.selectedCurrency = {code: 'GBP'};
            $scope.currencies = [{code: 'EUR'}, {code: 'GBP'}];
            directiveElement = getCompiledElement();
        });

        it('should select the hidden option when the model is undefined', function() {
            $scope.selectedCurrency = undefined;
            directiveElement = getCompiledElement();
            expect(directiveElement[0].querySelectorAll('li.hidden.selected').length).toEqual(1);
        });

        it('should select the defined value', function() {
            var isolateScope = directiveElement.isolateScope();
            expect(directiveElement[0].querySelectorAll('li.selected').length).toEqual(1);
            expect(isolateScope.vm.mappedModel).toEqual({code: 'GBP'});
        });

        it('should listen to changes and select the appropriate value', function() {
            $scope.selectedCurrency = {code: 'EUR'};
            $scope.$digest();
            var isolateScope = directiveElement.isolateScope();
            expect(isolateScope.vm.mappedModel).toEqual({code: 'EUR'});
        });
    });

    describe('no-search', function() {
        it('should hide the search element when specified', function() {
            $scope.currencies = [{code: 'EUR'}, {code: 'GBP'}];
            var directiveElement = getCompiledElementWithHiddenSearch();
            togglePopup(directiveElement);
            expect(directiveElement[0].querySelectorAll('.bs-searchbox').length).toEqual(0);
        });

        it('should not hide the search element when omitted', function() {
            $scope.currencies = [{code: 'EUR'}, {code: 'GBP'}];
            var directiveElement = getCompiledElement();
            togglePopup(directiveElement);
            expect(directiveElement[0].querySelectorAll('.bs-searchbox').length).toEqual(1);
        });
    });

    describe('search-placeholder', function() {
        it('should set the search text accordingly when specified', function() {
            $scope.searchPlaceholder = 'Buscando...';
            var directiveElement = getCompiledElementWithSearchPlaceholder();
            var inputElement = directiveElement[0].querySelector('.bs-searchbox input');
            var placeHolderValue = inputElement.getAttribute('placeholder');
            expect(placeHolderValue).toEqual($scope.searchPlaceholder);
        });

        it('should set the search text to be specified as an empty string', function() {
            $scope.searchPlaceholder = '';
            var directiveElement = getCompiledElementWithSearchPlaceholder();
            var inputElement = directiveElement[0].querySelector('.bs-searchbox input');
            var placeHolderValue = inputElement.getAttribute('placeholder');
            expect(placeHolderValue).toEqual('');
        });

        it('should be empty when omitted', function() {
            var directiveElement = getCompiledElement();
            var inputElement = directiveElement[0].querySelector('.bs-searchbox input');
            var placeHolderValue = inputElement.getAttribute('placeholder');
            expect(placeHolderValue).toEqual('');
        });
    });

    describe('no-results-text', function() {
        beforeEach(function() {
            $scope.currencies = [{code: 'EUR'}];
        });

        it('should set the no results text accordingly when specified', function() {
            $scope.noResultsText = 'Nada';
            var directiveElement = getCompiledElementWithResultsText();
            searchFor(directiveElement, 'doesNotExist');

            var noResultsElement = directiveElement[0].querySelector('li.no-results');
            var noResultsText = noResultsElement.innerText;
            expect(noResultsText).toEqual($scope.noResultsText);
        });

        it('should set the no results text to the default when empty', function() {
            $scope.noResultsText = '';
            var directiveElement = getCompiledElementWithResultsText();
            searchFor(directiveElement, 'doesNotExist');

            var noResultsElement = directiveElement[0].querySelector('li.no-results');
            var noResultsText = noResultsElement.innerText;
            expect(noResultsText).toEqual(constants.DEFAULT_NO_RESULTS_PLACEHOLDER);
        });

        it('should fallback to the default value when omitted', function() {
            var directiveElement = getCompiledElement();
            searchFor(directiveElement, 'doesNotExist');

            var noResultsElement = directiveElement[0].querySelector('li.no-results');
            var noResultsText = noResultsElement.innerText;
            expect(noResultsText).toEqual(constants.DEFAULT_NO_RESULTS_PLACEHOLDER);
        });
    });
    function selectOptionWithIndex(directiveElement, index) {
        var entry = $(getAllCurrencyOptions(directiveElement)[index + 1]);
        entry.find('a').trigger('click');
        $scope.$digest();
        $timeout.flush();
    }

    function getAllCurrencyOptions(directiveElement) {
        return directiveElement[0].querySelectorAll('.dropdown-menu > li');
    }

    function togglePopup(directiveElement) {
        var btn = angular.element(directiveElement[0].querySelector('.dropdown-toggle'));
        btn.triggerHandler('click');
    }

    function searchFor(directiveElement, text) {
        var input = angular.element(directiveElement[0].querySelector('.bs-searchbox input'));
        $(input).val(text);
        $(input).trigger('input');
    }

    function getCompiledElement() {
        var element = angular.element('<currency-select ' +
            'ng-model="selectedCurrency" currencies="currencies" ng-change="changedHandler()"></currency-select>');
        var compiledElement = $compile(element)($scope);
        $scope.$digest();
        $timeout.flush();
        return compiledElement;
    }

    function getCompiledElementWithHiddenSearch() {
        var element = angular.element('<currency-select ' +
            'ng-model="selectedCurrency" no-search="no-search" currencies="currencies" ng-change="changedHandler()"></currency-select>');
        var compiledElement = $compile(element)($scope);
        $scope.$digest();
        $timeout.flush();
        return compiledElement;
    }

    function getCompiledElementWithSearchPlaceholder() {
        var element = angular.element('<currency-select ' +
            'ng-model="selectedCurrency" search-placeholder="{{searchPlaceholder}}" currencies="currencies" ng-change="changedHandler()"></currency-select>');
        var compiledElement = $compile(element)($scope);
        $scope.$digest();
        $timeout.flush();
        return compiledElement;
    }

    function getCompiledElementWithResultsText() {
        var element = angular.element('<currency-select ' +
            'ng-model="selectedCurrency" no-results-text="{{noResultsText}}" currencies="currencies" ng-change="changedHandler()"></currency-select>');
        var compiledElement = $compile(element)($scope);
        $scope.$digest();
        $timeout.flush();
        return compiledElement;
    }

    function getCompiledElementWithWithMapperAndExtractor() {
        var element = angular.element('<currency-select ' +
            'ng-model="selectedCurrency" ' +
            'currencies="currencies" ' +
            'mapper="mapper" ' +
            'extractor="extractor" ' +
            'ng-change="changedHandler()"></currency-select>');
        var compiledElement = $compile(element)($scope);
        $scope.$digest();
        $timeout.flush();
        return compiledElement;
    }
});
