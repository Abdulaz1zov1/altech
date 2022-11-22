const {Router} = require('express')
const Worker = require('../modeles/worker')
const superauth  = require('../middleware/superauth')
const router = Router()


router.get('/',superauth,async(req,res)=>{
    let currentMonth = req.query.month || new Date().getMonth()
    let status = req.query.status || 2
    let currentYear = new Date().getFullYear()
    let workers = []
    if (status == -1){
        workers  = await Worker.find().sort({name:1}).lean()
    } else {
        workers = await Worker.find({status}).sort({name:1}).lean()
    }
    let months = ['Январ','Феврал','Март','Апрел','Май','Июн','Июл','Август','Сентябр','Октябр','Ноябр','Декабр']
    let allSummaMonth = 0
    let mustSummaMonth = 0
    let resSummaMonth = 0
    let allSummaMonthDollar = 0
    let mustSummaMonthDollar = 0
    let resSummaMonthDollar = 0
    workers = workers.map((worker, index) => {
        worker.index = index+1
        if(worker.current == 0) {
            worker.all = 0
            mustSummaMonth += worker.salary
            worker.history = worker.history.filter(item => {

                let itemDate = new Date(item.date)
                if (itemDate.getMonth() == currentMonth && itemDate.getFullYear() == currentYear) {
                    worker.all += item.getsalary
                    allSummaMonth += item.getsalary
                    return item
                }
            })
            worker.current = 'Сум'
            worker.must = worker.salary - worker.all
            worker.salary = worker.salary.toLocaleString()
            worker.all = worker.all.toLocaleString()
            worker.must = worker.must.toLocaleString()
            worker.phone = worker.phone.toLocaleString()
        } else {
            worker.all = 0;
            mustSummaMonthDollar += worker.salary
            worker.history = worker.history.filter(item =>{
                let itemDate = new Date(item.date)
                if (itemDate.getMonth()==currentMonth && itemDate.getFullYear() == currentYear){
                    worker.all += item.getsalary
                    allSummaMonthDollar += item.getsalary
                    return item
                }
            })
            worker.current = '$'
            worker.must = worker.salary - worker.all
            worker.salary = worker.salary.toLocaleString()
            worker.all = worker.all.toLocaleString()
            worker.must = worker.must.toLocaleString()
            worker.phone = worker.phone.toLocaleString()
        }

        return worker

    })
    resSummaMonth = mustSummaMonth - allSummaMonth
    allSummaMonth = allSummaMonth.toLocaleString()
    resSummaMonthDollar = mustSummaMonthDollar - allSummaMonthDollar
    allSummaMonthDollar = allSummaMonthDollar.toLocaleString()
    let monthRes = months[currentMonth]
    
    res.render('worker/index',{
        title: 'Работники',
        isWorkers:true,
        allSummaMonth,monthRes,
        mustSummaMonth: mustSummaMonth.toLocaleString(),
        resSummaMonth: resSummaMonth.toLocaleString(),
        allSummaMonthDollar,
        mustSummaMonthDollar: mustSummaMonthDollar.toLocaleString(),
        resSummaMonthDollar: resSummaMonthDollar.toLocaleString(),
        workers,
        error: req.flash('error'),
        success: req.flash('success')
    })
})

router.get('/salary/:id/:index',superauth,async (req,res)=>{
    let _id = req.params.id
    let index = req.params.index
    let worker = await Worker.findOne({_id})
    worker.history.splice(index,1)
    await worker.save()
    res.redirect(`/worker/show/${_id}`)
})


router.get('/excell',superauth,async (req,res)=> {
    let currentMonth = req.query.month || new Date().getMonth()
    let status = req.query.status || 2
    let currentYear = new Date().getFullYear()
    let workers = []
    if (status == -1){
        workers  = await Worker.find().sort({name:1}).lean()
    } else {
        workers = await Worker.find({status}).sort({name:1}).lean()
    }
    let months = ['Январ','Феврал','Март','Апрел','Май','Июн','Июл','Август','Сентябр','Октябр','Ноябр','Декабр']
    let allSummaMonth = 0
    let mustSummaMonth = 0
    let resSummaMonth = 0
    let allSummaMonthDollar = 0
    let mustSummaMonthDollar = 0
    let resSummaMonthDollar = 0
    workers = workers.map((worker, index) => {
        worker.index = index+1
        if(worker.current == 0) {
            worker.all = 0
            mustSummaMonth += worker.salary
            worker.history = worker.history.filter(item => {

                let itemDate = new Date(item.date)
                if (itemDate.getMonth() == currentMonth && itemDate.getFullYear() == currentYear) {
                    worker.all += item.getsalary
                    allSummaMonth += item.getsalary
                    return item
                }
            })
            worker.current = 'Сум'
            worker.must = worker.salary - worker.all
            worker.salary = worker.salary.toLocaleString()
            worker.all = worker.all.toLocaleString()
            worker.must = worker.must.toLocaleString()
            worker.phone = worker.phone.toLocaleString()
        } else {
            worker.all = 0;
            mustSummaMonthDollar += worker.salary
            worker.history = worker.history.filter(item =>{
                let itemDate = new Date(item.date)
                if (itemDate.getMonth()==currentMonth && itemDate.getFullYear() == currentYear){
                    worker.all += item.getsalary
                    allSummaMonthDollar += item.getsalary
                    return item
                }
            })
            worker.current = '$'
            worker.must = worker.salary - worker.all
            worker.salary = worker.salary.toLocaleString()
            worker.all = worker.all.toLocaleString()
            worker.must = worker.must.toLocaleString()
            worker.phone = worker.phone.toLocaleString()
        }

        return worker
    })
    resSummaMonth = mustSummaMonth - allSummaMonth
    allSummaMonth = allSummaMonth.toLocaleString()
    resSummaMonthDollar = mustSummaMonthDollar - allSummaMonthDollar
    allSummaMonthDollar = allSummaMonthDollar.toLocaleString()

    let monthExcell = months[currentMonth]
    res.render('worker/excell',{
        title: 'Работники',
        isWorkers:true,
        allSummaMonth,
        mustSummaMonth: mustSummaMonth.toLocaleString(),
        resSummaMonth: resSummaMonth.toLocaleString(),
        allSummaMonthDollar,
        mustSummaMonthDollar: mustSummaMonthDollar.toLocaleString(),
        resSummaMonthDollar: resSummaMonthDollar.toLocaleString(),
        workers,monthExcell,
        error: req.flash('error'),
        success: req.flash('success')
    })
})

router.get('/show/:id',superauth,async(req,res)=>{
    let _id = req.params.id
    let worker = await Worker.findOne({_id}).lean()
    let summa = 0
    worker.history = worker.history.map(el => {
        summa += el.getsalary
        el.type = el.type == 0 ? 'Аванс' : 'Оклад'
        el.getsalary = el.getsalary.toLocaleString()
        el.createdAt = (el.createdAt.getDate() + '/' + (el.createdAt.getUTCMonth()+1) + '/' + el.createdAt.getFullYear() + ' ' + el.createdAt.getHours() + ':' + el.createdAt.getMinutes() + ':' + el.createdAt.getSeconds())
        let dateVal = new Date(el.date)
        el.date = (dateVal.getUTCMonth()+1) + '/' + dateVal.getFullYear()
        return el
    })

    worker.current = worker.current == 0 ? 'Сум' : '$'

    summa = summa.toLocaleString()
    worker.salary = worker.salary.toLocaleString()
    res.render('worker/show',{
        title: `Подробная информация о сотрудники: ${worker.name} ${worker.lname}`,
        worker,summa, id:worker._id
    })
})

router.get('/get/:id',superauth,async(req,res)=>{
    let _id = req.params.id
    let worker = await Worker.findOne({_id})
    res.send(worker)
})

router.get('/getcurrent/:id',superauth,async(req,res)=>{
    let _id = req.params.id
    let worker = await Worker.findOne({_id})
    res.send(worker)
})

router.post('/save',superauth,async(req,res)=>{
    let {_id,name,phone,phone_res,lvl,lname,salary,current,status} = req.body
    status = status || 0
    await Worker.findByIdAndUpdate(_id,{name,phone,phone_res,lvl,lname,salary,current,status})
    req.flash('success', 'Успешно!')
    res.redirect('/worker/')
})

router.get('/delete/:id',superauth,async(req,res)=>{
    const _id = req.params.id
    await Worker.findByIdAndRemove({_id})
    req.flash('success','Удалено')
    res.redirect('/worker')
})

router.post('/',superauth, async (req, res) => {
    let {name,phone,phone_res,lvl,lname,salary,current,status} = req.body
    status = status || 0
    let newWorker = await new Worker({name,phone,phone_res,lvl,lname,salary,current,status})
    await newWorker.save()
    req.flash('success', 'Успешно!')
    res.redirect('/worker/')

})

router.post('/salary',superauth,async (req,res)=>{
    let {_id,type,month,date,getsalary} = req.body
    let worker = await Worker.findOne({_id})
    worker.history.push({type,month,getsalary,date,createdAt:Date.now()})
    await worker.save()
    res.redirect('/worker')
})

router.get('/api/getcsrftoken', function (req, res) {
    return res.json({ csrfToken: req.csrfToken() });
})


module.exports = router