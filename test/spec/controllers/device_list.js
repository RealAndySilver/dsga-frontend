'use strict';

describe('Controller: DeviceListCtrl', function () {

  // load the controller's module
  beforeEach(module('dsgaApp'));

  var DeviceListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DeviceListCtrl = $controller('DeviceListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DeviceListCtrl.awesomeThings.length).toBe(3);
  });
});
