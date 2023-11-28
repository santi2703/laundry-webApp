if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();

const path = require('path')
const methodOverride = require('method-override')

const mongoose = require('mongoose')
const Product = require('./models/products')

const ejsMate = require('ejs-mate') // boilerplate

const multer = require('multer')  // save files 
const { storage } = require('./cloudinary/index')
// const upload = multer({ dest: 'uploads/' }); //local
const upload = multer({ storage });



const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/laundry';

// 'mongodb://127.0.0.1:27017/laundry' local store



mongoose.connect(dbUrl, {

})
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.log('OH NOO mongo connection error');
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
    try {
        const products = await Product.find({});
        res.render('products/products', { products })

    } catch (err) {
        next(err)
    }

})


app.get('/products/new', (req, res) => {

    res.render('products/new')
})

app.post('/products', upload.single('image'), async (req, res, next) => {
    try {
        // console.log( req.body, req.file)
        const newitem = new Product(req.body.item)
        newitem.image = req.file.path
        console.log(req.file)
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
    try {
        const { id } = req.params;
        const item = await Product.findById(id)
        res.render('products/edit', { item })

    } catch (err) {
        next(err)
    }

})

app.put('/products/:id', upload.single('image'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await Product.findByIdAndUpdate(id, { ...req.body.item })
        if(req.file) {
            item.image = req.file.path
            await item.save();
        } else {res.redirect(`/products/${item._id}`)}
    

    } catch (err) {
        next(err)
        console.log(err)
    }
})
app.delete('/products/:id/edit', async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Product.findById(id)
        await Product.findByIdAndDelete(id)
        res.redirect('/products/')

    } catch (err) {
        next(err)
    }

})


app.all('*', (req, res, next) => {
    res.render('error')
})


app.use((err, req, res, next) => {
    res.render('error')
})




app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port 3000');
})