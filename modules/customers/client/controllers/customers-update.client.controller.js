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
