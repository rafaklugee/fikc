require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Client } = require("pg"); // Ou Firebase se preferir

const app = express();
app.use(express.json());
app.use(cors()); // Permite chamadas do frontend

// Conectar ao banco de dados PostgreSQL
const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
db.connect();

// Rota para pegar todos os posts
app.get("/posts", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM posts ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

// Rota para criar um novo post (somente admins)
app.post("/posts", async (req, res) => {
  const { title, content, author } = req.body;
  try {
    await db.query("INSERT INTO posts (title, content, author, created_at) VALUES ($1, $2, $3, NOW())", [title, content, author]);
    res.json({ message: "Post criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar post" });
  }
});

// Serve a página index.html na raiz
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Serve arquivos estáticos
app.use(express.static('public'));  // Isso irá servir os arquivos que estão em public/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
