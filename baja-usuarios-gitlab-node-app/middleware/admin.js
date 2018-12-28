// verify that the user has a token an acces to access the apis
module.exports = function (req, res, next){
    //401 unathorized
    // 403 forbidden
    if(!req.user.isAdmin) return res.status(403).send('Access denied');
    next();
};