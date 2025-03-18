require('dotenv').config()
const express = require('express')
const paypal =  require('./services/paypal')
const app = express()

// app.set('view engine', 'ejs')

app.get('/', (req, res) =>{
    res.render('index.ejs')
})

app.post('/pay', async (req, res)=>{
    try {
        const url = await paypal.createOrder()

        res.redirect(url)

    } catch (error) {
        res.send('Error: ' + error)
    }
})

app.get('/complete-order', async (req, res) =>{
    try {
        const capture = await paypal.capturePayment(req.query.token)
        console.log(capture)
        res.send("Purchased Order Completed")
    } catch (error) {
        res.send('Error: ' + error)
    }
})

app.get('/cancel-order', (req, res) =>{
    res.redirect("/")
})

app.listen(5173, () =>{
    console.log('Server started on port 5173')
})