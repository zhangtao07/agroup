'use strict';

angular.module('agroupApp').factory('messageAPI', ['apiRoot','$http',function(apiRoot,$http) {
  return {
    getList:function(groupId,datestamp,offset,limit){
      var params = {
        groupId:groupId,
        offset:offset||0,
        limit:limit||20
      }
      if(datestamp){
        params['datestamp'] = datestamp;
      }
      return $http.get(apiRoot+"api/message/list",{
        params:params
      });
    }
  };
}]);
