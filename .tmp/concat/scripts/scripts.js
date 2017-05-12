'use strict';

/**
 * @ngdoc overview
 * @name dsgaApp
 * @description
 * # dsgaApp
 *
 * Main module of the application.
 */
angular
  .module('dsgaApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.toggle',
    'ui.checkbox'
  ])
  .config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/Senders', {
        templateUrl: 'views/device_list.html',
        controller: 'DeviceListCtrl',
        controllerAs: 'deviceList'
      })
      .when('/new_device', {
        templateUrl: 'views/new_device.html',
        controller: 'NewDeviceCtrl',
        controllerAs: 'newDevice'
      })
      .when('/Settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settings'
      })
      .when('/update_device/:device_id', {
        templateUrl: 'views/update_device.html',
        controller: 'UpdateDeviceCtrl',
        controllerAs: 'updateDevice'
      })
      .otherwise({
        redirectTo: '/'
      });
      $locationProvider.hashPrefix('');
  }])
  .controller('AppController', ["$http", "$scope", function($http, $scope){
	$http.get("../config.json").then(function(response) { //success
		$scope.app_url = response.data.local_endpoint;	
	});
			
  }]);

'use strict';

/**
 * @ngdoc function
 * @name dsgaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dsgaApp
 */
angular.module('dsgaApp')
  .controller('MainCtrl', ["$scope", "SettingsService", "$rootScope", function ($scope,SettingsService, $rootScope) {
	$rootScope.master_switch = {
		state : null
	}
    
    $scope.getSettings = function(){
		SettingsService.getSettings(function(response){
			if(response.data && response.data.status){
		    	$scope.settings = response.data.data;
		    	$scope.settings.data.update_rate = $scope.settings.data.update_rate+'';
		    	console.log('Settings', $scope.settings);
		    	$rootScope.endpoint = $scope.settings.data.endpoint;
		    	$rootScope.master_switch = $scope.settings.active;
		    }
		}, 
		function(response){
			console.log('Error getting settings');
		});
	};
    $scope.getSettings();
    $scope.toggleSwitch = function(){
	    $scope.settings.active = $rootScope.master_switch.state ? 1:0;
		SettingsService.toggleSwitch($scope.settings.active,function(res){
			console.log(res);
		}, function(res){
			console.log('error', res);
		});	
	};
  }]);

'use strict';

/**
 * @ngdoc function
 * @name dsgaApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dsgaApp
 */
angular.module('dsgaApp')
  .controller('AboutCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name dsgaApp.controller:DeviceListCtrl
 * @description
 * # DeviceListCtrl
 * Controller of the dsgaApp
 */
angular.module('dsgaApp').controller('DeviceListCtrl', ["$scope", "$http", "$window", "$location", "DeviceService", "ListService", function ($scope, $http, $window, $location, DeviceService, ListService) {
    $scope.init = function(){
		getList();
	};
	$scope.filtered_devices = {};
	function getList(){
		DeviceService.listDevices(function(response) {
			if(response.data && response.data.status){
		    	$scope.device_list = response.data.data;
		    	$scope.device_list.forEach(function(device){
			    	if(device.data.app_name == undefined || device.data.app_name == ""){
				    	device.data.app_name = "Server 1 Senders";
			    	}
			    	if(!$scope.filtered_devices[device.data.app_name]){
				    	$scope.filtered_devices[device.data.app_name] = [];
			    	}
			    	$scope.filtered_devices[device.data.app_name].push(device);
		    	});
		    }
		    else{
			    $scope.app_list = [];
		    }
		});
	}
	ListService.getList(function(response){
		$scope.lists = response.data.data;
		getList();
	});
	$scope.getList = getList;
	$scope.changed = function(device){
		device.active = device.active ? 1:0;
		DeviceService.toggleDeviceByID(device.id,device.active,
		function(response){
			if(response.data && response.data.status){
		    	
		    }
		}, 
		function(response){
			console.log('Error toggling device');
		});
		
	};
	$scope.new_device = function () {
		$location.path('/new_device');
	};
	$scope.goToURL = function(id){
	    console.log('id',id);
    }
  }]);

'use strict';

/**
 * @ngdoc function
 * @name dsgaApp.controller:NewDeviceCtrl
 * @description
 * # NewDeviceCtrl
 * Controller of the dsgaApp
 */
angular.module('dsgaApp').controller('NewDeviceCtrl', ["$scope", "$http", "$window", "$timeout", "DeviceService", "ListService", function ($scope, $http, $window, $timeout, DeviceService, ListService) {
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
		data : {
			app_name : '',
			override_global_settings : true,
			settings : {}
		},
		polling_info : {
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
	ListService.getList(function(response){
		$scope.lists = response.data.data;
		$scope.dataModel.data.settings = $scope.lists.settings;
	});
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

    $scope.createDeviceInInternalServer = function(){
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
	    console.log('Vamos bien', $scope.dataModel);
	    $scope.dataModel.var_list = var_list.slice(0, -1);
		DeviceService.create($scope.dataModel, 
		function(response) {
			$scope.alert = {
				type : 'success',
				message : {
					strong : 'Success!',
					text : 'Device created'
				}
			};
			$timeout(function(){
				$window.history.back();
			}, 2000);

		},function(response) {
			$scope.alert = {
				type : 'failed',
				message : {
					strong : 'Error!',
					text : 'Request failed.'
				}
			};
		});
	};
  }]);

//'use strict';

/**
 * @ngdoc function
 * @name dsgaApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the dsgaApp
 */
angular.module('dsgaApp')
  .controller('SettingsCtrl', ["$scope", "$http", "SettingsService", "ServerService", "ListService", "$rootScope", function ($scope,$http, SettingsService, ServerService, ListService, $rootScope) {
	$scope.alert = {
		type : null,
		message : {
			strong : '',
			text : ''
		}
	};
	$scope.update_rate_options = [60,120,180,240,300];
    $scope.init = function(){
		$scope.getSettings();
	};
	$scope.getSettings = function(){
		SettingsService.getSettings(function(response){
			if(response.data && response.data.status){
		    	$scope.settings = response.data.data;
		    	$scope.settings.data.update_rate = $scope.settings.data.update_rate+'';
		    	$rootScope.endpoint = $scope.settings.data.endpoint;
		    }
		}, 
		function(response){
			console.log('Error getting settings');
		});
	};
	ListService.getList(function(response){
		$scope.lists = response.data.data;
		console.log('Lista',$scope.lists);
	});
	$scope.restoreSettings = function(){
		$scope.settings.data.settings = $scope.lists.settings;	
	};
	$scope.update = function(){
		$scope.alert={
			type : null,
			message : {
				strong : '',
				text : ''
			}
		};
		SettingsService.update($scope.settings,
		function(response){
			if(response.data && response.data.status){
		    	$scope.getSettings();
		    	$scope.alert={
					type : 'success',
					message : {
						strong : 'Success!',
						text : 'Settings updated'
					}
				};
		    }
		    else{
			    $scope.alert={
					type : 'failed',
					message : {
						strong : 'Error!',
						text : 'Request failed.'
					}
				};
		    }
		}, 
		function(response){
			console.log('Error updating settings');
		});
	};
	$scope.reset = function(){
		$scope.alert.type=null;
		SettingsService.reset(function(response) {
			if(response.data && response.data.status){
		    	$scope.getSettings();
		    	$scope.alert={
					type : 'warning',
					message : {
						strong : 'Success!',
						text : 'Default values restored.'
					}
				};
		    }
		    else{
			    $scope.alert={
					type : 'failed',
					message : {
						strong : 'Error!',
						text : 'Request failed.'
					}
				};
		    }
		}, function(res){
			console.log('error', res);
		});	
	};

	$scope.getServerStatus = function(){
		$scope.server_status='';
		ServerService.getStatus(function(res){
			if(res.data=='ok'){
				$scope.server_status='Ok!';
			}
			else{
				$scope.server_status='Wrong Endpoint.';
			}
		}, function(res){
				$scope.server_status='Something is wrong..';
		});
	};
	
	$scope.toggleSwitch = function(){
		$scope.settings.active = $scope.settings.active ? 1:0;	
		SettingsService.toggleSwitch($scope.settings.active,function(res){
			console.log(res);
		}, function(res){
			console.log('error', res);
		});	
	};
	
  }]);

'use strict';

/**
 * @ngdoc function
 * @name dsgaApp.controller:UpdateDeviceCtrl
 * @description
 * # UpdateDeviceCtrl
 * Controller of the dsgaApp
 */
angular.module('dsgaApp')
  .controller('UpdateDeviceCtrl', ["$scope", "$http", "$routeParams", "$timeout", "$interval", "$window", "$location", "DeviceService", "ListService", function ($scope, $http, $routeParams, $timeout, $interval, $window, $location, DeviceService, ListService) {
	      
  	
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
			AP : {
				active : false,
				dv_label : 'SV',
				dv_num : null,
				dv_unit : null,
				dv_value : null,
				dv_status : '0xc0'
			},
			IR : {
				active : false,
				dv_label : 'TV',
				dv_num : null,
				dv_unit : null,
				dv_value : null,
				dv_status : '0xc0'
			},
			SD : {
				active : false,
				dv_label : 'QV',
				dv_num : null,
				dv_unit : null,
				dv_value : null,
				dv_status : '0xc0'
			},
			ED : {
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
	
  }]);

'use strict';

/**
 * @ngdoc service
 * @name dsgaApp.ServerCommunicator
 * @description
 * # ServerCommunicator
 * Service in the dsgaApp.
 */
angular.module('dsgaApp')
  .service('ServerCommunicator', ["$http", "$rootScope", function ($http, $rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    //var app_url = 'http://192.241.187.135:3200/';
    var app_url = '';
    var self = this;
    this.settings = {};
    $http.get("../config.json").then(function(response) { //success
		console.log('Config.json',response);
		app_url = response.data.local_endpoint;	
		console.log('AppUrl',app_url)	
	});
    
    
    function getSettings(callback){
		$http.get(app_url+'api/settings/1').
		then(function(response) {
			
			if(response.data && response.data.status){
		    	//$scope.settings = response.data.data.data;
		    	//$scope.settings.update_rate = $scope.settings.update_rate+'';
		    	callback(null,{status:true, settings:response.data.data.data});
		    }
		    else{
			    callback({status:false, error:'Unknown'});
		    }
		}, function(response){
			callback({status:false, error:response});
		});
	}

	self.callInternalServer = function(type,data,path,success_callback,error_callback){
		//getSettings(function(err,response){
			if(type.toLowerCase() == 'post'){type = 'post';}
			else if(type.toLowerCase() == 'put'){type = 'put';}
			else if(type.toLowerCase() == 'get'){type = 'get';}
			else if(type.toLowerCase() == 'delete'){type = 'delete';}
			else {type = 'get';}
			$http[type](app_url+path,data).
			then(success_callback, error_callback);
		//});
	}
	self.callExternalServer = function(type,data,path,success_callback,error_callback){
		//getSettings(function(err,response){
			if(type.toLowerCase() == 'post'){type = 'post';}
			else if(type.toLowerCase() == 'put'){type = 'put';}
			else if(type.toLowerCase() == 'get'){type = 'get';}
			else if(type.toLowerCase() == 'delete'){type = 'delete';}
			else {type = 'get';}
			$http[type](response.settings.endpoint+path,data).
			then(success_callback, error_callback);
		//});
	}
  }]);

'use strict';

/**
 * @ngdoc service
 * @name dsgaApp.settings
 * @description
 * # settings
 * Service in the dsgaApp.
 */
angular.module('dsgaApp')
  .service('SettingsService', ["ServerCommunicator", function (ServerCommunicator) {
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
  }]);

'use strict';

/**
 * @ngdoc service
 * @name dsgaApp.Server
 * @description
 * # Server
 * Service in the dsgaApp.
 */
angular.module('dsgaApp')
.service('ServerService', ["ServerCommunicator", function (ServerCommunicator) {
	this.getStatus = function(success,error){
		ServerCommunicator.callExternalServer('get',null,'/general/admin/status',success, error);
	};
}]);

'use strict';

/**
 * @ngdoc service
 * @name dsgaApp.Device
 * @description
 * # Device
 * Service in the dsgaApp.
 */
angular.module('dsgaApp')
  .service('DeviceService', ["ServerCommunicator", function (ServerCommunicator) {
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
  }]);

'use strict';

/**
 * @ngdoc service
 * @name dsgaApp.Lists
 * @description
 * # Lists
 * Service in the dsgaApp.
 */
angular.module('dsgaApp')
  .service('ListService', ["ServerCommunicator", function (ServerCommunicator) {
    this.getList = function(success,error){
		ServerCommunicator.callInternalServer('get',null,'api/list',success,error);
	};
  }]);

angular.module('dsgaApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/about.html',
    "<p>This is the about view.</p>"
  );


  $templateCache.put('views/device_list.html',
    "<div class=\"device-list-header\"> <div class=\"float-left\" style=\"font-size:30px\"><b>Senders List</b> <span class=\"badge badge-important\">{{device_list.length}}</span></div> <button type=\"button\" class=\"btn btn-info add-button\" ng-click=\"new_device()\"><b>Add Sender +</b></button> </div> <div> <div ng-repeat=\"(app_name, devices) in filtered_devices\" ng-if=\"devices.length>0\"> <div style=\"font-size:30px; margin-bottom: 20px\"><b>{{app_name}}</b> <span class=\"badge badge-important\">{{devices.length}}</span> </div> <li class=\"no-list-style tall-list\" ng-repeat=\"device in devices\"> <span class=\"label label-danger type-tag\">{{device.var_list}}</span> <div class=\"left-container-for-list\"> <div class=\"device-title\"><b> <a href=\"#/update_device/{{device.id}}\">{{device.device_tag}}</a></b></div> <h3> <span class=\"label label-info\">{{device.data.settings['Points X Req']}}</span> <span class=\"label label-primary\">{{device.update_rate}}</span> </h3> </div> <div class=\"center-left-container-for-list\"> <span class=\"badge\">Sender Address : {{device.device_address}}</span> <span class=\"badge\">Network ID : {{device.network_id}}</span> <span class=\"badge\">Var List : {{device.var_list}}</span> <span class=\"badge\">Target : {{device.data.override_global_settings ? device.data.settings.endpoint : 'Global Endpoint'}}</span> </div> <toggle class=\"toggle\" ng-model=\"device.active\" ng-change=\"changed(device)\" on=\"On\" off=\"Off\" onstyle=\"btn-info\"></toggle> </li> </div> </div>"
  );


  $templateCache.put('views/main.html',
    "<div class=\"main-page\"> <p> <img style=\"margin-left: 250px\" src=\"images/hornet.png\" width=\"200\"> </p> <div class=\"circle\"> <div class=\"logo-text\">dsga</div> </div> <p class=\"lead\"> </p> <div class=\"home-title\"> DSGA Manager</div> <!--\n" +
    "  <div class=\"center-div\">\n" +
    "\t\t<toggle class=\"toggle center-content\" ng-model=\"settings.active\" ng-change=\"toggleSwitch()\" on=\"On\" off=\"Off\" onstyle=\"btn-success\"></toggle>\n" +
    "  </div>\n" +
    "--> <!--   <b><span class=\"nice-blue-text\">{{settings.data.endpoint}}</span></b> --> <div id=\"list-button-centered\"> <br> <p><a class=\"btn btn-lg btn-info\" ng-href=\"#/Senders\">Go To Senders List <span class=\"glyphicon glyphicon-th-list\"></span></a></p> </div> </div>"
  );


  $templateCache.put('views/new_device.html',
    "<div class=\"device-list-header\"> <div class=\"float-left\" style=\"font-size:30px\"><b>New Data Sender <span class=\"nice-blue-text\">{{dataModel.device_tag}}</span></b> </div> <button type=\"button\" class=\"btn btn-success add-button\" ng-click=\"createDeviceInInternalServer()\"><b>Save +</b></button> </div> <div class=\"form-group\"> <label for=\"app_name\">App Name:</label> <select name=\"singleSelect2\" id=\"singleSelect2\" ng-model=\"dataModel.data.app_name\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.apps\" value=\"{{option}}\">{{option}}</option> </select> </div> <div class=\"form-group\"> <label for=\"device_tag\">Sender Tag:</label> <input type=\"text\" class=\"form-control\" id=\"device_tag\" ng-model=\"dataModel.device_tag\"> </div> <div class=\"form-group\"> <label for=\"device_address\">Sender Address:</label> <input type=\"text\" class=\"form-control\" id=\"device_address\" ng-model=\"dataModel.device_address\"> </div> <!--\n" +
    "<div class=\"form-group\">\n" +
    "  <label for=\"gateway_tag\">Gateway Tag:</label>\n" +
    "  <input type=\"text\" class=\"form-control\" id=\"gateway_tag\" ng-model=\"dataModel.gateway_tag\">\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "  <label for=\"gateway_address\">Gateway Address:</label>\n" +
    "  <input type=\"text\" class=\"form-control\" id=\"gateway_address\" ng-model=\"dataModel.gateway_address\">\n" +
    "</div>\n" +
    "--> <div class=\"form-group\"> <label for=\"network_id\">Network ID:</label> <input type=\"text\" class=\"form-control\" id=\"network_id\" ng-model=\"dataModel.network_id\"> </div> <div class=\"form-group\"> <label for=\"update_rate\">Update Rate:</label> <select name=\"singleSelect2\" id=\"singleSelect2\" ng-model=\"dataModel.update_rate\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.update_rate_options\" value=\"{{option}}\">{{option}} Seconds</option> </select> </div> <!--\n" +
    "\t<div class=\"device-select\">\n" +
    "\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label for=\"update_rate\">Sender Type :</label>\n" +
    "\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.device_type_name\" ng-click=\"reset_device_type()\">\n" +
    "\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t    <option ng-repeat=\"option in lists.device_types\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t</select>\n" +
    "\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.device_type\">\n" +
    "\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t    <option ng-repeat=\"option in lists.device_sub_types[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t</select>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "--> <span> <div class=\"var_list_container\"> <h2> <b>Var</b> </h2> <b>PV</b> <checkbox largest ng-model=\"dataModel.polling_info.PV.active\" name=\"custom-name\" ng-change=\"onChange('PV')\" class=\"btn-default\"></checkbox> <b>AP</b> <checkbox largest ng-model=\"dataModel.polling_info.AP.active\" name=\"custom-name\" ng-change=\"onChange('AP')\" class=\"btn-default\"></checkbox> <b>IR</b> <checkbox largest ng-model=\"dataModel.polling_info.IR.active\" name=\"custom-name\" ng-change=\"onChange('IR')\" class=\"btn-default\"></checkbox> <b>SD</b> <checkbox largest ng-model=\"dataModel.polling_info.SD.active\" name=\"custom-name\" ng-change=\"onChange('SD')\" class=\"btn-default\"></checkbox> <b>ED</b> <checkbox largest ng-model=\"dataModel.polling_info.ED.active\" name=\"custom-name\" ng-change=\"onChange('ED')\" class=\"btn-default\"></checkbox> </div> <div class=\"single_var_element\" id=\"PV-section\" ng-if=\"dataModel.polling_info.PV.active\"> <h2><b>PV</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Data Type:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.PV\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"AP-section\" ng-if=\"dataModel.polling_info.AP.active\"> <h2><b>PV</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Image Size:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.AP\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"IR-section\" ng-if=\"dataModel.polling_info.IR.active\"> <h2><b>IR</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Infra Red Video Size:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.IR\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"SD-section\" ng-if=\"dataModel.polling_info.SD.active\"> <h2><b>SD</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Data Type:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.SD\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"ED-section\" ng-if=\"dataModel.polling_info.ED.active\"> <h2><b>ED</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Data Type:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.ED\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <!--\n" +
    "\t<div class=\"single_var_element\" id=\"PV-section\" ng-if=\"dataModel.polling_info.PV.active\">\n" +
    "\t\t<h2><b>PV</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_status\" ng-init=\"dataModel.polling_info.PV.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"AP-section\" ng-if=\"dataModel.polling_info.AP.active\">\n" +
    "\t\t<h2><b>AP</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"IR-section\" ng-if=\"dataModel.polling_info.IR.active\">\n" +
    "\t\t<h2><b>IR</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"SD-section\" ng-if=\"dataModel.polling_info.SD.active\">\n" +
    "\t\t<h2><b>SD</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"DV-section\" ng-if=\"dataModel.polling_info.ED.active\">\n" +
    "\t\t<h2><b>ED</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "--> <div style=\"clear:both; margin-bottom:30px\"></div> <div class=\"var_list_container\"> <h2> <b>Override Global Settings?</b> </h2> <b>Yes please :)</b> <checkbox largest ng-model=\"dataModel.data.override_global_settings\" name=\"custom-name\" ng-change=\"onChange()\" class=\"btn-default\"></checkbox> </div> <div ng-if=\"dataModel.data.override_global_settings\"> <div class=\"device-list-header\"> <div class=\"float-left\" style=\"font-size:30px\" ng-click=\"restoreSettings();\"><b>Settings</b></div> </div> <span ng-repeat=\"(key,value) in lists.settings\"> <div class=\"small-input float-left margin-bottom\"> <label for=\"{{key}}\">{{key}}:</label> <input type=\"number\" class=\"form-control\" id=\"\" ng-model=\"dataModel.data.settings[key]\" value=\"{{value}}\"> </div> </span> </div> </span> <div style=\"clear:both; margin-bottom:30px\"></div> <div class=\"alert-box\"> <div class=\"alert alert-success alert-dismissable\" ng-if=\"alert.type=='success'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-warning alert-dismissable\" ng-if=\"alert.type=='warning'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-danger alert-dismissable\" ng-if=\"alert.type=='failed'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> </div> <div class=\"device-list-header\"> <button type=\"button\" class=\"btn btn-success add-button\" ng-click=\"createDeviceInInternalServer()\"><b>Save +</b></button> </div>"
  );


  $templateCache.put('views/settings.html',
    "<span ng-init=\"init()\"> <div class=\"form-group\"> <h2> <b>Master Switch</b> </h2> <toggle class=\"toggle float-left\" ng-model=\"settings.active\" ng-change=\"toggleSwitch()\" on=\"On\" off=\"Off\" onstyle=\"btn-info\"></toggle> </div> <!--<div style=\"clear:both; margin-bottom:30px;\"></div>\n" +
    "\t<div class=\"device-list-header\">\n" +
    "\t\t<div class=\"float-left\" style=\"font-size:30px;\"><b>Settings</b></div>\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"OV1_SS\">OV1_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"OV1_SS\" ng-model=\"settings.data.settings.OV1_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"PKV1_SS\">PKV1_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"PKV1_SS\" ng-model=\"settings.data.settings.PKV1_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"OV2_SS\">OV2_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"OV2_SS\" ng-model=\"settings.data.settings.OV2_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"PKV2_SS\">PKV2_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"PKV2_SS\" ng-model=\"settings.data.settings.PKV2_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"DISCH_P_SS\">DISCH_P_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"DISCH_P_SS\" ng-model=\"settings.data.settings.DISCH_P_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"FLOW_SS\">FLOW_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"FLOW_SS\" ng-model=\"settings.data.settings.FLOW_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"SUCT_P_SS\">SUCT_P_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"SUCT_P_SS\" ng-model=\"settings.data.settings.SUCT_P_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"STR_DP_SS\">STR_DP_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"STR_DP_SS\" ng-model=\"settings.data.settings.STR_DP_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"SEAL_L_SS\">SEAL_L_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"SEAL_L_SS\" ng-model=\"settings.data.settings.SEAL_L_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"SEAL_P_SS\">SEAL_P_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"SEAL_P_SS\" ng-model=\"settings.data.settings.SEAL_P_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"BEAR1_T_SS\">BEAR1_T_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"BEAR1_T_SS\" ng-model=\"settings.data.settings.BEAR1_T_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"BEAR2_T_SS\">BEAR2_T_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"BEAR2_T_SS\" ng-model=\"settings.data.settings.BEAR2_T_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"SPEED_SP\">SPEED_SP:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"SPEED_SP\" ng-model=\"settings.data.settings.SPEED_SP\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"SPEED_MAX\">SPEED_MAX:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"SPEED_MAX\" ng-model=\"settings.data.settings.SPEED_MAX\">\n" +
    "\t</div>--> <div style=\"clear:both; margin-bottom:30px\"></div> <div class=\"device-list-header\"> <div class=\"float-left\" style=\"font-size:30px\" ng-click=\"restoreSettings();\"><b>Settings</b></div> </div> <span ng-repeat=\"(key,value) in lists.settings\"> <div class=\"small-input float-left margin-bottom\" ng-if=\"key!='endpoint'\"> <label for=\"{{key}}\">{{key}}:</label> <input type=\"number\" class=\"form-control\" id=\"OV1_SS\" ng-model=\"settings.data.settings[key]\" value=\"{{settings.data.settings[$index]}}\"> </div> </span> </span> <div style=\"clear:both\"></div> <!--\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label for=\"update_rate\">Global Update Rate:</label>\n" +
    "\t\t<select name=\"singleSelect2\" id=\"singleSelect2\" ng-model=\"settings.data.update_rate\">\n" +
    "\t\t\t<option ng-repeat=\"option in update_rate_options\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t</select>\n" +
    "\t</div>\n" +
    "--> <div class=\"form-group\"> <label for=\"device_tag\">Global Target API Endpoint:</label> <input type=\"text\" class=\"form-control\" id=\"device_tag\" ng-model=\"settings.data.endpoint\"> <button type=\"button\" class=\"btn btn-info margin-bottom margin-right margin-top\" ng-click=\"getServerStatus()\"><b>Check Target Server Status</b></button> <b>{{server_status}}</b> </div> <div class=\"alert-box\"> <div class=\"alert alert-success alert-dismissable\" ng-if=\"alert.type=='success'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-warning alert-dismissable\" ng-if=\"alert.type=='warning'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-danger alert-dismissable\" ng-if=\"alert.type=='failed'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> </div> <div> <button type=\"button\" class=\"btn btn-success add-button margin-bottom\" ng-click=\"update()\"><b>Update</b></button> <button type=\"button\" class=\"btn btn-warning add-button margin-bottom margin-right\" ng-click=\"reset()\"><b>Reset</b></button> </div> "
  );


  $templateCache.put('views/update_device.html',
    "<div class=\"form-group\"> <h2> <b>Status</b> </h2> <toggle class=\"toggle float-left\" ng-model=\"dataModel.active\" ng-change=\"changed()\" on=\"On\" off=\"Off\" onstyle=\"btn-info\"></toggle> </div> <div style=\"clear:both; margin-bottom:30px\"></div> <div class=\"device-list-header\"> <div class=\"float-left\" style=\"font-size:30px\"><b>Update Device <span class=\"nice-blue-text\">{{dataModel.device_tag}}</span></b></div> <button type=\"button\" class=\"btn btn-info add-button\" ng-click=\"update_device()\"><b>Update</b></button> </div> <div class=\"alert-box\" ng-show=\"alert.type\"> <div class=\"alert alert-success alert-dismissable\" ng-if=\"alert.type=='success'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-warning alert-dismissable\" ng-if=\"alert.type=='warning'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-danger alert-dismissable\" ng-if=\"alert.type=='failed'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> </div> <div class=\"form-group\"> <label for=\"app_name\">App Name:</label> <select name=\"app_name\" id=\"app_name\" ng-model=\"dataModel.data.app_name\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.apps\" value=\"{{option}}\">{{option}}</option> </select> </div> <div class=\"form-group\"> <label for=\"device_tag\">Sender Tag:</label> <input type=\"text\" class=\"form-control\" id=\"device_tag\" ng-model=\"dataModel.device_tag\"> </div> <div class=\"form-group\"> <label for=\"device_address\">Sender Address:</label> <input type=\"text\" class=\"form-control\" id=\"device_address\" ng-model=\"dataModel.device_address\"> </div> <!--\n" +
    "<div class=\"form-group\">\n" +
    "  <label for=\"gateway_tag\">Gateway Tag:</label>\n" +
    "  <input type=\"text\" class=\"form-control\" id=\"gateway_tag\" ng-model=\"dataModel.gateway_tag\">\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "  <label for=\"gateway_address\">Gateway Address:</label>\n" +
    "  <input type=\"text\" class=\"form-control\" id=\"gateway_address\" ng-model=\"dataModel.gateway_address\">\n" +
    "</div>\n" +
    "--> <div class=\"form-group\"> <label for=\"network_id\">Network ID:</label> <input type=\"text\" class=\"form-control\" id=\"network_id\" ng-model=\"dataModel.network_id\"> </div> <div class=\"form-group\"> <label for=\"update_rate\">Update Rate:</label> <select name=\"singleSelect2\" id=\"singleSelect2\" ng-model=\"dataModel.update_rate\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.update_rate_options\" value=\"{{option}}\">{{option}} Seconds</option> </select> </div> <!--\n" +
    "<div class=\"device-select\">\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label for=\"update_rate\">Sender Type :</label>\n" +
    "\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.device_type_name\" ng-click=\"reset_device_type()\">\n" +
    "\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t    <option ng-repeat=\"option in lists.device_types\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t</select>\n" +
    "\t\t<select name=\"singleSelect3\" id=\"singleSelect3\" ng-model=\"dataModel.device_type\">\n" +
    "\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t    <option ng-repeat=\"option in lists.device_sub_types[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t</select>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "--> <span> <div class=\"var_list_container\"> <h2> <b>Var</b> </h2> <b>PV</b> <checkbox largest ng-model=\"dataModel.polling_info.PV.active\" name=\"custom-name\" ng-change=\"onChange('PV')\" class=\"btn-default\"></checkbox> <b>AP</b> <checkbox largest ng-model=\"dataModel.polling_info.AP.active\" name=\"custom-name\" ng-change=\"onChange('AP')\" class=\"btn-default\"></checkbox> <b>IR</b> <checkbox largest ng-model=\"dataModel.polling_info.IR.active\" name=\"custom-name\" ng-change=\"onChange('IR')\" class=\"btn-default\"></checkbox> <b>SD</b> <checkbox largest ng-model=\"dataModel.polling_info.SD.active\" name=\"custom-name\" ng-change=\"onChange('SD')\" class=\"btn-default\"></checkbox> <b>ED</b> <checkbox largest ng-model=\"dataModel.polling_info.ED.active\" name=\"custom-name\" ng-change=\"onChange('ED')\" class=\"btn-default\"></checkbox> </div> <div class=\"single_var_element\" id=\"PV-section\" ng-if=\"dataModel.polling_info.PV.active\"> <h2><b>PV</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Data Type:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.PV\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"AP-section\" ng-if=\"dataModel.polling_info.AP.active\"> <h2><b>PV</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Image Size:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.AP\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"IR-section\" ng-if=\"dataModel.polling_info.IR.active\"> <h2><b>IR</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Infra Red Video Size:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.IR\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"SD-section\" ng-if=\"dataModel.polling_info.SD.active\"> <h2><b>SD</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Data Type:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.SD\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"ED-section\" ng-if=\"dataModel.polling_info.ED.active\"> <h2><b>ED</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Data Type:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.ED\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <!--\n" +
    "\t<div class=\"single_var_element\" id=\"PV-section\" ng-if=\"dataModel.polling_info.PV.active\">\n" +
    "\t\t<h2><b>PV</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_status\" ng-init=\"dataModel.polling_info.PV.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"SV-section\" ng-if=\"dataModel.polling_info.AP.active\">\n" +
    "\t\t<h2><b>AP</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"TV-section\" ng-if=\"dataModel.polling_info.IR.active\">\n" +
    "\t\t<h2><b>IR</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"QV-section\" ng-if=\"dataModel.polling_info.SD.active\">\n" +
    "\t\t<h2><b>SD</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"DV-section\" ng-if=\"dataModel.polling_info.ED.active\">\n" +
    "\t\t<h2><b>ED</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "--> <span> <div style=\"clear:both; margin-bottom:30px\"></div> <div class=\"var_list_container\"> <h2> <b>Override Global Settings?</b> </h2> <b>Yes please :)</b> <checkbox largest ng-model=\"dataModel.data.override_global_settings\" name=\"custom-name\" ng-change=\"onChange()\" class=\"btn-default\"></checkbox> </div> <div class=\"device-list-header\" ng-if=\"dataModel.data.override_global_settings\"> <div class=\"float-left\" style=\"font-size:30px\" ng-click=\"restoreSettings();\"><b>Settings</b></div> </div> <span ng-repeat=\"(key,value) in lists.settings\" ng-if=\"dataModel.data.override_global_settings\"> <div class=\"small-input float-left margin-bottom\"> <label for=\"{{key}}\">{{key}}:</label> <input type=\"text\" class=\"form-control\" id=\"\" ng-model=\"dataModel.data.settings[key]\" value=\"{{dataModel.data.settings[$index]}}\"> </div> </span> </span> </span> <div style=\"clear:both\"></div> <div class=\"alert-box\"> <div class=\"alert alert-success alert-dismissable\" ng-if=\"alert.type=='success'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-warning alert-dismissable\" ng-if=\"alert.type=='warning'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-danger alert-dismissable\" ng-if=\"alert.type=='failed'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> </div> <div class=\"device-list-header\"> <button type=\"button\" class=\"btn btn-info add-button\" ng-click=\"update_device()\"><b>Update</b></button> <button type=\"button\" class=\"btn btn-danger add-button margin-right\" ng-click=\"deleteDeviceInInternalServer()\"><b>Delete</b></button> </div> <!--\n" +
    "<div>\n" +
    "\t<h2 ng-click=\"getPollingDataLog();\"> <b>Polling Data Log</b> </h2>\n" +
    "\t<div class=\"overflow-box\">\n" +
    "\t<div style=\"border: 1px solid black; padding:5px;\" ng-repeat=\"log in polling_data_log\">\n" +
    "\t\t<div ng-repeat=\"s_log in log\">\n" +
    "\t\t\t<div>\n" +
    "\t\t\t\t<a href=\"\" data-toggle=\"tooltip\" title=\"{{s_log.algorithm}}\">{{s_log.value}}</a>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "-->"
  );

}]);
