'use strict';

require('../src/twCurrencySelectModule');

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

    function getCompiledElement() {
        var element = angular.element('<currency-select ' +
            'ng-model="selectedCurrency" currencies="currencies" ng-change="changedHandler()"></currency-select>');
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
