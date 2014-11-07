'use strict';

angular.module('agroupApp').directive('msgitem', function($rootScope,Modal,messageAPI) {


  function getTitle(data) {
    var text = '';
    switch (data.content.type) {
      case 'Link':
        text = '分享了 1 个连接';
        break;
      case 'File':
        var action = '';
        switch (data.content.action) {
          case 'Create':
            action = '分享';
            break;
        }
        text = action + '了 ' + data.content.data.files.length + ' 个文件';
        break;
      case 'Text':
        text = '输入了 1 段文字';
        break;
      case 'MK':
        var action = '';
        switch (data.content.action) {
          case 'Create':
            action = '创建';
            break;
          case 'Update':
            action = '更新';
            break;
        }
        text = action + '了 ' + data.content.data.files.length + ' 个笔记';
        break;
    }
    return text;
  }

  return {
    templateUrl: 'components/message/msgitem/msgitem.html',
    restrict: 'EA',
    scope: {
      data: '=data',
      group: '=group'
    },
    link: function(scope, element, attrs) {
      var data = scope.data;
      scope.__user = $rootScope.__user;
      scope.onDel = function(item){
        Modal.confirm.delete(function(){
          messageAPI.delete(scope.group.id,item.id);
        })('');
      }
      scope.title = getTitle(data);
    }
  };
});
