angular.module('faqApp', ['md.data.table', 'ngMaterial', 'ngResource','ngTagsInput','cl.paging'])

  .config(['$compileProvider', '$mdThemingProvider', function ($compileProvider, $mdThemingProvider) {
    'use strict';

    $compileProvider.debugInfoEnabled(false);

    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('pink');
  }]);
