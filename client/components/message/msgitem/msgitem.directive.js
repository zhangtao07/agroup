'use strict';

angular.module('agroupApp').directive('msgitem', function() {

  function getTitle(data){
    var text = '';
    switch(data.type){
      case 'link':
        text = '分享了1个连接';
        break;
      case 'file':
        var action = '';
        switch(data.content.action){
          case 'create':
            action='分享';
            break;
        }
        text = action+'了'+data.content.list.length+'个文件';
        break;
      case 'plain':
        text = '输入了1段文字';
        break;
      case 'mk':
        var action = '';
        switch(data.content.action){
          case 'create':
            action='创建';
            break;
        }
        text = action+'了'+data.content.list.length+'个笔记';
        break;
    }
    return text;
  }

  return {
    templateUrl: 'components/message/msgitem/msgitem.html',
    restrict: 'EA',
    scope: {
      data: '=data'
    },
    link: function(scope, element, attrs) {
        var data = scope.data;
        scope.title = getTitle(data);
    }
  };
});
