'use strict';

describe('Buys E2E Tests:', function () {
  describe('Test Buys page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/buys');
      expect(element.all(by.repeater('buy in buys')).count()).toEqual(0);
    });
  });
});
