require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const https = require("https");
const cheerio = require("cheerio");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.get('/minha-pagina', (req, res) => {
    const options = {
      hostname: 'whispering-collar-491.notion.site',
      port: 443,
      path: '/Newsletter-FIKC-189f9f7078dd80b8acf2e849f7029edb',
      method: 'GET',
      headers: {
        'User-Agent': 'Node.js'
      }
    };
  
    const proxy = https.request(options, (proxyRes) => {
      let data = '';
  
      // Coleta os dados da resposta
      proxyRes.on('data', chunk => {
        data += chunk;
      });
  
      // Quando a resposta estiver completa
      proxyRes.on('end', () => {
        // Modifica o conteúdo da página para alterar os links
        // Exemplo: Substituindo links para arquivos JS e CSS
        data = data.replace(/http:\/\/localhost:5432\//g, 'https://whispering-collar-491.notion.site/');
  
        // Envia o conteúdo modificado para o cliente
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        res.end(data);
      });
    });
  
    req.pipe(proxy, { end: true });
  });

// Conectar ao banco de dados PostgreSQL
const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});
db.connect();

// Rota para pegar todos os posts
app.get("/api/posts", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM posts ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar posts" });
    }
});

// Rota para deletar um post
app.delete("/api/posts/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await db.query("DELETE FROM posts WHERE id = $1", [id]);
        res.json({ message: "Post deletado com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar post" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));