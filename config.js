exports.mongoUrl="mongodb://localhost:27017/?replicaSet=rs0&readPreference=primary"

exports.transactionOptions = {
       readPreference: 'primary',
       readConcern: { level: 'local' },
       writeConcern: { w: 'majority' }
};
