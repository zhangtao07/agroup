'use strict';

describe('Directive: previewPanel', function () {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('components/previewPanel/previewPanel.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<preview-panel></preview-panel>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the previewPanel directive');
  }));
});