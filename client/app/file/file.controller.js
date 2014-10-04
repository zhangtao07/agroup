'use strict';

angular.module('agroupApp')
  .controller('FileCtrl', function($scope, $stateParams, $http,Modal,$localStorage) {

    var allFolder = [{
      files: [],
      parent_id: 0
    }];

    if($localStorage['file.level'] && $localStorage['file.level'].length){
      allFolder = $localStorage['file.level'];
    }
    var level = $localStorage['file.level'] = allFolder;
    var db;
    var confirm = Modal.confirm.delete;

    function getChild(lel) {
      return db.filter(function(d) {
        if (+d.parent_id === lel) {
          return d;
        }
      });
    }

    init();

    function init() {
      var group = $stateParams.group;
      $http.get('api/files/' + group).success(function(data, status) {
        db = data;
        level[0].files = level[0].files = getChild(0);
        $scope.level = level;
      })
    }

    function home(){
      level.splice(1,level.length-1);
    }

    function selectItem(folder, item) {
      if (folder.selectedItem) {
        folder.selectedItem.selected = false;
      }
      item.selected = true;
      folder.selectedItem = item;
      var index = level.indexOf(folder);

      if (item.type !== 'folder') {
        closeFolder(index + 1, level.length - index);
        $scope.preview(item);
        return;
      }
      $scope.nopreview();
      var nextLevel = level[index + 1] = level[index + 1] || {};
      nextLevel.files = getChild(item.id);
      nextLevel.parent_id = item.id;
      level.splice(index + 2, level.length - index - 2);
    }

    function closeFolder(index, end) {
      level.splice(index, end);
    }

    function clearSelect(folder) {
      if (folder.selectedItem) {
        folder.selectedItem.selected = false;
        folder.selectedItem.editing = false;
      }
    }

    function deleteItem(folder, item) {
      confirm(function(){
        var i = folder.files.indexOf(item);
        folder.files.splice(i, 1);
        var j = level.indexOf(folder);
        if (item.selected) {
          level.splice(j + 1, level.length - j - 1);
        }
        if (!folder.files.length) {
          level.splice(j, 1);
        }
        $http.delete('api/files/'+item.id);
      })(item.name);
    }

    function addItem(index, fileid, content) {
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
    $scope.editItem = editItem;
    $scope.doneEditing = doneEditing;
    $scope.home = home;

    $scope.updateItem = function(item) {
      $http.put('api/files/' + item.id, JSON.stringify({
        name: item.name
      }));
    }

    function editItem(item) {
      item.editing = true;
    }

    function doneEditing(item) {
      item.editing = false;
    }



    var panel = $scope.uploadpanel = {}

    function sendFile(file, folder) {
      var groupId = $stateParams.group;
      panel.addFile(file, function(file, send) {
        var formData = new FormData();
        formData.append('groupId', groupId);
        formData.append('file', file);
        send('api/message/upload', formData);

      }, function(res) {
        var i = level.indexOf(folder);
        addItem(i, res.file.id, res.msg.content);
      });
    }
    $scope.onDrop = function(files, folder) {
      files.forEach(function(file) {
        sendFile(file, folder);
      });
    };
  });
