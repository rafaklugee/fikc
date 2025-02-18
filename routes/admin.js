const {eAdmin} = require('../helpers/eAdmin')

app.get('/cliente', eAdmin, (req, res) => {
    res.render('cliente');
});