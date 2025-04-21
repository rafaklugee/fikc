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
    const { eAdmin } = require('./helpers/eAdmin')
    const postagemRoutes = require('./routes/adminPosts')
    const blogRoutes = require('./routes/blog')
    const uploadRoutes = require('./routes/adminUpload')
    const clientFilesRoutes = require('./routes/clientFiles')
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
    app.use("/uploads", express.static("uploads"));
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

app.get('/admin', eAdmin, (req, res) => {
    res.render('admin');
});

app.get('/politica-de-privacidade', (req, res) => {
    res.render('politica-de-privacidade');
});

app.get('/termos-de-uso', (req, res) => {
    res.render('termos-de-uso');
});

app.get('/cliente-unico/:client_id', (req, res) => {
    //usuarios.handle(req, res);
    const client_id = req.params.client_id;
    res.render('cliente-unico', { client_id });
});

app.use('/admin', uploadRoutes);

app.use('/usuarios', usuarios);

app.use('/postagem', postagemRoutes);

app.use ('/blog', blogRoutes);

app.use('/cliente-unico', clientFilesRoutes);

// Outros
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}!`);
})
