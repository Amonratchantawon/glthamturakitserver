'use strict';

describe('Accounttypes E2E Tests:', function () {
  describe('Test Accounttypes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/accounttypes');
      expect(element.all(by.repeater('accounttype in accounttypes')).count()).toEqual(0);
    });
  });
});
