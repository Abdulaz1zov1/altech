const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const superauth = require('../middleware/superauth')
const Spending = require('../modeles/spending')
const Worker = require('../modeles/worker')




router.get('/',auth,async(req,res)=>{
    let spending = await Spending.find().sort({_id:-1}).lean()
    let worker = await Worker.find().sort({name:1}).lean()
    let summaSum = 0;
    let summaDollar = 0;
    let control = req.session.user.role == 0 ? true : false
    spending = spending.map((spen,index) => {
        if(spen.currency == 0) {
            summaSum +=spen.summa
        }
        if(spen.currency == 1) {
            summaDollar += spen.summa
        }
        spen.index = index + 1
        spen.summa = spen.summa.toLocaleString()
        spen.currency = spen.currency == 0 ? 'Sum' : '$'
        spen.data = (spen.data.getDate() + '/' + (spen.data.getUTCMonth()+1) + '/' + spen.data.getFullYear() + ' ' + spen.data.getHours() + ':' + spen.data.getMinutes() + ':' + spen.data.getSeconds())
        return spen
    })
    summaSum = summaSum.toLocaleString()
    summaDollar = summaDollar.toLocaleString()
    res.render('spending/index',{
        spending,summaSum,summaDollar,worker,
        isSpending:true, control,
        title: 'Список расходы',
        error: req.flash('error'),
        success: req.flash('success')
    })
})

router.get('/excell',superauth,async(req,res)=>{
    let spending = await Spending.find().sort({_id:-1}).lean()
    let summaSum = 0;
    let summaDollar = 0;
    let control = req.session.user.role == 0 ? true : false
    spending = spending.map((spen,index) => {
        if(spen.currency == 0) {
            summaSum +=spen.summa
        }
        if(spen.currency == 1) {
            summaDollar += spen.summa
        }
        spen.summa = spen.summa.toLocaleString()
        spen.index = index + 1
        spen.currency = spen.currency == 0 ? 'Sum' : '$'
        spen.data = (spen.data.getDate() + '/' + (spen.data.getUTCMonth()+1) + '/' + spen.data.getFullYear() + ' ' + spen.data.getHours() + ':' + spen.data.getMinutes() + ':' + spen.data.getSeconds())
        return spen
    })
    summaSum = summaSum.toLocaleString()
    summaDollar = summaDollar.toLocaleString()
    res.render('spending/excell',{
        spending,summaSum,summaDollar,
        isSpending:true, control,
        title: 'Список расходы',
        error: req.flash('error'),
        success: req.flash('success')
    })
})

router.get('/delete/:id',auth,async(req,res)=>{
    const _id = req.params.id
    await Spending.findByIdAndDelete({_id})
    req.flash('success','удалено!')
    res.redirect('/spending')
})



router.post('/',auth,async(req,res)=>{
    try {
        let {title,discription,currency,summa} = req.body
        const spending = await new Spending({title,discription,summa,currency,data:Date.now()})
        await spending.save()
        req.flash('success', 'добавлено!')
        res.redirect('/spending/')
    } catch (error) {
        console.log(error)
    }
})

router.post('/save',auth,async(req,res)=>{
    let {title,discription,currency,summa} = req.body
    let _id = req.body._id
    let spending = {title,discription,summa,currency,data:Date.now()}
    await Spending.findByIdAndUpdate({_id},spending)
    req.flash('success','обновлено!')
    res.redirect('/spending/')
})


router.get('/get/:month',auth,async(req,res)=>{
    let month = req.params.month
    let spending = await Spending.find().lean()
    let monthsumma = 0;
    let monthdollar = 0
    spending = spending.map(spen => {
        
        if ((spen.data.getMonth()+1)==month){
            if(spen.currency == 0) {
                monthsumma +=spen.summa
            }
            if(spen.currency == 1) {
                monthdollar += spen.summa
            }
            
            
        }
        
        return spen
    })
    monthsumma = monthsumma.toLocaleString()
    monthdollar = monthdollar.toLocaleString()
    res.send({spending,monthsumma,monthdollar})
})



module.exports = router