'use strict';

describe('Directive: commonAside', function () {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('app/block/commonAside/commonAside.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<common-aside></common-aside>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the commonAside directive');
  }));
});