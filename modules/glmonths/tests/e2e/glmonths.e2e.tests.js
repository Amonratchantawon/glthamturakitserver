'use strict';

describe('Glmonths E2E Tests:', function () {
  describe('Test Glmonths page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/glmonths');
      expect(element.all(by.repeater('glmonth in glmonths')).count()).toEqual(0);
    });
  });
});
