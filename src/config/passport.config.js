const passport = require("passport");
const local = require("passport-local");

//Me traigo el UserModel y las funciones de bcrypt.
const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");

const initializePassport = () => {
  //ESTRATEGIA LOCAL
  const LocalStrategy = local.Strategy;
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        //Le decis que queres acceder al objeto request
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          //Verificamos si ya existe un registro con ese mail
          let user = await UserModel.findOne({ email: email });
          if (user) return done(null, false);
          //Si no existe, voy a crear un registro nuevo:
          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          let result = await UserModel.create(newUser);
          //Si todo resulta bien, podemos mandar done con el usuario generado.
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Agregamos otra estrategia, ahora para el "login":
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          //Primero verifico si existe un usuario con ese email:
          const user = await UserModel.findOne({ email });
          if (!user) {
            console.log("Este usuario no existeeeeeee ahhh");
            return done(null, false);
          }
          //Si existe, verifico la contraseña:
          if (!isValidPassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });

  //ESTRATEGIA LOGIN CON GITHUB
  const GitHubStrategy = require("passport-github2");
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        //Para ver como llega el perfil del usuario:
        console.log(profile);
        try {
          let user = await UserModel.findOne({ email: profile._json.email });
          //si no encuentro ningun usuario lo creo
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 20,
              email: profile._json.email,
              password: "",
            };
            //Una vez que tengo nuevo usuario, lo guardo en mongoDB
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //ESTRATEGIA CON FACEBOK

  const FacebookStrategy = require("passport-facebook");
  const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
  const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/facebook/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await UserModel.findOne({
          accountId: profile.id,
          provider: "Facebook",
        });
        if (!user) {
          console.log("Agregando un nuevo usuario a la BD");
          const newUser = new UserModel({
            first_name: profile.displayName,
            accountId: profile.id,
            provider: "Facebook",
          });
          await newUser.save();
          return done(null, profile);
        } else {
          console.log("El usuario ya existe");
          return done(null, profile);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, done);
  });

  passport.deserializeUser((user, done) => {
    done(null.user);
  });
};

module.exports = initializePassport;
