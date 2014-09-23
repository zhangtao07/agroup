'use strict';

describe('Controller: MarkdownCtrl', function () {

  // load the controller's module
  beforeEach(module('agroupApp'));

  var MarkdownCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MarkdownCtrl = $controller('MarkdownCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
