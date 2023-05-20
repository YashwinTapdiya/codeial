const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//used for session cookie and authentication passport
const session = require('express-session');
const passport =require('passport');
const passportLocal = require('./config/passport-local-strategy');
//const MongoStore = require('connect-mongo')(session);
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    mongooseConnection: db,
    uri: 'mongodb://127.0.0.1:27017/InstaBook-data',
    collection: 'mySessions',
    autoRemove: 'disabled'
  });
  // Catch errors
store.on('error', function(error) {
    console.log(error);
  });
  

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assests'));
app.use(expressLayouts);

//extract style and scripts from sub pages into the layout
app.set('layout extractStyles' , true);
app.set('layout extractScripts' , true);


//set up the view engine
app.set('view engine' , 'ejs');
app.set('views' , './views');

app.use(require('express-session')({
    secret: 'This is a secret',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//use express router
app.use('/' , require('./routes'));

app.listen(port , function(err){
    if(err){
        //console.log('Error' , err);
        //interpolation method
        console.log(`Error in running the server : ${err}`)
    }
    console.log(`Server is running on port : ${port}`);
})