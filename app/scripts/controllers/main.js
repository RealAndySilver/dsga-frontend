'use strict';

/**
 * @ngdoc function
 * @name dsgaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dsgaApp
 */
angular.module('dsgaApp')
  .controller('MainCtrl', function ($scope,SettingsService, $rootScope) {
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
  });
