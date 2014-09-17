'use strict';

describe('Directive: fileitem', function() {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('app/message/fileitem/fileitem.html'));

  var element, scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<fileitem></fileitem>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the fileitem directive');
  }));
});