angular.module('faqApp')
    .controller('faqController', ['$mdEditDialog', '$faq', '$mdDialog', '$q', '$scope', '$timeout', function($mdEditDialog, $faq, $mdDialog, $q, $scope, $timeout) {
        'use strict';
        $scope.openMenu = function($mdOpenMenu, ev) {
            console.log($mdOpenMenu, ev, 'test');
            $mdOpenMenu(ev);
        };
        $scope.selected = [];
        //$scope.limitOptions = [5, 10, 15];
        $scope.limitOptions = [25, 75, 100];
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

        $scope.currentPage = 0;

        $scope.paging = {
            total: 0,
            current: 1,
            onPageChanged: loadPages,
        };

        function loadPages() {
            console.log('Current page is : ' + $scope.paging.current);

            // TODO : Load current page Data here

            $scope.currentPage = $scope.paging.current;
        };


        $scope.filter = {
            options: {
                debounce: 500
            }
        };

        $scope.query = {
            order: 'faqId',
            limit: 25,
            page: 1
        };

        $scope.faqs = [];
        $scope.allFaqs = [];

        $scope.getFaqs = function() {
            $faq
                .getItems()
                .then(function(response) {
                  console.log('response',response);
                    $scope.faqList = response;
                    //console.log(response,"GETFAQS")
                    $scope.loadList();
                    $scope.faqs.count = response.length;
                    $scope.selected.length = 0;
                })
                .catch(function(e){ console.log(e) })
        }

        $scope.loadList = function(){
            $scope.faqs = [];
            var offset = ($scope.query.page-1) * $scope.query.limit;
            for (var i = offset; i < offset+$scope.query.limit; i++) {
                $faq
                .getItem($scope.faqList[i])
                .then(function(response){
                    $scope.faqs.push(response);
                });
            }
        };

        $scope.loadStuff = function() {
            $scope.promise = $timeout(function() {
                // loading
            }, 2000);
        }

        $scope.addItem = function(event) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'addItemController',
                controllerAs: 'ctrl',
                focusOnOpen: false,
                targetEvent: event,
                locals: {
                    faqs: null
                },
                templateUrl: 'add-item-dialog.html',
            }).then($scope.getFaqs);
        };
        $scope.unselectItem= function(event) {
        if($scope.selected.length > 0) {
            $scope.selected.length = 0;
        }
      };

        $scope.delete = function(event) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'deleteController',
                controllerAs: 'ctrl',
                focusOnOpen: false,
                targetEvent: event,
                locals: {
                    faqs: $scope.selected
                },
                templateUrl: 'delete-dialog.html',
            }).then(function() {
                var alert;
                alert = $mdDialog.alert({
                    //<md-icon>done</md-icon>
                    title: 'FAQ Deleted',
                    //textContent: response,
                    ok: 'Ok'
                  });

              $mdDialog
              .show( alert )
              .finally(function() {
                alert = undefined;
              });
             $scope.getFaqs
            });
        };

        $scope.editItem = function(event) {
            console.log("selected: ", $scope.selected[0]);
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'addItemController',
                controllerAs: 'ctrl',
                focusOnOpen: false,
                targetEvent: event,
                locals: {
                    faqs: $scope.selected[0]
                },
                templateUrl: 'add-item-dialog.html',
            }).then($scope.getFaqs);
        };

        $scope.types = ['Any', 'faq', 'faq2'];
        $scope.searchType = 'Any';
        $scope.query.filter = '';

        $scope.removeFilter = function() {
            $scope.filter.show = false;
            $scope.searching = false;
            $scope.query.filter = '';
            //console.log("HERE")
            $scope.query.page = 0;
            $scope.getFaqs();
            $scope.faqs = $scope.allFaqs;
            if ($scope.filter.form.$dirty) {
                $scope.filter.form.$setPristine();
            }
        };
        $scope.validateCheckbox = function(type){
            $scope.searchQuestion = false;
            $scope.searchId = false;
            $scope.searchTag = false;
            $scope.searchJourney = false;
            $scope.searchAnswer = false;

            if (type ==='tag'){
                $scope.searchTag = true;
            }
            if(type ==='answer'){
                $scope.searchAnswer=true;
            }

            if(type==='question'){
                $scope.searchQuestion=true;

            }
            if(type==='journey'){
                $scope.searchJourney=true;
            }

            if(type==='id'){
                $scope.searchId=true;
            }
        }

        $scope.doSearch = function() {
            $scope.query.page = 1;
            console.log("START SEARCH");
            $scope.searching = true;

            $scope.faqs = [];

            var query_fields = [];
            if ($scope.searchQuestion) {
                query_fields.push("question")
            }

            if ($scope.searchId) {
                query_fields.push("id")
            }

            if ($scope.searchAnswer) {
                query_fields.push("answer")
            }

            if ($scope.searchTag) {
                query_fields.push("tags")
            }

            if ($scope.searchJourney) {
                query_fields.push("journey")
            }

            if (query_fields.length === 0) {
                query_fields = [
                    //'id',
                    'question',
                //    'answer',
                //    'tags',
                //    'journey'
                ];

            }
            $scope.faqs =[];
            var offset = ($scope.query.page - 1) * $scope.query.limit;
            console.log('offset', offset);
            $faq
                .searchItem($scope.query.filter, query_fields,offset)
                .then(function(results) {
//
                    $scope.faqList = results;
                    //$scope.faqs = results;
                    $scope.paginateSearch();
                    $scope.paging.total = Math.ceil(results.length / 10);
                    //$scope.faqs = results;
                })
                .catch(function(e) {
                    console.log(e)
                    // Do something if we have errors
                })

        }

        $scope.paginateSearch = function(){
            $scope.faqs = [];
            var offset = ($scope.query.page-1)*$scope.query.limit;
            for (var i = offset; i < offset+$scope.query.limit; i++) {
                $scope.faqs.push($scope.faqList[i]);
            }

        }

        $scope.$watch('query.filter', function(newValue, oldValue) {
            if (!oldValue) {
                bookmark = $scope.query.page;
            }

            if (newValue !== oldValue) {
                $scope.query.page = 1;
            }

            if (!newValue) {
                $scope.query.page = bookmark;
            }
        });

        $scope.onPaginate = function(page,limit){
            $scope.query.page = page;
            if($scope.searching){
                 $scope.paginateSearch();
            }
            else{
                $scope.loadList(page);
            }
        }
        $scope.getFaqs();

    }]);
