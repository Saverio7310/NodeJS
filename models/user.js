const db = require('../util/database')
const getDB = require('../util/mongo').getDB
const mongo = require('mongodb')

module.exports = class User {
    constructor(name, surname) {
        this.name = name
        this.surname = surname
    }

    saveMySql() {
        db.execute("INSERT INTO nomi (nome, cognome) VALUES (?, ?)", [this.name, this.surname])
            .then(result => {
                console.log(result)
            })
            .catch(err => {
                console.log(err)
                return err
            })
    }

    saveMongoDB() {
        const mongodb = getDB()
        return mongodb.collection('nomi')
            .insertOne(this)
            .then(result => {
                console.log(result)
            })
            .catch(err => {
                console.log(err)
                return err
            })
    }

    searchMySQL() {
        return db.execute("SELECT nome, cognome FROM nomi WHERE nome=? AND cognome=? ", [this.name, this.surname])
            .then(([body]) => {
                console.log('Risultato ricerca MySQL', body)
                return body[0]
            })
            .catch(err => {
                console.log('Errore nella ricerca dell\'utente', err)
                return err
            })
    }

    //con questa funzione si ottengono tutti gli elementi nel database
    static searchMongoDB() {
        const mongodb = getDB()
        return mongodb.collection('nomi')
            .find()
            .toArray()
            .then(prods => {
                console.log(prods)
                return prods
            })
            .catch(err => {
                console.log(err)
                return err
            })
    }

    //cerca un singolo elemento nel database
    searchNameMongoDB() {
        const mongodb = getDB()
        return mongodb.collection('nomi')
            .find({ name: this.name, surname: this.surname })
            .next()
            .then(product => {
                console.log('Risultato ricerca MongoDB', product)
                return product
            })
            .catch(err => {
                console.log(err)
                return err
            })
    }

    static deleteNameMongoDB(userID) {
        const mongodb = getDB()
        return mongodb.collection('nomi')
            .deleteOne({'_id': new mongo.ObjectId(userID)})
            .then(result => {
                console.log('Cancellazione MongoDB', result)
                return result
            })
            .catch(err => {
                console.log(err)
                return err
            })
    }

    login() {
        const mongodb = getDB()
        return mongodb.collection('account')
            .find({ name: this.name })
            .next()
            .then(user => {
                console.log('search single mongodb', user)
                return user
            })
            .catch(err => {
                console.log('Errore ricerca login MongoDB', err)
                return err
            })
    }

    signup() {
        const mongodb = getDB()
        return mongodb.collection('account')
            .insertOne(this)
            .then(result => {
                //console.log('Inserimento', result)
                return result
            })
            .catch(err => {
                //console.log('Errore inserimento', err)
                //essendoci un index sulla mail, se cerco di inserire una mail già inserta ottengo
                //un errore
                return err
            })
     }
} 