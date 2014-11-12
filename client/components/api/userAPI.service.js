'use strict';

angular.module('agroupApp').factory('userAPI', ['apiRoot', '$q', '$http',
  function(apiRoot, $q,$http) {
    return {
      getMe: function() {
        return $http.get(apiRoot + "api/user/me");
      },
      getGroups: function() {
        return $http.get(apiRoot + "api/user/groups");
      },
      getMockGroups: function() {
        var deferred = $q.defer();
        deferred.promise.success = function(fn) {
          deferred.promise.then(fn);
          return deferred.promise;
        };
        var collections = [{
          name: '我的收藏',
          groups: []
        }, {
          name: '我的群组',
          groups: [{
            id: 1,
            name: 'fex',
            desc: '简单可依赖',
            logo: 'http://127.0.0.1:8080/static/upload/1/02/5bdd6689a5ed33a7e102f6150fc3ac19ed4075.png',
            createAt: new Date()
          }]
        }, {
          name: '热门群组',
          groups: []
        }];

        function randString(x) {
          var s = "";
          while (s.length < x && x > 0) {
            var r = Math.random();
            s += (r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65)));
          }
          return s;
        }

        var CON = 8;
        collections = _.each(collections, function(d, i) {
          for (var k = 0, len = CON; k < len; k++) {
            d.groups.push({
              id: k,
              name: randString(5),
              desc: randString(20),
              logo: 'http://127.0.0.1:8080/static/upload/1/02/5bdd6689a5ed33a7e102f6150fc3ac19ed4075.png',
              createAt: new Date()
            })
          }
        })
        deferred.resolve({
          data: collections
        });
        return deferred.promise;
      }
    };
  }
]);
