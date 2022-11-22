const {Router} = require('express')
const bcrypt = require('bcryptjs')
const auth  = require('../middleware/auth')
const router = Router()
const csrf = require('csurf')
const Cart = require('../modeles/cart')
const csrfProtection = csrf({ cookie: true })


router.get('/',auth,async(req,res)=>{
    let carts = await Cart.find().populate('product.id').sort({_id:-1}).lean()
    carts = carts.map((cart, index) => {
        cart.status = cart.status == 0 
            ? '<span class="badge bg-primary">рассматривается</span>' : 
            cart.status == 1 
                    ? '<span class="badge bg-success">принято</span>' : '<span class="badge bg-danger">отказано</span>'
        cart.index = index + 1
        return cart
    })
    res.render('cart/index',{
        title: 'Список заказов',
        isCart:true,
        carts,
        error: req.flash('error'),
        success: req.flash('success')
    })
})



router.post('/',async(req,res)=>{
    try {
        let {name, adress,phone, product} = req.body
        status =  0
        const cart = await new Cart({name, adress,phone, status, product})

        await cart.save()
        res.send('ok')
        
    } catch (error) {
        console.log(error)
    }
})


router.post('/save',auth,async(req,res)=>{
    
        let {name, adress,phone, status, product} = req.body 
        let _id = req.body._id
        status = status || 0
        const cart = {name, adress,phone, status, product}
        await Cart.findByIdAndUpdate({_id},cart)
        res.send(cart) 
})


router.get('/doc/:id',async(req,res)=>{
    let _id = req.params.id
    let cart = await Cart.findOne({_id}).populate('product.id').lean()
    let allSumma = 0
    cart.product = cart.product.map((c,index) => {

        c.index = index + 1
        c.sum = c.id.price * c.count
        allSumma += c.sum
        c.id.price =  c.id.price.toLocaleString('fr')
        c.sum = c.sum.toLocaleString('fr')

        return c
    })
    allSumma = allSumma.toLocaleString('fr')
    // cart.status = cart.status == 0 
    //     ? '<span class="badge bg-primary">рассматривается</span>' : 
    //         product.status == 1 
    //             ? '<span class="badge bg-success">принято</span>' : '<span class="badge bg-danger">w</span>'

    res.render('cart/doc',{
        isCart:true,
        title: 'Zakaz',
        cart,allSumma
    })
})

router.get('/delete/:id',auth,async(req,res)=>{
    const _id = req.params.id
    await Cart.findByIdAndDelete({_id})
    req.flash('success','Заказ удалено!')
    res.redirect('/cart')
})


module.exports = router