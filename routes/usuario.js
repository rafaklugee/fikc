const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const client = require('../config/db');
const passport = require('passport');

router.get('/registro', (req, res) => {
    res.render('usuarios/registro');
})

router.get('/login', (req, res) => {
    res.render('usuarios/login');
})

// Rota para cadastro de usuário
router.post('/registro', async (req, res) => {
    var erros = [];

    if (!req.body.nome || req.body.nome.trim() === '') {
        erros.push({ texto: "Nome inválido" });
    }

    if (!req.body.email || req.body.email.trim() === '') {
        erros.push({ texto: "E-mail inválido" });
    }

    if (!req.body.senha || req.body.senha.length < 4) {
        erros.push({ texto: "Senha muito curta" });
    }

    if (req.body.senha !== req.body.senha2) {
        erros.push({ texto: "As senhas são diferentes, tente novamente!" });
    }

    if (erros.length > 0) {
        return res.render('usuarios/registro', { erros: erros });
    }

    try {
        // Verifica se o e-mail já existe no banco de dados
        const { rows } = await client.query('SELECT * FROM usuarios WHERE email = $1', [req.body.email]);

        if (rows.length > 0) {
            req.flash("error_msg", "Já existe uma conta com este e-mail no nosso sistema");
            return res.redirect('/usuarios/registro');
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.senha, salt);

        // Inserir usuário no banco de dados
        await client.query(
            'INSERT INTO usuarios (nome, email, senha, eAdmin) VALUES ($1, $2, $3, $4)',
            [req.body.nome, req.body.email, hash, 0]
        );

        console.log("Usuário criado com sucesso!");
        req.flash("success_msg", "Usuário criado com sucesso!");
        res.redirect('/');

    } catch (err) {
        console.error("Erro no banco de dados:", err);
        req.flash("error_msg", "Houve um erro interno, tente novamente!");
        res.redirect('/usuarios/registro');
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/usuarios/login',
    failureFlash: true
}))

module.exports = router;