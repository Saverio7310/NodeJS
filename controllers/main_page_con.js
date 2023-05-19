const User = require('../models/user')
const { catchError, sendingError } = require('../util/errors')

exports.getAddUser = (req, res, next) => {
    if (req.session.isLoggedIn === undefined) {
        req.session.isLoggedIn = false
    }
    console.log('getAdd', req.session)
    //res.sendFile(path.getPath('views', 'main_page.html'))
    res.render('main_page.pug', {
        csrfToken: req.csrfToken(),
        mode: req.session.isLoggedIn
    })
}

exports.postAddUser = (req, res, next) => {
    const name = req.body.nome_add
    const surname = req.body.cognome_add
    const user = new User(name, surname)
    //console.log(user)

    //user.saveMySql()

    user.saveMongoDB()
        .then(() => {
            res.redirect('/')
        })
        .catch(err => {
            console.log('Errore nel saveMongoDB', err)
            return catchError(err, 500, next)
        })
}

exports.postSearchUser = (req, res, next) => {
    const name = req.body.nome_search
    const surname = req.body.cognome_search
    const user = new User(name, surname)

    /* user.searchMySQL()
        .then(body => {
            if (body === undefined) {
                console.log('Se il corpo è undefined significa che non ci sono corrispondenze nel db')
                res.render('errors/404.pug', { code: 1 })
            }
            res.render('detail_page.pug', {
                nome_utente: body.nome,
                cognome_utente: body.cognome
            })
        })
        .catch(err => {
            console.log('Errore nel searchMySQL', err)
            return catchError(err, 500, next)
        }) */

    user.searchNameMongoDB()
        .then(fetched_user => {
            if (fetched_user === undefined) {
                console.log('Non ci sono corrispondenze nel DB')
                return res.render('errors/404.pug', { code: 1 })
            }
            console.log(fetched_user)
            return res.render('detail_page.pug', {
                prods: [fetched_user]
            })
        })
        .catch(err => {
            console.log('Errore nel searchNameMongoDB', err)
            return catchError(err, 500, next)
        })
}

exports.deleteUser = (req, res, next) => {
    const userID = req.params.userID

    User.deleteNameMongoDB(userID)
        .then(result => {
            console.log('ELiminazione utente effettuata', result)
            res.status(200).json({message: 'Success'})
        })
        .catch(err => {
            console.log('Errore in fase di eliminazione', err)
            res.status(500).json({message: 'Fail'})
        })
}