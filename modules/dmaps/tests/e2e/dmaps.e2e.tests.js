'use strict';

describe('Dmaps E2E Tests:', function() {
	describe('Test Dmaps page', function() {
		it('Should not include new Dmaps', function() {
			browser.get('http://localhost:3000/#!/dmaps');
			expect(element.all(by.repeater('dmap in dmaps')).count()).toEqual(0);
		});
	});
});
