const express = require('express');
const router = express.Router();
const Postagem = require('../models/Postagem');

router.get('/', async (req, res) => {
    try {
        const postagens = await Postagem.findAll();
        const postagensPlain = postagens.map(postagem => postagem.toJSON());
        res.render('blog', { postagens: postagensPlain });
    } catch (err) {
        console.error('Erro ao buscar postagens:', err);
        req.flash('error_msg', 'Houve um erro ao listar as postagens');
        res.redirect('/');
    }
});

module.exports = router;