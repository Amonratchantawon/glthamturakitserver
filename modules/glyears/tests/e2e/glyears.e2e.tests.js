'use strict';

describe('Glyears E2E Tests:', function () {
  describe('Test Glyears page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/glyears');
      expect(element.all(by.repeater('glyear in glyears')).count()).toEqual(0);
    });
  });
});
