'use strict';

describe('Directive: imageResize', function () {

  // load the directive's module
  beforeEach(module('agroupApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<image-resize></image-resize>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the imageResize directive');
  }));
});