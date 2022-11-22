const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Category = require('../modeles/category')
const Product = require('../modeles/product')
const upload = require('../middleware/file')
router.get('/',auth,async(req,res)=>{
    let category = await Category.find().lean()
    category = category.map((cat, index) => {
        cat.status = cat.status == 0 ? '<span class="badge bg-danger">Отключенный</span>' : '<span class="badge bg-success">Активный</span>'
        cat.index = index + 1
        return cat
    })
    res.render('category/index',{
        category,
        isCategory:true,
        title: 'Список категории',
        error: req.flash('error'),
        success: req.flash('success')
    })
})



router.post('/',upload.fields([{name:'img',maxCount:1},{name:'icon',maxCount:1}]),auth,async(req,res)=>{
    try {
        let {title,order,status} = req.body
        status = status || 0
        let category = {title,order,status}
        if (req.files){
            let fileinfo = req.files
            if (fileinfo.img) {
                category.img = fileinfo.img[0]['path']
            }
            if (fileinfo.icon) {
                category.icon = fileinfo.icon[0]['path']
            }
        }
        const newcategory = await new Category(category)
        await newcategory.save()
        req.flash('success','Категория добавлено!')
        res.redirect('/category/')
    } catch (error) {
        console.log(error)
    }
})

router.post('/save',upload.fields([{name:'img',maxCount:1},{name:'icon',maxCount:1}]),auth,async(req,res)=>{
    let {title,order,status} = req.body
    let _id = req.body._id
    status = status || 0
    let category = {title,order,status}
    if (req.files){
        let fileinfo = req.files
        if (fileinfo.img) {
            category.img = fileinfo.img[0]['path']
        }
        if (fileinfo.icon) {
            category.icon = fileinfo.icon[0]['path']
        }
    }
    await Category.findByIdAndUpdate({_id},category)
    req.flash('success','Категория обновлено!')
    res.redirect('/category/')
})


router.get('/delete/:id',auth,async(req,res)=>{
    const _id = req.params.id
    await Category.findByIdAndDelete({_id})
    req.flash('success','Категория удалено!')
    res.redirect('/category')
})

router.get('/getone/:id',async(req,res)=>{
    const _id = req.params.id
    let category = await Category.findOne({_id}).lean()
    res.send(category)
})


module.exports = router