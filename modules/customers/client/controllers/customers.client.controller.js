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
				controller: function ($scope, $modalInstance) {


					$scope.ok = function (isValid) {
						console.log(isValid);
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
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
				controller: function ($scope, $modalInstance, aCustomer) {

					$scope.theCustomer = {};

					$scope.theCustomer = angular.copy(aCustomer);


					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
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
