'use strict';

angular.module('agroupApp').factory('messageAPI', ['apiRoot','$http',function(apiRoot,$http) {
  return {
    getList:function(groupId,timestamp,offset,limit){
      var params = {
        groupId:groupId,
        offset:offset||0,
        limit:limit||20
      }
      if(timestamp){
        params['timestamp'] = timestamp;
      }
      return $http.get(apiRoot+"api/message/list",{
        params:params
      });
    },
    uploadEnd:function(groupId,fileids){
      return $http.post(apiRoot+"api/message/uploadEnd",{
        groupId:groupId,
        fileids:fileids
      });
    },
    delete:function(messageId){
      return $http.post(apiRoot+"api/message/delete",{
        messageId:messageId
      });
    }
  };
}]);
