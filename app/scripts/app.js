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
  .config(function ($routeProvider, $locationProvider) {
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
  })
  .controller('AppController', function($http, $scope){
	$http.get("../config.json").then(function(response) { //success
		$scope.app_url = response.data.local_endpoint;	
	});
			
  });
