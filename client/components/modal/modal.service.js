'use strict';

angular.module('agroupApp')
  .factory('Modal', ['$rootScope', '$modal',function($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass,size,backdrop) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';


      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope,
        size: size,
        keyboard: true,
        backdrop: backdrop || 'static'
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
              name = args.shift(),
              deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: '提示',
                html: '<p>亲,确定要删除 <strong>' + name + '</strong> ?</p>',
                buttons: [
                  {
                    classes: 'btn-danger',
                    text: '删除',
                    click: function(e) {
                      deleteModal.close(e);
                    }
                  },
                  {
                    classes: 'btn-default',
                    text: '取消',
                    click: function(e) {
                      deleteModal.dismiss(e);
                    }
                  }
                ]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        },
        create: function(ok) {
          ok = ok || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to ok callback
           */
          return function(info) {
            var args = Array.prototype.slice.call(arguments),
              name = args.shift(),
              createModal;

            createModal = openModal({
              modal: {
                dismissable: true,
                title: info.title,
                html: info.content,
                data: info.data,
                templateUrl: info.templateUrl,
                buttons: [
                  {
                    classes: 'btn-default',
                    text: '取消',
                    click: function(e) {
                      createModal.dismiss(e);
                    }
                  },
                  {
                    classes: 'btn-primary',
                    text: info.ok,
                    click: function(e) {
                      createModal.close(e);
                    }
                  }
                ]
              }
            }, info.style,info.size,info.templateUrl);

            createModal.result.then(function(event) {
              ok.apply(event, args);
            });
          };
        }
      },

      dialog: function(ok){
          ok = ok || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
              name = args.shift(),
              dialogModal;

            dialogModal = openModal({
              modal: {
                dismissable: true,
                title: 'Agroup',
                html: name,
                buttons: [
                  //{
                    //classes: 'btn-primary',
                    //text: 'Edit',
                    //click: function(e) {
                      //dialogModal.close(e);
                    //}
                  //},
                  {
                    classes: 'btn-default',
                    text: 'Close',
                    click: function(e) {
                      dialogModal.dismiss(e);
                    }
                  }
                ]
              }
            }, 'modal-primary');

            dialogModal.result.then(function(event) {
              ok.apply(event, args);
            });
          };
      },

      /* addMember modal */
      addMember : {

        create: function(ok) {
          ok = ok || angular.noop;

          return function(info) {
            var args = Array.prototype.slice.call(arguments),
              name = args.shift(),
              createModal;

            createModal = openModal({
              modal: {
                dismissable: true,
                title: info.title,
                html: info.content,
                data: info.data,
                templateUrl: info.templateUrl,
                buttons: [
                  {
                    classes: 'btn-default',
                    text: '关闭',
                    click: function (e) {
                      createModal.dismiss(e);
                    }
                  }
                ]
              }
            }, info.style,info.size,true);

            createModal.result.then(function(event) {
              ok.apply(event, args);
            });
          };
        }
      }
    };
  }]);
