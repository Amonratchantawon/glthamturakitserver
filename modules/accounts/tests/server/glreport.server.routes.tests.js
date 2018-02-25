'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Account = mongoose.model('Account'),
    Accountchart = mongoose.model('Accountchart'),
    express = require(path.resolve('./config/lib/express')),
    Accounttype = mongoose.model('Accounttype'),
    Company = mongoose.model('Company');

/**
 * Globals
 */
var app,
    agent,
    credentials,
    user,
    accountchart,
    accountchart1,
    accountchart2,
    accountchart3,
    accountchart4,
    accountchart5,
    accountchart6,
    accountchart7,
    accountchart8,
    accountchart9,
    account,
    account2,
    account3,
    accounttype,
    company;

/**
 * Account routes tests
 */
describe('GL Report tests', function () {

    before(function (done) {
        // Get application
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function (done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'M3@n.jsI$Aw3$0m3'
        };

        company = new Company({
            name: 'Company Ass center',
            address: '6/636 หมู่ 5',
            subDistrict: 'xxx',
            district: 'xxx',
            province: 'xxxx',
            postCode: '10220',
            phone: '0935325XXX'
        });

        // Create a new user
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local'
        });

        accounttype = new Accounttype({
            accounttypename: 'สินทรัพย์',
            accounttypeno: '09',
            user: user
        });

        accountchart1 = new Accountchart({
            name: 'เงินสด TEST',
            accountno: '101101',
            parent: 0,
            accounttype: accounttype,
            user: user
        });
        accountchart2 = new Accountchart({
            name: 'ค่าเครื่องเขียนแบบพิมพ์',
            accountno: '605003',
            parent: 0,
            accounttype: accounttype,
            user: user
        });
        accountchart3 = new Accountchart({
            name: 'ภาษีซื้อ',
            accountno: '101502',
            parent: 0,
            accounttype: accounttype,
            user: user
        });
        accountchart4 = new Accountchart({
            name: 'คอมพิวเตอร์และอุปกรณ์',
            accountno: '102101',
            parent: 0,
            accounttype: accounttype,
            user: user
        });
        accountchart5 = new Accountchart({
            name: 'ซื้อสินค้า',
            accountno: '501001',
            parent: 0,
            accounttype: accounttype,
            user: user
        });
        accountchart6 = new Accountchart({
            name: 'เงินฝากธนาคารออมทรัพย์ TMB',
            accountno: '101111',
            parent: 0,
            accounttype: accounttype,
            user: user
        });
        accountchart7 = new Accountchart({
            name: 'เงินฝากธนาคารกระแสรายวัน TMB',
            accountno: '101211',
            accounttype: accounttype,
            parent: 0,
            user: user
        });
        accountchart8 = new Accountchart({
            name: 'ค่าเช่าสำนักงาน',
            accountno: '605011',
            accounttype: accounttype,
            parent: 0,
            user: user
        });
        accountchart9 = new Accountchart({
            name: 'ปรับเศษสตางค์เงินสด',
            accountno: '605009',
            accounttype: accounttype,
            parent: 0,
            user: user
        });

        account = new Account({
            credits: [{
                account: accountchart1,
                description: "ค่ากระดาษถ่ายเอกสาร",
                amount: 180
            }],
            debits: [{
                account: accountchart2,
                description: "ค่ากระดาษถ่ายเอกสาร",
                amount: 168.22
            }, {
                account: accountchart3,
                description: "ค่ากระดาษถ่ายเอกสาร",
                amount: 11.78
            }],
            docdate: "2016-01-04T07:00:00.000+07:00",
            docno: "PV59010401",
            gltype: "PV",
            remark: "ค่ากระดาษถ่ายเอกสาร",
            status: "Open",
            totalcredit: 180,
            totaldebit: 180
        });

        account2 = new Account({
            credits: [{
                account: accountchart6,
                description: "โอนเงินระหว่างบัญชี",
                amount: 200000
            }],
            debits: [{
                account: accountchart7,
                description: "โอนเงินระหว่างบัญชี",
                amount: 200000
            }],
            docdate: "2016-02-04T07:00:00.000+07:00",
            docno: "PV59020401",
            gltype: "PV",
            remark: "",
            status: "Open",
            totalcredit: 200000,
            totaldebit: 200000
        });

        account3 = new Account({
            credits: [{
                account: accountchart1,
                description: "ค่ากระดาษถ่ายเอกสาร",
                amount: 180
            }],
            debits: [{
                account: accountchart2,
                description: "ค่ากระดาษถ่ายเอกสาร",
                amount: 168.22
            }, {
                account: accountchart3,
                description: "ค่ากระดาษถ่ายเอกสาร",
                amount: 11.78
            }],
            docdate: "2015-12-04T07:00:00.000+07:00",
            docno: "PV58120401",
            gltype: "PV",
            remark: "ค่ากระดาษถ่ายเอกสาร",
            status: "Open",
            totalcredit: 180,
            totaldebit: 180
        });

        // Save a user to the test db and create new Account
        user.save(function () {
            company.save(function () {
                accounttype.save(function () {
                    accountchart1.save();
                    accountchart2.save();
                    accountchart3.save();
                    accountchart4.save();
                    accountchart5.save();
                    accountchart6.save();
                    accountchart7.save();
                    accountchart8.save();
                    accountchart9.save(function () {
                        account.save();
                        account2.save();
                        account3.save(function () {
                            done();
                        });
                    });
                });
            });

        });
    });

    it('GL Report get accountchart', function (done) {

        // Get a list of Accountcharts
        agent.get('/api/accountcharts')
            .end(function (accountchartsGetErr, accountchartsGetRes) {
                // Handle Accountcharts save error
                if (accountchartsGetErr) {
                    return done(accountchartsGetErr);
                }

                // Get Accountcharts list
                var accountcharts = accountchartsGetRes.body;

                (accountcharts.length).should.match(9);
                // Call the assertion callback
                done();
            });
    });

    it('GL Report get account', function (done) {

        // Get a list of Accountcharts
        agent.get('/api/accounts')
            .end(function (accountsGetErr, accountsGetRes) {
                // Handle Accountcharts save error
                if (accountsGetErr) {
                    return done(accountsGetErr);
                }

                // Get Accountcharts list
                var accounts = accountsGetRes.body;

                (accounts.length).should.match(3);

                // Call the assertion callback
                done();
            });
    });

    it('GL gen report daily by month', function (done) {
        var date = '2016-01-05';
        var type = 'month';
        // Get a list of Accountcharts
        agent.get('/api/glreport/' + type + '/' + date)
            .end(function (glreportsGetErr, glreportsGetRes) {
                // Handle Accountcharts save error
                if (glreportsGetErr) {
                    return done(glreportsGetErr);
                }

                // Get Accountcharts list
                var glreports = glreportsGetRes.body;

                (glreports.type).should.match("month");
                (glreports.daily.transaction.length).should.match(1);
                (glreports.daily.transaction[0].docno).should.match(account.docno);

                (glreports.daily.company).should.match(company.name);


                // Call the assertion callback
                done();
            });

    });

    it('GL gen report daily by year', function (done) {
        var date = '2016-01-05';
        var type = 'year';
        // Get a list of Accountcharts
        agent.get('/api/glreport/' + type + '/' + date)
            .end(function (glreportsGetErr, glreportsGetRes) {
                // Handle Accountcharts save error
                if (glreportsGetErr) {
                    return done(glreportsGetErr);
                }

                // Get Accountcharts list
                var glreports = glreportsGetRes.body;

                (glreports.type).should.match("year");
                (glreports.daily.transaction.length).should.match(2);
                (glreports.daily.transaction[0].docno).should.match(account.docno);
                (glreports.daily.transaction[1].docno).should.match(account2.docno);

                (glreports.daily.company).should.match(company.name);
                // Call the assertion callback
                done();
            });

    });

    it('GL gen report acceach by month', function (done) {

        var date = '2016-01-05';
        var type = 'month';
        // Get a list of Accountcharts
        agent.get('/api/glreport/' + type + '/' + date)
            .end(function (glreportssGetErr, glreportssGetRes) {
                // Handle Accountcharts save error
                if (glreportssGetErr) {
                    return done(glreportssGetErr);
                }

                // Get Accountcharts list
                var glreports = glreportssGetRes.body;

                (glreports.type).should.match("month");
                (glreports.acceach.length).should.match(3);
                (glreports.acceach[0].accountno).should.match('101101');
                //(glreports.acceach[0].transaction[0].list[0].accountno).should.match('605003');
                (glreports.acceach[0].company).should.match(company.name);

                (glreports.acceach[0].company).should.match(company.name);
                // Call the assertion callback
                done();
            });
    });

    it('GL gen report acceach by year', function (done) {

        var date = '2016-01-05';
        var type = 'year';
        // Get a list of Accountcharts
        agent.get('/api/glreport/' + type + '/' + date)
            .end(function (glreportssGetErr, glreportssGetRes) {
                // Handle Accountcharts save error
                if (glreportssGetErr) {
                    return done(glreportssGetErr);
                }

                // Get Accountcharts list
                var glreports = glreportssGetRes.body;

                (glreports.type).should.match("year");
                (glreports.acceach.length).should.match(5);
                (glreports.acceach[0].accountno).should.match('101101');
                //(glreports.acceach[0].transaction[0].list[0].accountno).should.match('605003');
                //(glreports.acceach[0].transaction[0].list[1].accountno).should.match('101502');
                //(glreports.acceach[0].transaction).should.equal('101502');
                // (glreports.acceach[0].current.debit).should.match(0);
                // (glreports.acceach[0].current.credit).should.match(180);
                // (glreports.acceach[0].carryforward.accountname).should.match('ยอดยกไป');
                // (glreports.acceach[0].carryforward.debit).should.match(0);
                // (glreports.acceach[0].carryforward.credit).should.match(180);

                (glreports.acceach[0].company).should.match(company.name);
                // Call the assertion callback
                done();
            });
    });

    it('GL gen report gain', function (done) {

        var date = '2016-01-05';
        var type = 'month';
        // Get a list of Accountcharts
        agent.get('/api/glreport/' + type + '/' + date)
            .end(function (glreportssGetErr, glreportssGetRes) {
                // Handle Accountcharts save error
                if (glreportssGetErr) {
                    return done(glreportssGetErr);
                }

                // Get Accountcharts list
                var glreports = glreportssGetRes.body;

                (glreports.type).should.match("month");
                (glreports.gain.transaction.length).should.match(8);
                (glreports.gain.transaction[0].accounttype).should.match('รายได้จากการดำเนินงาน');
                (glreports.gain.transaction[1].accounttype).should.match('กำไรขั้นต้น');
                (glreports.gain.transaction[2].accounttype).should.match('ค่าใช้จ่ายในการดำเนินงาน');
                (glreports.gain.transaction[3].accounttype).should.match('ค่าใช้จ่ายในการผลิต');
                (glreports.gain.transaction[4].accounttype).should.match('กำไรสุทธิจากการดำเนินงาน');
                (glreports.gain.transaction[5].accounttype).should.match('รายได้อื่น');
                (glreports.gain.transaction[6].accounttype).should.match('ค่าใช้จ่ายอื่น');
                (glreports.gain.transaction[7].accounttype).should.match('กำไรสุทธิ (ขาดทุนสุทธิ)');

                (glreports.gain.company).should.match(company.name);
                // Call the assertion callback
                done();
            });
    });

    it('GL gen report balance', function (done) {

        var date = '2016-01-05';
        var type = 'month';
        // Get a list of Accountcharts
        agent.get('/api/glreport/' + type + '/' + date)
            .end(function (glreportssGetErr, glreportssGetRes) {
                // Handle Accountcharts save error
                if (glreportssGetErr) {
                    return done(glreportssGetErr);
                }

                // Get Accountcharts list
                var glreports = glreportssGetRes.body;

                (glreports.type).should.match("month");
                (glreports.balance.asset.transaction[0].accounttype).should.match('สินทรัพย์หมุนเวียน');
                (glreports.balance.asset.transaction[1].accounttype).should.match('ที่ดิน อาคารและอุปกรณ์');
                (glreports.balance.asset.transaction[2].accounttype).should.match('สินทรัพย์อื่น');
                (glreports.balance.asset.transaction[3].accounttype).should.match('รวมสินทรัพย์');
                (glreports.balance.debt.transaction[0].accounttype).should.match('หนี้สินหมุนเวียน');
                (glreports.balance.debt.transaction[1].accounttype).should.match('ส่วนของผู้ถือหุ้น');
                (glreports.balance.debt.transaction[2].accounttype).should.match('รวมหนี้สินและส่วนของผู้ถือหุ้น');

                (glreports.balance.company).should.match(company.name);   
                // Call the assertion callback
                done();
            });
    });

    it('GL test custom date', function (done) {

        var date = '2016-01-01';
        var enddate = '2016-01-31';
        var type = 'custom';
        // Get a list of Accountcharts
        agent.get('/api/glreport/' + type + '/' + date + '/' + enddate)
            .end(function (glreportssGetErr, glreportssGetRes) {
                // Handle Accountcharts save error
                if (glreportssGetErr) {
                    return done(glreportssGetErr);
                }

                // Get Accountcharts list
                var glreports = glreportssGetRes.body;

                (glreports.type).should.match("custom");
                (glreports.acceach).should.be.instanceof(Array).and.have.lengthOf(3);
                (glreports.balancetests.transaction).should.be.instanceof(Array).and.have.lengthOf(3);
                // Call the assertion callback
                done();
            });
    });

    it('GL Excel report', function(done){
        var date = '2016-01-01';
        var enddate = '2016-01-31';
        var type = 'custom';

        agent.get('/api/glreport/excel/' + type + '/' + date + '/' + enddate)
        .expect(200)
        .end(function(getErr, getRes){
            if(getErr){
                return done(getErr);
            }

            var res = getRes.body;
            res.should.be.instanceof(Object);
            done();            
        });
    });


    afterEach(function (done) {
        User.remove().exec(function () {
            Accounttype.remove().exec(function () {
                Accountchart.remove().exec(function () {
                    Account.remove().exec(done);
                });
            });
        });
    });
});
