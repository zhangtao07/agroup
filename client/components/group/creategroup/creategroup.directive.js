'use strict';
(function() {


  angular.module('agroupApp')
    .directive('creategroup', ['$modal','$http', function($modal,$http) {
      return {
        templateUrl: 'components/group/creategroup/creategroup.html',
        restrict: 'EA',
        link: function(scope, element, attrs) {

          var ModalInstanceCtrl = function($scope, $modalInstance, items) {

            $scope.ok = function() {
              $http.post("api/group/create",{
                name:this.inputname
              }).success(function(res){
                if(res.err == 0){
                  $modalInstance.close();
                }
              })

            };

            $scope.cancel = function() {
              $modalInstance.dismiss('cancel');
            };
          };


          element.bind("click", function() {
            var modalInstance = $modal.open({
              templateUrl: 'myModalContent.html',
              controller: ModalInstanceCtrl,
              resolve: {
                items: function() {
                  return scope.items;
                }
              }
            });

            modalInstance.result.then(function(selectedItem) {

            }, function() {

            });
          });
        }
      };
    }]);



})();