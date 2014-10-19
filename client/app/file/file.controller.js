'use strict';

angular.module('agroupApp')
  .controller('FileCtrl', function($scope, $stateParams, $http, Modal, $localStorage, messageAPI) {

    var level = $localStorage['file.level'] = $localStorage['file.level'] || [{
      files: [],
      parent_id: 0
    }];

    var db;
    var confirm = Modal.confirm.delete;

    function getChild(index, level) {
      return _.filter(db, function(d) {
        if (+d.parent_id === index) {
          var isSelected = level && level.selectedItem && level.selectedItem.id === +d.id;
          if (isSelected) {
            d.selected = true;
          } else {
            d.selected = false;
          }
          return d;
        }
      });
    }

    init();

    function init() {
      var group = $stateParams.group;
      $http.get('api/files/' + group).success(function(data, status) {
        db = data;
        var firstLevel = level[0];
        var files = firstLevel.files = getChild(0, firstLevel);
        if (!files.length) {
          firstLevel.selectedItem = undefined;
        }
        $scope.level = level;
      })
    }

    function home() {
      level.splice(1, level.length - 1);
    }

    function selectItem(folder, item) {
      if (folder.selectedItem) {
        folder.selectedItem.selected = false;
        _.each(folder.files, function(d) {
          d.selected = false;
        });
      }
      item.selected = true;
      var index = level.indexOf(folder);

      $scope.scrollLeft();
      if (item.type !== 'folder') {
        closeFolder(index + 1, level.length - index);
        $scope.preview(item);
      } else {
        var nextLevel = level[index + 1] = level[index + 1] || {};
        nextLevel.files = getChild(item.id, folder);
        nextLevel.parent_id = item.id;
        $scope.previewFolder(nextLevel.files, nextLevel);
        level.splice(index + 2, level.length - index - 2);
      }
      folder.selectedItem = item;
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

    function deleteFile(foldid) {
      _.remove(db, function(item) {
        return item.id === foldid;
      });
    }

    function deleteItem(folder, item) {
      confirm(function() {
        var i = folder.files.indexOf(item);
        folder.files.splice(i, 1);
        var j = level.indexOf(folder);
        if (item.selected) {
          level.splice(j + 1, level.length - j - 1);
        }
        if (!folder.files.length) {
          level.splice(j, 1);
        }
        deleteFile(item.id);
        $http.delete('api/files/' + item.id);
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

    function sendFile(file, folder, folderId, length) {
      var groupId = $stateParams.group;
      var completeQueue = [];
      panel.addFile(file, function(file, send) {
        var formData = new FormData();
        formData.append('groupId', groupId);
        formData.append('file', file);
        formData.append('folderId', folderId);
        send('api/message/upload', formData);
      }, function(fileID, fd) {
        db.push(fd);
        var index = level.indexOf(folder);
        level[index].files.push(fd);
        completeQueue.push(fileID);
        $scope.selectItem(folder, fd);
        //$scope.preview(fd);
        if (completeQueue.length === length) {
          messageAPI.uploadEnd(groupId, completeQueue.join(','));
        }
      });
    }
    $scope.onDrop = function(files, folder) {
      var index = level.indexOf(folder);
      var folderId = index > 0 ? level[index - 1].selectedItem.id : 0;
      files.forEach(function(file) {
        sendFile(file, folder, folderId, files.length);
      });
    };
  });
