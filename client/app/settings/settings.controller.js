'use strict';

angular.module('agroupApp')
  .controller('SettingsCtrl', ['apiRoot', '$scope',
    function (apiRoot, $scope) {
      /*获取用户信息*/
      $scope.my_profile = $scope.__user;

      if($scope.my_profile) {
        var avatarImage;

        $scope.onpick = function(fileData){
          if (fileData) {
            $scope.my_profile.avatar = fileData;
          };
          /*base64 to blob*/
          function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
            var byteCharacters = atob(b64Data.substring(b64Data.indexOf(',') + 1));
            var byteArrays = [];
            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
              var slice = byteCharacters.slice(offset, offset + sliceSize);
              var byteNumbers = new Array(slice.length);
              for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
              var byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
            var blob = new Blob(byteArrays, {type: contentType});
            return blob;
          };

          avatarImage = b64toBlob(fileData, 'application/octet-binary');

        };

        /*提交资料*/
        $scope.signupForm = function() {

          var formData = new FormData();
          formData.append('id', $scope.my_profile.id);
          formData.append('nickname', $scope.my_profile.nickname);
          formData.append('realname', $scope.my_profile.realname);
          if(avatarImage != undefined) {
            formData.append('avatar', avatarImage);
          };

          var xhr = new XMLHttpRequest();
          xhr.open('POST', apiRoot + 'api/user/modify', true);
          $scope.subIng = true;
          xhr.onreadystatechange=function() {
            if (xhr.readyState== 4 && xhr.status== 200 && JSON.parse(xhr.responseText).status == 200) {
              $scope.$apply(function() {
                $scope.subIng = false;
              });
            }else {
              console.log('提交失败，请重试！');//这里应该有个通知
              $scope.subIng = false;
            };

          };

          xhr.send(formData);

        };
      };
  }
  ]);
