const express = require('express');
const router = express.Router();
const { client } = require('../config/db');

router.get('/:client_id/relatorios', async (req, res) => {
    const client_id = req.params.client_id;

    // Obtém os filtros do query string
    const { nome, data_inicio, data_fim } = req.query;

    // Validação: ambas as datas devem ser fornecidas
    if ((data_inicio && !data_fim) || (!data_inicio && data_fim)) {
        req.flash('error_msg', 'Por favor, preencha as duas datas para filtrar.');
        return res.redirect(`/cliente-unico/${client_id}/relatorios`);
    }

    try {
        // Base da query SQL
        let query = `
            SELECT id, caminho, nome_original, data_upload
            FROM arquivos 
            WHERE client_id = $1
        `;
        const queryParams = [client_id];

        // Adiciona filtros dinamicamente
        if (nome) {
            queryParams.push(`%${nome}%`);
            query += ` AND nome_original ILIKE $${queryParams.length}`;
        }
        if (data_inicio && data_fim) {
            queryParams.push(data_inicio);
            query += ` AND data_upload >= $${queryParams.length}`;
            queryParams.push(data_fim);
            query += ` AND data_upload <= $${queryParams.length}`;
        }

        // Ordena os resultados por data de upload
        query += ` ORDER BY data_upload DESC`;

        // Executa a query
        const { rows: arquivos } = await client.query(query, queryParams);

        // Renderiza o template completo
        res.render('relatorios', { arquivos, client_id });
    } catch (err) {
        console.error("Erro ao buscar arquivos do cliente:", err);
        req.flash("error_msg", "Erro ao carregar os relatórios.");
        res.redirect(`/cliente-unico/${client_id}`);
    }
});

module.exports = router;
