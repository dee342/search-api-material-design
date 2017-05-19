angular.module('faqApp')
    .factory('$faq', faqService);

function faqService($http, $q) {
    var funcs = {};

    var API_HOST = "http://dsnode6:50020/selfServiceHelpAdmin"; // This needs to change when the access to the API is
    // given


    funcs.addItem = function(faqId, data) {
        console.log('Service item ', data, faqId);
        var deferred = $q.defer();

        $http({
                method: "POST",
                url: API_HOST + "/changeElement",
                params: {
                    action: "create",
                    data: "response", //change to response
                    id: faqId,
                },
                data:  data
            })
            .then(function(response) {
                // callBack(response);
                console.log("adding element")
                deferred.resolve({
                    message: "Item created with success"
                });

            })
            .catch(function(e) {
                console.log(e);
                deferred.resolve({
                    message: "There was an error creating the item"
                });

            })

        return deferred.promise;
    };

    funcs.deleteItem = function(delItems) {
        console.log('delItems', delItems);

        var deferred = $q.defer();
        var deletePromise = batch_delete(delItems)

        deletePromise
         .then(function(response) {
              // callBack(response);
              deferred.resolve({
                  message: "Item(s) deleted with success"
              });
          })
          .catch(function() {
              deferred.resolve({
                  message: "There was an error deleting the item"
              });
          })

          return deferred.promise;

    };

    funcs.updateItem = function(faqId, data) {
        console.log('Service item ', data, faqId);
        var deferred = $q.defer();

        $http({
                method: "POST",
                url: API_HOST + "/changeElement",
                params: {
                    action: "update",
                    data: "response", //change to response
                    id: faqId,
                },
                data:  data
            })
            .then(function(response) {
                // callBack(response);
                console.log("updating element")
                deferred.resolve({
                    message: "Item updated with success"
                });

            })
            .catch(function(e) {
                console.log(e);
                deferred.resolve({
                    message: "There was an error updating the item"
                });

            })

        return deferred.promise;
    };

    // Use this function if the API can update multiple values at the same time
    // right now it seems you have to update one field a time.
    function batch_delete(faqs) {

        var promises = [];

        for (var i = 0; i < faqs.length; i++) {

            var p = $http({
                method: "POST",
                url: API_HOST + "/changeElement",
                params: {
                    data: "response",
                    id: faqs[i].id,
                    action: "delete"
                }
            })

            promises.push(p);
        }
        console.log('say', $q.all(promises));

        return $q.all(promises)
    }

    funcs.getItems = function(callBack) {
        var deferred = $q.defer();

        $http({
                method: "GET",
                url: API_HOST + "/getList",
                params: {
                    list: "id",
                    data: "response"
                }
            })
            .then(function(response) {
                var faqs = {};

                if (!response.data.id) {
                    deferred.reject({
                        message: "empty results"
                    })
                    return false
                }

                faqs = response.data.id.map(function(r) {
                    return r
                });

                deferred.resolve(faqs);
            })
            .catch(function() {
                deferred.resolve({
                    message: "There was an error listing all items"
                });
            });

        return deferred.promise;
    };

    funcs.getItem = function(id, item) {
        var deferred = $q.defer();

        $http({
                method: "GET",
                url: API_HOST + "/idToDoc",
                params: {
                    id: id,
                    data: "response"
                }
            })
            .then(function(response) {
                response = response.data;

                deferred.resolve({
                    id: response["searchResult"]["id"],
                    question: response["searchResult"]["title"], // is the title text used as the answer field?
                    answer: response["searchResult"]["text"], // is the text used as the answer field?
                    journey: response["searchResult"]["journey"],
                    tags: response["searchResult"]["tags"],
                });
            })
            .catch(function() {
                deferred.resolve({
                    message: "There was an error getting the item"
                });
            })

        return deferred.promise;
    };

    funcs.searchItem = function(query, fields, offset) {

        var deferred = $q.defer();

        $http({
                method: "GET",
                url: API_HOST + "/searchFAQ",
                //:{'Content-Type':'application/x-www-form-urlencoded'},
                params: {
                    data: "response",
                    field: fields,
                    search: encodeURIComponent(query),
                    limit: 10000,
                    offset: offset || 0
                }
            })
            .then(function(response) {

                if (response.data.filteredList) {
                    var results = response.data.filteredList.map(
                        function(item) {
                            return {
                                id: item["id"],
                                question: item["title"], // is the title text used as the answer field?
                                answer: item["text"], // is the text used as the answer field?
                                journey: item["journey"],
                                tags: item["tags"],
                            };
                        }
                    );

                    deferred.resolve(results);
                }


            })
            .catch(function() {
                deferred.resolve({
                    message: "There was an error searching for the item"
                });
            })

        return deferred.promise;

    };

    return funcs;
}
