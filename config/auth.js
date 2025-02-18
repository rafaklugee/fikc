const localStrategy = require('passport-local').Strategy
const client = require('../config/db')
const bcrypt = require('bcryptjs')

module.exports = function(passport) {

    passport.use(new localStrategy({usernameField: 'email', passwordField:'senha'}, async (email, senha, done) => {
        try {
            const { rows } = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
            const usuario = rows[0];

            if (!usuario) {
                return done(null, false, { message: "Esta conta não existe" });
            }

            const isMatch = await bcrypt.compare(senha, usuario.senha);

            if (isMatch) {
                return done(null, usuario);
            } else {
                return done(null, false, { message: "Senha incorreta" });
            }
        } catch (err) {
            console.error(err);
            return done(err);
        }
    }));

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const { rows } = await client.query('SELECT * FROM usuarios WHERE id = $1', [id]);
            const usuario = rows[0];

            if (!usuario) {
                return done(null, false, { message: 'Erro interno' });
            }

            done(null, usuario);
        } catch (err) {
            console.error(err);
            done(err, false);
        }
    });
}