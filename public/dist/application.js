'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'meanapp';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('chat');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('customers');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Configuring the Chat module
angular.module('chat').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', {
			title: 'Chat',
			state: 'chat'
		});
	}
]);

'use strict';

// Configure the 'chat' module routes
angular.module('chat').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('chat', {
			url: '/chat',
			templateUrl: 'modules/chat/views/chat.client.view.html'
		});
	}
]);
'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', 'Socket',
    function($scope, Socket) {
    	// Create a messages array
        $scope.messages = [];
        
        // Add an event listener to the 'chatMessage' event
        Socket.on('chatMessage', function(message) {
            $scope.messages.unshift(message);
        });
        
        // Create a controller method for sending messages
        $scope.sendMessage = function() {
        	// Create a new message object
            var message = {
                text: this.messageText
            };
            
            // Emit a 'chatMessage' message event
            Socket.emit('chatMessage', message);
            
            // Clear the message text
            this.messageText = '';
        };

        // Remove the event listener when the controller instance is destroyed
        $scope.$on('$destroy', function() {
            Socket.removeListener('chatMessage');
        });

    }
]); 

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
	function($scope, $state, Authentication, Menus) {
		// Expose view variables
		$scope.$state = $state;
		$scope.authentication = Authentication;

		// Get the topbar menu
		$scope.menu = Menus.getMenu('topbar');

		// Toggle the menu items
		$scope.isCollapsed = false;
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.alerts = [
			{
				icon: 'glyphicon-user',
				colour:'btn-success',
				total: '20,408',
				description: 'TOTAL CUSTOMERS'
			},
			{
				icon: 'glyphicon-calendar',
				colour: 'btn-primary',
				total: '8,382',
				description: 'UPCOMING EVENTS'
			},
			{
				icon: 'glyphicon-edit',
				colour: 'btn-success',
				total: '527',
				description: 'NEW CUSTOMERS IN 24H'
			},
			{
				icon: 'glyphicon-record',
				colour: 'btn-info',
				total: '85,000',
				description: 'EMAILS SENT'
			},
			{
				icon: 'glyphicon-eye-open',
				colour: 'btn-warning',
				total: '268',
				description: 'FOLLOW UPS REQUIRED'
			},
			{
				icon: 'glyphicon-flag',
				colour:'btn-danger',
				total: '348',
				description:'REFERRALS TO MODERATE'
			}
		];
	}
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

    function() {
        // Define a set of default roles
        this.defaultRoles = ['*'];

        // Define the menus object
        this.menus = {};

        // A private function for rendering decision 
        var shouldRender = function(user) {
            if (user) {
                if (!!~this.roles.indexOf('*')) {
                    return true;
                } else {
                    for (var userRoleIndex in user.roles) {
                        for (var roleIndex in this.roles) {
                            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                                return true;
                            }
                        }
                    }
                }
            } else {
                return this.isPublic;
            }

            return false;
        };

        // Validate menu existance
        this.validateMenuExistance = function(menuId) {
            if (menuId && menuId.length) {
                if (this.menus[menuId]) {
                    return true;
                } else {
                    throw new Error('Menu does not exists');
                }
            } else {
                throw new Error('MenuId was not provided');
            }

            return false;
        };

        // Get the menu object by menu id
        this.getMenu = function(menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            return this.menus[menuId];
        };

        // Add new menu object by menu id
        this.addMenu = function(menuId, options) {
            options = options || {};

            // Create the new menu
            this.menus[menuId] = {
                isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? true : options.isPublic),
                roles: options.roles || this.defaultRoles,
                items: options.items || [],
                shouldRender: shouldRender
            };

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenu = function(menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            delete this.menus[menuId];
        };

        // Add menu item object
        this.addMenuItem = function(menuId, options) {
            options = options || {};

            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Push new menu item
            this.menus[menuId].items.push({
                title: options.title || '',
                state: options.state || '',
                type: options.type || 'item',
                class: options.class,
                isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].isPublic : options.isPublic),
                roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].roles : options.roles),
                position: options.position || 0,
                items: [],
                shouldRender: shouldRender
            });

            // Add submenu items
            if (options.items) {
                for (var i in options.items) {
                	this.addSubMenuItem(menuId, options.link, options.items[i]);
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Add submenu item object
        this.addSubMenuItem = function(menuId, parentItemState, options) {
            options = options || {};

            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].state === parentItemState) {
                    // Push new submenu item
                    this.menus[menuId].items[itemIndex].items.push({
                        title: options.title || '',
                        state: options.state|| '',
                        isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : options.isPublic),
                        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
                        position: options.position || 0,
                        shouldRender: shouldRender
                    });
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenuItem = function(menuId, menuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
                    this.menus[menuId].items.splice(itemIndex, 1);
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeSubMenuItem = function(menuId, submenuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
                    if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
                        this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
                    }
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        //Adding the topbar menu
        this.addMenu('topbar', {
            isPublic: false
        });
    }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
    function(Authentication, $state, $timeout) {
    	// Connect to the Socket.io server only when authenticated
        if (Authentication.user) {
            this.socket = io();
        } else {
            $state.go('home');
        }

        // Wrap the Socket.io 'on' method
        this.on = function(eventName, callback) {
            if (this.socket) {
                this.socket.on(eventName, function(data) {
                    $timeout(function() {
                        callback(data);
                    });
                });
            }
        };

        // Wrap the Socket.io 'emit' method
        this.emit = function(eventName, data) {
            if (this.socket) {
                this.socket.emit(eventName, data);
            }
        };

        // Wrap the Socket.io 'removeListener' method
        this.removeListener = function(eventName) {
            if (this.socket) {
                this.socket.removeListener(eventName);
            }
        };
    }
]);

'use strict';

// Configuring the Customers module
angular.module('customers').run(['Menus',
	function(Menus) {
		// Add the customers dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Customers',
			state: 'customers',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'customers', {
			title: 'List Customers',
			state: 'customers.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'customers', {
			title: 'Create Customers',
			state: 'customers.create'
		});
	}
]);

'use strict';

// Setting up route
angular.module('customers').config(['$stateProvider',
	function($stateProvider) {
		// Customers state routing
		$stateProvider.
		state('customers', {
			abstract: true,
			url: '/customers',
			template: '<ui-view/>'
		}).
		state('customers.list', {
			url: '',
			templateUrl: 'modules/customers/views/list-customers.client.view.html'
		});
	}
]);

'use strict';

angular.module('customers').controller('CustomersCreateController', ['$scope', 'Customers', 'Notify',
    function($scope, Customers, Notify ) {
		// Customers create controller logic

        $scope.channelOptions = [
            {id: '1', opt:'Facebook'},
            {id: '2', opt:'Twitter'},
            {id: '3', opt:'Email'}
        ];

        // Create new Customer
        this.create = function() {
            // Create new Customer object
            var customer = new Customers ({
                firstName: this.firstName,
                surname: this.surname,
                suburb: this.suburb,
                country: this.country,
                industry: this.industry,
                email: this.email,
                phone: this.phone,
                referred: this.referred,
                channel: this.channel
            });

            // Redirect after save
            customer.$save(function(response) {

                Notify.sendMsg('NewCustomer', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
	}
]);


'use strict';

angular.module('customers').controller('CustomersUpdateController', ['$scope', 'Customers', 'Notify',
    function($scope, Customers, Notify ) {
		// Customers update controller logic

        $scope.channelOptions = [
            {id: '1', opt:'Facebook'},
            {id: '2', opt:'Twitter'},
            {id: '3', opt:'Email'}
        ];


        // Update existing Customer
        this.update = function(updatedCustomer) {
            var customer = updatedCustomer ;

            customer.$update(function(response) {

                Notify.sendMsg('UpdatedCustomer', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
	}
]);

'use strict';

// Customers controller

angular.module('customers').controller('CustomersController', ['$scope', '$stateParams', 'Authentication', 'Customers', '$modal', '$log',
	function($scope, $stateParams, Authentication, Customers, $modal, $log) {

		this.authentication = Authentication;

		// Find a list of Customers
		this.customers = Customers.query();


		// Open a modal window to Create a single customer record
		this.modalCreate = function (size) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/customers/views/create-customer.modal.view.html',
				controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {


					$scope.ok = function (isValid) {
						console.log(isValid);
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				}],
				size: size
			});

			modalInstance.result.then(function (selectedItem) {
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};



		// Open a modal window to Update a single customer record
		this.modalUpdate = function (size, selectedCustomer) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/customers/views/update-customer.modal.view.html',
				controller: ["$scope", "$modalInstance", "aCustomer", function ($scope, $modalInstance, aCustomer) {

					$scope.theCustomer = {};

					$scope.theCustomer = angular.copy(aCustomer);


					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				}],
				size: size,
				resolve: {
					aCustomer: function () {
						return selectedCustomer;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};



		// Remove existing Customer
		this.remove = function( customer ) {
			if ( customer ) { customer.$remove();

				for (var i in this.customers ) {
					if (this.customers [i] === customer ) {
						this.customers.splice(i, 1);
					}
				}
			} else {
				this.customer.$remove(function() {
				});
			}
		};

	}
]);

'use strict';

angular.module('customers').directive('customerList', ['Customers', 'Notify',
    function(Customers, Notify) {

    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'modules/customers/views/customer-list-template.html',
        link: function(scope, element, attrs){

            //when a new customer is added, update the customer list

            Notify.getMsg('NewCustomer', function(event, data) {

                scope.customersCtrl.customers = Customers.query();

            });

            Notify.getMsg('UpdatedCustomer', function(event, data) {

                scope.customersCtrl.customers = Customers.query();

            });
        }
    };

}]);


'use strict';

//Customers service used for communicating with the customers REST endpoints
angular.module('customers').factory('Customers', ['$resource',
	function($resource) {
		return $resource('api/customers/:customerId', {
			customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

angular.module('customers').factory('Notify', ['$rootScope',
    function($rootScope) {
        // Notify service logic
        // Public API

        var notify = {};

        notify.sendMsg = function(msg, data) {
            data = data || {};
            $rootScope.$emit(msg, data);

        };

        notify.getMsg = function(msg, func, scope) {
            var unbind = $rootScope.$on(msg, func);

            if (scope) {
                scope.$on('destroy', unbind);
            }
        };

        return notify;
    }

]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function ($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function ($q, $location, Authentication) {
				return {
					responseError: function (rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function ($stateProvider) {
		// Users state routing
		$stateProvider.
			state('settings', {
				abstract: true,
				url: '/settings',
				templateUrl: 'modules/users/views/settings/settings.client.view.html'
			}).
			state('settings.profile', {
				url: '/profile',
				templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
			}).
			state('settings.password', {
				url: '/password',
				templateUrl: 'modules/users/views/settings/change-password.client.view.html'
			}).
			state('settings.accounts', {
				url: '/accounts',
				templateUrl: 'modules/users/views/settings/manage-social-accounts.client.view.html'
			}).
			state('settings.picture', {
				url: '/picture',
				templateUrl: 'modules/users/views/settings/change-profile-picture.client.view.html'
			}).
			state('authentication', {
				abstract: true,
				url: '/authentication',
				templateUrl: 'modules/users/views/authentication/authentication.client.view.html'
			}).
			state('authentication.signup', {
				url: '/signup',
				templateUrl: 'modules/users/views/authentication/signup.client.view.html'
			}).
			state('authentication.signin', {
				url: '/signin',
				templateUrl: 'modules/users/views/authentication/signin.client.view.html'
			}).
			state('password', {
				abstract: true,
				url: '/password',
				template: '<ui-view/>'
			}).
			state('password.forgot', {
				url: '/forgot',
				templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
			}).
			state('password.reset', {
				abstract: true,
				url: '/reset',
				template: '<ui-view/>'
			}).
			state('password.reset.invalid', {
				url: '/invalid',
				templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
			}).
			state('password.reset.success', {
				url: '/success',
				templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
			}).
			state('password.reset.form', {
				url: '/:token',
				templateUrl: 'modules/users/views/password/reset-password.client.view.html'
			});
	}
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/api/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/api/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/api/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
	function ($scope, $timeout, $window, Authentication, FileUploader) {
		$scope.user = Authentication.user;
		$scope.imageURL = $scope.user.profileImageURL;

		// Create file uploader instance
		$scope.uploader = new FileUploader({
			url: 'api/users/picture'
		});

		// Set file uploader image filter
		$scope.uploader.filters.push({
			name: 'imageFilter',
			fn: function (item, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		// Called after the user selected a new picture file
		$scope.uploader.onAfterAddingFile = function (fileItem) {
			if ($window.FileReader) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL(fileItem._file);

				fileReader.onload = function (fileReaderEvent) {
					$timeout(function () {
						$scope.imageURL = fileReaderEvent.target.result;
					}, 0);
				};
			}
		};

		// Called after the user has successfully uploaded a new picture
		$scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
			// Show success message
			$scope.success = true;

			// Populate user object
			$scope.user = Authentication.user = response;

			// Clear upload buttons
			$scope.cancelUpload();
		};

		// Called after the user has failed to uploaded a new picture
		$scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
			// Clear upload buttons
			$scope.cancelUpload();

			// Show error message
			$scope.error = response.message;
		};

		// Change user profile picture
		$scope.uploadProfilePicture = function () {
			// Clear messages
			$scope.success = $scope.error = null;

			// Start upload
			$scope.uploader.uploadAll();
		};

		// Cancel the upload process
		$scope.cancelUpload = function () {
			$scope.uploader.clearQueue();
			$scope.imageURL = $scope.user.profileImageURL;
		};
	}
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};
	}
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// Check if there are additional accounts
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/api/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('api/users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);