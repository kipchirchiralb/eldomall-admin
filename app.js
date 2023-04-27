const express = require("express"); // web framework
const mysql = require("mysql");

const multer = require("multer");
const upload = multer({ dest: "public/products/" });

const conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "eldomall_db",
});

conn.query(
  "ALTER TABLE products ADD COLUMN productimage VARCHAR(255)",
  (error, m, n) => {
    console.log(error);
    console.log(m);
    console.log(n);
  }
);

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public")); // serve static files through this folder
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("middleware");
  next();
});

app.get("/", (req, res) => {
  conn.query(
    "SELECT products.name as productName,companies.name as companyName,product_id,price,quantity,productimage  FROM products INNER JOIN companies ON products.company_id = companies.id",
    (error, data) => {
      if (error) {
        // console.log(error);
        res.status(500).send("Database Error");
      } else {
        // console.log(data);
        res.render("admin-home", { products: data });
      }
    }
  );
});

app.get("/new-product", (req, res) => {
  conn.query("SELECT * FROM companies", (error, result) => {
    if (error) {
      res.status(500).send("Database Error");
    } else {
      res.render("new-product", { companies: result });
    }
  });
});

app.post("/new-product", upload.single("productimage"), (req, res) => {
  conn.query(
    "INSERT INTO products(name,description,price,quantity,company_id,productimage) VALUES(?,?,?,?,?,?)",
    [
      req.body.name,
      req.body.description,
      req.body.price,
      req.body.quantity,
      req.body.company,
      req.file.filename,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send("Server error");
      } else {
        res.send(
          "Product added succefully. Go <a href='/'>Home</a> or <a href='/new-product'>add another</a> "
        );
        // res.redirect("/")
      }
    }
  );
});

app.get("/delete/:id", (req, res) => {
  // query paramameters
  console.log(typeof req.params.id);
  conn.query(
    "DELETE FROM products WHERE product_id = ?",

    [Number(req.params.id)],

    (error, result) => {
      if (error) {
        console.log(error);
        res.send("Server Error");
      } else {
        res.redirect("/");
      }
    }
  );
});

app.get("/edit", (req, res) => {
  res.render("edit");
});
// upload -- nulter js

app.listen(3005, () => console.log("listening on port 3005"));
