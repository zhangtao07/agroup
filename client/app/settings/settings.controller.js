'use strict';

angular.module('agroupApp')
  .controller('SettingsCtrl', function ($scope, $http) {
    $http.get('http://agroup.baidu.com/api/user/me').success(function(e) {
      if(e.data) {
        $scope.my_profile = e.data;
        console.info(e.data);
      };
    });

    if($scope.my_profile) {
      var avatarImage;

      $scope.onpick = function(fileData){
        if (fileData) {
          $scope.my_profile.avatar = fileData;
        };
        avatarImage = new Image();
        avatarImage.src = fileData;
      };
      $scope.signupForm = function() {
        var formData = new FormData();
        formData.append('id', $scope.my_profile.id);
        formData.append('nickname', $scope.my_profile.nickname);
        if(avatarImage != undefined) {
          formData.append('avatar', avatarImage);
        };

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/user/me', true);
        xhr.onload = function(e) {
          if(e.responseText) {
            console.info(e);
          }
        };

        xhr.send(formData);
      };
    };


  });
