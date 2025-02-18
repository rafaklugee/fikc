const client = require('../config/db');

// Criando a tabela (se não existir)
client.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        eAdmin INTEGER DEFAULT 0,
        senha VARCHAR(255) NOT NULL
    );
`, (err, res) => {
    if (err) console.error(err);
    else console.log('Banco de dados verificado!');
});

module.exports = client;