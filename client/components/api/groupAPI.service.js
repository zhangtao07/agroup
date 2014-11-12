'use strict';

angular.module('agroupApp').factory('groupAPI', ['$http',
  function($http) {
    return {
      find: function(name,collections) {
        var flatArray = [];
        _.each(collections,function(d){
          flatArray = flatArray.concat(d.groups);
        });
        return _.find(flatArray,{name:name});
      }
    };
  }
]);
