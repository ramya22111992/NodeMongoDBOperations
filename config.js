exports.mongoUrl="mongodb://127.0.0.1:27017/dbTest?replicaSet=rs0"

exports.transactionOptions = {
       readPreference: 'primary',
       readConcern: { level: 'local' },
       writeConcern: { w: 'majority' }
};
