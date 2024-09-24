let URL = "https://fakestoreapi.com/products";
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

var app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;
let products = [];

let priceDetails = {
  mrp: 0,
  dis: 50,
  shipping: 20,
  plat: 10,
  total: 0
};

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(URL);
    res.render("index.ejs", { dat: response.data, products: products, pricesDetails: priceDetails });
  } catch (error) {
    console.log("FAILED TO MAKE REQUEST:", error.message);
  }
});

app.get("/cart", async (req, res) => {
  try {
    let { title: product, price, ima: image } = req.query;
    let existingProduct = products.find(element => element.product === product);
    
    if (existingProduct) {
      existingProduct.count += 1;
    } else {
      products.push({ product, price, image, count: 1 });
    }
    priceDetails.mrp = products.reduce((acc, element) => acc + parseFloat(element.price) * element.count, 0);
    priceDetails.total = priceDetails.mrp + priceDetails.shipping + priceDetails.plat - priceDetails.dis;

    res.redirect("/");
  } catch (error) {
    console.log("FAILED TO MAKE REQUEST:", error.message);
  }
});

app.get("/add", async (req, res) => {
  try {
    let product = req.query.title;
    products.forEach(element => {
      if (element.product === product) {
        element.count += 1;
      }
    });
    priceDetails.mrp = products.reduce((acc, element) => acc + parseFloat(element.price) * element.count, 0);
    priceDetails.total = priceDetails.mrp + priceDetails.shipping + priceDetails.plat - priceDetails.dis;

    res.redirect("/");
  } catch (error) {
    console.log("FAILED TO MAKE REQUEST:", error.message);
  }
});

app.get("/del", async (req, res) => {
  try {
    let product = req.query.title;
    const newCount = parseInt(req.query.count, 10) - 1;
    
    if (newCount > 0) {
      products.forEach(element => {
        if (element.product === product) {
          element.count = newCount;
        }
      });
    } else {
      products = products.filter(element => element.product !== product);
    }
    priceDetails.mrp = products.reduce((acc, element) => acc + parseFloat(element.price) * element.count, 0);
    priceDetails.total = priceDetails.mrp + priceDetails.shipping + priceDetails.plat - priceDetails.dis;
    res.redirect("/");
  } catch (error) {
    console.log("FAILED TO MAKE REQUEST:", error.message);
  }
});

app.get("/remove", async (req, res) => {
  try {
    let product = req.query.title;
    products = products.filter(element => element.product !== product);
    priceDetails.mrp = products.reduce((acc, element) => acc + parseFloat(element.price) * element.count, 0);
    priceDetails.total = priceDetails.mrp + priceDetails.shipping + priceDetails.plat - priceDetails.dis;

    res.redirect("/");
  } catch (error) {
    console.log("FAILED TO MAKE REQUEST:", error.message);
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
