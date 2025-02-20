// Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    const passport = require('passport')
    const usuarios = require('./routes/usuario')
    const {eAdmin} = require('./helpers/eAdmin')
    const postagemRoutes = require('./routes/admin')
    const Postagem = require('./models/Postagem')
    require('./helpers/handlebars')
    require('./config/auth')(passport)

// Configurações
    // Sessão
    app.use(session({
        secret: "fikc",
        resave: true,
        saveUninitialized: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
            next()
        });
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // HandleBars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // Public
    app.use(express.static(path.join(__dirname,'public')))

// Rotas
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/cliente', eAdmin, (req, res) => {
    res.render('cliente');
});

app.get('/politica-de-privacidade', (req, res) => {
    res.render('politica-de-privacidade');
});

app.get('/termos-de-uso', (req, res) => {
    res.render('termos-de-uso');
});

app.get('/cliente-unico/:client_id', (req, res) => {
    res.render('cliente-unico');
});

// Rota para exibir a página do blog
app.get('/blog', async (req, res) => {
    try {
        const postagens = await Postagem.findAll();
        const postagensPlain = postagens.map(postagem => postagem.toJSON());
        res.render('blog', { postagens: postagensPlain });
    } catch (err) {
        console.error('Erro ao buscar postagens:', err);
        req.flash('error_msg', 'Houve um erro ao listar as postagens');
        res.redirect('/');
    }
});

app.use('/usuarios', usuarios);

app.use('/postagem', postagemRoutes);

// Outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log("Servidor rodando!");
})
