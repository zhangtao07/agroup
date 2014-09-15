'use strict';

describe('Directive: imageitem', function() {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('app/message/imageitem/imageitem.html'));

  var element, scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<imageitem></imageitem>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the imageitem directive');
  }));
});