'use strict';

describe('Service: ServerCommunicator', function () {

  // load the service's module
  beforeEach(module('dsgaApp'));

  // instantiate service
  var ServerCommunicator;
  beforeEach(inject(function (_ServerCommunicator_) {
    ServerCommunicator = _ServerCommunicator_;
  }));

  it('should do something', function () {
    expect(!!ServerCommunicator).toBe(true);
  });

});
