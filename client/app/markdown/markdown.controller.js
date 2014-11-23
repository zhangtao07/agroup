'use strict';

angular.module('agroupApp')
  .controller('MarkdownCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$stateParams',
    'Modal',
    '$sce',
    'markdownAPI',
    'groupAPI',
    function($rootScope, $scope, $http, $stateParams, Modal, $sce, markdownAPI,groupAPI) {

      $scope.markdowns = [];


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
        return $sce.trustAsHtml(converter.makeHtml(md));
      }

      var confirm = Modal.confirm.delete;
      var dialog = Modal.dialog;

      $scope.remove = function(md) {
        var group = $scope.module.group;
        confirm(function() {
          markdownAPI.deleteFile(group.id,md.id);
          var i = $scope.markdowns.indexOf(md);
          $scope.markdowns.splice(i, 1);
        })(md.name);
      };

      var pagenation = {
        page: 0,
        size: 9
      }

      $scope.me = $rootScope.__user;

      function loadList(group,pagesize) {
        $scope.hasMore = true;
        markdownAPI.getList(group.id, pagenation.page++, pagesize || pagenation.size).success(showList);
      }

      $scope.$on('groupChanged',function(event,group) {
        loadList(group,8);
      });

      $scope.$on('moduleChanged',function(event,group) {
        loadList(group, 8);
      });

      function showList(data, status) {
        var m = data.count - (data.page+1) * data.size;
        $scope.hasMore = data.page < data.total;
        data.list.forEach(function(md) {
          $scope.markdowns.push(md);
        });
      }

    }
  ]);
