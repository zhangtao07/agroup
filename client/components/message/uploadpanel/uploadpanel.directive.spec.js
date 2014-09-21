'use strict';

describe('Directive: uploadpanel', function () {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('components/message/uploadpanel/uploadpanel.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<uploadpanel></uploadpanel>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the uploadpanel directive');
  }));
});