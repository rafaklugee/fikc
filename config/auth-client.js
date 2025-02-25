function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Por favor, faça login para acessar essa área.');
    res.redirect('/usuarios/login');
}

function ensureCorrectClient(req, res, next) {
    if (req.user.client_id === req.params.client_id) {
        return next();
    }
    req.flash('error_msg', 'Você não tem permissão para acessar essa área.');
    res.redirect('/');
}

module.exports = {
    ensureAuthenticated,
    ensureCorrectClient
};