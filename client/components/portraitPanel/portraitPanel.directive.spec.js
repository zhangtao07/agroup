'use strict';

describe('Directive: portraitPanel', function () {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('components/portraitPanel/portraitPanel.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<portrait-panel></portrait-panel>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the portraitPanel directive');
  }));
});