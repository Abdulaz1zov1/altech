const {Router} = require('express')
const router = Router()
const Product = require('../modeles/product')
const Subcategory = require('../modeles/subcategory')
const Category = require('../modeles/category')
const Brend = require('../modeles/brend')
const auth = require('../middleware/auth')

const upload = require('../middleware/file')
let titleQuery;
let subQuery;

router.get('/',auth,async(req,res)=>{
    let pageSize = 20
    let subcategoryId = req.query.subcategory || -1
    let title = req.query.title || ''
    titleQuery = title;
    subQuery = subcategoryId;
    const pageNumber = req.query.pageNumber || 1
    let prod = await Product.find().lean()
    let products = []
    if (subcategoryId !==-1 && title.length==0){

        products = await Product.find({subcategory:subcategoryId}).skip((pageNumber-1)*pageSize).populate('subcategory').populate('brend').sort({_id:-1}).lean()
    } else if (subcategoryId !==-1 && title.length>0) {
        products = await Product.find({
            $and: [
                {'title': {$regex: new RegExp( title.toLowerCase(), 'i')}},
                {'subcategory': subcategoryId},
            ]
        }).populate('subcategory').populate('brend').lean()
    } else {
        products = await Product.find(
            {'title': {$regex: new RegExp( title.toLowerCase(), 'i')}},
        ).limit(pageSize).sort({_id:-1}).populate('subcategory').populate('brend').lean()
    }

    // if (products) {
    //     products = await Product.find().skip((pageNumber-1)*pageSize).limit(pageSize).populate('subcategory').populate('brend').sort({_id:-1}).lean()
    // }


    let subcategory = await Subcategory.find().lean()
    const count = Math.ceil(prod.length / pageSize)

    let category = await Category.find().lean()
    let brend = await Brend.find().lean()
    let img = null
    products = products.map((product, index) => {
        product.img = product.photos[0]
        product.sale = product.sale == 1 ? '<span class="badge bg-success">Есть</span>' : '<span class="badge bg-danger">Нет</span>'
        product.status = product.status == 0
            ? '<span class="badge bg-danger">Нет</span>' :
            product.status == 1
                ? '<span class="badge bg-success">Есть</span>' : '<span class="badge bg-primary">Нет в наличие</span>'
        product.index = index + 1

        product.price = product.price.toLocaleString()
        return product
    })
    res.render('product/index',{
        // titleQuery,
        // subQuery,
        title: 'Список продуктов',
        isProducts:true,
        count,
        img,
        products,subcategory,brend,category,
        error: req.flash('error'),
        success: req.flash('success')
    })
})


router.get('/delete/:id',auth,async(req,res)=>{
    const _id = req.params.id
    await Product.findByIdAndDelete({_id})
    res.redirect('/product/')
})

router.get('/editproduct/:id',auth,async(req,res)=>{
    const _id = req.params.id
    const product = await Product.findOne({_id}).populate('brend').populate('atribut.atr').populate('subcategory').lean()
    const brend = await Brend.find().lean()
    const subcategory = await Subcategory.find().lean()
    let prodImg1;
    let prodImg2;
    let prodImg3;
    let prodImg4;
    if (product.photos[0]) {
        prodImg1 = product.photos[0]
    }
    if (product.photos[1]) {
        prodImg2 = product.photos[1]
    }
    if (product.photos[2]) {
        prodImg3 = product.photos[2]
    }
    if (product.photos[3]) {
        prodImg4 = product.photos[3]
    }

    let status = ''
    if (product.status == 0) status = 'Нет'
    if (product.status == 1) status = 'Есть'
    if (product.status == 2) status = 'Нет в наличие'

    res.render('product/edit',{
        title: `${product.title} ni tahrirlash`,
        product,
        brend,
        subcategory,
        prodImg1,prodImg2,prodImg3,prodImg4,
        status,
        isProducts:true,

    })
})


router.post('/', upload.fields(
    [
        {name:'photo1',maxCount:1},
        {name:'photo2',maxCount:2},
        {name:'photo3',maxCount:3},
        {name:'photo4',maxCount:4}
    ]),async(req,res)=>{
    try {
        let {title, subcategory,atribut, sale, price, brend, order, descriptions, status } = req.body
        sale = sale || 0
        atribut = JSON.parse(atribut)
        let photos = []
        if (req.files){
            let fileinfo = req.files
            if (fileinfo.photo1) {
                photos.push(fileinfo.photo1[0]['path'])
            }
            if (fileinfo.photo2) {
                photos.push(fileinfo.photo2[0]['path'])
            }
            if (fileinfo.photo3) {
                photos.push(fileinfo.photo3[0]['path'])
            }
            if (fileinfo.photo4) {
                photos.push(fileinfo.photo4[0]['path'])
            }
        }

        const product = await new Product({title, subcategory, order, atribut, descriptions, price, brend, photos, status, })

        product.save()
        req.flash('success','Продукт добавлено!')
        res.redirect('/product')
    } catch (error) {
        console.log(error)
    }
})

router.post('/save', upload.fields(
    [
        {name:'photo1',maxCount:1},
        {name:'photo2',maxCount:2},
        {name:'photo3',maxCount:3},
        {name:'photo4',maxCount:4}
    ]), auth,async(req,res)=>{
    let titleQuery = req.query.title || ''
    let {title, subcategory, price, sale, atribut, order, brend,descriptions, status} = req.body
    let _id = req.body._id
    sale = sale || 0
    let prod = await Product.findOne({_id}).lean()

    let photos = prod.photos
    let product = {}
    if (req.files){
        let fileinfo = req.files

        if (fileinfo.photo1) {
            photos[0] = fileinfo.photo1[0]['path']
        }
        if (fileinfo.photo2) {
            photos[1] = fileinfo.photo2[0]['path']
        }
        if (fileinfo.photo3) {
            photos[2] = fileinfo.photo3[0]['path']
        }
        if (fileinfo.photo4) {
            photos[3] = fileinfo.photo4[0]['path']
        }

    }
    atribut = JSON.parse(atribut)
    product = {title, price, atribut, sale, descriptions, subcategory,order, brend, status,photos
    }

    await Product.findByIdAndUpdate({_id},product)

    
    // if (subQuery !==-1 && titleQuery.length==0){
    //     res.redirect(`/product/?title=&subcategory=${subQuery}`)
    // }  else if (subQuery !==-1 && titleQuery.length>0) {
    //     res.redirect(`/product/?title=${titleQuery}&subcategory=${subQuery}`)
    // } else {
        res.redirect('/product')
    // }


})

router.get('/more/:id',async(req,res)=>{
    let _id = req.params.id
    let product = await Product.findOne({_id}).populate('subcategory').populate('brend').populate('atribut.atr').lean()

    product.status = product.status == 0 
        ? '<span class="badge bg-danger">Нет</span>' : 
            product.status == 1 
                ? '<span class="badge bg-success">Есть</span>' : '<span class="badge bg-primary">Деактив</span>'
    
    res.render('product/more',{
        title: `${product.title}`,
        isProducts:true,
        product, 
        error: req.flash('error'),
        success: req.flash('success')
    })
})





module.exports = router