'use strict';

angular.module('agroupApp')
  .controller('SettingsCtrl', ['apiRoot', '$scope',
    function (apiRoot, $scope) {

      $scope.my_profile = $scope.__user;

      if($scope.my_profile) {

        var avatarImage;

        $scope.onpick = function(fileData){
          if (fileData) {
            $scope.my_profile.avatar = fileData;
          };

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

        $scope.signupForm = function() {
          var formData = new FormData();
          formData.append('id', $scope.my_profile.id);
          formData.append('nickname', $scope.my_profile.nickname);
          formData.append('realname', $scope.my_profile.realname);
          if(avatarImage != undefined) {
            formData.append('avatar', avatarImage);
            console.log(avatarImage);
          };

          var xhr = new XMLHttpRequest();
          xhr.open('POST', apiRoot + 'api/user/me', true);
          xhr.onload = function(e) {
            if(e.responseText) {
              console.info(e);
            }
          };
          xhr.send(formData);

        };

      };

  }
  ]);
