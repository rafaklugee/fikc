const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { client } = require('../config/db');
const passport = require('passport');
const { ensureAuthenticated, ensureCorrectClient } = require('../config/auth-client');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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
            [req.body.nome, req.body.email, hash, 1]
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
                return res.redirect('/admin');
            } else {
                return res.redirect(`/cliente-unico/${user.client_id}`);
            }
        });
    })(req, res, next);
});

// Rota para a área do cliente
router.get('/cliente-unico/:client_id', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM usuarios WHERE client_id = $1::uuid', [req.params.client_id]);
        
        if (result.rows.length > 0) {
            // Renderiza a área do cliente com os dados disponíveis
            res.render('cliente-unico', { cliente: result.rows[0] });
        } else {
            req.flash('error_msg', 'Cliente não encontrado');
            res.redirect('/');
        }
    } catch (err) {
        console.error('Erro ao buscar cliente:', err);
        req.flash('error_msg', 'Houve um erro ao buscar o cliente');
        res.redirect('/');
    }
});


// Rota para listar arquivos de um cliente
router.get("/arquivos/:client_id", async (req, res) => {
    try {
        const { client_id } = req.params;
        const { data_inicio, data_fim } = req.query;

        let query = "SELECT * FROM arquivos WHERE client_id = $1";
        let params = [client_id];

        if (data_inicio && data_fim) {
            query += " AND data_upload BETWEEN $2 AND $3";
            params.push(data_inicio, data_fim);
        }

        const result = await client.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error("Erro ao buscar arquivos:", err);
        res.status(500).send("Erro ao buscar arquivos.");
    }
});

router.get('/cliente-unico/:client_id/arquivos', ensureAuthenticated, async (req, res) => {
    try {
        const { client_id } = req.params;

        // Busca os arquivos associados ao cliente
        const result = await client.query(
            'SELECT id, nome, caminho, data_upload FROM arquivos WHERE client_id = $1 ORDER BY data_upload DESC',
            [client_id]
        );

        res.json(result.rows); // Retorna os arquivos como JSON
    } catch (err) {
        console.error('Erro ao buscar arquivos:', err);
        res.status(500).send('Erro ao buscar arquivos.');
    }
});

router.post("/cliente/upload", ensureAuthenticated, upload.single("arquivo"), async (req, res) => {
    try {
        const client_id = req.user.client_id; // Obtém o client_id do usuário autenticado
        const nome = req.file.filename;
        const caminho = `/uploads/${nome}`;

        await client.query(
            "INSERT INTO arquivos (client_id, nome, caminho) VALUES ($1, $2, $3)",
            [client_id, nome, caminho]
        );

        req.flash('success_msg', 'Arquivo enviado com sucesso!');
        res.redirect(`/cliente-unico/${client_id}`);
    } catch (err) {
        console.error("Erro no upload:", err);
        req.flash('error_msg', 'Erro ao enviar o arquivo.');
        res.redirect(`/cliente-unico/${req.user.client_id}`);
    }
});

module.exports = router;