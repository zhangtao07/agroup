'use strict';

describe('Directive: commonSettings', function () {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('app/block/commonSettings/commonSettings.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<common-settings></common-settings>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the commonSettings directive');
  }));
});