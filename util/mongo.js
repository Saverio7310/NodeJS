const mongodb = require('mongodb')
const client = mongodb.MongoClient

let _db

const mongoConnection = (cb) => {
    client
        .connect(process.env.URI_MONGODB)
        .then(client => {
            //ritorna il client
            console.log('Connesso')
            _db = client.db()
            cb()
        })
        .catch(err => {
            console.log('Errore connessione MongoDB')
            throw 'Errore connessione MongoDB'
        })
}

const getDB = () => {
    if (_db) {
        return _db
    }
    throw 'Errore! Nessun DB Mongo disponibile'
}

exports.mongoConnection = mongoConnection
exports.getDB = getDB