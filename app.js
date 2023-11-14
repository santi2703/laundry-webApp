const express = require('express');
const app = express();

const path = require('path')
const methodOverride = require('method-override')

const mongoose = require('mongoose')
const Product = require('./models/products')

const ejsMate = require('ejs-mate')



mongoose.connect('mongodb://127.0.0.1:27017/laundry')
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.log('Error');
        console.log(err);
    })


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.use(express.urlencoded({ extended: true })) // form
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, '/public')))

app.engine('ejs', ejsMate)


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('products/products', { products })

})


app.get('/products/new', (req, res) => {

    res.render('products/new')
})

app.post('/products', async (req, res, next) => {
    try {
        const newitem = new Product(req.body.item)
        await newitem.save()
        res.redirect(`/products/${newitem._id}`)

    } catch (err) {
        next(err)
    }
})



app.get('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await Product.findById(id)
        res.render('products/show', { item })
    } catch (err) {
        next(err)
    }
})

app.get('/products/:id/edit', async (req, res) => {

    const { id } = req.params;
    const item = await Product.findById(id)
    res.render('products/edit', { item })


})
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const item = await Product.findByIdAndUpdate(id, { ...req.body.item })
    res.redirect(`/products/${item._id}`)

})
app.delete('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id)
    res.redirect('/products/')

})


app.all('*', (req, res, next) => {
    res.render('error')
})


app.use((err, req, res, next) => {
    res.render('error')
})





app.listen(3000, () => {
    console.log('listening on port 3000');
})