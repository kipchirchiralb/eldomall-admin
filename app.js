const express = require("express"); // web framework
const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "eldomall_db",
});

const app = express();
app.set("view engine", "ejs");
app.use(express.static("views/styles")); // serve static files through this folder

app.use((req, res, next) => {
  console.log("middleware");
  next();
});

app.get("/", (req, res) => {
  conn.query(
    "SELECT products.name as productName,companies.name as companyName,product_id,price,quantity  FROM products INNER JOIN companies ON products.company_id = companies.id",
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

app.post("/new-product", (req, res) => {
  // logic cb func
  res.send("Product added succefully");
});

app.listen(3005, () => console.log("listening on port 3005"));
