//'use strict';

/**
 * @ngdoc function
 * @name dsgaApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the dsgaApp
 */
angular.module('dsgaApp')
  .controller('SettingsCtrl', function ($scope,$http, SettingsService, ServerService, ListService, $rootScope) {
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
	
  });
