//funzione per gestire gli errori
exports.catchError = (err, statusCode, next) => {
    const error = new Error(err)
    error.httpStatusCode = statusCode
    next(error)
}


//funzione per inviare gli errori nella pagina di autenticazione
exports.sendingError = (req, res, title, mode, error, path) => {
    req.flash('title', title)
    req.flash('mode', mode)
    req.flash('error', error)
    res.redirect(path)
}