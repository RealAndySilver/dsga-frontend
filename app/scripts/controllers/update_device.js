'use strict';

/**
 * @ngdoc function
 * @name dsgaApp.controller:UpdateDeviceCtrl
 * @description
 * # UpdateDeviceCtrl
 * Controller of the dsgaApp
 */
angular.module('dsgaApp')
  .controller('UpdateDeviceCtrl', function ($scope, $http, $routeParams, $timeout, $interval, $window, $location, DeviceService, ListService) {
	      
  	
	$scope.activate_update = false;
	$scope.activate_create = false;
	$scope.activate_delete = false;
	$scope.app = 'pumps';
	$scope.dataModel = {};
    function getDevice(device_id){
		DeviceService.getDeviceByID(device_id,
		function(response){
			$scope.dataModel = response.data.data;
	    	$scope.dataModel.update_rate = $scope.dataModel.update_rate+'';
	    	$scope.dataModel.device_type = $scope.dataModel.device_type+'';
	    	console.log('El Device', $scope.dataModel)
	    	$scope.getDeviceStatus();
		}, function(response){
			console.log('Error getting devices');
		});
	}
	getDevice($routeParams.device_id);
	var var_list = '';
	var polling_info_keys = [];
	var current_object = {};
	$scope.alert = {
		type : null,
		message : {
			strong : '',
			text : ''
		}
	};
	
	ListService.getList(function(response){
		$scope.lists = response.data.data;
	});
	
	$scope.restoreSettings = function(){
		$scope.dataModel.data.settings = $scope.lists.settings;	
	};
	
	$scope.dataModel = {
		device_tag : null,
		device_address : null,
		gateway_tag : null,
		gateway_address : null,
		network_id : null,
		update_rate : null,
		device_type : null,
		var_list : '',
		polling_info : {
			app : 'pumps',
			device_type_name : '',
			PV : {
				active : false,
				dv_label : 'PV',
				dv_num : null,
				dv_unit : null,
				dv_value : null,
				dv_status : '0xc0'
			},
			SV : {
				active : false,
				dv_label : 'SV',
				dv_num : null,
				dv_unit : null,
				dv_value : null,
				dv_status : '0xc0'
			},
			TV : {
				active : false,
				dv_label : 'TV',
				dv_num : null,
				dv_unit : null,
				dv_value : null,
				dv_status : '0xc0'
			},
			QV : {
				active : false,
				dv_label : 'QV',
				dv_num : null,
				dv_unit : null,
				dv_value : null,
				dv_status : '0xc0'
			},
			DV : {
				active : false,
				dv_label : 'DV',
				dv_num : null,
				dv_unit : null,
				dv_value : null,
				dv_status : '0xc0'
			}
		}
	};
	$scope.reset_device_type = function(){
		console.log($scope.dataModel.device_type);
		$scope.dataModel.device_type = null;
	}
    $scope.onChange = function(changed){
	    console.log('changed', $scope.dataModel.polling_info);
	    if(changed == "PV"){
		    $scope.dataModel.polling_info.PV.active = true;
		    $scope.dataModel.polling_info.AP.active = false;
		    $scope.dataModel.polling_info.IR.active = false;
		    $scope.dataModel.polling_info.SD.active = false;
		    $scope.dataModel.polling_info.ED.active = false;
	    }
	    else if(changed == "AP"){
		    $scope.dataModel.polling_info.PV.active = false;
		    $scope.dataModel.polling_info.AP.active = true;
		    $scope.dataModel.polling_info.IR.active = false;
		    $scope.dataModel.polling_info.SD.active = false;
		    $scope.dataModel.polling_info.ED.active = false;
	    }
	    else if(changed == "IR"){
		    $scope.dataModel.polling_info.PV.active = false;
		    $scope.dataModel.polling_info.AP.active = false;
		    $scope.dataModel.polling_info.IR.active = true;
		    $scope.dataModel.polling_info.SD.active = false;
		    $scope.dataModel.polling_info.ED.active = false;
	    }
	    else if(changed == "SD"){
		    $scope.dataModel.polling_info.PV.active = false;
		    $scope.dataModel.polling_info.AP.active = false;
		    $scope.dataModel.polling_info.IR.active = false;
		    $scope.dataModel.polling_info.SD.active = true;
		    $scope.dataModel.polling_info.ED.active = false;
	    }
	    else if(changed == "ED"){
		    $scope.dataModel.polling_info.PV.active = false;
		    $scope.dataModel.polling_info.AP.active = false;
		    $scope.dataModel.polling_info.IR.active = false;
		    $scope.dataModel.polling_info.SD.active = false;
		    $scope.dataModel.polling_info.ED.active = true;
	    }
    };
    $scope.update_device = function(){
	    $scope.alert={
			type : null,
			message : {
				strong : '',
				text : ''
			}
		};
	    var_list = '';
	    polling_info_keys = Object.keys($scope.dataModel.polling_info);
	    polling_info_keys.forEach(function(variable_name, index){
		    if($scope.dataModel.polling_info[variable_name].active == true){
			    var_list += variable_name+',';
		    }
		   
	    });
	    $scope.dataModel.var_list = var_list.slice(0, -1);
		DeviceService.updateByID($scope.dataModel,$routeParams.device_id,
		function(response){
			$scope.alert = {
				type : 'success',
				message : {
					strong : 'Success!',
					text : 'Device updated'
				}
			};
			$timeout(function(){
				$scope.alert = {
					type : null
				};
			}, 2000);
		}, 
		function(response){
			$scope.alert = {
				type : 'failed',
				message : {
					strong : 'Error!',
					text : 'Request failed.'
				}
			};
		});
	};
    $scope.changed = function(){
		$scope.dataModel.active = $scope.dataModel.active ? 1:0;		
		DeviceService.toggleDeviceByID($routeParams.device_id,$scope.dataModel.active,
		function(response){
			if(response.data && response.data.status){
		    	
		    }
		}, 
		function(response){
			console.log('Error toggling device');
		});
		
	};
	$scope.polling_data_log = [];
	$scope.getPollingDataLog = function(){
		DeviceService.getDeviceByID($routeParams.device_id,
		function(response){
			$scope.polling_data_log = response.data.data.log.last_ten;
		}, function(response){
			console.log('Error getting log');
		});
	};
			
	$scope.getDeviceStatus = function(){
		$scope.activate_update = false;
		$scope.activate_create = false;
		$scope.activate_delete = false;
		$scope.request_status='...';
		DeviceService.getTargetServerDeviceStatusByTag($scope.dataModel.device_tag,
		function(response){
			if(response.data.status==true){
				$scope.activate_update = true;
				$scope.activate_create = false;
				$scope.activate_delete = true;
				$scope.request_status='Device exist in target server!';
			}
			else{
				$scope.activate_update = false;
				$scope.activate_create = false;
				$scope.activate_delete = false;
				$scope.request_status='Something is wrong..';
			}
		}, 
		function(response){
			if(response.status==404){
				$scope.activate_update = false;
				$scope.activate_create = true;
				$scope.activate_delete = false;
				$scope.request_status='Device not found in target server :(';
			}
			else{
				$scope.activate_update = false;
				$scope.activate_create = false;
				$scope.activate_delete = false;
				$scope.request_status='Something is wrong..';
			}
		});
	};
	
	$scope.deleteDeviceInInternalServer = function(){
		DeviceService.deleteByTag($scope.dataModel.device_tag,
		function(res){
			$scope.request_status = 'Device deleted successfully.';
			$scope.activate_delete = false;
			$scope.activate_create = false;
			$scope.activate_update = false;
			$location.url('/Devices');
		}, function(res){
			//console.log('error', res);
			$scope.request_status = 'Error deleting device..';
		});
	};
	
	$scope.createDeviceInTargetServer = function(){
		DeviceService.createDeviceInTargetServer($scope.dataModel.device_tag,
		function(res){
			$scope.request_status = 'Device created successfully.';
			$scope.activate_delete = true;
			$scope.activate_create = false;
			$scope.activate_update = true;
		}, function(res){
			//console.log('error', res);
			$scope.request_status = 'Error creating device..';
		});
	};
	
	$scope.deleteDeviceInTargetServer = function(){
		DeviceService.deleteDeviceInTargetServer($scope.dataModel.device_tag,
		function(res){
			$scope.request_status = 'Device deleted successfully.';
			$scope.activate_delete = false;
			$scope.activate_create = true;
			$scope.activate_update = false;
		}, function(res){
			$scope.request_status = 'Error deleting device..';
			//console.log('error', res);
		});
	};
	
	$scope.updateDeviceInTargetServer = function(){
		Device.updateDeviceInTargetServer($scope.dataModel.device_tag,
		function(res){
			$scope.request_status = 'Device updated successfully.';
		}, 
		function(res){
			$scope.request_status = 'Error updating device..';
			//console.log('error', res);
		});
	};
	
  });
