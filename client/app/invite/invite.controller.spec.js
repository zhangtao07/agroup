'use strict';

describe('Controller: InviteCtrl', function () {

  // load the controller's module
  beforeEach(module('agroupApp'));

  var InviteCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InviteCtrl = $controller('InviteCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
