'use strict';

var angular = require('angular');
var $ = require('jquery');

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
            ngChange: '&'
        }, compile: function(tElm) {
            return function(scope) {
                var $selectElement = $(tElm.find('select'));

                $selectElement.on('change', function() {
                    var value = this.value;
                    $timeout(function() {
                        scope.vm.onChangeHandler(value);
                    });
                });

                scope.$watch('vm.mappedModel', function(current) {
                    if (current && current.code) {
                        $selectElement.val(current.code);
                    } else {
                        $selectElement.val(undefined);
                    }
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
