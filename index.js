const express = require("express");

const app = express();

app.use(()=> {
    console.log('hello')
    console.log('hello lagi...')
    console.log('hello afs...')
})

app.listen(4000)