'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName)
	.config(['$locationProvider',
		function($locationProvider) {
			$locationProvider.html5Mode(true).hashPrefix('!');
		}
	])

	.config(function($mdThemingProvider) {
	  $mdThemingProvider.theme('default')
	    .primaryPalette('yellow', {
	      'default': '400', // by default use shade 400 from the pink palette for primary intentions
	      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
	      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
	      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
	    })
	    // If you specify less than all of the keys, it will inherit from the
	    // default shades
	    .accentPalette('blue', {
	      'default': '200' // use shade 200 for default, and keep all other shades the same
	    });
	});

	angular.module(ApplicationConfiguration.applicationModuleName)
	.controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log) {
	  $scope.toggleLeft = function() {
	    $mdSidenav('left').toggle()
	      .then(function(){
	          $log.debug('toggle left is done');
	      });
	  };
	  $scope.toggleRight = function() {
	    $mdSidenav('right').toggle()
	                        .then(function(){
	                          $log.debug('toggle RIGHT is done');
	                        });
	  };
	})
	.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
	  $scope.close = function() {
	    $mdSidenav('left').close()
	                      .then(function(){
	                        $log.debug('close LEFT is done');
	                      });
	  };
	})
	.controller('RightCtrl', function($scope, $timeout, $mdSidenav, $log) {
	  $scope.close = function() {
	    $mdSidenav('right').close()
	                        .then(function(){
	                          $log.debug('close RIGHT is done');
	                        });
	  };
	});

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
