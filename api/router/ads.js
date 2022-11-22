const {Router} = require('express')
const router = Router()
const Ads = require('../modeles/ads')
const auth = require('../middleware/auth')
const Category = require('../modeles/realisator')
router.get('/',auth,async(req,res)=>{
    // const ads = await Ads.find().lean()
    res.render('ads/index',{
        title: 'Создание нового обявление',
        error: req.flash('error'),
        success: req.flash('success')
    })
})
router.get('/create',auth,async(req,res)=>{
    // const ads = await Ads.find().lean()
    const category = await Category.find().lean()
    res.render('ads/create',{
        title: 'Создание нового обявление',
        category,
        error: req.flash('error'),
        success: req.flash('success')
    })
})

router.get('/:id',async(req,res)=>{
    const _id = req.params.id
    let ads = await Ads.findOne({_id}).populate('userId').lean()
    res.render('ads/view',{
        title: `Обявление: ${ads.title} | ${ads.price}`,
        ads
    })
})

router.post('/',auth,async(req,res)=>{
    try {
        let {categoryId,place,type,title,state,seller,stock,price,currency,sale,text,userId} = req.body
        if (sale == undefined) sale = 0
        // if (isnew == undefined) isnew = 1
        let img = 'no-image'
        if (req.file){
            img = req.file.path // !
        }
        
        const ads = await new Ads({categoryId,place,type,title,state,seller,stock,price,currency,sale,text,img,userId})
        await ads.save()
        res.redirect('/profile/')
    } catch (error) {
        console.log(error)
    }
})

router.post('/save',auth,async(req,res)=>{
    let {title,price,slug,sale,categoryId,detail,warranty,custom,adjust,care,status,isnew,colors,slider} = req.body
    let _id = req.body._id
    if (status == undefined) status = 1
    if (isnew == undefined) isnew = 1
    if (isnew == undefined) isnew = 0
    let product = {title,price,slug,sale,categoryId,detail,warranty,custom,adjust,care,status,isnew,colors,slider}
    
    if (req.file){
        const img = req.file.path
        product.img = img 
    }
    await Product.findByIdAndUpdate({_id},product)
    res.redirect('/product/show/'+_id)
})

module.exports = router