const jwt = require('jsonwebtoken');
const config = require('config');

function checkJwt(req, res, next) {
    try {
        const { jwtToken } = req.params;
        const decoded = jwt.verify(jwtToken, config.get('jwtSecret'));
        req.body = {...req.body, jwtDecoded: decoded};
        next();
    } catch (e) {
        res.json({ jwtError: e.message })
    }    
}

module.exports = { checkJwt };