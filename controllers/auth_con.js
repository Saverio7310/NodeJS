const bcrypt = require('bcryptjs')
const { MongoServerError } = require('mongodb')

const User = require("../models/user")
const path = require('../util/path')
const {catchError, sendingError} = require('../util/errors')
const {validateCredentials} = require('../util/validation')

//middleware per accedere alla creazione di un account - signup
exports.getAuth = (req, res, next) => {
    //ritorna un array, quindi accedo al primo elemento
    let title = req.flash('title')[0]
    let mode = req.flash('mode')[0]
    let error = req.flash('error')[0]
    //se non sono stati settati degli errori indirizzo alla pagina base di registrazione
    if (title == 0 && mode == 0 && error == 0) {
        console.log('Sono dentro if di getAuth')
        title = 'Registrati'
        mode = 'signup'
        error = undefined
    }
    console.log('errore', error, 'mode', mode, 'titolo', title)
    res.render('auth.pug', {
        title: title,
        mode: mode,
        error: error
    })
}

//middleware per la creazione di un account
exports.postSignUp = (req, res, next) => {
    //validazione credenziali
    const validation = validateCredentials(req.body.email, req.body.password,
        req.body.confirmed_password)
    if (typeof validation === 'string') {
        console.log(validation)
        return sendingError(req, res, 'Registrati', 'signup',
            validation, '/auth')
    }
    /* else if (typeof validation === 'boolean') 
        console.log('momomomomo') */

    bcrypt.hash(req.body.password, 12)
        .then(hashedPassword => {
            const user = new User(req.body.email, hashedPassword)
            return user.signup()
        })
        .then(result => {
            if (result instanceof MongoServerError) {
                console.log('Email già presente nel database')
                sendingError(req, res, 'Registrati', 'signup',
                    'Email già associata ad un account', '/auth')
            } else {
                console.log('Utente inserito nel database', result)
                res.render('auth.pug', {
                    title: 'Accedi',
                    mode: 'login',
                    error: ''
                })
            }
        })
        .catch(err => {
            console.log('Errore registrazione utente', err)
            return catchError(err, 500, next)
        })
}

//middleware per fare login
exports.postLogIn = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const user = new User(email, password)
    console.log('credenziali', email, password)
    //validazione credenziali
    const validation = validateCredentials(email, password)
    if (typeof validation === 'string') {
        console.log(validation)
        return sendingError(req, res, 'Accedi', 'login',
            validation, '/auth')
    }
    //creo l'utente e lo cerco nel db
    user.login()
        .then(user => {
            //se non esiste torno indietro
            if (!user) {
                console.log('Nessun utente trovato nel database')
                return sendingError(req, res, 'Accedi', 'login',
                    'Indirizzo email sconosciuto', '/auth')
            }
            //se esiste comparo la password inserita nella pagina di login con quella criptata nel db
            //compare ritorna false se le password non combaciano, non ritorna errore
            bcrypt.compare(password, user.surname)
                .then(match => {
                    //se è sbagliata ricarico la pagina
                    if (!match) {
                        console.log('Password errata')
                        return sendingError(req, res, 'Accedi', 'login',
                            'Password errata', '/auth')
                    }
                    //altrimenti vado avanti e creo la sessione
                    req.session.user = user
                    req.session.isLoggedIn = true
                    req.session.save(() => {
                        res.redirect('/')
                    })
                })
                .catch(err => {
                    //qui si arriva se una delle due password è undefined
                    console.log('Errore login', err)
                    return catchError(err, 500, next)
                })
        })
        .catch(err => {
            console.log('Errore ricerca login', err)
            return catchError(err, 500, next)
        })
}

//middleware per aprire la pagina di login
exports.getLogIn = (req, res, next) => {
    res.render('auth.pug', {
        title: 'Accedi',
        mode: 'login',
        error: ''
    })
}

//middleware per il logout
exports.postLogOut = (req, res, next) => {
    //req.session.isLoggedIn = false
    req.session.destroy((err) => {
        console.log('Errore nella chiusura della sessione', err)
        res.redirect('/')
    })
}