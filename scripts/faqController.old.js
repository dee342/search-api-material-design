
angular.module('faqApp'['ngMaterial', 'cl.paging'])
.controller('faqController', ['$mdEditDialog','$faq','$mdDialog','$q', '$scope', '$timeout', function ($mdEditDialog,$faq,$mdDialog, $q, $scope,$timeout) {
  'use strict';

    $scope.currentPage = 0;


  $scope.selected = [];
  $scope.limitOptions = [5, 10, 15];
  var bookmark;
  $scope.options = {
    rowSelection: true,
    multiSelect: true,
    autoSelect: true,
    decapitate: false,
    largeEditDialog: false,
    boundaryLinks: false,
    limitSelect: true,
    pageSelect: true
  };


  $scope.filter = {
    options: {
      debounce: 500
    }
  };

  $scope.query = {
    order: 'faqId',
    limit: 5,
    page: 1
  };

  $scope.faqs = [];
  $scope.allFaqs = [];

  $scope.getFaqs= function() {
    $faq
    .getItems()
    .then(function(response){
      $scope.allFaqs = response;

   /*   angular.forEach(response, function(value1, key1) {
        response[key1].tagList = getStringText(value1);
      });

      function getStringText(value1) {
        var concatedStr ="";
        if(value1.tags !== undefined) {
          for(var i=0; i<value1.tags.length; i++) {
            concatedStr +=  value1.tags[i].text + " ," ;
          }
        }


        return concatedStr.substring(0,concatedStr.length-1);
      }; */      
       //console.log("Response from Server===>" + response.message);
      if(response.data) {

      $scope.faqs = response;  
    } else {
      $scope.faqs = [];
    }
      

      $scope.faqs.count = response.length;
      $scope.selected.length=0;
    });
  }

  $scope.loadStuff = function () {
    $scope.promise = $timeout(function () {
      // loading
    },2000);
  }

  $scope.addItem = function (event) {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: 'addItemController',
      controllerAs: 'ctrl',
      focusOnOpen: false,
      targetEvent: event,
      locals: { faqs: null},
      templateUrl: 'add-item-dialog.html',
    }).then( $scope.getFaqs);
  };

  $scope.delete = function (event) {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: 'deleteController',
      controllerAs: 'ctrl',
      focusOnOpen: false,
      targetEvent: event,
      locals: { faqs: $scope.selected },
      templateUrl: 'delete-dialog.html',
    }).then($scope.getFaqs);
  };

  $scope.editItem = function (event) {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: 'addItemController',
      controllerAs: 'ctrl',
      focusOnOpen: false,
      targetEvent: event,
      locals: { faqs: $scope.selected[0] },
      templateUrl: 'add-item-dialog.html',
    }).then($scope.getFaqs);
  };
  
  $scope.types = ['Any','faq','faq2'];
  $scope.searchType = 'Any';
  $scope.query.filter = '';
  $scope.removeFilter = function () {
    $scope.filter.show = false;
    $scope.query.filter = '';
    $scope.faqs = $scope.allFaqs;
    if($scope.filter.form.$dirty) {
      $scope.filter.form.$setPristine();
    }
  };

  $scope.doSearch = function(){
    $scope.faqs = [];
    
    var query_fields = [];
    if($scope.searchQuestion){
      query_fields.push("question")
    }
    
    if($scope.searchAnswer){
      query_fields.push("answer")
    }
    
    if($scope.searchTag){
      query_fields.push("tags")
    }

    if($scope.searchJourney){
      query_fields.push("journey")
    }    
    
    if(query_fields.length===0){
      query_fields = ['question','answer','tags','journey'];
    }

    $faq
    .searchItem($scope.query.filter,query_fields)
    .then(function(results){
      //Do something on success
      $scope.faqs = results;
    })
    .catch(function(){
      // Do something if we have errors
    })

  }

  $scope.$watch('query.filter', function (newValue, oldValue) {
    if(!oldValue) {
      bookmark = $scope.query.page;
    }

    if(newValue !== oldValue) {
      $scope.query.page = 1;
    }

    if(!newValue) {
      $scope.query.page = bookmark;
    }
  });

  $scope.getFaqs();

//     $scope.paging = {
//         total: 100,
//         current: 1,
//         onPageChanged: loadPages;
// }
//
//     function loadPages() {
//         console.log('Current page is : ' + $scope.paging.current);
//
//         // TODO : Load current page Data here
//
//         $scope.currentPage = $scope.paging.current;
//     }

}]);
