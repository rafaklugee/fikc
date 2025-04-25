const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { eAdmin } = require('../helpers/eAdmin');
const { client } = require('../config/db');

// Configuração do Multer para salvar arquivos na pasta 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Crie essa pasta na raiz do projeto
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Middleware para verificar se o usuário é administrador
router.use(eAdmin);

// Rota para renderizar a página de upload
router.get('/upload', async (req, res) => {
    try {
        const { filterClienteId } = req.query;

        const { rows: usuarios } = await client.query('SELECT id, nome FROM usuarios');

        let arquivosQuery = `SELECT id, nome_original, caminho FROM arquivos`;
        const queryParams = [];

        if (filterClienteId) {
            arquivosQuery += ` WHERE client_id = (SELECT client_id FROM usuarios WHERE id = $1)`;
            queryParams.push(filterClienteId);
        }

        const { rows: arquivos } = await client.query(arquivosQuery, queryParams);

        res.render('upload', { usuarios, arquivos, filterClienteId });
    } catch (err) {
        console.error("Erro ao buscar usuários ou arquivos:", err);
        req.flash("error_msg", "Erro ao carregar a página de upload.");
        res.redirect('/admin');
    }
});

// Rota para lidar com o upload de múltiplos arquivos
router.post('/upload', upload.array('arquivos', 10), async (req, res) => {
    const { clienteId } = req.body;

    if (!clienteId) {
        req.flash("error_msg", "Selecione um cliente.");
        return res.redirect('/admin/upload');
    }

    if (!req.files || req.files.length === 0) {
        req.flash("error_msg", "Nenhum arquivo foi enviado.");
        return res.redirect('/admin/upload');
    }

    try {
        // Obter o client_id (UUID) correspondente ao clienteId (integer)
        const { rows } = await client.query(
            `SELECT client_id FROM usuarios WHERE id = $1`,
            [clienteId]
        );

        if (rows.length === 0) {
            req.flash("error_msg", "Cliente não encontrado.");
            return res.redirect('/admin/upload');
        }

        const clientIdUUID = rows[0].client_id;

        // Salvar informações de cada arquivo no banco de dados
        for (const file of req.files) {
            await client.query(
                `INSERT INTO arquivos (client_id, caminho, nome_original, data_upload) 
                 VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
                [clientIdUUID, file.path, file.originalname]
            );
        }

        req.flash("success_msg", "Arquivos enviados com sucesso!");
        res.redirect('/admin/upload');
    } catch (err) {
        console.error("Erro ao salvar arquivos no banco de dados:", err);
        req.flash("error_msg", "Erro ao salvar os arquivos.");
        res.redirect('/admin/upload');
    }
});

router.post('/delete', async (req, res) => {
    const { arquivoId } = req.body;

    if (!arquivoId) {
        req.flash("error_msg", "Arquivo não encontrado.");
        return res.redirect('/admin/upload');
    }

    try {
        // Obter o caminho do arquivo antes de deletar
        const { rows } = await client.query(
            `SELECT caminho FROM arquivos WHERE id = $1`,
            [arquivoId]
        );

        if (rows.length === 0) {
            req.flash("error_msg", "Arquivo não encontrado.");
            return res.redirect('/admin/upload');
        }

        const filePath = rows[0].caminho;

        // Remover o arquivo do banco de dados
        await client.query(`DELETE FROM arquivos WHERE id = $1`, [arquivoId]);

        // Remover o arquivo do sistema de arquivos
        const fs = require('fs');
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Erro ao deletar o arquivo do sistema:", err);
            }
        });

        req.flash("success_msg", "Arquivo removido com sucesso!");
        res.redirect('/admin/upload');
    } catch (err) {
        console.error("Erro ao remover arquivo:", err);
        req.flash("error_msg", "Erro ao remover o arquivo.");
        res.redirect('/admin/upload');
    }
});

module.exports = router;