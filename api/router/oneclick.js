const {Router} = require('express')
const bcrypt = require('bcryptjs')
const auth  = require('../middleware/auth')
const router = Router()
const csrf = require('csurf')
const Oneclick = require('../modeles/oneclick')
const csrfProtection = csrf({ cookie: true })


router.get('/',auth,async(req,res)=>{
    let carts = await Oneclick.find().populate('product').sort({_id:-1}).lean()
    carts = carts.map(cart => {
        cart.status = cart.status == 0
            ? '<span class="badge bg-primary">рассматривается</span>' :
            cart.status == 1
                ? '<span class="badge bg-success">принято</span>' : '<span class="badge bg-danger">отказано</span>'
        cart.createdAt = cart.createdAt.toLocaleString('en-GB')

        return cart
    })
    res.render('oneclick',{
        title: 'Список заказов ONECLICK',
        isOneclick:true,
        carts,
        error: req.flash('error'),
        success: req.flash('success')
    })
})



router.post('/',async(req,res)=>{
    try {
        let {phone, product} = req.body
        status =  0
        const cart = await new Oneclick({phone, status, product, createdAt: Date.now()})
        await cart.save()
        res.send('ok')

    } catch (error) {
        console.log(error)
    }
})

router.get('/get/:id',auth,async(req,res)=>{
    if (req.params.id){
        let _id = req.params.id
        let oneclick = await Oneclick.findOne({_id}).lean()
        if (oneclick){
            res.send(oneclick)
        } else {
            res.send(JSON.stringify('not exists'))
        }
    } else {
        res.send(JSON.stringify('error'))
    }

})

router.post('/save',auth,async(req,res)=>{
    let {name, address,phone, status} = req.body
    let _id = req.body._id
    status = status || 0
    const cart = {name, address,phone, status}
    await Oneclick.findByIdAndUpdate({_id},cart)
    res.redirect('/oneclick')
})

router.get('/delete/:id',auth,async (req,res)=>{
    let _id = req.params.id
    await Oneclick.findByIdAndDelete({_id})
    res.redirect('/oneclick')
})

// router.get('/more',async(req,res)=>{
//     // let _id = req.params.id
//     // let cart = await Cart.findOne({_id}).populate('product.id').lean()
//
//     // cart.status = cart.status == 0
//     //     ? '<span class="badge bg-primary">рассматривается</span>' :
//     //         product.status == 1
//     //             ? '<span class="badge bg-success">принято</span>' : '<span class="badge bg-danger">w</span>'
//
//     res.render('cart/more',{
//         title: `mdcc`,
//         isCart:true,
//
//         error: req.flash('error'),
//         success: req.flash('success')
//     })
// })


module.exports = router