'use strict';

angular.module('agroupApp')
  .controller('MarkdownCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$stateParams',
    'Modal',
    '$location',
    'groupAPI',
    'markdownAPI',
    function($rootScope, $scope, $http, $stateParams, Modal, $location, groupAPI, markdownAPI) {

      $scope.markdowns = [];

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

      $scope.md2html = mdToHtml;
      function mdToHtml(md) {
        var converter = new Markdown.Converter();
        var extensions = [
          "fenced_code_gfm",
          "tables",
          "def_list",
          "attr_list",
          "footnotes",
          "smartypants",
          "strikethrough",
          "newlines"
        ];
        var extraOptions = {
          extensions: extensions,
          highlighter: "prettify"
        };
        Markdown.Extra.init(converter, extraOptions);
        return converter.makeHtml(md);
      }

      var confirm = Modal.confirm.delete;
      var dialog = Modal.dialog;

      $scope.remove = function(md) {
        confirm(function() {
          $http.delete('/api/markdowns/' + md.id);
          var i = $scope.markdowns.indexOf(md);
          $scope.markdowns.splice(i, 1);
        })(md.name);
      };

      var pagenation = {
        page: 0,
        size: 9
      }

      $scope.me = $rootScope.__user;

      var groupName = $stateParams.name;
      groupAPI.getGroupByName(groupName).success(function(res) {
        $rootScope.__currentGroupName = res.data.name;
        $rootScope.__currentGroupId = res.data.id;
        $scope.group = res.data;
        $scope.loadList();
      });

      $scope.loadList = function() {
        $scope.hasMore = true;
        var group = $scope.group;
        markdownAPI.getList(group.id, pagenation.page++, pagenation.size).success(showList);
      }

      function showList(data, status) {
        $scope.hasMore = data.total > Math.abs((data.page - 1) * data.size + data.count);
        data.list.forEach(function(md) {
          $scope.markdowns.push(md);
        });
      }

    }
  ]);
