'use strict';

describe('Service: callapi', function () {

  // load the service's module
  beforeEach(module('dsgaApp'));

  // instantiate service
  var callapi;
  beforeEach(inject(function (_callapi_) {
    callapi = _callapi_;
  }));

  it('should do something', function () {
    expect(!!callapi).toBe(true);
  });

});
