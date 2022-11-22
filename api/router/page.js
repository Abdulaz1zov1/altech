const {Router} = require('express')
const router = Router() 
const auth = require('../middleware/auth')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true }) 
const Product = require('../modeles/product')
const Brend = require('../modeles/brend')
const Category = require('../modeles/category')
const Worker = require('../modeles/worker')


router.get('/', auth,async(req,res)=>{
    const brend = await Brend.find().lean()
    const brendCount = brend.length
    const category = await Category.find().lean()
    const categoryCount = category.length
    const product = await Product.find().lean()
    const productCount = product.length
    const worker = await Worker.find().lean()
    const workerCount = worker.length
    const brendlist = await Brend.find().limit(10).sort({_id:-1}).lean()
    let productlist = await Product.find().populate('subcategory').populate('brend').limit(10).sort({_id:-1}).lean()

    productlist = productlist.map(product => {
        product.img = product.photos[0]
        product.status = product.status == 0 
            ? '<span class="badge bg-danger">Нет</span>' : 
                product.status == 1 
                    ? '<span class="badge bg-success">Есть</span>' : '<span class="badge bg-primary">Деактив</span>'
        return product
    })
    res.render('index',{
        title: 'Главная страница',
        brendCount,categoryCount,productCount,workerCount,brendlist,productlist,
        isHome:true
    })
})
router.get('/api/getcsrftoken', csrfProtection, function (req, res) {
    return res.json({ csrfToken: req.csrfToken() });
})

router.get('/search',auth,async(req,res)=>{
    const {search} = req.query
    
    const products = await Product.find().where({title: { $regex: '.*' + search.toLowerCase() + '.*' } }).select(['_id','title','price','sale','pimg']).lean()
    res.send(products)
})



router.get('/page/all',auth,async(req,res)=>{
    const page = await Page.find().lean()
    res.render('page/index',{
        title: 'Sahifalar ro`yhati',
        page,
        isPage:true,
        error: req.flash('error'),
        success: req.flash('success')
    })
})

router.get('/page/show/:id',auth,async(req,res)=>{
    const _id = req.params.id
    const page = await Page.findOne({_id}).lean()
    res.render('page/view',{
        title: `${page.title}`,
        page,
        isPage:true,
    })
})

router.get('/page/create',auth,(req,res)=>{
    res.render('page/create',{
        title: 'Yangi sahifa'
    })
})

router.get('/page/edit/:id',auth,async(req,res)=>{
    const _id = req.params.id
    const page = await Page.findOne({_id}).lean()
    res.render('page/edit',{
        page,
        isPage:true,
        error: req.flash('error'),
        success: req.flash('success'),
        title: `${page.title} ni tahrirlash`
    })
})

router.get('/page/get/:menu',async(req,res)=>{
    const menu = req.params.menu 
    const pages = await Page.find().where({'menu':menu,'status':0}).select(['_id','title','slug']).lean()
    res.send(pages)
})

router.post('/page/',auth,async(req,res)=>{
    const {title,slug,status,text,menu} = req.body
    
    if (status == undefined) status = 1
    const haveblog = await Page.findOne({slug})
    if (haveblog){
        req.flash('error','Bunday sahifa bor!')
        res.redirect('/page/all')
    } else {
        const page = await new Page({title,slug,status,menu,text})
        await page.save()
        req.flash('success','Yangi sahifani ro`yhatdan o`tkazildi')
        res.redirect('/page/all')
    }
})


router.post('/page/save',auth,async(req,res)=>{
    let {_id,title,slug,status,text} = req.body
    
    // let img = 'no-image'
    if (req.file){  
        img = req.file.path
    }
    if (status == undefined) status = 1
    const haveblog = await Page.findOne({slug,_id: {$ne:_id}})
    if (haveblog){
        req.flash('error','Bunday page bor!')
        res.redirect(`/page/edit/${_id}`)
    } else {
        const page = await Page.findByIdAndUpdate(_id,{title,slug,status,text,img})
        await page.save()
        req.flash('success','Blog muvaffaqiyatli o`zgardi')
        res.redirect('/page/all')
    }
})

router.get('/page/change/:id/:status',auth,async(req,res)=>{
    const _id = req.params.id
    let status = req.params.status
    status = (parseInt(status)==0)?1:0
    let page = await Page.findByIdAndUpdate(_id,{status})
    page.save()
    res.redirect('/page/all')
})

router.get('/order/',async(req,res)=>{
    const products =await JSON.parse(req.query.products)
    const order = await new Order({products})
    await order.save()
    res.send('OK')
})

router.get('/page/delete/:id',auth,async(req,res)=>{
    await Page.findByIdAndDelete(req.params.id)
    res.redirect('/page/all')
})


router.get('/page/:slug',async(req,res)=>{
    const slug = req.params.slug
    const page = await Page.findOne({slug}).lean()
    res.send(page)
})



module.exports = router