'use strict';

angular.module('agroupApp')
  .controller('MainCtrl', ['$scope','$location','Modal','groupAPI',function($scope, $location, Modal,groupAPI) {

    var path = $location.path();
    var groupName = path.replace(/\/(\w+)\/.*/, '$1');

    var module = {};
    $scope.module = module;


    if(groupName !== 'groups'){
      groupAPI.find(groupName).success(function(res){
        module.group = groupAPI.format({group:res.data.group});
        module.relaction = {
          joined: res.data.ingroup,
          collected: res.data.collectgroup
        };
      });
    }

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      var data = [];
      _.each($scope.collections, function(d) {
        data = data.concat(d.groups);
      })

      var gp = _.find(data, {
        name: toParams.name
      });

      groupAPI.find(toParams.name).success(function(res){
        module.group = groupAPI.format({group:res.data.group});
        module.relaction = {
          joined: res.data.ingroup,
          collected: res.data.collectgroup
        };
        module.path = toState.url.split('/').slice(2).join('/')
        $scope.$broadcast('groupChanged',module.group,module.relaction,module.path);
      });
    });

    $scope.$on('$viewContentLoaded',function(event,viewConfig){
      console.log(viewConfig);
    });

    window.scope = $scope;

    $scope.navgate = function(group) {
      $location.path('/' + group.name + '/' + module.path)
    }



    $scope.createGroup = function() {
      var dialog = Modal.confirm.create;
      var data = {
        setgroup: false,
        group: {
          type: 'Public',
          logo: '',
          logocroped: ''
        }
      };
      dialog(function ok() {
        //success
        groupAPI.createGroup({
          name: data.group.name,
          type: data.group.type,
          icon: data.group.logocroped,
          display: data.group.displayName,
          description: data.group.desc
        }).success(function(res){
          console.log(res);
        });
      })({
        data: data,
        title: '创建群组',
        //size: 'lg',
        templateUrl: 'app/main/group.html',
        ok: '创建',
        style: 'modal-primary'
      });
    }

    $scope.setGroup = function() {
      var dialog = Modal.confirm.create;
      var group = module.group;
      var data = {
        setgroup: true,
        group: {
          name: group.name,
          desc: group.desc,
          logo: '',
          logocroped: '',
          displayName: group.displayName,
          type: group.type
        }
      };

      dialog(function ok() {
        group.desc = data.group.desc;
        if(data.group.logo){
          group.logo = data.group.logocroped;
        }
        group.displayName = data.group.displayName;
        group.type = data.group.type;
      })({
        data: data,
        title: module.group.name,
        //size: 'lg',
        templateUrl: 'app/main/group.html',
        ok: '保存',
        style: 'modal-danger'
      });
    }
  }]);
