'use strict';

/**
 * @ngdoc service
 * @name dsgaApp.Lists
 * @description
 * # Lists
 * Service in the dsgaApp.
 */
angular.module('dsgaApp')
  .service('ListService', function (ServerCommunicator) {
    this.getList = function(success,error){
		ServerCommunicator.callInternalServer('get',null,'api/list',success,error);
	};
  });
