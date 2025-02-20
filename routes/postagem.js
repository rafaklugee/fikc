const express = require('express');
const router = express.Router();
const Postagem = require('../models/Postagem');

// Rota para listar todas as postagens
router.get('/', async (req, res) => {
    try {
        const postagens = await Postagem.findAll();
        const postagensPlain = postagens.map(postagem => postagem.toJSON());
        console.log(postagensPlain); // Adicione esta linha
        res.render('postagem/postagens', { postagens: postagensPlain });
    } catch (err) {
        console.error('Erro ao buscar postagens:', err);
        req.flash('error_msg', 'Houve um erro ao listar as postagens');
        res.redirect('/');
    }
});

// Rota para exibir o formulário de adição de uma nova postagem
router.get('/add', (req, res) => {
    res.render('postagem/addpostagem');
});

// Rota para adicionar uma nova postagem
router.post('/nova', async (req, res) => {
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
            res.redirect('/postagem');
        } catch (err) {
            console.error('Erro ao criar postagem:', err);
            req.flash('error_msg', 'Houve um erro ao criar a postagem');
            res.redirect('/postagem');
        }
    }
});

// Rota para deletar uma postagem
router.get('/deletar/:id', async (req, res) => {
    console.log('Parametros recebidos (id): ',req.params.id);
    try {
        await Postagem.destroy({ where: { id: req.params.id } });
        req.flash("success_msg", "Postagem deletada com sucesso!");
        res.redirect('/postagem');
    } catch (err) {
        console.error('Erro ao deletar postagem:', err);
        req.flash("error_msg", "Houve um erro interno");
        res.redirect('/postagem');
    }
});

// Rota para exibir o formulário de edição de uma postagem
router.get('/edit/:id', async (req, res) => {
    console.log('Parametros recebidos (id): ',req.params.id);
    try {
        const postagem = await Postagem.findOne({ where: { id: req.params.id } });
        if (postagem) {
            res.render('postagem/editpostagem', { postagem: postagem.toJSON() });
        } else {
            req.flash('error_msg', 'Postagem não encontrada');
            res.redirect('/postagem');
        }
    } catch (err) {
        console.error('Erro ao buscar postagem:', err);
        req.flash('error_msg', 'Houve um erro ao buscar a postagem');
        res.redirect('/postagem');
    }
});

// Rota para exibir na edição a postagem
router.post('/postagem/edit', (req,res) => {

    Postagem.findOne({_id: req.body.id}).then((postagem) => {

        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso");
            res.redirect('/postagem');
        }).catch((err) => {
            req.flash("error_msg", "Erro interno");
            res.redirect('/postagem');
        })


    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar a edição");
        console.log(err);
        res.redirect('/postagem');
    })
})

// Rota para exibir uma postagem específica
router.get('/:slug', async (req, res) => {
    try {
        console.log('Parametros recebidos (slug): ',req.params.id);
        const postagem = await Postagem.findOne({ where: { slug: req.params.slug } });
        if (postagem) {
            res.render('postagem/index', { postagem });
        } else {
            req.flash('error_msg', 'Postagem não encontrada');
            res.redirect('/postagem');
        }
    } catch (err) {
        console.error('Erro ao buscar postagem:', err);
        req.flash('error_msg', 'Houve um erro ao buscar a postagem');
        res.redirect('/postagem');
    }
});

module.exports = router;