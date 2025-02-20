const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const client = require('../config/db');
const passport = require('passport');
const { ensureAuthenticated, ensureCorrectClient } = require('../helpers/auth-client');

router.get('/registro', (req, res) => {
    res.render('usuarios/registro');
});

router.get('/login', (req, res) => {
    res.render('usuarios/login');
});

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
            'INSERT INTO usuarios (nome, email, senha, eAdmin, client_id) VALUES ($1, $2, $3, $4, uuid_generate_v4())',
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

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/usuarios/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            if (user.eadmin == 1) {
                return res.redirect('/cliente');
            } else {
                return res.redirect(`/cliente-unico/${user.client_id}`);
            }
        });
    })(req, res, next);
});

// Rota para a área do cliente
router.get('/cliente-unico/:client_id', ensureAuthenticated, ensureCorrectClient, async (req, res) => {
    try {
        const { rows } = await client.query('SELECT nome FROM usuarios WHERE client_id = $1', [req.params.client_id]);
        if (rows.length > 0) {
            const nome = rows[0].nome;
            res.render('cliente-unico', { nome });
        } else {
            req.flash('error_msg', 'Cliente não encontrado.');
            res.redirect('/');
        }
    } catch (err) {
        console.error('Erro ao buscar cliente:', err);
        req.flash('error_msg', 'Erro interno, tente novamente.');
        res.redirect('/');
    }
});

module.exports = router;