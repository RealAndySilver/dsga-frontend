'use strict';

/**
 * @ngdoc service
 * @name dsgaApp.settings
 * @description
 * # settings
 * Service in the dsgaApp.
 */
angular.module('dsgaApp')
  .service('SettingsService', function (ServerCommunicator) {
    this.getSettings = function(success,error){
		ServerCommunicator.callInternalServer('get',null,'api/settings/1',success,error);
	};
	this.update = function(data,success,error){
		ServerCommunicator.callInternalServer('put',data,'api/settings/1',success, error);
	};
	this.reset = function(success,error){
		ServerCommunicator.callInternalServer('put',null,'api/settings/default/1', success, error);
	};
	this.toggleSwitch = function(state,success,error){
		ServerCommunicator.callInternalServer('get',null,'api/settings/toggle/1/'+state, success, error);	
	};
  });
