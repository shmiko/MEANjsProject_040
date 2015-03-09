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

