'use strict';

/**
 * @ngdoc service
 * @name dsgaApp.Device
 * @description
 * # Device
 * Service in the dsgaApp.
 */
angular.module('dsgaApp')
  .service('DeviceService', function (ServerCommunicator) {
	//Internal server CRUD
    this.create = function(data,success,error){
	    ServerCommunicator.callInternalServer('post',data,'api/device', success, error);
    };
    this.getDeviceByID = function(id,success,error){
	    ServerCommunicator.callInternalServer('get',{},'api/device/'+id, success, error);
    };
    this.listDevices = function(success,error){
	    ServerCommunicator.callInternalServer('get',{},'api/devices/ASC/1000', success, error);
    };
    this.updateByID = function(data,id,success,error){
	    ServerCommunicator.callInternalServer('put',data,'api/device/'+id, success, error);
    };
    this.deleteByTag = function(tag,success,error){
	    ServerCommunicator.callInternalServer('delete',{},'api/device/tag/'+tag, success, error);
    }; 
    this.toggleDeviceByID = function(id,state,success,error){
	    ServerCommunicator.callInternalServer('get',{},'api/device/toggle/'+id+'/'+state, success, error);
    };
    
    //Target server CRUD
    //Direct
    this.getTargetServerDeviceStatusByTag = function(tag,success,error){
	    ServerCommunicator.callExternalServer('get',{},'/general/device/tag/'+tag, success, error);
    };
    //With proxy
    this.createDeviceInTargetServer = function(tag,success,error){
	    ServerCommunicator.callInternalServer('post',null,'api/device/external/'+tag, success, error);
    }; 
    this.updateDeviceInTargetServer = function(tag,success,error){
	    ServerCommunicator.callInternalServer('put',null,'api/device/external/'+tag, success, error);
    };
    this.deleteDeviceInTargetServer = function(tag,success,error){
	    ServerCommunicator.callInternalServer('delete',null,'api/device/external/'+tag, success, error);
    };
  });
