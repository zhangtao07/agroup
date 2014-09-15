'use strict';

describe('Directive: creategroup', function () {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('app/group/creategroup/creategroup.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<creategroup></creategroup>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the creategroup directive');
  }));
});