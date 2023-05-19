//funzione per validare le credenziali
exports.validateCredentials = (...args) => {
    console.log('sono nella validazione')
    for (const el of args.values()) {
        //console.log(el)
        if (el == undefined)
            return 'Campo mancante'
    }
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    if (!args[0].match(validRegex))
        return 'Formato email non valido'


    //TODO check sulla password: caratteri maiuscolo, minuscolo, numeri e simboli


    if (args[1].length < 1)
        return 'Password troppo corta'

    //console.log(args.length)
    if (args.length === 3) {
        if (args[1] === args[2])
            return true
        return 'Password non combacianti'
    }
    return true
}