import express from "express";
import http from "node:http";

import fs from "node:fs";
import path from "node:path";

const assets = {
    'devotee.ttf': 'fonts/devotee/Devotee-Plus.ttf',
};

Object.entries(assets).forEach(async ([dest, src]) => {
    fs.copyFile(src, path.resolve('./public/lib', dest));
});

const app = express();
app.use(async (req, res, next) => {
    const start = process.hrtime.bigint();
    await next();
    const time = ((process.hrtime.bigint() - start) / BigInt(1000000));
    console.log(req.method, req.path, `${time}ms`);
});
app.use("/public", express.static("public"));
app.get('/', (_, res) => {
    res.redirect('/devotee.html');
});
app.all("*", (_, res) => {
    res.status(404).sendFile('./public/404.html');
});

http.createServer(app).listen(8081);
console.log('http://localhost:8081/');
