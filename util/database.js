const mysql = require('mysql2')

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'ProvaNodeJS',
    password:'Dneo2%&pq='
})

//ritorna una promise
module.exports = pool.promise()