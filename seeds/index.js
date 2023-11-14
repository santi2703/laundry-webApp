
const mongoose = require('mongoose')
const Product = require('../models/products')

mongoose.connect('mongodb://127.0.0.1:27017/laundry')
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.log('Error');
        console.log(err);
    })


const testing = [
    {
        name: 'Pantalon',
        price: '8.000',
        size: 'Unidad',
        time: '24h'
    },
    {
        name: 'Camiseta',
        price: '8.000',
        unidad: 'Unidad',
        time: '24h'
    },
    {
        name: 'Camisa',
        price: '9.000',
        size: 'Unidad',
        time: ' 24h'
    },
    {
        name: 'Vestido',
        price: '10.000',
        size: 'Metro cuadrado',
        time: ' 48h'
    }
]
const star = async () => {
    await Product.deleteMany({})
   const produts = await Product.insertMany(testing)
   console.log(produts)
}

star();