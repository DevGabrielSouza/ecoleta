"use strict";
exports.__esModule = true;
var express_1 = require("express");
var app = express_1["default"]();
app.get('/users', function (request, response) {
    console.log('Usuários');
    response.json({ "msg": 'Hello World!' });
});
app.listen(3333);
