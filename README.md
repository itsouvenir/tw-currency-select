# tw-currency-select

> Currency select drop-down with flags

This plugin allows you to create a currency select dropdown on your page just by providing it with a list of currencies

Check a live example <a href="https://rawgit.com/transferwise/tw-currency-select/master/example/index.html" target="_blank">here</a>

The code of the example can be found [here](./example/index.html)

## Getting the plugin

The easiest way is to use bower
```
    bower install --save https://github.com/transferwise/tw-currency-select
```

## How to use

HTML - include tw-currency-select.js

```html
    <script src="path-to/ng-scroll-repeat.js"></script>
```

JS - inject ng-scroll-repeat

```js
    angular.module('myApp',['tw-currency-select']);
```

HTML
```html
    <currency-select
        class="theDropdown m-b-lg"
        ng-model="selectedCurrency"
        currencies="currencies"
        ng-change="changedHandler()"></currency-select>
```

OPTION - provide a `mapper` and an `extractor` to allow any object type in the currency list

Normally the currency-select component expects the currencies to have the following format

```js
    [{code: 'EUR'}, {code: 'GBP'}]
```

However by providing a mapper and an extractor as follows you can have a list of whatever type
HTML
```html
    <currency-select
                    class="theDropdown"
                    ng-model="selectedCurrencyCode"
                    currencies="currencyCodes"
                    mapper="codeMapper"
                    extractor="codeExtractor"
                    ng-change="changedCodeHandler()"></currency-select>
```

JS
```js

$scope.currencyCodes = ['EUR', 'GBP'];

$scope.codeMapper = function(code) {
    return {code: code};
};

$scope.codeExtractor = function(currency) {
    return currency.code;
};
```
