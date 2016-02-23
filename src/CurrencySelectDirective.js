'use strict';

var angular = require('angular');
var $ = require('jquery');

module.exports = function CurrencySelectDirective($timeout) {
    var previousTransclution = [];

    return {
        templateUrl: 'templates/currencySelect.html',
        bindToController: true,
        controller: 'CurrencySelectController',
        restrict: 'E',
        controllerAs: 'vm',
        transclude: true,
        scope: {
            currencies: '=',
            ngModel: '=',
            extractor: '=?',
            mapper: '=?',
            ngChange: '&',
            noSearch: '@',
            searchPlaceholder: '@',
            noResultsText: '@',
            noneSelectedText: '@',
            hideNameSelected: '@',
            hideNameOptions: '@'
        }, compile: function() {
            return function(scope, element, atts, controller, transcludeFn) {
                var $selectElement = $(element).find('select');
                $timeout(function() {
                    $selectElement.selectpicker();
                    moveTranscludedElement(element, transcludeFn);
                });

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
                            moveTranscludedElement(element, transcludeFn);
                        } else {
                            $selectElement.selectpicker('val', '');
                            moveTranscludedElement(element, transcludeFn);
                        }
                    });
                });

                scope.$watch('vm.mappedCurrencies', function (newVal) {
                    if (!newVal) {
                        return;
                    }
                    $timeout(function () {
                        $selectElement.selectpicker('refresh');
                        moveTranscludedElement(element, transcludeFn);
                    });
                }, true);

                scope.$on('$destroy', function() {
                   $selectElement.off('change');
                });
            };
        }
    };

    function moveTranscludedElement(element, transclude) {
        var $element = $(element);
        var $dropdownMenu = $element.find('ul.dropdown-menu');

        cleanupPreviousTransclusion();

        transclude(function(clone, scope) {
            $dropdownMenu.append(clone);
            previousTransclution.push({element: clone, scope: scope});
        });
    }

    function cleanupPreviousTransclusion() {
        previousTransclution.forEach(function(t) {
            t.element.remove();
            t.scope.$destroy();
        });
        previousTransclution = [];
    }
};
