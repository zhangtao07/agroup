'use strict';

angular.module('agroupApp').factory('userAPI', ['apiRoot','groupAPI', '$q', '$http',
  function(apiRoot, groupAPI, $q,$http) {

    function getGroups(page,size) {
      return $http.post(apiRoot + "api/user/me/groups",{page:page||0,size:size||10});
    }

    function getCollectionGroups(page,size){
      return $http.post(apiRoot + 'api/user/me/collectionGroups',{ page:page||0, size:size||10});
    }

    function getHotGroup(page,size){
      return $http.post(apiRoot + 'api/group/hot',{
        page: page || 0,
        size: size || 10
      })
    }
    return {
      getMe: function() { return $http.get(apiRoot + "api/user/me"); },

      getGroups: getGroups,

      getCollectionGroups: getCollectionGroups,

      getHotGroup: getHotGroup,

      getMockGroups: function() {

        var deferred = $q.defer();
        deferred.promise.success = function(fn) {
          deferred.promise.then(fn);
          return deferred.promise;
        };


        $q.all([getGroups(),getCollectionGroups(),getHotGroup()]).then(function(results){
          var groups = results[0].data;
          var collects = results[1].data;
          var hots = results[2].data;

          var collections = [{
            name: '我的收藏',
            groups: []
          }, {
            name: '我的群组',
            groups: [{
              id: 1,
              displayName: '大FEX-端组-硬的游戏',
              type: 'Public',
              name: 'fex',
              desc: '简单可依赖',
              logo: 'http://p.qq181.com/cms/1210/2012100413194979334.jpg',
              createAt: new Date()
            }]
          }, {
            name: '热门群组',
            groups: []
          }];

          collections[0].groups = collects.data.list.map(function(d){ return groupAPI.format(d);});
          collections[1].groups = groups.data.list.map(function(d){ return groupAPI.format(d);});
          collections[2].groups = hots.data.list.map(function(d){ return groupAPI.format(d);});

          deferred.resolve({
            data: collections
          });
        })
        return deferred.promise;
      }
    };
  }
]);
