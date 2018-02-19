'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Account = mongoose.model('Account'),
    Accountchart = mongoose.model('Accountchart'),
    Glmonth = mongoose.model('Glmonth'),
    Glyear = mongoose.model('Glyear'),
    Company = mongoose.model('Company'),
    xl = require('excel4node'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');


/**
 * Create a Account
 */
exports.genDocno = function (req, res, next) {
    var account = new Account(req.body);
    // console.log(account);
    account.user = req.user;
    var date = new Date(account.docdate);
    var reqGltype = account.gltype;
    var year = (date.getFullYear() + 543).toString().substr(2, 2);
    var getmonth = date.getMonth() + 1;
    var month = '';
    var dayOfMonth = '';
    if (getmonth >= 10) {
        month = getmonth;
    } else {
        month = '0' + getmonth;
    }

    if (date.getDate().toString().length === 1) {
        dayOfMonth = '0' + date.getDate();
    } else {
        dayOfMonth = date.getDate();
    }

    var genDocno = reqGltype + '' + year + '' + month + '' + dayOfMonth;
    Account.find({
        gltype: reqGltype
    }).sort('-created').populate('user', 'displayName').exec(function (err, accounts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (accounts && accounts.length > 0) {
                var passSite = accounts.filter(function (obj) {
                    return obj.docno.substr(0, 8) === genDocno.toString();
                });
                if (passSite && passSite.length > 0) {
                    var docno = passSite[0].docno;
                    var subnumber = docno.substr(2, 13);
                    var cookingdocno = parseInt(subnumber) + 1;
                    req.genDocno = reqGltype + cookingdocno.toString();
                    next();
                } else {
                    req.genDocno = genDocno + '01';
                    next();
                }
            } else {
                req.genDocno = genDocno + '01';
                next();
            }
        }
    });
};


exports.create = function (req, res) {
    var account = new Account(req.body);
    account.user = req.user;
    account.docno = req.genDocno;
    account.totaldebit = 0;
    account.totalcredit = 0;

    if (account.debits && account.debits.length > 0) {
        account.debits.forEach(function (debit) {
            account.totaldebit += debit.amount;
        });
    }

    if (account.credits && account.credits.length > 0) {
        account.credits.forEach(function (credit) {
            account.totalcredit += credit.amount;
        });
    }
    if (account.totaldebit !== account.totalcredit) {
        res.jsonp({
            message: 'totalcredit not equal totaldebit!'
        });
    }

    account.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(account);
        }
    });
};

/**
 * Show the current Account
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var account = req.account ? req.account.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    account.isCurrentUserOwner = req.user && account.user && account.user._id.toString() === req.user._id.toString();

    res.jsonp(account);
};

/**
 * Update a Account
 */
exports.update = function (req, res) {
    var account = req.account;

    account = _.extend(account, req.body);

    account.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Accountchart.populate(account, {
                path: 'debits',
                populate: {
                    path: 'account',
                    model: 'Accountchart'
                }
            }, function (err, data) {
                Accountchart.populate(data, {
                    path: 'credits',
                    populate: {
                        path: 'account',
                        model: 'Accountchart'
                    }
                }, function (err, data2) {
                    var accountSig = data2.toJSON();
                    for (var i = 0; i < accountSig.debits.length; i++) {
                        var accountDebitI = accountSig.debits[i].account;
                        var accountDebitNew = {
                            _id: accountDebitI._id,
                            accountno: accountDebitI.accountno,
                            name: accountDebitI.name,
                            fullname: accountDebitI.accountno + ' ' + accountDebitI.name,
                            status: accountDebitI.status,
                            parent: accountDebitI.parent ? accountDebitI.parent : null,
                            vat: accountDebitI.vat ? accountDebitI.vat : 0,
                            unitprice: accountDebitI.unitprice ? accountDebitI.unitprice : 0,
                            user: accountDebitI.user
                        };
                        accountSig.debits[i].account = accountDebitNew;
                    }
                    for (var ii = 0; ii < accountSig.credits.length; ii++) {
                        var accountCreditI = accountSig.credits[ii].account;
                        var accountCreditNew = {
                            _id: accountCreditI._id,
                            accountno: accountCreditI.accountno,
                            name: accountCreditI.name,
                            fullname: accountCreditI.accountno + ' ' + accountCreditI.name,
                            status: accountCreditI.status,
                            parent: accountCreditI.parent ? accountCreditI.parent : null,
                            vat: accountCreditI.vat ? accountCreditI.vat : 0,
                            unitprice: accountCreditI.unitprice ? accountCreditI.unitprice : 0,
                            user: accountCreditI.user
                        };
                        accountSig.credits[ii].account = accountCreditNew;
                    }
                    res.jsonp(accountSig);
                });
            });
        }
    });
};

/**
 * Delete an Account
 */
exports.delete = function (req, res) {
    var account = req.account;

    account.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(account);
        }
    });
};

/**
 * List of Accounts
 */
exports.list = function (req, res) {
    Account.find().sort('-created').populate('user', 'displayName').exec(function (err, accounts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(accounts);
        }
    });
};

/**
 * Account middleware
 */
exports.accountByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Account is invalid'
        });
    }

    Account.findById(id).populate('user', 'displayName').exec(function (err, account) {
        if (err) {
            return next(err);
        } else if (!account) {
            return res.status(404).send({
                message: 'No Account with that identifier has been found'
            });
        }
        req.account = account;
        next();
    });
};

exports.genDocnoAccount = function (req, res, next) {
    var account = new Account(req.body);
    var date = new Date(account.docdate);
    var reqGltype = account.gltype;
    var year = (date.getFullYear() + 543).toString().substr(2, 2);
    var getmonth = date.getMonth() + 1;
    var month = '';
    var dayOfMonth = '';
    if (getmonth >= 10) {
        month = getmonth;
    } else {
        month = '0' + getmonth;
    }
    if (date.getDate().toString().length === 1) {
        dayOfMonth = '0' + date.getDate();
    } else {
        dayOfMonth = date.getDate();
    }
    var genDocno = reqGltype + '' + year + '' + month + '' + dayOfMonth;
    Account.find({
        gltype: reqGltype
    }).sort('-created').populate('user', 'displayName').exec(function (err, accounts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (accounts && accounts.length > 0) {
                var passSite = accounts.filter(function (obj) {
                    return obj.docno.substr(0, 8) === genDocno.toString();
                });
                if (passSite && passSite.length > 0) {
                    var docno = passSite[0].docno;
                    var subnumber = docno.substr(2, 13);
                    var cookingdocno = parseInt(subnumber) + 1;
                    req.genDocno = reqGltype + cookingdocno.toString();
                    next();
                } else {
                    req.genDocno = genDocno + '01';
                    next();
                }
            } else {
                req.genDocno = genDocno + '01';
                next();
            }
        }
    });
};


exports.createAccount = function (req, res) {
    var account = new Account(req.body);
    account.docno = req.genDocno;
    account.totaldebit = 0;
    account.totalcredit = 0;

    if (account.debits && account.debits.length > 0) {
        account.debits.forEach(function (debit) {
            account.totaldebit += debit.amount;
        });
    }

    if (account.credits && account.credits.length > 0) {
        account.credits.forEach(function (credit) {
            account.totalcredit += credit.amount;
        });
    }
    if (account.totaldebit !== account.totalcredit) {
        res.jsonp({
            message: 'totalcredit not equal totaldebit!'
        });
    }

    account.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Accountchart.populate(account, {
                path: 'debits',
                populate: {
                    path: 'account',
                    model: 'Accountchart'
                }
            }, function (err, data) {
                Accountchart.populate(data, {
                    path: 'credits',
                    populate: {
                        path: 'account',
                        model: 'Accountchart'
                    }
                }, function (err, data2) {
                    var accountSig = data2.toJSON();
                    for (var i = 0; i < accountSig.debits.length; i++) {
                        var accountDebitI = accountSig.debits[i].account;
                        var accountDebitNew = {
                            _id: accountDebitI._id,
                            accountno: accountDebitI.accountno,
                            name: accountDebitI.name,
                            fullname: accountDebitI.accountno + ' ' + accountDebitI.name,
                            status: accountDebitI.status,
                            parent: accountDebitI.parent ? accountDebitI.parent : null,
                            vat: accountDebitI.vat ? accountDebitI.vat : 0,
                            unitprice: accountDebitI.unitprice ? accountDebitI.unitprice : 0,
                            user: accountDebitI.user
                        };
                        accountSig.debits[i].account = accountDebitNew;
                    }
                    for (var ii = 0; ii < accountSig.credits.length; ii++) {
                        var accountCreditI = accountSig.credits[ii].account;
                        var accountCreditNew = {
                            _id: accountCreditI._id,
                            accountno: accountCreditI.accountno,
                            name: accountCreditI.name,
                            fullname: accountCreditI.accountno + ' ' + accountCreditI.name,
                            status: accountCreditI.status,
                            parent: accountCreditI.parent ? accountCreditI.parent : null,
                            vat: accountCreditI.vat ? accountCreditI.vat : 0,
                            unitprice: accountCreditI.unitprice ? accountCreditI.unitprice : 0,
                            user: accountCreditI.user
                        };
                        accountSig.credits[ii].account = accountCreditNew;
                    }
                    res.jsonp(accountSig);
                });
            });
        }
    });
};

// Accounts search
exports.accountByDocno = function (req, res, next, docno) {

    Account.find({
        docno: docno
    }).populate('debits.account').populate('credits.account').populate('user', 'displayName').exec(function (err, account) {
        if (err) {
            return next(err);
        } else if (!account) {
            return res.status(404).send({
                message: 'No Account with that identifier has been found'
            });
        }

        if (account[0]) {
            var accountArr = account[0].toJSON();
            for (var i = 0; i < accountArr.debits.length; i++) {
                var accountDebitI = accountArr.debits[i].account;
                var accountDebitNew = {
                    _id: accountDebitI._id,
                    accountno: accountDebitI.accountno,
                    name: accountDebitI.name,
                    fullname: accountDebitI.accountno + ' ' + accountDebitI.name,
                    status: accountDebitI.status,
                    parent: accountDebitI.parent ? accountDebitI.parent : null,
                    vat: accountDebitI.vat ? accountDebitI.vat : 0,
                    unitprice: accountDebitI.unitprice ? accountDebitI.unitprice : 0,
                    user: accountDebitI.user
                };
                accountArr.debits[i].account = accountDebitNew;
            }
            for (var ii = 0; ii < accountArr.credits.length; ii++) {
                var accountCreditI = accountArr.credits[ii].account;
                var accountCreditNew = {
                    _id: accountCreditI._id,
                    accountno: accountCreditI.accountno,
                    name: accountCreditI.name,
                    fullname: accountCreditI.accountno + ' ' + accountCreditI.name,
                    status: accountCreditI.status,
                    parent: accountCreditI.parent ? accountCreditI.parent : null,
                    vat: accountCreditI.vat ? accountCreditI.vat : 0,
                    unitprice: accountCreditI.unitprice ? accountCreditI.unitprice : 0,
                    user: accountCreditI.user
                };
                accountArr.credits[ii].account = accountCreditNew;
            }
            req.account = accountArr;
            next();

        } else {
            req.account = [];
            next();
        }
    });
};

exports.listSearch = function (req, res) {
    var account = req.account ? req.account : {};
    res.jsonp(account);
};


/////////////////////////////////////////////// Gen GL
exports.glType = function (req, res, next, type) {
    req.type = type;
    next();
};


exports.getGlDate = function (req, res, next, date) {
    req.date = date;
    next();
};

exports.getGlEndDate = function (req, res, next, enddate) {
    req.enddate = enddate;
    next();
};

exports.setReportCondition = function (req, res, next) {
    var paramDate = new Date(req.date);
    var firstDay;
    var lastDay;
    // console.log("req.type : ", req.type);
    if (req.type === 'month') {
        firstDay = new Date(paramDate.getFullYear(), paramDate.getMonth(), 1);
        lastDay = new Date(new Date(paramDate.getFullYear(), paramDate.getMonth() + 1, 0).setHours(0, 0, 1));
    } else if (req.type === 'year') {
        firstDay = new Date(paramDate.getFullYear(), 0, 1);
        lastDay = new Date(paramDate.getFullYear(), 11, 31);
    } else if (req.type === 'custom') {
        firstDay = new Date(paramDate.getFullYear(), paramDate.getMonth(), paramDate.getDate());
        var paramEndDate = new Date(req.enddate);
        lastDay = new Date(paramEndDate.getFullYear(), paramEndDate.getMonth(), paramEndDate.getDate());
    } else {
        return res.status(404).send({
            message: 'Type not macth. [m,y]'
        });
    }

    req.firstDay = '' + firstDay;
    req.lastDay = '' + lastDay;
    next();
};

exports.getGlByCondition = function (req, res, next) {
    if (req.type === 'month') {
        Glmonth.find({
            startdate: req.firstDay
        }).exec(function (err, glReport) {
            if (err) {
                return next(err);
            } else if (!glReport) {
                return res.status(404).send({
                    message: 'No Glmonth with that identifier has been found'
                });
            }
            if (glReport[0]) {
                res.jsonp(glReport[0]);
            } else {
                next();
            }
        });
    } else {
        Glyear.find({
            startdate: req.firstDay
        }).exec(function (err, glReport) {
            if (err) {
                return next(err);
            } else if (!glReport) {
                return res.status(404).send({
                    message: 'No Glyear with that identifier has been found'
                });
            }
            if (glReport[0]) {
                res.jsonp(glReport[0]);
            } else {
                next();
            }
        });
    }
};

exports.getCompany = function (req, res, next) {
    Company.find({}, "name").exec(function (err, company) {
        if (err) {
            return next(err);
        } else if (!company) {
            return res.status(404).send({
                message: 'No Account with that identifier has been found'
            });
        }
        req.company = company[0];
        next();
    });
};

exports.getAccounts = function (req, res, next) {

    Account.find({
        docdate: {
            $gte: req.firstDay,
            $lte: req.lastDay
        } //  $gt > | $lt < | $gte >== | $lte <==
    }).populate('debits.account').populate('credits.account').populate('user', 'displayName').sort('docno').exec(function (err, account) {
        if (err) {
            return next(err);
        } else if (!account) {
            return res.status(404).send({
                message: 'No Account with that identifier has been found'
            });
        }
        req.account = account;
        req.firstDayText = convertDateThai(req.firstDay);
        req.lastDayText = convertDateThai(req.lastDay);
        next();
    });
};

exports.generateGlDaily = function (req, res, next) {


    var daily = {
        date: new Date(),
        company: req.company ? req.company.name : "",
        startdate: req.firstDay,
        enddate: req.lastDay,
        title: "สมุดรายวันทั่วไป",
        transaction: []
    };

    var acc = req.account.length;
    for (var i = 0; i < acc; i++) {
        var element = req.account[i];
        var transaction = {
            docdate: element.docdate,
            docno: element.docno,
            list: [],
            remark: element.remark
        };

        var debitLength = element.debits.length;
        for (var d = 0; d < debitLength; d++) {
            var debit = element.debits[d];

            transaction.list.push({
                accountname: debit.account.name,
                accountno: debit.account.accountno,
                description: debit.description,
                document: "",
                timestamp: "",
                debit: debit.amount,
                credit: 0
            });
        }

        var creditsLength = element.credits.length;
        for (var c = 0; c < creditsLength; c++) {
            var credits = element.credits[c];

            transaction.list.push({
                accountname: credits.account.name,
                accountno: credits.account.accountno,
                description: credits.description,
                document: "",
                timestamp: "",
                debit: 0,
                credit: credits.amount
            });
        }
        daily.transaction.push(transaction);

    }

    daily.transaction.sort(function (a, b) {
        var adate = new Date(a.docdate).getTime(),
            bdate = new Date(b.docdate).getTime(),
            rv = adate - bdate;
        if (rv === 0) {
            rv = a.docno.localeCompare(b.docno);
        }
        return rv;
    });

    // daily.transaction.sort(function (a, b) {
    //     return new Date(a.docdate).getTime() - new Date(b.docdate).getTime();
    // });

    req.daily = daily;
    next();
};

exports.getAccountchart = function (req, res, next) {
    Accountchart.find().populate('accounttype').sort('accountno').exec(function (err, accountcharts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.accountcharts = accountcharts;
            next();
        }
    });
};

exports.getBringForwardForAcceach = function (req, res, next) {
    Account.find({
        docdate: {
            $lt: req.firstDay
        }
    }).populate('debits.account').populate('credits.account').populate('user', 'displayName').sort('docno').exec(function (err, account) {
        if (err) {
            return next(err);
        } else if (!account) {
            return res.status(404).send({
                message: 'No Account with that identifier has been found'
            });
        }

        // รายวันทั้งหมด
        var daily = {
            transaction: []
        };

        var acc = account.length;
        for (var i = 0; i < acc; i++) {
            var element = account[i];
            var transaction = {
                docdate: element.docdate,
                docno: element.docno,
                list: [],
                remark: element.remark
            };

            var debitLength = element.debits.length;
            for (var d = 0; d < debitLength; d++) {
                var debit = element.debits[d];

                transaction.list.push({
                    accountname: debit.account.name,
                    accountno: debit.account.accountno,
                    description: debit.description,
                    document: "",
                    timestamp: "",
                    debit: debit.amount,
                    credit: 0
                });
            }

            var creditsLength = element.credits.length;
            for (var c = 0; c < creditsLength; c++) {
                var credits = element.credits[c];

                transaction.list.push({
                    accountname: credits.account.name,
                    accountno: credits.account.accountno,
                    description: credits.description,
                    document: "",
                    timestamp: "",
                    debit: 0,
                    credit: credits.amount
                });
            }

            daily.transaction.push(transaction);

        }
        // รายวันทั้งหมด
        // แยกประเภททั้งหมด
        var accountchart = req.accountcharts;
        var accChartsLength = accountchart.length;
        var dailyLength = daily.transaction.length;
        var acceach = [];

        for (var each = 0; each < accChartsLength; each++) {
            var accountchartI = accountchart[each];

            var acceachGrop = {
                title: "บัญชีแยกประเภท" + accountchartI.name,
                accountno: accountchartI.accountno,
                current: {
                    debit: 0,
                    credit: 0
                },
                transaction: []
            };

            var transactionAccEach = [];

            for (var ii = 0; ii < dailyLength; ii++) {
                var dailyI = daily.transaction[ii];
                var indexOfAccountno = dailyI.list.map(function (e) {
                    return e.accountno;
                }).indexOf(accountchartI.accountno);

                if (indexOfAccountno !== -1) {
                    var dailyIList = dailyI.list;
                    // checkDuplicate.splice(indexOfAccountno, 1);
                    var dailyIListLength = dailyIList.length;

                    var macthAccount = dailyIList[indexOfAccountno];
                    var iii = 0;
                    if (macthAccount.debit > 0) {

                        var sumCredit = 0;
                        var dailyListCredit = [];
                        for (iii; iii < dailyIListLength; iii++) {
                            var dailyListICredit = dailyIList[iii];
                            if (dailyListICredit.credit > 0) {
                                sumCredit += dailyListICredit.credit;
                                dailyListCredit.push({
                                    docdate: dailyI.docdate,
                                    docno: dailyI.docno,
                                    accountname: dailyListICredit.accountname,
                                    accountno: dailyListICredit.accountno,
                                    document: "",
                                    timestamp: "",
                                    debit: dailyListICredit.credit,
                                    credit: dailyListICredit.debit,
                                    description: dailyListICredit.description
                                });
                            }
                        }

                        if (macthAccount.debit === sumCredit) {
                            transactionAccEach = transactionAccEach.concat(dailyListCredit);
                        } else {
                            transactionAccEach.push({
                                docdate: dailyI.docdate,
                                docno: dailyI.docno,
                                accountname: dailyListCredit[0].accountname,
                                accountno: dailyListCredit[0].accountno,
                                document: "",
                                timestamp: "",
                                debit: macthAccount.debit,
                                credit: 0,
                                description: dailyListCredit[0].description
                            });
                        }

                    } else if (macthAccount.credit > 0) {

                        var sumDebit = 0;
                        var dailyListDabit = [];
                        for (iii; iii < dailyIListLength; iii++) {
                            var dailyListIDabit = dailyIList[iii];
                            if (dailyListIDabit.debit > 0) {
                                sumDebit += dailyListIDabit.debit;
                                dailyListDabit.push({
                                    docdate: dailyI.docdate,
                                    docno: dailyI.docno,
                                    accountname: dailyListIDabit.accountname,
                                    accountno: dailyListIDabit.accountno,
                                    document: "",
                                    timestamp: "",
                                    debit: dailyListIDabit.credit,
                                    credit: dailyListIDabit.debit,
                                    description: dailyListIDabit.description
                                });
                            }
                        }

                        if (macthAccount.credit === sumDebit) {
                            transactionAccEach = transactionAccEach.concat(dailyListDabit);
                        } else {
                            transactionAccEach.push({
                                docdate: dailyI.docdate,
                                docno: dailyI.docno,
                                accountname: dailyListDabit[0].accountname,
                                accountno: dailyListDabit[0].accountno,
                                document: "",
                                timestamp: "",
                                debit: 0,
                                credit: macthAccount.credit,
                                description: dailyListDabit[0].description
                            });
                        }

                    }

                }
            }

            var tranLength = transactionAccEach.length;
            var currentDebit = 0;
            var currentCredit = 0;
            if (tranLength > 0) {

                for (var index = 0; index < tranLength; index++) {
                    var tran = transactionAccEach[index];
                    currentDebit += tran.debit;
                    currentCredit += tran.credit;
                }
                var carryforwardDebit = 0;
                var carryforwardCredit = 0;
                var sumCurent = currentDebit - currentCredit;
                acceachGrop.current.debit = currentDebit > currentCredit ? currentDebit : currentCredit;
                acceachGrop.current.credit = acceachGrop.current.debit;
                if (sumCurent >= 0) {
                    carryforwardCredit = sumCurent;
                } else {
                    carryforwardDebit = Math.abs(sumCurent);
                }

                acceachGrop.carryforward = {
                    docdate: "",
                    docno: "",
                    accountname: "ยอดยกไป",
                    accountno: "",
                    document: "",
                    timestamp: "",
                    debit: carryforwardDebit,
                    credit: carryforwardCredit,
                    description: ""
                };

                transactionAccEach = _(transactionAccEach)
                    .groupBy('docdate')
                    .reduce(function (array, children, key) {
                        array.push({
                            docdate: key,
                            list: children
                        });

                        return array;
                    }, []);

                acceachGrop.transaction = transactionAccEach;
                acceach.push(acceachGrop);
            }
        }
        req.bringforward = acceach;
        next();
        // แยกประเภททั้งหมด
    });
};

exports.generateAcceach = function (req, res, next) {
    var daily = req.daily;
    var accountchart = req.accountcharts;
    var accChartsLength = accountchart.length;
    var dailyLength = daily.transaction.length;
    var acceach = [];

    for (var i = 0; i < accChartsLength; i++) {
        var accountchartI = accountchart[i];

        var acceachGrop = {
            date: new Date(),
            company: req.company ? req.company.name : "",
            startdate: req.firstDay,
            enddate: req.lastDay,
            title: "บัญชีแยกประเภท" + accountchartI.name,
            accountno: accountchartI.accountno,
            account: accountchartI, //สำหรับเอาไปทำงบกำไรขาดทุน
            current: {
                debit: 0,
                credit: 0
            },
            transaction: []
        };

        var transaction = [];

        for (var ii = 0; ii < dailyLength; ii++) {
            var dailyI = daily.transaction[ii];
            var indexOfAccountno = dailyI.list.map(function (e) {
                return e.accountno;
            }).indexOf(accountchartI.accountno);

            if (indexOfAccountno !== -1) {
                var dailyIList = dailyI.list;
                // checkDuplicate.splice(indexOfAccountno, 1);
                var dailyIListLength = dailyIList.length;

                var macthAccount = dailyIList[indexOfAccountno];
                var iii = 0;
                if (macthAccount.debit > 0) {

                    var sumCredit = 0;
                    var dailyListCredit = [];
                    for (iii; iii < dailyIListLength; iii++) {
                        var dailyListICredit = dailyIList[iii];
                        if (dailyListICredit.credit > 0) {
                            sumCredit += dailyListICredit.credit;
                            dailyListCredit.push({
                                docdate: dailyI.docdate,
                                docno: dailyI.docno,
                                accountname: dailyListICredit.accountname,
                                accountno: dailyListICredit.accountno,
                                document: "",
                                timestamp: "",
                                debit: dailyListICredit.credit,
                                credit: dailyListICredit.debit,
                                description: dailyListICredit.description
                            });
                        }
                    }

                    if (macthAccount.debit === sumCredit) {
                        transaction = transaction.concat(dailyListCredit);
                    } else {
                        transaction.push({
                            docdate: dailyI.docdate,
                            docno: dailyI.docno,
                            accountname: dailyListCredit[0].accountname,
                            accountno: dailyListCredit[0].accountno,
                            document: "",
                            timestamp: "",
                            debit: macthAccount.debit,
                            credit: 0,
                            description: dailyListCredit[0].description
                        });
                    }

                } else if (macthAccount.credit > 0) {

                    var sumDebit = 0;
                    var dailyListDabit = [];
                    for (iii; iii < dailyIListLength; iii++) {
                        var dailyListIDabit = dailyIList[iii];
                        if (dailyListIDabit.debit > 0) {
                            sumDebit += dailyListIDabit.debit;
                            dailyListDabit.push({
                                docdate: dailyI.docdate,
                                docno: dailyI.docno,
                                accountname: dailyListIDabit.accountname,
                                accountno: dailyListIDabit.accountno,
                                document: "",
                                timestamp: "",
                                debit: dailyListIDabit.credit,
                                credit: dailyListIDabit.debit,
                                description: dailyListIDabit.description
                            });
                        }
                    }

                    if (macthAccount.credit === sumDebit) {
                        transaction = transaction.concat(dailyListDabit);
                    } else {
                        transaction.push({
                            docdate: dailyI.docdate,
                            docno: dailyI.docno,
                            accountname: dailyListDabit[0].accountname,
                            accountno: dailyListDabit[0].accountno,
                            document: "",
                            timestamp: "",
                            debit: 0,
                            credit: macthAccount.credit,
                            description: dailyListDabit[0].description
                        });
                    }

                }

            }
        }

        var tranLength = transaction.length;
        var currentDebit = 0;
        var currentCredit = 0;
        if (tranLength > 0) {

            for (var index = 0; index < tranLength; index++) {
                var tran = transaction[index];
                currentDebit += tran.debit;
                currentCredit += tran.credit;
            }

            var indexOfbringforward = req.bringforward.map(function (e) {
                return e.accountno;
            }).indexOf(accountchartI.accountno);

            if (indexOfbringforward !== -1) {
                currentDebit += req.bringforward[indexOfbringforward].carryforward.debit;
                currentCredit += req.bringforward[indexOfbringforward].carryforward.credit;
                acceachGrop.bringforward = {
                    docdate: "",
                    docno: "",
                    accountname: "ยอดยกมา",
                    accountno: "",
                    document: "",
                    timestamp: "",
                    debit: req.bringforward[indexOfbringforward].carryforward.debit,
                    credit: req.bringforward[indexOfbringforward].carryforward.credit,
                    description: ""
                };
            } else {
                acceachGrop.bringforward = {
                    docdate: "",
                    docno: "",
                    accountname: "ยอดยกมา",
                    accountno: "",
                    document: "",
                    timestamp: "",
                    debit: 0,
                    credit: 0,
                    description: ""
                };
            }

            var carryforwardDebit = 0;
            var carryforwardCredit = 0;
            var sumCurent = currentDebit - currentCredit;

            if (sumCurent >= 0) {
                carryforwardCredit = sumCurent;
            } else {
                carryforwardDebit = Math.abs(sumCurent);
            }

            acceachGrop.carryforward = {
                docdate: "",
                docno: "",
                accountname: "ยอดยกไป",
                accountno: "",
                document: "",
                timestamp: "",
                debit: carryforwardDebit,
                credit: carryforwardCredit,
                description: ""
            };

            acceachGrop.current.debit = currentDebit + carryforwardDebit;
            acceachGrop.current.credit = currentCredit + carryforwardCredit;

            transaction = _(transaction)
                .groupBy('docdate')
                .reduce(function (array, children, key) {
                    array.push({
                        docdate: key,
                        list: children
                    });

                    return array;
                }, []);

            acceachGrop.transaction = transaction;
            acceach.push(acceachGrop);
        }
    }
    req.acceach = acceach;
    next();
};

exports.generateGain = function (req, res, next) {
    var acceach = req.acceach;
    var accountChart = req.accountcharts;

    var gain = {
        date: new Date(),
        company: req.company ? req.company.name : "",
        startdate: req.firstDay,
        enddate: req.lastDay,
        title: "งบกำไรขาดทุน",
        transaction: []
    };
    // 0 รายได้จากการดำเนินงาน
    gain.transaction.push(generateGlByType(acceach, accountChart, '09', 'รายได้จากการดำเนินงาน'));
    // 0 จบรายได้จากการดำเนินงาน

    // 1 กำไรขั้นต้น
    gain.transaction.push({
        accounttype: "กำไรขั้นต้น",
        list: [],
        summary: gain.transaction[0].summary
    });
    // 1 จบกำไรขั้นต้น

    // 2 ค่าใช้จ่ายในการดำเนินงาน
    gain.transaction.push(generateGlByType(acceach, accountChart, '11', 'ค่าใช้จ่ายในการดำเนินงาน'));
    // 2 จบค่าใช้จ่ายในการดำเนินงาน

    // 3 ค่าใช้จ่ายในการผลิต
    gain.transaction.push(generateGlByType(acceach, accountChart, '12', 'ค่าใช้จ่ายในการผลิต'));
    // 3 จบค่าใช้จ่ายในการผลิต

    // 4 กำไรสุทธิจากการดำเนินงาน***
    gain.transaction.push({
        accounttype: "กำไรสุทธิจากการดำเนินงาน",
        list: [],
        summary: (gain.transaction[1].summary ? gain.transaction[1].summary : 0) - (gain.transaction[2].summary ? gain.transaction[2].summary : 0) - (gain.transaction[3].summary ? gain.transaction[3].summary : 0)
    });
    // 4 จบกำไรสุทธิจากการดำเนินงาน***

    // 5 รายได้อื่น
    gain.transaction.push(generateGlByType(acceach, accountChart, '10', 'รายได้อื่น'));
    gain.transaction[5].sumtrans = {
        accountno: "",
        amount: (gain.transaction[4].summary ? gain.transaction[4].summary : 0) + (gain.transaction[5].summary ? gain.transaction[5].summary : 0)
    };
    // 5 จบรายได้อื่น

    // 6 ค่าใช้จ่ายอื่น
    gain.transaction.push(generateGlByType(acceach, accountChart, '13', 'ค่าใช้จ่ายอื่น'));
    // 6 จบค่าใช้จ่ายอื่น

    // 7 กำไรสุทธิ***
    gain.transaction.push({
        accounttype: "กำไรสุทธิ (ขาดทุนสุทธิ)",
        list: [],
        summary: (gain.transaction[5].sumtrans.amount ? gain.transaction[5].sumtrans.amount : 0) - (gain.transaction[6].summary ? gain.transaction[6].summary : 0)
    });
    // 7 จบกำไรสุทธิ***

    req.gain = gain;
    next();
};

exports.generateBalance = function (req, res, next) {
    var acceach = req.acceach;
    var accountChart = req.accountcharts;

    var balance = {
        date: new Date(),
        company: req.company ? req.company.name : "",
        startdate: req.firstDay,
        enddate: req.lastDay,
        title: "งบแสดงฐานะการเงิน",
        asset: {
            name: "- สินทรัพย์ -",
            transaction: []
        },
        debt: {
            name: "- หนี้สินและส่วนของผู้ถือหุ้น -",
            transaction: []
        }
    };
    balance.asset.transaction.push(generateGlByType(acceach, accountChart, '01', 'สินทรัพย์หมุนเวียน'));
    balance.asset.transaction.push(generateGlByType(acceach, accountChart, '03', 'ที่ดิน อาคารและอุปกรณ์'));
    balance.asset.transaction.push(generateGlByType(acceach, accountChart, '04', 'สินทรัพย์อื่น'));
    balance.asset.transaction.push({
        accounttype: "รวมสินทรัพย์",
        list: [],
        summary: (balance.asset.transaction[0].summary ? balance.asset.transaction[0].summary : 0) + (balance.asset.transaction[1].summary ? balance.asset.transaction[1].summary : 0) + (balance.asset.transaction[2].summary ? balance.asset.transaction[2].summary : 0)
    });

    balance.debt.transaction.push(generateGlByType(acceach, accountChart, '05', 'หนี้สินหมุนเวียน'));
    balance.debt.transaction[0].sumtrans = {
        accountno: "- รวมหนี้สิน -",
        amount: balance.debt.transaction[0].summary
    };

    balance.debt.transaction.push(generateGlByType(acceach, accountChart, '08', 'ส่วนของผู้ถือหุ้น'));
    balance.debt.transaction[1].sumtrans = {
        accountno: "- รวมส่วนของผู้ถือหุ้น -",
        amount: balance.debt.transaction[1].summary
    };

    balance.debt.transaction.push({
        accounttype: "รวมหนี้สินและส่วนของผู้ถือหุ้น",
        list: [],
        summary: (balance.debt.transaction[0].summary ? balance.debt.transaction[0].summary : 0) + (balance.debt.transaction[1].summary ? balance.debt.transaction[1].summary : 0)
    });

    req.balance = balance;
    next();
};

exports.balancetest = function (req, res, next) {
    var balancetests = {
        date: Date.now(),
        company: "",
        startdate: req.firstDay,
        enddate: req.lastDay,
        title: "งบทดลอง",
        transaction: [],
        summary: {
            bfdebit: 0,
            bfcredit: 0,
            currdebit: 0,
            currcredit: 0,
            afdebit: 0,
            afcredit: 0
        }
    };
    req.acceach.forEach(function (acc) {
        var currDr = 0;
        var currCr = 0;
        acc.transaction.forEach(function (accofdate) {
            accofdate.list.forEach(function (trn) {
                currDr += trn.debit;
                currCr += trn.credit;
            });
        });

        var balancetest = {
            accountno: acc.account.accountno,
            name: acc.account.name,
            bfdebit: acc.bringforward.debit,
            bfcredit: acc.bringforward.credit,
            currdebit: currDr,
            currcredit: currCr,
            afdebit: acc.carryforward.credit,
            afcredit: acc.carryforward.debit
        };
        balancetests.summary.bfdebit += acc.bringforward.debit;
        balancetests.summary.bfcredit += acc.bringforward.credit;
        balancetests.summary.currdebit += currDr;
        balancetests.summary.currcredit += currCr;
        balancetests.summary.afdebit += acc.carryforward.credit;
        balancetests.summary.afcredit += acc.carryforward.debit;
        balancetests.transaction.push(balancetest);
    });
    req.balancetests = balancetests;
    next();
};

exports.returnGlreport = function (req, res) {

    var glreport = {
        type: req.type,
        startdate: req.firstDay,
        enddate: req.lastDay,
        firstDayText: req.firstDayText,
        lastDayText: req.lastDayText,
        daily: req.daily,
        acceach: req.acceach,
        gain: req.gain,
        balance: req.balance,
        balancetests: req.balancetests
    };
    res.jsonp(glreport);
};

exports.exportExcel = function (req, res) {
    var wb = new xl.Workbook();
    //var ws = wb.addWorksheet(req.daily.title);
    var numStyle = wb.createStyle({
        // font: {
        //     color: '#FF0800',
        //     size: 12
        // },
        numberFormat: '#,##0.00; (#,##0.00); -'
    });





    // ws.cell(1, 1).number(100);
    // // หมายถึงใส่ค่าตัวเลข 100 ลงไปที่ cell A1
    // ws.cell(1, 2).string('some text');
    // //หมายถึงใส่ค่าตัวอักษร some text ลงใน cell B1
    // ws.cell(1, 3).formula('A1+A2');
    // //หมายถึงใส่สูตร A1+A2 ใน cell C1
    // ws.cell(1, 4).bool(true);
    // //หมายถึงใส่ค่า boolean true ใน cell D1
    // ws.cell(1,5).number(23000).style(numStyle);
    // ws.cell(1,6).string('my big string').style({font:{ size : 25 }});
    // ws.cell(1,7).number(45900).style(numStyle).style({font:{ size : 25 }});


    if (req.daily) {
        var ws = wb.addWorksheet(req.daily.title);
        ws.cell(1, 1).string('วันที่');
        ws.cell(1, 2).string('เลขเอกสาร');
        ws.cell(1, 3).string('รายการ');
        ws.cell(1, 4).string('รหัสบัญชี');
        ws.cell(1, 5).string('เช็ค/ใบสำคัญ');
        ws.cell(1, 6).string('ลงวันที่');
        ws.cell(1, 7).string('เดบิต');
        ws.cell(1, 8).string('เครดิด');

        var i = 2;
        req.daily.transaction.forEach(function (tran) {
            ws.cell(i, 1).string(tran.docdate.toISOString().slice(0,10).replace(/-/g,""));
            ws.cell(i, 2).string(tran.docno);
            tran.list.forEach(function (detail) {
                ws.cell(i, 3).string(detail.accountname);
                ws.cell(i, 4).string(detail.accountno);
                ws.cell(i, 5).string('');
                ws.cell(i, 6).string('');
                ws.cell(i, 7).number(detail.debit || 0).style(numStyle);
                ws.cell(i, 8).number(detail.credit || 0).style(numStyle);
                i++;
            });
            i++;
        });
    }

    if (req.balancetests) {
        var ws = wb.addWorksheet(req.balancetests.title);
        ws.cell(1, 1).string('เลขบัญชี');
        ws.cell(1, 2).string('ชื่อบัญชี');
        ws.cell(1, 3).string('ยกมา(เดบิต)');
        ws.cell(1, 4).string('ยกมา(เครดิต)');
        ws.cell(1, 5).string('ในงวด(เดบิต)');
        ws.cell(1, 6).string('ในงวด(เครดิต)');
        ws.cell(1, 7).string('ยกไป(เดบิต)');
        ws.cell(1, 8).string('ยกไป(เครดิต)');

        var i = 2;
        req.balancetests.transaction.forEach(function (tran) {
            ws.cell(i, 1).string(tran.accountno);
            ws.cell(i, 2).string(tran.name);
            ws.cell(i, 3).number(tran.bfdebit).style(numStyle);
            ws.cell(i, 4).number(tran.bfcredit).style(numStyle);
            ws.cell(i, 5).number(tran.currdebit).style(numStyle);
            ws.cell(i, 6).number(tran.currcredit).style(numStyle);
            ws.cell(i, 7).number(tran.afdebit).style(numStyle);
            ws.cell(i, 8).number(tran.afcredit).style(numStyle);
            i++;
        });
    }



    wb.write('ExcelFile.xlsx', res);
};

function generateGlByType(acceach, accountChart, type, name) {
    var accChartLength = accountChart.length;
    var accLength = acceach.length;
    var GG = {
        accounttype: name,
        list: [],
        summary: 0
    };
    for (var i = 0; i < accChartLength; i++) {
        var accountChartI = accountChart[i];
        if (accountChartI.accounttype && accountChartI.accounttype.accounttypeno === type) {
            GG.list.push({
                accountno: accountChartI.accountno,
                accountname: accountChartI.name,
                amount: 0
            });
        }
    }
    for (var ii = 0; ii < accLength; ii++) {
        var acceachI09 = acceach[ii];

        var indexOfGG = GG.list.map(function (e) {
            return e.accountno;
        }).indexOf(acceachI09.accountno);
        if (indexOfGG !== -1) {
            GG.list[indexOfGG].amount = acceachI09.carryforward.debit > 0 ? acceachI09.carryforward.debit : acceachI09.carryforward.credit;
        }
    }
    var GGListLength = GG.list.length;
    for (var iii = 0; iii < GGListLength; iii++) {
        GG.summary += GG.list[iii].amount;
    }
    return GG;
}

function convertDateThai(d) {
    var months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    var date = new Date(d);
    return date.getDate() + ' ' + months[date.getMonth()] + ' ' + (date.getFullYear() + 543);
}
