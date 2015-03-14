'use strict';

describe('Its E2E Tests:', function() {
	describe('Test Its page', function() {
		it('Should not include new Its', function() {
			browser.get('http://localhost:3000/#!/its');
			expect(element.all(by.repeater('it in its')).count()).toEqual(0);
		});
	});
});
