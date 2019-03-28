"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var path = require("path");
var app = express();
//将访问的路径修改为根目录下的client下的index.html
app.use('/', express.static(path.join(__dirname, '..', 'client')));
var Product = /** @class */ (function () {
    function Product(id, title, price, rating, desc, categories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Product;
}());
exports.Product = Product;
var products = [
    new Product(1, "第一个商品", 2.6, 3.5, "这是第一个商品，这也是我的练习", ["蔬菜", "水果", "牛奶"]),
    new Product(2, "第二个商品", 22.22, 3.4, "这是第二个商品，这也是我的练习", ["蔬菜", "水果", "牛奶"]),
    new Product(3, "第三个商品", 33.33, 2.5, "这是第三个商品，这也是我的练习", ["蔬菜", "水果", "牛奶"]),
    new Product(4, "第四个商品", 3.9, 4.5, "这是第四个商品，这也是我的练习", ["蔬菜", "水果", "牛奶"]),
    new Product(5, "第五个商品", 11, 2.5, "这是第五个商品，这也是我的练习", ["蔬菜", "水果", "牛奶"]),
    new Product(6, "第六个商品", 12.6, 3.5, "这是第六个商品，这也是我的练习", ["蔬菜", "水果", "牛奶"]),
];
var Comment = /** @class */ (function () {
    function Comment(id, productId, timestamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
var comments = [
    new Comment(1, 2, '2000-09-09', '大宝', 2.4, '还不错还不错1'),
    new Comment(2, 1, '2000-09-09', '大宝', 3.4, '还不错还不错1'),
    new Comment(3, 1, '2000-09-09', '大宝', 4.6, '还不错还不错1'),
    new Comment(4, 2, '2000-09-09', '大宝', 3, '还不错还不错1'),
    new Comment(5, 3, '2000-09-09', '大宝', 3.6, '还不错还不错1'),
];
app.get('/api/products', function (req, res) {
    var result = products;
    var params = req.query;
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    if (params.price && result.length > 0) {
        result = result.filter(function (p) { return p.price <= Number(params.price); });
    }
    if (params.category && params.category !== '-1' && result.length > 0) {
        result = result.filter(function (p) { return p.categories.indexOf(params.category) !== -1; });
    }
    console.log(result);
    res.json(result);
});
app.get('/api/test', function (req, res) {
    var params = req.query;
    res.json(products);
});
app.get('/api/products/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get('/api/products/:id/comments', function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log('服务器已启动，地址是:http://localhost:8000');
});
//webSockt服务
var subscriptions = new Map();
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on('connection', function (websocket) {
    console.log('服务器已启动，地址是:http://localhost:8085');
    websocket.on('message', function (message) {
        // if (typeof message === "string") {
        var messageObj = JSON.parse(message);
        var productIds = subscriptions.get(websocket) || [];
        subscriptions.set(websocket, productIds.concat([messageObj.productId]));
        // }
    });
});
//生成新的报价
var currentBids = new Map();
var time = setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });
    subscriptions.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pId) { return ({
                productId: pId,
                bid: currentBids.get(pId)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
// setInterval(()=>{
//     clearInterval(time)
// },10000)
