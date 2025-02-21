const express = require('express');
const router = express.Router();
const { eAdmin } = require('../helpers/eAdmin');
const { client } = require('../config/db');

// Rota para listar todos os clientes
router.get('/edit/drive', eAdmin, async (req, res) => {
    try {
        const clients = await client.query('SELECT client_id, nome, drive_link FROM usuarios WHERE eAdmin = 0');
        res.render('drivelink', { clients: clients.rows });
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        req.flash('error_msg', 'Houve um erro ao listar os clientes');
        res.redirect('/cliente');
    }
});

// Rota para editar o link do drive de um cliente
router.post('/edit/drive/update/:client_id', eAdmin, async (req, res) => {
    const { client_id } = req.params;
    const { drive_link } = req.body;

    try {
        await client.query('UPDATE usuarios SET drive_link = $1 WHERE client_id = $2', [drive_link, client_id]);
        req.flash('success_msg', 'Link do drive atualizado com sucesso!');
        res.redirect('/admin/edit/drive');
    } catch (err) {
        console.error('Erro ao atualizar link do drive:', err);
        req.flash('error_msg', 'Houve um erro ao atualizar o link do drive.');
        res.redirect('/admin/edit/drive');
    }
});

module.exports = router;