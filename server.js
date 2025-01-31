require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { Client } = require("pg");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do middleware de sessões
app.use(session({
  secret: 'admin',  // Defina um segredo único para sua aplicação
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Para desenvolvimento local, use secure: false
}));

// Rota de login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Verifica se o usuário e a senha estão corretos
  if (username === "admin" && password === "admin") {
      // Salva a sessão indicando que o usuário está logado
      req.session.isAuthenticated = true;
      console.log("Sessão iniciada", req.session);
      return res.json({ message: "Login bem-sucedido!" });
  }

  res.status(401).json({ error: "Credenciais inválidas!" });
});

// Middleware para proteger a página "cliente.html"
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
      return next();  // Deixa a requisição continuar
  }
  res.status(403).json({ error: "Você precisa estar logado para acessar esta página." });
}

// Rota para acessar "cliente.html" (proteção por sessão)
app.get("/cliente.html", isAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/cliente.html");
});

// Rota para logout
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).json({ error: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout bem-sucedido!" });
  });
});

// Configuração do Multer para salvar arquivos em "public/uploads"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Gera um nome único para a imagem
  }
});

const upload = multer({ storage: storage });

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

// Rota para criar posts com imagens
app.post("/api/posts", upload.single("image"), async (req, res) => {
  const { title, content, author } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await db.query("INSERT INTO posts (title, content, author, image_url, created_at) VALUES ($1, $2, $3, $4, NOW())", 
      [title, content, author, image_url]);
    
    res.json({ message: "Post criado com sucesso!", image_url });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar post" });
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

// Serve arquivos estáticos (incluindo imagens na pasta 'uploads/')
app.use(express.static("public"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
