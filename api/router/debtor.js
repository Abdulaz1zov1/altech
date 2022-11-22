const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const superauth = require('../middleware/superauth')
const Debtor = require('../modeles/debtor')




router.get('/',superauth,async(req,res)=>{
    let debtor = await Debtor.find().sort({_id:-1}).lean()
    let summaSum = 0;
    let summaDollar = 0;
    debtor = debtor.map((debt,index) => {
        if(debt.currency == 0) {
            summaSum +=debt.summa
        }
        if(debt.currency == 1) {
            summaDollar += debt.summa
        }
        debt.index = index + 1
        debt.summa = debt.summa.toLocaleString()
        debt.currency = debt.currency == 0 ? 'Sum' : '$'
        debt.createdAt = (debt.createdAt.getDate() + '/' + (debt.createdAt.getUTCMonth()+1) + '/' + debt.createdAt.getFullYear() + ' ' + debt.createdAt.getHours() + ':' + debt.createdAt.getMinutes() + ':' + debt.createdAt.getSeconds())
        debt.data = (debt.data.getDate() + '/' + (debt.data.getUTCMonth()+1) + '/' + debt.data.getFullYear())

        return debt
    })
    summaSum = summaSum.toLocaleString()
    summaDollar = summaDollar.toLocaleString()
    res.render('debtor/index',{
        debtor,
        summaSum,
        summaDollar,
        isDebtor:true,
        title: 'Список должники',
        error: req.flash('error'),
        success: req.flash('success')
    })
})

router.get('/excell',superauth,async(req,res)=>{
    let debtor = await Debtor.find().sort({_id:-1}).lean()
    let summaSum = 0;
    let summaDollar = 0;
    debtor = debtor.map((debt,index) => {
        if(debt.currency == 0) {
            summaSum +=debt.summa
        }
        if(debt.currency == 1) {
            summaDollar += debt.summa
        }
        debt.index = index + 1
        debt.summa = debt.summa.toLocaleString()
        debt.currency = debt.currency == 0 ? 'Sum' : '$'
        debt.createdAt = (debt.createdAt.getDate() + '/' + (debt.createdAt.getUTCMonth()+1) + '/' + debt.createdAt.getFullYear() + ' ' + debt.createdAt.getHours() + ':' + debt.createdAt.getMinutes() + ':' + debt.createdAt.getSeconds())
        debt.data = (debt.data.getDate() + '/' + (debt.data.getUTCMonth()+1) + '/' + debt.data.getFullYear())

        return debt
    })
    summaSum = summaSum.toLocaleString()
    summaDollar = summaDollar.toLocaleString()
    res.render('debtor/excell',{
        debtor,
        summaSum,
        summaDollar,
        isDebtor:true,
        title: 'Список должники',
        error: req.flash('error'),
        success: req.flash('success')
    })
})

router.get('/delete/:id',superauth,async(req,res)=>{
    const _id = req.params.id
    await Debtor.findByIdAndDelete({_id})
    req.flash('success','удалено!')
    res.redirect('/debtor')
})



router.post('/',superauth,async(req,res)=>{
    try {
        let {title,discription,currency,data,summa} = req.body
        const debtor = await new Debtor({title,discription,summa,currency,data,createdAt:Date.now()})
        await debtor.save()
        req.flash('success', 'добавлено!')
        res.redirect('/debtor/')
    } catch (error) {
        console.log(error)
    }
})

router.post('/save',superauth,async(req,res)=>{
    let {title,discription,data,currency,summa} = req.body
    let _id = req.body._id
    let debtor = {title,discription,summa,data,currency,createdAt:Date.now()}
    await Debtor.findByIdAndUpdate({_id},debtor)
    req.flash('success','обновлено!')
    res.redirect('/debtor/')
})



module.exports = router