const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Category = require('../modeles/category')
const Subcategory = require('../modeles/subcategory')
const Product = require('../modeles/product')
router.get('/',auth,async(req,res)=>{
    let category = await Category.find().lean()
    let subcategory = await Subcategory.find().populate('category').lean()
    subcategory = subcategory.map((subcat, index) => {
        subcat.status = subcat.status == 0 ? '<span class="badge bg-danger">Отключенный</span>' : '<span class="badge bg-success">Активный</span>'
        subcat.index = index + 1
        return subcat
    })
    res.render('subcategory/index',{
        category,
        subcategory,
        isSubcategory:true,
        title: 'Список субкатегории',
        error: req.flash('error'),
        success: req.flash('success')
    })
})

router.get('/delete/:id',auth,async(req,res)=>{
    const _id = req.params.id
    await Subcategory.findByIdAndDelete({_id})
    req.flash('success','Субкатегория удалено!')
    res.redirect('/subcategory')
})

router.get('/:id',async(req,res)=>{
    const _id = req.params.id
    let subcategory = await Subcategory.findOne({_id}).lean()
    res.send(subcategory)
})

router.post('/',auth,async(req,res)=>{
    try {
        let {title,order,category,status} = req.body
        status = status || 0
        const subcategory = await new Subcategory({title,order,category,status})
        await subcategory.save()
        req.flash('success','Субкатегория добавлено!')
        res.redirect('/subcategory/')
    } catch (error) {
        console.log(error)
    }
})

router.post('/save',auth,async(req,res)=>{
    let {title,order,category,status} = req.body
    let _id = req.body._id
    status = status || 0
    let subcategory = {title,order,category,status}
    await Subcategory.findByIdAndUpdate({_id},subcategory)
    req.flash('success','Категория обновлено!')
    res.redirect('/subcategory/')
})






module.exports = router