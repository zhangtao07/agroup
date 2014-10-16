'use strict';

describe('Directive: linkitem', function () {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('components/message/linkitem/linkitem.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<linkitem></linkitem>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the linkitem directive');
  }));
});