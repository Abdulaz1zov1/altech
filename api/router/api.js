const {Router} = require('express')
const router = Router()
const Product = require('../modeles/product')
const Subcategory = require('../modeles/subcategory')
const Category = require('../modeles/category')
const Brend = require('../modeles/brend')
const Atribut = require('../modeles/atribut')
const Spending = require('../modeles/spending')
const Debtor = require('../modeles/debtor')
const Viktorina = require('../modeles/viktorina')
const auth = require('../middleware/auth')

const upload = require('../middleware/file')

// product

const kirlot = (text) => {
    let lat = {'a':'а','q':'қ','s':'с','d':'д','e':'е','r':'р','f':'ф','t':'т','g':'г','y':'й','h':'ҳ','u':'у','j':'ж','i':'и','k':'к','o':'о','l':'л','p':'п','z':'з','x':'х','s':'с','v':'в','b':'б','n':'н','m':'м','ch':'ч',' ':' '}
    let kir = {'а':'a','қ':'q','с':'s','д':'d','е':'e','р':'r','ф':'f','т':'t','г':'g','й':'y','ҳ':'h','у':'u','ж':'j','и':'i','к':'k','о':'o','л':'l','п':'p','з':'z','х':'x','с':'s','в':'v','б':'b','н':'n','м':'m','ш':'sh','ч':'ch', ' ':' '}
    let res = ''
    text = text.toLowerCase().split('')
    let letterCount = 0
    while (letterCount < text.length) {
        if (text[letterCount]+text[letterCount+1]=='sh') {
            res+='ш'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=='ch') {
            res+='ч'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=='yo') {
            res+='ё'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=='ya') {
            res+='я'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=="o'") {
            res+='ў'
            letterCount+=2
            continue
        }
        if (text[letterCount]+text[letterCount+1]=="g'") {
            res+='ғ'
            letterCount+=2
            continue
        }
        if (lat[text[letterCount]]) {
            res+=lat[text[letterCount]]
        }
        if (kir[text[letterCount]]) {
            res+=kir[text[letterCount]]
        }
        letterCount++
    }

    return res
}
router.get('/product/search/:title',async(req,res)=>{
    const title = req.params.title
    if (title.length>0) {
        let othertitle = kirlot(title)
        let products = await Product
            .find({
                    $or: [
                        {
                            'title': {
                                $regex: new RegExp( title.toLowerCase(), 'i')
                            }
                        },
                        {
                            'title': {
                                $regex: new RegExp( othertitle.toLowerCase(), 'i')
                            }
                        }
                    ]
                }
            ).where({status:1}).sort({_id:-1}).limit(10).lean()
        if (products.length>0){
            products = products.map(ad => {
                ad.img = ad.photos[0]
                ad.price = +ad.price
                ad.price = ad.price.toLocaleString('ru-RU')
                return ad
            })
            res.send(products)
        } else {
            res.send([])
        }
    } else {
        res.send('error')
    }
})

router.get('/product/api/search/',async (req,res)=>{
    let {title,subcategory} = req.query

    title = title || ''
    let products = []
    let pageSize = 20

    if (subcategory){
        products = await Product.find({'subcategory': subcategory})
            .select('title photos status price subcategory brend')
            .populate('subcategory').populate('brend').lean()
        
    } else if (subcategory  && title){
        products = await Product.find({
            $and: [
                {'title': {$regex: new RegExp( title.toLowerCase(), 'i')}},
                {'subcategory': subcategory},
            ]
        }).populate('subcategory').populate('brend').lean()
    } else{
        products = await Product.find(
            {'title': {$regex: new RegExp( title.toLowerCase(), 'i')}},
        ).limit(pageSize).sort({_id:-1}).populate('subcategory').populate('brend').lean()
    }

    if (products){
        products = products.map(product => {
            product.img = product.photos[0]
            product.status = product.status == 0
                ? '<span class="badge bg-danger">Нет</span>' :
                product.status == 1
                    ? '<span class="badge bg-success">Есть</span>' : '<span class="badge bg-primary">Деактив</span>'
            return product
        })
    }

    res.send(products)


})

router.post('/product/ids',async(req,res)=>{
    let {favs} = req.body
    // console.log(favs)
    if (favs.length>0){
        let ads = await Product.find({status:1}).populate(['subcategory','brend']).lean()
        if (ads){
            res.send(ads)
        } else {
            res.send('error')
        }
    } else {
        res.send('error')
    }
})

router.post('/product/need',async(req,res)=>{
    let {favs} = req.body
    // console.log(favs)
    if (favs.length>0){
        let ads = await Product.find({_id: {$in: favs}}).populate(['subcategory','brend']).lean()
        if (ads){
            res.send(ads)
        } else {
            res.send('error')
        }
    } else {
        res.send('error')
    }
})

router.get('/product/last',async(req,res)=>{
    let products = await Product.find({status:1}).populate(['subcategory','brend']).limit(10).sort({_id:-1}).lean()
    if (products) {
        products = products.map(product => {
            product.img = product.photos[0]
            product.status = product.status == 0
                ? '<span class="badge bg-danger">Нет</span>' :
                product.status == 1
                    ? '<span class="badge bg-success">Есть</span>' : '<span class="badge bg-primary">Нет в наличие</span>'
            return product
        })
    }
    res.send(products)
})

router.get('/product/all',async(req,res)=>{
    const products = await Product.find().where({'status':1}).lean()
    res.send(products)
})

router.get('/product/api/random',async(req,res)=>{
    let products = await Product.aggregate([{$sample: {size: 10}}])
    if (products){
        res.send(products)
    }
})

router.get('/brand/random',async(req,res)=>{
    let brand = await Brend.aggregate([{$sample: {size: 6}}])
    if (brand){
        res.send(brand)
    }
})

router.get('/product/api/allproduct',async(req,res)=>{
    let pageSize = 20
    let products = await Product.find().limit(pageSize).sort({_id:-1}).populate('subcategory').populate('brend').lean()
    products = products.map(product => {
        product.img = product.photos[0]
        product.status = product.status == 0
            ? '<span class="badge bg-danger">Нет</span>' :
            product.status == 1
                ? '<span class="badge bg-success">Есть</span>' : '<span class="badge bg-primary">Нет в наличие</span>'
        return product
    })
    res.send(products)
})


// function for sort atribut
function sortAtribut( a, b ) {
    if ( a.atr.order < b.atr.order ){
        return -1;
    }
    if ( a.atr.order > b.atr.order ){
        return 1;
    }
    return 0;
}

router.get('/product/sale',async (req,res)=>{
    let product = await Product.find({sale:1}).select(['title','photos','subcategory','price','descriptions']).sort({_id:1}).lean()
    if (product){
        product = product.map(item => {
            item.img = item.photos[0]
            return item
        })
        res.send(product)
    } else {
        res.send([])
    }
})

router.get('/product/view/:id',async(req,res)=>{
    const _id = req.params.id || ''
    if (_id) {
        let product = await Product.findOne({_id}).populate(['subcategory','brend','atribut.atr']).lean()
        if (product.atribut){
            product.atribut.sort(sortAtribut)
        }

        if (product.atribut.length>0){
            product.atribut = product.atribut.filter(atr => {
                if (atr.spec) return atr
            })
        }

        let others = []
        if (product){
            others = await Product.find({status:1})
                .where({_id: {$ne:_id}})
                .where('subcategory')
                .select(['title','photos','subcategory','price','descriptions'])
                .populate(['subcategory','brend'])
                .equals(product.subcategory)
                .limit(5)
                .lean()
            others = others.map(other => {
                other.img = other.photos[0]
                return other
            })
        }
        res.send({product,others})
    }
})

router.get('/product/edit/:id',async(req,res)=>{
    const _id = req.params.id
    if (_id){
        let product = await Product.findOne({_id}).populate('atribut.atr').lean()
        res.send(product)
    }
})

router.get('/product/api/bycat/:id',async(req,res)=>{
    const _id = req.params.id
    let products = await Product.find({subcategory:_id,status:1}).limit(4).sort({_id:-1}).lean()
    products = products.map(product=>{
        product.img = product.photos[0]
        return product
    })
    res.send(products)
})
router.get('/product/api/bycats/:id',async(req,res)=>{
    const _id = req.params.id
    let products = await Product.find({subcategory:_id,status:1}).select(['title','price','photos','brend','sale']).populate(['subcategory','brend']).sort({_id:-1}).lean()
    products = products.map(product=>{
        product.img = product.photos[0]
        return product
    })
    res.send(products)
})
router.get('/product/api/:id',async(req,res)=>{
    const _id = req.params.id
    const product = []
    if (_id){
        product = await Product.findOne({_id}).lean()
    }
    res.send(product)
})



// subcategory


router.get('/subcategory/all',async(req,res)=>{
    const subcategories = await Subcategory.find().where({'status':1}).lean()
    
    res.send(subcategories)
})

router.get('/subcategory/api/allsubcategory',async(req,res)=>{
    let subcategory = await Subcategory.find()
    res.send(subcategory)
})

router.get('/subcategory/api/forhome/:num',async(req,res)=>{

    let page = +req.params.num  || 0

    let categories = await Subcategory.find().skip(page).limit(2).lean()
    let data = []
    if (categories){
    categories = await Promise.all(categories.map(async category=>{
        let products = await Product.find({subcategory:category._id,$in: {status: [1,2]}}).sort({_id:-1}).select(['title','photos','price','descriptions','status']).limit(6).lean()
        products = products.map(product=>{
            product.img = product.photos[0]
            return product
        })
        category.products = products

        return category
    }))


    res.send(categories)

    } else {
        res.send('nomore')
    }
})

router.get('/subcategory/api/:id',async(req,res)=>{
    const _id = req.params.id
    if (_id){

    const subcategory = await Subcategory.findOne({_id}).lean()
    res.send(subcategory)
    } else {
        res.send({})
    }

})


// brand


router.get('/brend/api/bysub/:id',async(req,res)=>{
    if (req.params.id){
        let products = await Product.find({subcategory:req.params.id}).select('brend').populate('brend')
        let list = []
        products.forEach(product => {
            let index = list.findIndex(item => product.brend._id == item._id)
            // console.log(product,index)
            if (index == -1) {
                list.push(product.brend)
            }
        })

        res.send(list)

    }
})

router.get('/brend/api/allbrend',async(req,res)=>{
    let brend = await Brend.find()
    res.send(brend)
})

router.get('/brend/api/:id',async(req,res)=>{
    const _id = req.params.id
    const brend = await Brend.findOne({_id}).lean()
    res.send(brend)
})

router.get('/brend/get/:id',async(req,res)=>{
    let _id = req.params.id
    let products = await Product.find({brend:_id}).lean()
    let brend = await Brend.findOne({_id}).lean()

    products = products.map(product => {
        product.img = product.photos[0]
        return product
    })
    brend.products = products
    res.send(brend)
})

// atribut

router.get('/atribut/api/search/',async (req,res)=>{
    let {subcategory} = req.query
    let atributs = []
    if (subcategory){
        atributs = await Atribut.find({
            $and: [
                {'subcategory': subcategory},
            ]
        }).sort({order:1}).populate('subcategory').lean()
    } else {
        atributs = await Atribut.find().sort({order:1}).populate('subcategory').lean()
    }

    atributs = atributs.map(atribut => {
        atribut.status = atribut.status == 0 ? '<span class="badge bg-danger">Отключенный</span>' : '<span class="badge bg-success">Активный</span>'
        return atribut
    })

    res.send(atributs)


})

router.get('/atribut/all',async(req,res)=>{
    const atributs = await Atribut.find().where({'status':1}).lean()
    res.send(atributs)
})

router.get('/atribut/api/allatribut',async(req,res)=>{
    let atribut = await Atribut.find().sort({_id:-1}).populate('subcategory').lean()
    atribut = atribut.map(atr => {
        atr.status = atr.status == 0 ? '<span class="badge bg-danger">Отключенный</span>' : '<span class="badge bg-success">Активный</span>'
        return atr
    })
    res.send(atribut)
})


router.get('/atribut/allatribut/:id',auth,async(req,res)=>{
    const _id = req.params.id 
    const atribut = await Atribut.find({subcategory: _id}).sort({order:1}).lean()
    res.send(atribut)
})


router.get('/atribut/api/:id',async(req,res)=>{
    const _id = req.params.id
    const atribut = await Atribut.findOne({_id}).lean()
    res.send(atribut)
})



// category

// router.get('/category/all',async(req,res)=>{
//     const categories = await Category.find().where({'status':1}).lean()
//     res.send(categories)
// })

router.get('/category/api/allcategory',async(req,res)=>{
    let category = await Category.find().where({status:1})
    if (category){
        res.send(category)
    } else {
        res.send([])
    }
})


router.get('/category/get/:id',async(req,res)=>{
    if (req.params){
        const _id = req.params.id

        const category = await Category.findOne({_id}).lean()
        if (category){
            let subcategories = await Subcategory.find({category:category._id,status:1}).where({'status':1}).lean()
            if (subcategories) {
                subcategories = await Promise.all(
                    subcategories.map(async subcat => {
                        let products = await Product.find({subcategory:subcat._id,status:1}).select(['title','price','photos','brend','sale']).populate(['subcategory','brend']).where({'status':1}).lean()
                        subcat.products = products
                        return subcat
                    })
                )

                category.subcategory = subcategories
                res.send(category)
            }
        }
    } else {
        res.send('error')
    }
})



router.get('/category/api/:id',async(req,res)=>{
    const _id = req.params.id
    const category = await Category.findOne({_id}).lean()
    res.send(category)
})


//spending

router.get('/spending/:id',async(req,res)=>{
    const _id = req.params.id
    const spending = await Spending.findOne({_id}).lean()

    res.send(spending)
})


//debtor

router.get('/debtor/:id',async(req,res)=>{
    const _id = req.params.id
    const debtor = await Debtor.findOne({_id}).lean()

    res.send(debtor)
})


//viktorina

router.get('/viktorina/last',async(req,res)=>{

    const viktorina = await Viktorina.findOne().sort({_id:-1}).where({'status':1}).limit(1).lean()

    res.send(viktorina)
})

router.get('/viktorina/static/:chartId',async(req,res)=>{
    const _id = req.params.chartId
    const viktorina = await Viktorina.findOne({_id}).lean()
    
    res.send(viktorina.players)
})

router.get('/viktorina/:id',async(req,res)=>{
    const _id = req.params.id
    const viktorina = await Viktorina.findOne({_id}).lean()

    res.send(viktorina)
})

router.get('/viktorina/check/:id/:phone',async(req,res)=> {
    const _id = req.params.id
    const phone = req.params.phone
    const viktorina = await Viktorina.findOne({_id}).lean()
    let fIndex = viktorina.players.findIndex((player) => player.phone === phone )
    if (fIndex!==-1){
        res.send("ok")
    } else {
        res.send("bad")
    }
})

router.post('/viktorina/:id',async(req,res)=>{
    let _id = req.params.id
    let viktorina = await Viktorina.findOne({_id}).lean()
    let {name, phone, region, account } = req.body
    
    let player = {
        name: name,
        phone: phone,
        region: region,
        account: account
    }

    viktorina.players.push(player)
    await Viktorina.findByIdAndUpdate(_id,viktorina)
    res.send('ok')
})



//HEADER

router.get('/header', async(req,res)=> {

    let category = await Category.find().where({'status':1}).lean()

    category = await Promise.all(
        category.map(async cat => {
            let subcategories = await Subcategory.find({category:cat._id}).populate('category').where({'status':1}).lean()
            cat.subcategories = subcategories
            return cat
        })
    )
    res.send(category)
})


//FOOTER

router.get('/footer', async(req,res)=> {
    const subcategories = await Subcategory.find().limit(10).sort({_id:-1}).where({'status':1}).lean()
    const categories = await Category.find().limit(5).sort({_id:-1}).where({'status':1}).lean()
    const brends = await Brend.find().limit(10).sort({_id:-1}).where({'status':1}).lean()

    const footer = {
        subcategory: {
            title: 'Компьютерные аксессуары', subcategories
        },
        category: {
            title: 'Категории', categories
        },

        brend: {
            title:'Бренды', brends
        }
    }
    res.send(footer)
})

router.get('/footer/brend/:id', async(req,res)=> {
    const _id = req.params.id
    let products = await Product.find({brend:_id}).select(['title','photos','price','descriptions']).sort({_id:-1}).lean()
    res.send(products)
})

router.get('/brend/showproducts/:id', async(req,res)=> {
    const _id = req.params.id
    let products = await Product.find({brend:_id}).select(['title','photos','price','descriptions']).limit(6).sort({_id:-1}).lean()
    res.send(products)
})

module.exports = router