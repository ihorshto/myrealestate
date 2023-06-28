const { WebSocketServer, WebSocket } = require("ws");

const fs = require('fs');
const express = require("express");
const app = express();
const eta = require("eta");
const bodyParser = require('body-parser');
const dayjs = require('dayjs')
const mysql = require('mysql2/promise');
const cors = require('cors')
const uuid = require('uuid')

app.engine("eta", eta.renderFile);
eta.configure({ views: "./views", cache: false });
app.set("views", "./views");
app.set("view cache", false);
app.set("view engine", "eta");
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(cors());

let connection;
async function initMySQL() {
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'myrealestate2'
    });
}

// websocket
let ws_server = new WebSocketServer({ port: 8001 });
ws_server.on("connection", (ws) => {
    console.log("new client connected");
    // ws.send({ action: "newmessage", text: "Hello" });

    ws.on("message", data => {
        console.log(`le client a envoyé :`, data)
    });
    ws.on("close", () => {
        console.log("le client s'est déconnecté");
    });
    ws.onerror = function (err) {

        console.log("Une erreur est survenue", err);
    }
});

app.get("/", function (req, res) {
    res.redirect("/list");
});
app.get("/list", async function (req, res) {
    res.render("list.eta", { products: await loadProducts("1=1") });
});
app.get("/details/:id", async function (req, res) {
    res.render("details.eta", { product: await loadProduct(req.params.id) });
});


async function checkUser(req, res, next) {
    let token = req.headers?.authorization?.split(" ")[1];
    if (!token) return res.status(403).send("unauthorized");
    let [user] = await connection.query(`SELECT * FROM clients where token like ?`, [token]);
    if (user.length == 0 || user[0].length == 0) return res.status(403).send("unauthorized");
    next();
}

async function loadProduct(id) {
    console.log('id', id)
    let product = await connection.query(`SELECT * FROM bien_immo
    WHERE id=?`, [id]);
    console.log("product loqdProduct", product)
    if (product[0].length == 0) return null;

    let p = product[0][0];
    console.log("product", product);
    p.hasImg = fs.existsSync(`./assets/products/${p.id}.jpg`);
    return p;
}

async function addProduct(product) {
    let [inserted] = await connection.query(
        `INSERT INTO bien_immo (name, description, price, image, type_immo, id_client) VALUES (?, ?, ?, ?, ?, ?)`,
        [product.name, product.description, product.price, product.image, product.type_immo, product.id_client]
    );
    return inserted.insertId;
}

async function updateProduct(id, product) {
    await connection.query(`UPDATE bien_immo SET name=?, description=?, price=?, type_immo=?, id_client=? WHERE id=?`, [product.name, product.description, product.price, product.type_immo, product.id_client, id]);
    return id;
}

async function removeProduct(id) {
    connection.query(`DELETE FROM bien_immo WHERE id=?`, [id]);
}

async function loadProducts(where = "1=1", whereData = [], orderBy = "name") {
    let products = await connection.query(`SELECT t1.*, t2.name AS typeName, t3.name AS clientName 
    FROM bien_immo t1 
    LEFT JOIN type_immo t2 ON t1.type_immo = t2.id 
    LEFT JOIN clients t3 ON t1.id_client = t3.id 
    where ${where} 
    order by ${orderBy}`,
        whereData);
    products[0].map(p => {
        p.hasImg = fs.existsSync(`./assets/products/${p.id}.jpg`);
        return p;
    });
    return products[0];
}


async function loadProductsTypes(where = "1=1", whereData = [], orderBy = "name") {
    let productstypes = await connection.query(`SELECT * FROM type_immo`,
        whereData);
    return productstypes[0];
}

app.get("/office/products", checkUser, async function (req, res) {
    let where = "1=1", whereData = [];
    if (req.query.typeimmo) {
        where += " && t1.type_immo = ? ";
        whereData.push(req.query.typeimmo);
    }
    let products = await loadProducts(where, whereData);
    res.send({ data: products });
});

app.get("/office/productstypes", checkUser, async function (req, res) {
    let where = "1=1", whereData = [];
    let productstypes = await loadProductsTypes(where, whereData);
    res.send({ data: productstypes });
});

app.get("/office/products/:id", checkUser, async function (req, res) {
    console.log('on est ici', req.params.id)
    if (req.params.id == "0") {
        return res.send({ data: { id: 0, name: "", description: "", price: 0, type_immo: "", id_client: 0 } })
    }

    console.log('on est ici', req.params.id)

    let product = await loadProduct(req.params.id);
    console.log('product office', product)

    if (!product) return res.send({ error: "product not found" })
    res.send({ data: product })
});

function saveImage(req, id) {
    if (!req.body.image) return;
    let base64Image = req.body.image.split(';base64,').pop();
    let filename = `./assets/products/${id}.jpg`;
    fs.writeFileSync(filename, base64Image, 'base64');
}
app.post("/office/products", checkUser, async function (req, res) {
    let id = await addProduct(req.body)
    let product = await loadProduct(id)
    saveImage(req, id);
    res.send({ data: product })
});

app.put("/office/products/:id", checkUser, async function (req, res) {
    let product = await loadProduct(req.params.id);
    if (!product) return res.send({ error: "product not found" });
    console.log("req.body", req.body);
    await updateProduct(req.params.id, req.body);
    product = await loadProduct(req.params.id);
    saveImage(req, product.id);
    res.send({ data: product })
});

app.delete("/office/products/:id", checkUser, async function (req, res) {
    let product = await loadProduct(req.params.id)
    if (!product) return res.send({ error: "product not found" })
    await removeProduct(req.params.id)
    res.send({ data: product })
});


async function loadUser(id) {
    let user = await connection.query(`SELECT * FROM clients where id=?`, [id]);
    if (user[0].length == 0) return null;
    return user[0][0];
}
async function addUser(user) {
    let token = uuid.v4();
    let [inserted] = await connection.query(
        `INSERT INTO clients (name, email, password, token) VALUES (?, ?, PASSWORD(?), ?)`,
        [user.name, user.email, user.password, token]
    );
    return inserted.insertId;
}
async function updateUser(id, user) {
    let sql = `UPDATE clients SET name=?, email=?`;
    let sqlData = [user.name, user.email]
    if (user.password) {
        sql = ", password=PASSWORD(?)";
        sqlData.push(user.password)
    }
    sql += " WHERE id=?"
    sqlData.push(id)
    await connection.query(sql, sqlData);
    return id;
}
async function removeUser(id) {
    connection.query(`DELETE FROM clients WHERE id=?`, [id]);
}
async function loadUsers(where = "1=1", orderBy = "name") {
    let users = await connection.query(`SELECT * FROM clients where ${where} order by ${orderBy}`);
    return users[0];
}
app.get("/office/users", checkUser, async function (req, res) {
    let users = await loadUsers();
    res.send({ data: users });
});
app.get("/office/users/:id", checkUser, async function (req, res) {
    if (req.params.id == "0") {
        return res.send({ data: { id: 0, name: "", description: "", price: 0 } })
    }
    let user = await loadUser(req.params.id);
    if (!user) return res.send({ error: "user not found" })
    // delete user.password;
    user.password = "";
    res.send({ data: user })
});
app.post("/office/users", checkUser, async function (req, res) {
    let id = await addUser(req.body)
    let user = await loadUser(id)
    res.send({ data: user })
});
app.put("/office/users/:id", checkUser, async function (req, res) {
    let user = await loadUser(req.params.id)
    if (!user) return res.send({ error: "user not found" })
    await updateUser(req.params.id, req.body)
    user = await loadUser(req.params.id)
    res.send({ data: user })
});
app.delete("/office/users/:id", checkUser, async function (req, res) {
    let user = await loadUser(req.params.id)
    if (!user) return res.send({ error: "user not found" })
    await removeUser(req.params.id)
    res.send({ data: user })
});

app.post("/office/login", async function (req, res) {
    let user = await connection.query(`SELECT * FROM clients where email=? and password=PASSWORD(?)`, [req.body.login, req.body.password]);
    if (user[0].length == 0) return res.send({ error: "invalid login/password" });
    res.send({ data: user[0][0] });
});

app.listen(8000, async function () {
    console.log("listening on port 8000");
    await initMySQL();
});

