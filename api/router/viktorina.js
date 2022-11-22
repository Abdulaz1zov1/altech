const {Router} = require('express')

const auth  = require('../middleware/auth')
const router = Router()
const csrf = require('csurf')
const Viktorina = require('../modeles/viktorina')

router.get('/',auth,async(req,res)=>{
    let viktorina = await Viktorina.find().sort({_id:-1}).lean()

    viktorina = viktorina.map(viktor => {
        viktor.status = viktor.status == 0 ? '<span class="badge bg-danger">Отключенный</span>' : '<span class="badge bg-success">Активный</span>'

        viktor.createdAt = (viktor.createdAt.getDate() + '/' + (viktor.createdAt.getUTCMonth()+1) + '/' + viktor.createdAt.getFullYear() + ' ' + viktor.createdAt.getHours() + ':' + viktor.createdAt.getMinutes() + ':' + viktor.createdAt.getSeconds())
        viktor.deadline = (viktor.deadline.getDate() + '/' + (viktor.deadline.getUTCMonth()+1) + '/' + viktor.deadline.getFullYear())
        return viktor
    })
    res.render('viktorina/index',{
        title: 'Список викторины',
        isViktorina:true,
        viktorina,
        error: req.flash('error'),
        success: req.flash('success')
    })
})



router.get('/delete/:id',auth,async(req,res)=>{
    const _id = req.params.id
    await Viktorina.findByIdAndDelete({_id})
    res.redirect('/viktorina/')
})

router.post('/',async(req,res)=>{
    try {

        let {title, discription, deadline, status } = req.body
        status = status || 0
        let viktorina = await new Viktorina({title, discription, deadline, status, createdAt:Date.now()})
         await viktorina.save()
        req.flash('success','добавлено!')
        res.redirect('/viktorina/')
    } catch (error) {
        console.log(error)
    }
})

router.post('/save',auth,async(req,res)=>{
    let {title, discription, deadline, status, createdAt } = req.body
    let _id = req.body._id
    status = status || 0
    let viktorina = {title, discription, deadline, status, createdAt:Date.now()}
    await Viktorina.findByIdAndUpdate({_id},viktorina)
    res.redirect('/viktorina/')
})

router.get('/more/:id',async(req,res)=>{
    let _id = req.params.id
    let viktorina = await Viktorina.findOne({_id}).lean()
    viktorina.players = viktorina.players.map((player,index)=>{
        player.index = index+1
        return player
    })
    res.render('viktorina/show',{
        title: `${viktorina.title}`,
        isViktorina:true,
        viktorina,
    })
})



module.exports = router