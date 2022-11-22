module.exports = (req,res,next)=>{
    res.locals.isAuth = req.session.isAuthed
    res.locals.csrf = req.csrfToken()
    if (req.session.user){
        res.locals.layout = req.session.user.role == 0 ? 'main' : 'worker'

    }
    res.locals.user = req.session.user
    next()
}