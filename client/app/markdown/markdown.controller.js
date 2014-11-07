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

      function showList(data, status) {
        $scope.hasMore = data.total > (data.page - 1) * data.size + data.count;
        data.list.forEach(function(md) {
          $scope.markdowns.push(md);
        });
      }

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

      $scope.view = function(md) {
        dialog(function() {})(md.content);
      }

      $scope.sync = function() {
        $scope.markdowns = [];
        init();
      };

      var pagenation = {
        page: 0,
        size: 9
      }

      //$scope.hasMore = true;
      $scope.me = $rootScope.__user;

      var groupName = $stateParams.name;
      groupAPI.getGroupByName(groupName).success(function(res) {
        $rootScope.__currentGroupName = res.data.name;
        $rootScope.__currentGroupId = res.data.id;
        $scope.group = res.data;
        init();
      });


      function init() {
        var group = $scope.group.id;
        markdownAPI.getList($scope.group.id, pagenation.page, pagenation.size).success(showList);
      }


      $scope.loadList = function(pageno) {
        $scope.hasMore = true;
        var group = $scope.group;
        markdownAPI(group.id, pagenation.page++, pagenation.size).success(showList);
      }


    }
  ]);
