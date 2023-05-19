const deleteUser = btn => {
    console.log('btn')
    const userID = btn.parentNode.querySelector('[name=userId]').value
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value
    const productElement = btn.closest('article')

    fetch('/delete/' + userID, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            console.log('Risultato cancellazione')
            return result.json()
        })
        .then(data => {
            console.log('dati:', data)
            productElement.remove()
        })
        .catch(err => {
            console.log('Errore cancellazione', err)
        })
}