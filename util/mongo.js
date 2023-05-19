const mongodb = require('mongodb')
const client = mongodb.MongoClient

let _db

const mongoConnection = (cb) => {
    client
        .connect('mongodb+srv://saverioperrone:4OHIJVRDoyzJaLfp@cluster0.wwbkxel.mongodb.net/?retryWrites=true&w=majority')
        .then(client => {
            //ritorna il client
            console.log('Connesso')
            _db = client.db('prova')
            cb()
        })
        .catch(err => {
            console.log('Errore connessione MongoDB')
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