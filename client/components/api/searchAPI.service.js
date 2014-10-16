'use strict';

angular.module('agroupApp').factory('searchAPI', ['$http','apiRoot',function($http,apiRoot) {
  return {
    searchFile:function(keyword,textLength,page,size){
      //localhost:9000/api/search/file?keyword=123213
      keyword = encodeURI(keyword);
      return $http.get(apiRoot+"api/search/file?keyword="+keyword+"&textLength="+textLength+"&page="+page+"&size="+size);
    }
  };
}]);
