'use strict';

describe('Directive: commonNav', function () {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('app/block/commonNav/commonNav.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<common-nav></common-nav>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the commonNav directive');
  }));
});