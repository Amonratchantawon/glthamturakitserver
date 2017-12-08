'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Glmonth Schema
 */
var GlmonthSchema = new Schema({
  statementname: {
    type: String
  },
  firstDayText: {
    type: String,
  },
  lastDayText: {
    type: String,
  },
  startdate: {
    type: Date
  },
  enddate: {
    type: Date
  },
  type: {
    type: String
  },

  acceach: {
    type: [{
      accountno: {
        type: String
      },
      company: {
        type: String
      },
      date: {
        type: Date
      },
      enddate: {
        type: Date
      },
      startdate: {
        type: Date
      },
      title: {
        type: String
      },
      current: {
        type: {
          credit: {
            type: Number
          },
          debit: {
            type: Number
          }
        }
      },
      carryforward: {
        accountname: {
          type: String
        },
        accountno: {
          type: String
        },
        credit: {
          type: Number
        },
        debit: {
          type: Number
        },
        description: {
          type: String
        },
        docdate: {
          type: String
        },
        docno: {
          type: String
        },
        document: {
          type: String
        },
        timestamp: {
          type: String
        }
      },
      bringforward: {
        accountname: {
          type: String
        },
        accountno: {
          type: String
        },
        credit: {
          type: Number
        },
        debit: {
          type: Number
        },
        description: {
          type: String
        },
        docdate: {
          type: String
        },
        docno: {
          type: String
        },
        document: {
          type: String
        },
        timestamp: {
          type: String
        }
      },
      account: {
        accounttype: {
          accounttypename: {
            type: String
          },
          accounttypeno: {
            type: String
          },
          created: {
            type: Date
          },
          user: {
            type: Schema.ObjectId,
            ref: 'User'
          },
          _id: {
            type: String
          }
        },
        accountno: {
          type: String
        },
        created: {
          type: Date
        },
        name: {
          type: String
        },
        parent: {
          type: String
        },
        status: {
          type: String
        },
        unitprice: {
          type: Number
        },
        vat: {
          type: Number
        },
        user: {
          type: Schema.ObjectId,
          ref: 'User'
        },
        _id: {
          type: String
        }
      },
      transaction: {
        type: [{
          docdate: {
            type: Date
          },
          list: {
            type: [{
              accountname: {
                type: String
              },
              accountno: {
                type: String
              },
              credit: {
                type: Number
              },
              debit: {
                type: Number
              },
              description: {
                type: String
              },
              docdate: {
                type: Date
              },
              docno: {
                type: String
              },
              document: {
                type: String
              },
              timestamp: {
                type: String
              }
            }]
          }
        }]
      }
    }]
  },

  balance: {
    type: {
      company: {
        type: String
      },
      date: {
        type: Date
      },
      enddate: {
        type: Date
      },
      startdate: {
        type: Date
      },
      title: {
        type: Date
      },
      asset: {
        type: {
          name: {
            type: String
          },
          transaction: {
            type: [{
              accounttype: {
                type: String
              },
              summary: {
                type: Number
              },
              sumtrans: {
                type: {
                  accountno: {
                    type: String
                  },
                  amount: {
                    type: Number
                  }
                }
              },
              list: {
                type: [{
                  accountname: {
                    type: String
                  },
                  accountno: {
                    type: String
                  },
                  amount: {
                    type: Number
                  }
                }]
              }
            }]
          }
        }
      },
      debt: {
        type: {
          name: {
            type: String
          },
          transaction: {
            type: [{
              accounttype: {
                type: String
              },
              summary: {
                type: Number
              },
              sumtrans: {
                type: {
                  accountno: {
                    type: String
                  },
                  amount: {
                    type: Number
                  }
                }
              },
              list: {
                type: [{
                  accountname: {
                    type: String
                  },
                  accountno: {
                    type: String
                  },
                  amount: {
                    type: Number
                  }
                }]
              }
            }]
          }
        }
      },

    }
  },

  daily: {
    type: {
      company: {
        type: String
      },
      date: {
        type: Date
      },
      enddate: {
        type: Date
      },
      startdate: {
        type: Date
      },
      title: {
        type: Date
      },
      transaction: {
        type: [{
          docdate: {
            type: Date
          },
          docno: {
            type: String
          },
          remark: {
            type: String
          },
          list: {
            type: [{
              accountname: {
                type: String
              },
              accountno: {
                type: String
              },
              credit: {
                type: Number
              },
              debit: {
                type: Number
              },
              description: {
                type: String
              },
              document: {
                type: String
              },
              timestamp: {
                type: String
              },
            }]
          }
        }]
      }
    }
  },

  gain: {
    type: {
      company: {
        type: String
      },
      date: {
        type: Date
      },
      enddate: {
        type: Date
      },
      startdate: {
        type: Date
      },
      title: {
        type: Date
      },
      transaction: {
        type: [{
          accounttype: {
            type: String
          },
          summary: {
            type: Number
          },
          list: {
            type: [{
              accountname: {
                type: String
              },
              accountno: {
                type: String
              },
              amount: {
                type: Number
              }
            }]
          }
        }]
      }
    }
  },


  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Glmonth', GlmonthSchema);
