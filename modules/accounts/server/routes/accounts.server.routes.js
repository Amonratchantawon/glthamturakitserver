'use strict';

/**
 * Module dependencies
 */
var accountsPolicy = require('../policies/accounts.server.policy'),
    accounts = require('../controllers/accounts.server.controller');

module.exports = function (app) {
    // Accounts Routes
    app.route('/api/accounts').all(accountsPolicy.isAllowed)
        .get(accounts.list)
        .post(accounts.genDocno, accounts.create);

    app.route('/api/accounts/:accountId').all(accountsPolicy.isAllowed)
        .get(accounts.read)
        .put(accounts.update)
        .delete(accounts.delete);

    app.route('/api/orther/accounts')
        .post(accounts.genDocnoAccount, accounts.createAccount);

    app.route('/api/orther/accounts/:accountId')
        .get(accounts.read)
        .put(accounts.update)
        .delete(accounts.delete);

    app.route('/api/accounts/search/:docno') // match docno only (*A111 === *A111 : *A111 !== *A11)
        .get(accounts.listSearch);

    app.route('/api/glreport/:type/:date').all(accountsPolicy.isAllowed)
        //.get(accounts.setReportCondition, accounts.getCompany, accounts.getAccounts, accounts.generateGlDaily, accounts.getAccountchart, accounts.getBringForwardForAcceach, accounts.generateAcceach, accounts.generateGain, accounts.generateBalance, accounts.balancetest, accounts.returnGlreport);
        .get(accounts.setReportCondition, accounts.getCompany, accounts.getAccounts, accounts.generateGlDaily, accounts.getAccountchart, accounts.getBringAccount, accounts.acceachCooking, accounts.balancetest, accounts.returnGlreport);
       
    app.route('/api/glreport/:type/:date/:enddate').all(accountsPolicy.isAllowed)
        //.get(accounts.setReportCondition, accounts.getCompany, accounts.getAccounts, accounts.generateGlDaily, accounts.getAccountchart, accounts.getBringForwardForAcceach, accounts.generateAcceach, accounts.generateGain, accounts.generateBalance, accounts.balancetest, accounts.returnGlreport);
        .get(accounts.setReportCondition, accounts.getCompany, accounts.getAccounts, accounts.generateGlDaily, accounts.getAccountchart, accounts.getBringAccount, accounts.acceachCooking, accounts.balancetest, accounts.returnGlreport);
    app.route('/api/glreport/excel/:type/:date/:enddate')
        //.get(accounts.setReportCondition, accounts.getCompany, accounts.getAccounts, accounts.generateGlDaily, accounts.getAccountchart, accounts.getBringForwardForAcceach, accounts.generateAcceach, accounts.generateGain, accounts.generateBalance, accounts.balancetest, accounts.exportExcel);
        .get(accounts.setReportCondition, accounts.getCompany, accounts.getAccounts, accounts.generateGlDaily, accounts.getAccountchart, accounts.getBringAccount, accounts.acceachCooking, accounts.balancetest, accounts.exportExcel);
        


    //สมุดรายวันทั่วไป
    app.route('/api/gl-daily-report/:type/:date')
        .get(accounts.setReportCondition, accounts.getCompany, accounts.getAccounts, accounts.generateGlDaily, accounts.returnGlreport);
    app.route('/api/gl-daily-report/:type/:date/:enddate')
        .get(accounts.setReportCondition, accounts.getCompany, accounts.getAccounts, accounts.generateGlDaily, accounts.returnGlreport);

    //สมุดบัญชีแยกประเภท
    app.route('/api/gl-acceach-report/:type/:date')
        .get(accounts.setReportCondition, accounts.getCompany, accounts.getAccounts, accounts.getAccountchart, accounts.getBringAccount, accounts.acceachCooking, accounts.returnGlreport);
    app.route('/api/gl-acceach-report/:type/:date/:enddate')
        .get(accounts.setReportCondition, accounts.getCompany, accounts.getAccounts, accounts.getAccountchart, accounts.getBringAccount, accounts.acceachCooking, accounts.returnGlreport);




    // accounts.getGlByCondition
    // Finish by binding the Account middleware
    app.param('accountId', accounts.accountByID);
    app.param('docno', accounts.accountByDocno);
    app.param('type', accounts.glType);
    app.param('date', accounts.getGlDate);
    app.param('enddate', accounts.getGlEndDate);
};
