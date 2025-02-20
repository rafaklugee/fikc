const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.js'); // Certifique-se de ajustar o caminho para o seu arquivo de configuração do banco de dados

const Postagem = sequelize.define('Postagem', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    conteudo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'postagens',
    timestamps: false
});

// Sincronizar o modelo com o banco de dados
Postagem.sync()
    .then(() => console.log('Tabela postagens criada/verificada com sucesso!'))
    .catch(err => console.error('Erro ao criar/verificar tabela postagens:', err));

module.exports = Postagem;