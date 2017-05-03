'use strict';

describe('Controller: UpdateDeviceCtrl', function () {

  // load the controller's module
  beforeEach(module('dsgaApp'));

  var UpdateDeviceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UpdateDeviceCtrl = $controller('UpdateDeviceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UpdateDeviceCtrl.awesomeThings.length).toBe(3);
  });
});
