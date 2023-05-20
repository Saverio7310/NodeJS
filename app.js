const express = require('express')
const parser = require('body-parser')
const path = require('path')
const session = require('express-session')
const csrf = require('csurf')
const flash = require('connect-flash')
const dotenv = require('dotenv')

//serve a caricare il contentuto del file .env all'interno di process.env
//in questo modo si nascondono element sensibili
dotenv.config()
//console.log(process.env)

//con questa scrittura si intende che si importa una funzione passandogli come
//argomento la sessione session. Da qui si ottiene il costruttore???
const MongoDBStore = require('connect-mongodb-session')(session)

const mongoConnection = require('./util/mongo').mongoConnection
const main_router = require('./routes/main_page')
const auth_router = require('./routes/auth')
const api_router = require('./routes/api_first')

//creazione il server
const server = express()

//database per salvare le sessioni
const store = new MongoDBStore({
    uri: process.env.URI_MONGODB,
    collection: 'sessions'
})

//funzione da inserire come middleware per la protezione da attacchi CSRF
const csrfProtection = csrf()

//settaggio del modulo da usare per generare gli html
server.set('view conroller', 'pug')

//middleware che consente di prendere i dati dal body della request quando arrivano da un form
server.use(parser.urlencoded({ extended: false }))

//accesso ai file pubblici. qui css
server.use(express.static(path.join(__dirname, 'public')))

//inizializzazione della sessione
server.use(session({
    secret: 'password_lunga_e_sicura_per_fare_hash',
    resave: false, //la sessione non viene modificata automaticamente ad ogni risposta
    saveUninitialized: false, //la sessione non viene salvata se è stata appena creata ma non modificata
    store: store //dove si andanno a salvare le sessioni
}))

//middleware per la protezione da attacchi CSRF
server.use(csrfProtection)

//inizializzazione connect flash che permette di creare messaggi temporanei da inserire nella session
server.use(flash())

//middleware necessario per passare alcune variabili alle views
server.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})

//middleware per tutte le altre pagine
server.use(main_router)

//middleware per le pagine di autenticazione
server.use(auth_router)

//middleware che consent edi prendere i dati dal body quando arrivano da un chiamata api => JSON
server.use(parser.json())

//middleware per gestire le chiamate API
server.use('/api', api_router)

//middleware pagina di errore
server.use((req, res, next) => {
    res.render('errors/404.pug', { code: 404 })
})

//pagina per gli errori intercettati nei blocchi catch
server.use((error, req, res, next) => {
    console.log(error)
    res.render('errors/500.pug')
})

//connessione a MongoDB e listen del server
mongoConnection(() => {
    server.listen(8080)
})