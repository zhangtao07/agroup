'use strict';

angular.module('agroupApp')
  .controller('MainCtrl', ['$scope','userAPI','$timeout','$state','Modal','groupAPI',function($scope, userAPI,$timeout,$state, Modal,groupAPI) {

    var module = {};
    $scope.module = module;


    $scope.fromNow = function(time){
      var now = new Date();
      var moreThen1Day = (now.getTime() - time) > 1000*60*60*24;
      if(moreThen1Day){
        //return moment(time).calendar();//.format('YYYY-MM-Do');
        return moment(time).format('ll');
      }else{
        return moment(time).fromNow();
      }

    };


    function getPath(state){
      return state.url.split('/').slice(2).join('/')
    }

    $scope.getGroups  = function(){
      userAPI.getMockGroups().success(function(res){
        $scope.collections = res.data;
      });
    }


    /**
     * angular-ui router 对二维url state change支持不完善，所以这里使用了如下
     * hack技，
     *
     * 场景：
     *  “｛组名｝／｛模块名｝”
     *
     *  组名变化时，通过angular-ui router 配置的各state中的controller将收到
     *  groupChanged事件 : $scope.on('groupChanged',function(event,currentGroup){})
     *  模块变化时,将接受到
     *  moduleChanged事件 : $scope.on('moduleChanged',function(event,currentGroup){})
     *
     */
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if(!toParams.name) return;

      var fromPath = getPath(fromState);
      var toPath = getPath(toState);
      module.path = toPath;

      var isGroupChanging =  toParams.name !== fromParams.name;
      var isModuleChanging = fromPath !== toPath;

      //一级导航: 组切换
      if(isGroupChanging){
        groupAPI.find(toParams.name).success(function(res){
          module.group = groupAPI.format({group:res.data.group});
          module.relaction = {
            joined: res.data.ingroup,
            collected: res.data.collectgroup
          };
          $scope.$broadcast('groupChanged',module.group,module.relaction,module);
        });
        //二级导航: 组->模块切换, 二级导航时不需要重新同步group信息
      }else if(isModuleChanging){
        $timeout(function(){
          $scope.$broadcast('moduleChanged',module.group,module.relaction,module);
        },1)
      }
    });


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
          $state.go('app.message',{ name : res.data.display });
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

        groupAPI.modifyGroup({
          id: group.id,
          name: data.group.name,
          type: data.group.type,
          icon: data.group.logo ? data.group.logocroped : '',
          display: data.group.displayName,
          description: data.group.desc
        }).success(function(res){
          group.displayName = res.data.name;
          group.desc = res.data.description;
          group.logo = res.data.icon;
          group.type = res.data.type;
        });
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
