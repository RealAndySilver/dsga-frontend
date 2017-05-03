'use strict';

/**
 * @ngdoc service
 * @name dsgaApp.ServerCommunicator
 * @description
 * # ServerCommunicator
 * Service in the dsgaApp.
 */
angular.module('dsgaApp')
  .service('ServerCommunicator', function ($http, $rootScope) {
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
  });
