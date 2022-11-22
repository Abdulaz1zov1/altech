const {Router} = require('express')
const User = require('../modeles/user')
const bcrypt = require('bcryptjs')
const auth  = require('../middleware/auth')
const router = Router()
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })


router.get('/',auth,async(req,res)=>{
    let users = await User.find()
        .where({role:2})
        .lean()
    users = users.map(user => {
        user.gender = (user.gender == 0) ? 'Мужской' : 'Женщина'
        return user 
        
    })
    
    res.render('users',{
        title: 'Пользователи',
        isTeachers:true,
        users,
        error: req.flash('error'),
        success: req.flash('success')
    })
})

router.get('/create',auth,(req,res)=>{
    res.render('users/create',{
        title:'Новый сотрудник',
        isTeachers:true
    })
})


router.post('/save',auth,async(req,res)=>{
    const {_id,name,phone,role,email,password,gender,telegram,instagram,facebook} = req.body
    const haveuser = await User.findOne({phone,_id: {$ne:_id}})
    if (haveuser){
        req.flash('error','Такой человек уже есть!')
        res.redirect(`/user/edit/${_id}`)
    } else {
        const user = await User.findByIdAndUpdate(_id,{name,phone,role,email,password,gender,telegram,instagram,facebook})
        await user.save()
        req.flash('success','Сохранено')
        res.redirect('/users/')
    }
    
    
})

router.get('/edit/:id',auth,async(req,res)=>{
    const _id = req.params.id 
    const user = await User.findOne({_id}).lean()
    res.render('users/edit',{
        title: `Редактировать ${user.name}`,
        user,
        isUsers:true
    })
})


router.get('/delete/:id',auth,async(req,res)=>{
    const _id = req.params.id
    await User.findByIdAndRemove({_id})
    req.flash('success','Удалено')
    res.redirect('/users')
})


router.post('/', async (req, res) => {
    const {name,phone,role,email,gender,group,password,telegram,instagram,facebook} = req.body
    const reallyMen = await User.findOne({phone})
    if (reallyMen) {
        req.flash('error', 'Пользователь с таким почтой или номер телефоном уже имеется!')
        res.redirect('/users/')
    } else {    
        const hashPass = await bcrypt.hash(password, 10)
        const user = await new User({name,phone,role,email,gender,telegram,instagram,facebook,password: hashPass})
        await user.save()
        req.flash('success', 'Успешно!')
        if (role == 3)
            res.redirect('/users/student')
        else 
            res.redirect('/users/')

    }
})

router.get('/get/:id',auth,async(req,res)=>{
    const _id = req.params.id 
    const user = await User.findOne({_id})
    res.send(user)
})



module.exports = router