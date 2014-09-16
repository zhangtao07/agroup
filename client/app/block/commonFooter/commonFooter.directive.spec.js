'use strict';

describe('Directive: commonFooter', function () {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('app/block/commonFooter/commonFooter.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<common-footer></common-footer>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the commonFooter directive');
  }));
});