'use strict';

angular.module('agroupApp')
  .controller('FileCtrl', function($scope,$stateParams,$http) {
    $scope.message = 'Hello';

    var level = [{
      files: []
    }];
    var db;

    function getChild(lel){
      return db.filter(function(d){
        if(d.parent_id === lel){
          return d;
        }
      });
    }

    init();
    function init(){
      var group = $stateParams.group;
      $http.get('api/files/'+group).success(function(data,status) {
        db = data;
        window.db= db;
        level[0].files = level[0].files.concat(getChild(0));
        $scope.level = level;
      })
    }

    window.level = level;

    function selectItem(folder,item) {
      if(folder.selectedItem){
        folder.selectedItem.selected = false;
      }
      item.selected = true;
      folder.selectedItem = item;

      var index = level.indexOf(folder);
      var nextLevel = level[index+1] = level[index+1] || {};
      nextLevel.files  = getChild(item.id);

      //if(item.selected){ return }
      //folder.selectedItem = item;
      //nextFolder.selectedItem = item;

      level.splice(index+2,level.length-index-2);

      //var selectedChild = _.filter(nextFolder.files,function(d){
        //if(d.selected){
          //return d;
        //}
      //});

      //if(selectedChild.length){
        //selectItem(nextFolder,selectedChild[0]);
      //}
    }

    function clearSelect(folder){
      if(folder.selectedItem){
        folder.selectedItem.selected = false;
      }
    }

    function deleteItem(folder,item) {
      var i = folder.files.indexOf(item);
      folder.files.splice(i,1);
      var j = level.indexOf(folder);
      if(item.selected){
        level.splice(j+1,level.length-j-1);
      }

      if(!folder.files.length){
        level.splice(j,1);
      }
    }

    function createFolder(index) {
      var files = level[index].files = level[index].files || [];

      var data = {
        name: 'level'+ index +'-folder' + level[index].files.length,
        parent_id: index > 0 ? level[index-1].selectedItem.id : 0,
        group_id: $stateParams.group
      };
      $http.post('api/files/',data).success(function(d,status){
        db.push(d);
        //var files = level[index].files = level[index].files || [];
        level[index].files.push(d);
      });
    }


    $scope.clearSelect = clearSelect;
    $scope.selectItem = selectItem;
    $scope.deleteItem = deleteItem;
    $scope.createFolder = createFolder;

  });
