'use strict';

describe('Accountcharts E2E Tests:', function () {
  describe('Test Accountcharts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/accountcharts');
      expect(element.all(by.repeater('accountchart in accountcharts')).count()).toEqual(0);
    });
  });
});
