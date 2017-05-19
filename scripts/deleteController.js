angular.module('faqApp')
.controller('deleteController', [ 'faqs','$faq' ,'$mdDialog', '$scope', function (faqs, $faq,$mdDialog, $scope) {
  'use strict';

  this.cancel = $mdDialog.cancel;
  this.deleteDessert = deleteDessert;
  function deleteDessert() {
	$faq
	.deleteItem(faqs)
  .then(function(response){
    var alert;
		console.log(response);
		hide(response);
    $mdDialog.hide(response);
    $mdDialog.hide(message);
     alert = $mdDialog.alert({
       title: 'FAQ Deleted',
       //textContent: message,
       ok: 'Ok'
     });

 $mdDialog
 .show( alert )
 .finally(function() {
   alert = undefined;
 });

	})
  .catch(function(err){
    console.log(err);
  })
  .finally(function(message){
    $mdDialog.hide(message);
  })

  };

 function hide(response) {

 }

}])
