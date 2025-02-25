const express = require('express');
const router = express.Router();
const {eAdmin} = require('../helpers/eAdmin')
const Postagem = require('../models/Postagem');

// Rota para listar todas as postagens
router.get('/listar', eAdmin, async (req, res) => {
    try {
        const postagens = await Postagem.findAll();
        const postagensPlain = postagens.map(postagem => postagem.toJSON());
        res.render('postagem/postagens', { postagens: postagensPlain });
    } catch (err) {
        console.error('Erro ao buscar postagens:', err);
        req.flash('error_msg', 'Houve um erro ao listar as postagens');
        res.redirect('/');
    }
});

// Rota para exibir o formulário de adição de uma nova postagem
router.get('/add', eAdmin, (req, res) => {
    res.render('postagem/addpostagem');
});

// Rota para adicionar uma nova postagem
router.post('/nova', eAdmin, async (req, res) => {
    const { titulo, slug, descricao, conteudo} = req.body;
    let erros = [];

    if (!titulo || !slug || !descricao || !conteudo) {
        erros.push({ texto: 'Por favor, preencha todos os campos' });
    }

    if (erros.length > 0) {
        res.render('postagem/addpostagem', { erros });
    } else {
        try {
            await Postagem.create({ titulo, slug, descricao, conteudo});
            req.flash('success_msg', 'Postagem criada com sucesso');
            res.redirect('/postagem/listar');
        } catch (err) {
            console.error('Erro ao criar postagem:', err);
            req.flash('error_msg', 'Houve um erro ao criar a postagem');
            res.redirect('/postagem/listar');
        }
    }
});

// Rota para deletar uma postagem
router.get('/deletar/:id', eAdmin, async (req, res) => {
    console.log('Parametros recebidos (id): ',req.params.id);
    try {
        await Postagem.destroy({ where: { id: req.params.id } });
        req.flash("success_msg", "Postagem deletada com sucesso!");
        res.redirect('/postagem/listar');
    } catch (err) {
        console.error('Erro ao deletar postagem:', err);
        req.flash("error_msg", "Houve um erro interno");
        res.redirect('/postagem/listar');
    }
});

// Rota para exibir o formulário de edição de uma postagem
router.get('/edit/:id', eAdmin, async (req, res) => {
    console.log('Parametros recebidos (id): ',req.params.id);
    try {
        const postagem = await Postagem.findOne({ where: { id: req.params.id } });
        if (postagem) {
            res.render('postagem/editpostagem', { postagem: postagem.toJSON() });
        } else {
            req.flash('error_msg', 'Postagem não encontrada');
            res.redirect('/postagem/listar');
        }
    } catch (err) {
        console.error('Erro ao buscar postagem:', err);
        req.flash('error_msg', 'Houve um erro ao buscar a postagem');
        res.redirect('/postagem/listar');
    }
});

// Rota para editar uma postagem
router.post('/edit', eAdmin, async (req, res) => {
    try {
        const postagem = await Postagem.findOne({ where: { id: req.body.id } });
        if (postagem) {
            postagem.titulo = req.body.titulo;
            postagem.slug = req.body.slug;
            postagem.descricao = req.body.descricao;
            postagem.conteudo = req.body.conteudo;

            await postagem.save();
            req.flash("success_msg", "Postagem editada com sucesso");
            res.redirect('/postagem/listar');
        } else {
            req.flash("error_msg", "Postagem não encontrada");
            res.redirect('/postagem/listar');
        }
    } catch (err) {
        console.error('Erro ao editar postagem:', err);
        req.flash("error_msg", "Houve um erro ao editar a postagem");
        res.redirect('/postagem/listar');
    }
});

// Rota para exibir uma postagem específica
router.get('/:slug', async (req, res) => {
    try {
        console.log('Parametros recebidos (slug): ', req.params.slug);
        const postagem = await Postagem.findOne({ where: { slug: req.params.slug } });
        if (postagem) {
            res.render('postagem/index', { postagem: postagem.toJSON() });
        } else {
            req.flash('error_msg', 'Postagem não encontrada');
            res.redirect('/postagem/listar');
        }
    } catch (err) {
        console.error('Erro ao buscar postagem:', err);
        req.flash('error_msg', 'Houve um erro ao buscar a postagem');
        res.redirect('/postagem/listar');
    }
});

module.exports = router;