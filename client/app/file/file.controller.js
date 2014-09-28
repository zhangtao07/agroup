'use strict';

angular.module('agroupApp')
  .controller('FileCtrl', function($scope, $stateParams, $http) {
    $scope.message = 'Hello';

    var level = [{
      files: [],
      parent_id:0
    }];
    var db;

    function getChild(lel) {
      return db.filter(function(d) {
        if (d.parent_id === lel) {
          return d;
        }
      });
    }

    init();

    function init() {
      var group = $stateParams.group;
      $http.get('api/files/' + group).success(function(data, status) {
        db = data;
        level[0].files = level[0].files.concat(getChild(0));
        $scope.level = level;
      })
    }

    function selectItem(folder, item) {
      if (folder.selectedItem) {
        folder.selectedItem.selected = false;
      }
      item.selected = true;
      folder.selectedItem = item;
      var index = level.indexOf(folder);

      if(item.type !== 'folder'){
        closeFolder(index+1,level.length-index);
        return;
      }

      var nextLevel = level[index + 1] = level[index + 1] || {};
      nextLevel.files = getChild(item.id);
      nextLevel.parent_id = item.id;
      level.splice(index + 2, level.length - index - 2);
    }

    function closeFolder(index,end){
        level.splice(index, end);
    }

    function clearSelect(folder) {
      if (folder.selectedItem) {
        folder.selectedItem.selected = false;
      }
    }

    function deleteItem(folder, item) {
      var i = folder.files.indexOf(item);
      folder.files.splice(i, 1);
      var j = level.indexOf(folder);
      if (item.selected) {
        level.splice(j + 1, level.length - j - 1);
      }

      if (!folder.files.length) {
        level.splice(j, 1);
      }
    }

    function addItem(index,fileid,content) {
      var files = level[index].files = level[index].files || [];

      var data = {
        name: content && content.filename || 'level' + index + '-folder' + level[index].files.length,
        parent_id: index > 0 ? level[index - 1].selectedItem.id : 0,
        type: content && content.mimetype || 'folder',
        file_id: fileid && fileid || 0,
        group_id: $stateParams.group
      };
      $http.post('api/files/', data).success(function(d, status) {
        db.push(d);
        //var files = level[index].files = level[index].files || [];
        level[index].files.push(d);
      });
    }

    $scope.clearSelect = clearSelect;
    $scope.selectItem = selectItem;
    $scope.deleteItem = deleteItem;
    $scope.addItem = addItem;


    var panel = $scope.uploadpanel = {}

    function sendFile(file,folder) {
      var groupId = $stateParams.group;
      panel.addFile(file, function(file, send) {
        var formData = new FormData();
        formData.append('groupId', groupId);
        formData.append('file', file);
        send('api/message/upload', formData);

      },function(res){
        var i = level.indexOf(folder);
        addItem(i,res.file.id,res.file.content);
      });
    }
    $scope.onDrop = function(files,folder) {
      files.forEach(function(file) {
        sendFile(file,folder);
      });
    };
  });
