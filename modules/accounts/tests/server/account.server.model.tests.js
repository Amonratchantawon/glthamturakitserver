'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Accountchart = mongoose.model('Accountchart'),
    Account = mongoose.model('Account'),
    Accounttype = mongoose.model('Accounttype');

/**
 * Globals
 */
var user,
    accountchart,
    account,
    accounttype;

/**
 * Unit tests
 */
describe('Account Model Unit Tests:', function () {
    beforeEach(function (done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        accounttype = new Accounttype({
            accounttypename: 'Accounttype Name',
            accounttypeno: '01',
            user: user
        });

        accountchart = new Accountchart({
            name: ' name',
            accountno: 'Account0000',
            parent: 0,
            accounttype: accounttype,
            user: user
        });

        user.save(function () {
            accounttype.save(function () {
                accountchart.save(function () {
                    account = new Account({
                        docno: 'JV20170800001',
                        docdate: new Date(),
                        debits: [{
                            account: accountchart,
                            description: 'ค่าข้าว',
                            amount: 50
                        }],
                        credits: [{
                            account: accountchart,
                            description: 'ค่าข้าว',
                            amount: 50
                        }],
                        remark: 'JV',
                        totaldebit: 50,
                        totalcredit: 50,
                        gltype: 'JV',
                        status: 'Open',
                        user: user
                    });
                    done();
                });
            });
        });
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            this.timeout(0);
            return account.save(function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without docno', function (done) {
            account.docno = '';

            return account.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save duplicate docno', function (done) {
            var account2 = new Account(account);

            return account.save(function (err) {
                should.not.exist(err);
                account2.save(function (err) {
                    should.exist(err);
                    done();
                });
            });
        });

        it('should be able to show an error when try to save without docdate', function (done) {
            account.docdate = null;

            return account.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save duplicate docdate', function (done) {
            var account2 = new Account(account);

            return account.save(function (err) {
                should.not.exist(err);
                account2.save(function (err) {
                    should.exist(err);
                    done();
                });
            });
        });
    });

    afterEach(function (done) {
        Account.remove().exec(function () {
            Accountchart.remove().exec(function () {
                Accounttype.remove().exec(function () {
                    User.remove().exec(function () {
                        done();
                    });
                });
            });
        });
    });
});
