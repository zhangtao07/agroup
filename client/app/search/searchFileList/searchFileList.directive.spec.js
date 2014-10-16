'use strict';

describe('Directive: searchFileList', function () {

  // load the directive's module and view
  beforeEach(module('agroupApp'));
  beforeEach(module('app/search/searchFileList/searchFileList.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<search-file-list></search-file-list>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the searchFileList directive');
  }));
});