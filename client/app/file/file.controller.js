'use strict';

angular.module('agroupApp')
  .controller('FileCtrl', ['$scope', '$stateParams', '$http', 'Modal', '$localStorage', 'messageAPI', 'folderAPI','groupAPI',
    function($scope, $stateParams, $http, Modal, $localStorage, messageAPI, folderAPI, groupAPI) {

      //var level = $localStorage['file.level'] = $localStorage['file.level'] || [{
      //files: [],
      //parent_id: 0
      //}];

      var level = [{
        files: [],
        parent_id: 0
      }];

      var panel = $scope.uploadpanel = {}

      var confirm = Modal.confirm.delete;
      $scope.clearSelect = clearSelect;
      $scope.selectItem = selectItem;
      $scope.deleteItem = deleteItem;
      $scope.addItem = addItem;
      $scope.editItem = editItem;
      $scope.doneEditing = doneEditing;
      $scope.home = home;
      var groupName = $stateParams.name;

      groupAPI.getGroupByName(groupName).success(function(res){
        $scope.group = res.data;
        init();
      });


      function getFiles(item, folder, groupId, cb) {
        folderAPI.getFiles(groupId, item.id).success(function(files, status) {
          return cb && cb(
            _.each(files, function(d) {
              var isSelected = folder && folder.selectedItem && folder.selectedItem.id === +d.id;
              if (isSelected) {
                d.selected = true;
              } else {
                d.selected = false;
              }
            }));
        });
      }

      function init() {
        var group = $scope.group.id;
        var firstLevel = level[0];
        getFiles({
          id: 0
        }, firstLevel, group, function(files) {
          firstLevel.files = files;
          if (!files.length) {
            firstLevel.selectedItem = undefined;
          }
          $scope.level = level;
        });
      }

      function home() {
        level.splice(1, level.length - 1);
      }

      function selectItem(folder, item) {
        var groupId = $scope.group.id;
        clearSelect(folder);
        item.selected = true;
        folder.selectedItem = item;
        var index = level.indexOf(folder);

        if (item.type !== 'folder') {
          if (index === level.length - 2) {
            closeFolder(index + 1, level.length - index);
          }
          $scope.preview(item);
        } else {
          getFiles(item, folder, groupId, function(files) {
            var nextLevel = level[index + 1] = level[index + 1] || {};
            nextLevel.files = files;
            nextLevel.parent_id = item.id;
            $scope.previewFolder(nextLevel.files, nextLevel);
            level.splice(index + 2, level.length - index - 2);
            setTimeout(function() {
              $scope.scrollLeft();
            }.bind(this), 10);
          });
        }
      }

      function closeFolder(index, end) {
        $scope.scrollRight();
        setTimeout(function() {
          level.splice(index, end);
        }.bind(this), 600);
      }

      function clearSelect(folder) {
        if (folder.selectedItem) {
          _.each(folder.files, function(d) {
            d.selected = false;
          });
          folder.selectedItem.selected = false;
          folder.selectedItem.editing = false;
        }
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
          group_id: $scope.group.id
        };
        $http.post('api/files/', data).success(function(d, status) {
          level[index].files.push(d);
        });
      }

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

      function sendFile(file, folder, folderId, length, completeQueue) {
        var groupId = $scope.group.id;
        panel.addFile(file, function(file, send) {
          var formData = new FormData();
          formData.append('groupId', groupId);
          formData.append('file', file);
          formData.append('folderId', folderId);
          send('api/message/upload', formData);
        }, function(fileID, fd) {
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
        var completeQueue = [];
        files.forEach(function(file) {
          sendFile(file, folder, folderId, files.length, completeQueue);
        });
      };

    }
  ]);
