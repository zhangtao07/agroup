'use strict';

describe('Directive: msgitem', function() {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('app/message/msgitem/msgitem/msgitem.html'));

  var element, scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<msgitem></msgitem>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the msgitem directive');
  }));
});