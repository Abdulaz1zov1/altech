const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Brend = require('../modeles/brend')
const upload = require('../middleware/file')
const Product = require('../modeles/product')

router.get('/',auth,async(req,res)=>{
    let brend = await Brend.find().sort({_id:-1}).lean()
    brend = brend.map((br, index) => {
        br.status = br.status == 0 ? '<span class="badge bg-danger">Отключенный</span>' : '<span class="badge bg-success">Активный</span>'
        br.top = br.top == 1 ?  '<span class="badge bg-success">Активный</span>' : '<span class="badge bg-danger">Отключенный</span>'
        br.home = br.home == 1 ?  '<span class="badge bg-success">Активный</span>' : '<span class="badge bg-danger">Отключенный</span>'
        br.index = index + 1
        return br
    })
    res.render('brend/index',{
        brend,
        isBrend:true,
        title: 'Список бренды',
        error: req.flash('error'),
        success: req.flash('success')
    })
})

router.get('/delete/:id',auth,async(req,res)=>{
    const _id = req.params.id
    await Brend.findByIdAndDelete({_id})
    req.flash('success','Бренд удалено!')
    res.redirect('/brend')
})

router.get('/getone/:id',async(req,res)=>{
    const _id = req.params.id
    let brend = await Brend.findOne({_id}).lean()
    res.send(brend)
})

router.get('/forhome',async (req,res)=>{
    let brends = await Brend.find({home:1}).lean()
    brends = await Promise.all(brends.map(async (brend)=> {
        brend.products = await Product.find({brend:brend._id}).count()
        return brend
    }))
    res.send(brends)
})

router.post('/',upload.fields([{name:'img',maxCount:1}]),auth,async(req,res)=>{
    try {
        let {title,order,status,home,top} = req.body
        status = status || 0
        top = top || 0
        home = home || 0
        let newbrend = {title,order,status,home,top}
        if (req.files){
            let fileinfo = req.files
            if (fileinfo.img) {
                newbrend.img = fileinfo.img[0]['path']
            }
        }
        const brend = await new Brend(newbrend)
        await brend.save()
        req.flash('success', 'Бренд добавлено!')
        res.redirect('/brend/')
    } catch (error) {
        console.log(error)
    }
})

router.post('/save',upload.fields([{name:'img',maxCount:1}]),auth,async(req,res)=>{
    let {title,order,status,home,top} = req.body
    let _id = req.body._id
    status = status || 0
    top = top || 0
    home = home || 0
    let brend = {title,order,status,home,top}
    if (req.files){
        let fileinfo = req.files
        if (fileinfo.img) {
            brend.img = fileinfo.img[0]['path']
        }
    }
    await Brend.findByIdAndUpdate({_id},brend)
    req.flash('success','Бренд обновлено!')
    res.redirect('/brend/')
})


// API

// router.get('/all',async(req,res)=>{
//     const brends = await Brend.find().where({'status':1}).lean()
//     res.send(brends)
// })

// router.get('/api/allbrend',async(req,res)=>{
//     let brend = await Brend.find()
//     res.send(brend)
// })

// router.get('/api/:id',async(req,res)=>{
//     const _id = req.params.id
//     const brend = await Brend.findOne({_id}).lean()
//     res.send(brend)
// })



module.exports = router