'use strict';

describe('Controller: MessageCtrl', function () {

  // load the controller's module
  beforeEach(module('agroupApp'));

  var GroupCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GroupCtrl = $controller('MessageCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
