const router = require("express").Router();
const passport = require("passport");

router.get('/login', (req, res) => {
    if (req.user) {
        res.redirect('/profile');
        return;
    }
    res.redirect('google');
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('login');
})

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile');
})

module.exports = router;