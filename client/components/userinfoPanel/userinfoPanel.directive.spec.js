'use strict';

describe('Directive: userinfoPanel', function () {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('components/userinfoPanel/userinfoPanel.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<userinfo-panel></userinfo-panel>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the userinfoPanel directive');
  }));
});