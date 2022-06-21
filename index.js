const app = require("express")();
const express = require("express");
const falsisdb = require("falsisdb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JsonDatabase } = require("wio.db");

const db = new JsonDatabase({
  databasePath: "./database.json"
});
const checkEmail = (email) => {
  return db.get("users").filter((x) => x.email == email).length > 0
    ? false
    : true;
};

const checkUsername = (username) => {
  return db.get("users").filter((x) => x.username == username).length > 0
    ? false
    : true;
};
const checkPassword = (password) => {
  return db.get("users").filter((x) => x.password == password).length > 0
    ? false
    : true;
};
const getKey = () => {
  const letters = "ABCDEFGHIJKLMNOPRSTUVYZabcdefghijklmnoprstuvyz1234567890";
  let res = "";
  for (var i = 0; i < 15; i++) {
    res += letters[Math.floor(Math.random() * letters.length)];
  }
  return res;
};
app.use(cookieParser())
app.use(session({
  secret:"Blablbaalkaak",
  resave:false,
  saveUninitialized:true
  }))

app.get("/script", (req, res) => {
  res.sendFile(__dirname + "/styles/script.js");
});
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.set("views", __dirname + "/views");

app.get("/admin", (req, res) => {
  res.render("admin", { db: db });
});

app.post("/admin", (req, res) => {
  const key = Object.entries(req.body)[0][0];
  const data = db.get("messages").filter((x) => x.key != key);
  db.set("messages", data);
  res.render("admin", { db: db });
});

app.get("/admin-css", (req, res) => {
  res.sendFile(__dirname + "/styles/admin-style.css");
});
app.get("/", (req, res) => {
  res.render("index");
  /*db.push("users", {
    email:"berat@gmail.com",
    password:"1234"
  })*/
  //console.log(checkEmail("berat@gmail.com"))
});

app.post("/", (req, res) => {
  db.push("messages", { message: req.body.letterMessage, key: getKey() });
  res.render("index");
});
/*"messages":[{"message":"deneme"}, {"message":"deniyom"}, {"message":"Xjwksjwkdmeksmskwlxmmwkkskskw\n\n\n\n\n\n\n\nxjeoxskzmsksm\n\n\n\n\nsnwosmwksmsmwkss\n"},{"message":"xd"},{"message":"xd"},{"message":"xd"},{"message":"xd"}]*/

/*this.DatabaseError("_").*/
app.get("/login", (req, res) => {
  res.render("login.ejs", { pass: true });
});
app.get("/login-css", (req, res) => {
  res.sendFile(__dirname + "/styles/login-style.css");
});

app.get("/signup-css", (req, res) => {
  res.sendFile(__dirname + "/styles/signup-style.css");
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up", { pass: true });
});

app.post("/sign-up", (req, res) => {
  if (!checkEmail(req.body.email) || !checkPassword(req.body.password)) {
    res.render("sign-up", { pass: false });
  } else if (!checkUsername(req.body.username)) {
    res.render("sign-up", { pass: "Username error" });
  } else {
    db.push("users", {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    res.redirect("/");
  }
});
app.get("/css", (req, res) => {
  res.sendFile(__dirname + "/styles/style.css");
});

app.post("/login", (req, res) => {
  if (!checkEmail(req.body.email) || !checkPassword(req.body.password)) {
    res.redirect("/");
  } else {
    res.render("login", { pass: false });
  }
});

app.get("/kayit", (req,res) => {
  res.render("deneme")
  //req.headers.a = "deneme"
  console.log(req.headers)
})

app.post("/kayit", (req,res) => {
  const hash = require("crypto").createHash("md5").update(req.body.password).digest("hex")
  const token = jwt.sign({
    email:req.body.email,
    password:req.body.password,
  }, secret,{expiresIn:10})
  //res.cookie("token",token,{maxAge:5000})
  //res.setHeader("Authorization:",String(` Bearer ${token}`),{maxAge:5,httpOnly:true})
  console.log(token)
  console.log(req.headers)
  res.status(200).send({
    message:"OK",
    token:token
  })
  /*setInterval(() => {
    console.log(req.headers)
  },6000)*/
})

app.get("/log", (req,res) => {
  res.render("log")
})

app.post("/log",(req,res) => {
  /*JWT is send with request header! 
        Format of it: Authorization : Bearer <token>
        */
  /*try {
        
        /*const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        req.userData = decodedToken;
        console.log("başarılı: "+token+"\n\n"+decodedToken)
        console.log(req.headers)
        next();
    }catch(error) {
      console.log(error)
        return res.status(401).send({
            message: 'Auth failed'
        });
    }*/
})

app.get("/deneme1", (req,res) => {
  res.render("deneme1")
})

app.get("/deneme2", (req,res) => {
  res.render("deneme2")
})

app.get("/deneme3", (req,res) => {
  res.render("deneme3")
})

app.listen(3001, () => {
  console.log("Server listening!");
});

/*fun.fact*/

/*
const endpoint = `/admin/delete/${del.dataset.doc}`
  console.log(endpoint)
  fetch(endpoint, {
    method:"DELETE"
  })
  .then((response) => response.json())
  .then(data => window.location.href = data.link)
  .catch(err => console.log(err))

*/

/*del.addEventListener("click", (e) => {
  console.log(del)
})*/

/*
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" charset="utf-8"></script>
*/
