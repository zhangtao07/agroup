'use strict';

angular.module('agroupApp')
  .controller('MainCtrl', ['$scope','$location','Modal','groupAPI',function($scope, $location, Modal,groupAPI) {
    var path = $location.path();
    var groupName = path.replace(/\/(\w+)\/.*/, '$1');
    var data = [];
    _.each($scope.collections, function(d) {
      data = data.concat(d.groups);
    })

    var module = {};
    $scope.module = module;
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      module.group = _.find(data, {
        name: toParams.name
      });
      module.path = toState.url.split('/').slice(2).join('/')
    });

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
          display: data.displayName
        })
        console.log(data.group);
      })({
        data: data,
        title: '创建群组',
        //size: 'lg',
        templateUrl: 'app/main/group.html',
        ok: '创建',
        style: 'modal-primary'
      });
    }

    function toLocal(imgpath, size) {
      size = size || 240;
      return '/static/image/resize?url=' + imgpath + '&width=' + size + '&height=' + size + '&gravity=center&type=resize';
    }

    $scope.setGroup = function() {
      var dialog = Modal.confirm.create;
      var group = module.group;
      var data = {
        setgroup: true,
        group: {
          name: group.name,
          desc: group.desc,
          logo: toLocal(group.logo),
          logocroped: toLocal(group.logo),
          displayName: group.displayName,
          type: group.type
        }
      };

      dialog(function ok() {
        group.desc = data.group.desc;
        group.logo = data.group.logocroped; //data.group.logo;
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
