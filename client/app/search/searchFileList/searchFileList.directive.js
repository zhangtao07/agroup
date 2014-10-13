'use strict';

angular.module('agroupApp').directive('searchFileList', function(searchAPI) {
  return {
    templateUrl: 'app/search/searchFileList/searchFileList.html',
    restrict: 'EA',
    scope: {
      keyword: "@"
    },
    link: function(scope, element, attrs) {
//        console.info(scope.keyword);
      scope.list = [];

      scope.currentPage = 1;
      var highlightRegex = (function(){
        var keyword = scope.keyword;
        var words = [];
        keyword.trim().split(' ').forEach(function(word){
          word = word.trim();
          if(word.length>0){
            words.push(word);
          }
        });
        var regStr = '('+words.join('|')+')';
        console.info(regStr)
        return new RegExp(regStr,'g');


      })();
      var keyword = scope.keyword;
      'keyword'.replace(/([^\x00-\xff])/g,'$1 ');

      scope.pageChanged = function() {
//        console.info(scope.currentPage);

        searchAPI.searchFile(scope.keyword, 1000, scope.currentPage, 10).success(function(res, status) {
          if (!res.err) {
            var total = res.data.total,
              pagesize = res.data.pagesize,
              list = res.data.list;

            if (total == 0) {
//              alert('没有数据');
            } else {
              scope.totalItems = total;
              scope.list.splice(0,scope.list.length);
              list.forEach(function(item){

                item.text = item.text.replace(highlightRegex,'<b>$1</b>')
                scope.list.push(item);
              });
            }

          }
        });
      };

      scope.pageChanged();


    }

  }
});