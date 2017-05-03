'use strict';

/**
 * @ngdoc service
 * @name dsgaApp.Server
 * @description
 * # Server
 * Service in the dsgaApp.
 */
angular.module('dsgaApp')
.service('ServerService', function (ServerCommunicator) {
	this.getStatus = function(success,error){
		ServerCommunicator.callExternalServer('get',null,'/general/admin/status',success, error);
	};
});
