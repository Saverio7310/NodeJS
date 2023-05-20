exports.getFirst = (req, res, next) => {
    res.status(200).json({
        response: {
            primo: 1,
            secondo:2,
            terzo: 3
        }
    })
}