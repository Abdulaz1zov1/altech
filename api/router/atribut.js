const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Atribut = require('../modeles/atribut')
const Subcategory = require('../modeles/subcategory')




router.get('/',auth,async(req,res)=>{
    let atribut = await Atribut.find().populate('subcategory').sort({_id:-1}).lean()
    let subcategory = await Subcategory.find().lean()
    atribut = atribut.map((atr, index) => {
        atr.status = atr.status == 0 ? '<span class="badge bg-danger">Отключенный</span>' : '<span class="badge bg-success">Активный</span>'
        atr.index = index + 1
        return atr
    })
    res.render('atribut/index',{
        atribut,
        subcategory,
        isAtribut:true,
        title: 'Список атрибуты',
        error: req.flash('error'),
        success: req.flash('success')
    })
})

// router.get('/delete/:id',auth,async(req,res)=>{
//     const _id = req.params.id
//     await Atribut.findByIdAndDelete({_id})
//
//
//
//
//     req.flash('success','Атрибут удалено!')
//     res.redirect('/atribut')
// })

router.get('/:id',async(req,res)=>{
    const _id = req.params.id
    let atribut = await Atribut.findOne({_id}).lean()
    res.send(atribut)
})

router.post('/',auth,async(req,res)=>{
    try {
        let {title,subcategory,order,status} = req.body
        status = status || 0
        
        const atribut = await new Atribut({title,subcategory,order,status})
        await atribut.save()
        req.flash('success', 'Атрибут добавлено!')
        res.redirect('/atribut/')
    } catch (error) {
        console.log(error)
    }
})

router.post('/save',auth,async(req,res)=>{
    let {title,subcategory,order,status} = req.body
    let _id = req.body._id
    status = status || 0
    let atribut = {title,subcategory,order,status}
    await Atribut.findByIdAndUpdate({_id},atribut)
    req.flash('success','Атрибут обновлено!')
    res.redirect('/atribut/')
})



module.exports = router