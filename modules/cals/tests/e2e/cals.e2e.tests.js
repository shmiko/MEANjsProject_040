'use strict';

describe('Cals E2E Tests:', function() {
	describe('Test Cals page', function() {
		it('Should not include new Cals', function() {
			browser.get('http://localhost:3000/#!/cals');
			expect(element.all(by.repeater('cal in cals')).count()).toEqual(0);
		});
	});
});
