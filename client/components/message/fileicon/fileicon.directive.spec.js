'use strict';

describe('Directive: fileicon', function () {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('components/message/fileicon/fileicon.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<fileicon></fileicon>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the fileicon directive');
  }));
});