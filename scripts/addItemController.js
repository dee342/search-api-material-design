angular.module('faqApp')
.controller('addItemController', ['faqs','$mdDialog', '$faq', '$scope', function (faqs,$mdDialog, $faq,$scope) {
  'use strict';

  $scope.disableFaqId = false;
  $scope.title = "Create New FAQ";
  $scope.buttonText = "Create";

  if(faqs === null) {
    $scope.faq = {};
  } else {
    faqs.tags = faqs.tags.split(" ");
    $scope.faq = faqs;

    $scope.disableFaqId = true;
    $scope.title = "Edit FAQ";
    $scope.buttonText = "Save";
  }

  this.cancel = $mdDialog.cancel;

  $scope.addItem = function () {
    $scope.item.form.$setSubmitted();
    var item = {};
    item.text = $scope.faq.answer;
    item.title = $scope.faq.question;
    item.journey = $scope.faq.journey;
    item.tags =  getStringText($scope.faq);


    function getStringText(value1) {
       var concatedStr ="";
       if(value1.tags !== undefined) {
         for(var i=0; i<value1.tags.length; i++) {
           concatedStr +=  '#' + value1.tags[i].text + " ," ;
         }
       }
       return concatedStr.substring(0,concatedStr.length-1);
     };
    if(faqs === null) {
      var alert;
      if($scope.item.form.$valid) {
        console.log('item', item);
        $faq
        .addItem($scope.faq.id, item)
        .then(function(message){
          $mdDialog.hide(message);
           alert = $mdDialog.alert({
             title: 'FAQ Created',
             //textContent: message,
             ok: 'Ok'
           });

       $mdDialog
       .show( alert )
       .finally(function() {
         alert = undefined;
       });
        })
        .catch(function(message){
          console.log(message)
        })
        .finally(function(message){
        })
   	  }

    } else {
    	if($scope.item.form.$valid) {
        var alert;
        var itemUpdate = {
          title:$scope.faq.question,
          journey:$scope.faq.journey,
          tags:$scope.faq.tags.map(function(t){return t.text}).join(" "),
          text:$scope.faq.answer
        }
        console.log("To update ",$scope.faq)
	      $faq
        .updateItem($scope.faq.id,itemUpdate)
        .then(function(response){
          console.log('response: ', response);
          $mdDialog.hide(response);
          alert = $mdDialog.alert({
            //<md-icon>done</md-icon>
            title: 'FAQ Updated',
            //textContent: response,
            ok: 'Ok'
          });

      $mdDialog
      .show( alert )
      .finally(function() {
        alert = undefined;
      });
        })
        .catch(function(err) {
          console.log(err);
        })
        .finally(function(message){

        })
   	  }
    }
  };

}]);
