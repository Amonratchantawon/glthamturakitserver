'use strict';

describe('Sells E2E Tests:', function () {
  describe('Test Sells page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sells');
      expect(element.all(by.repeater('sell in sells')).count()).toEqual(0);
    });
  });
});
