'use strict';

describe('Directive: groupAction', function () {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('app/main/groupAction/groupAction.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<group-action></group-action>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the groupAction directive');
  }));
});