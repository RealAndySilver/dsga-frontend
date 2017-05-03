'use strict';

describe('Service: Lists', function () {

  // load the service's module
  beforeEach(module('dsgaApp'));

  // instantiate service
  var Lists;
  beforeEach(inject(function (_Lists_) {
    Lists = _Lists_;
  }));

  it('should do something', function () {
    expect(!!Lists).toBe(true);
  });

});
