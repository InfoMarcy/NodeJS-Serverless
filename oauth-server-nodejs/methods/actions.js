 var User = require('../model/user');
 var Book = require('../model/book');
var config = require('config');
var jwt = require('jwt-simple');

var functions = {
    authenticate: function(req, res) {
   
        User.findOne({
            name: req.body.name
        }, function(err, user){
            if (err) throw err;
            
            if(!user) {
                res.status(403).send({success: false, msg: 'Authentication failed, User not found'});
            }
            
           else {
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch && !err) {
                        var token = jwt.encode(user, config.get('SECRET_KEY'));
                        res.json({success: true, token: token, userId: user._id});
                    } else {
                        return res.status(403).send({success: false, msg: 'Authenticaton failed, wrong password.'});
                    }
                })
            }
            
        })
    },
    addNew: function(req, res){
        if((!req.body.name) || (!req.body.password)){
            console.log(req.body.name);
            console.log(req.body.password);
            
            res.json({success: false, msg: 'Enter all values'});
        }
        else {
            var newUser = User({
                name: req.body.name,
                password: req.body.password
            });
            
            newUser.save(function(err, newUser){
                if (err){
                    res.json({success:false, msg:'Failed to save'})
                }
                
                else {
                    
                    res.json({success:true, msg:'Successfully saved'});
                }
            })
        }
    },
    getinfo: function(req, res){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.get('SECRET_KEY'));
            return res.json({success: true, msg: 'hello '+decodedtoken.name});
        }
        else {
            return res.json({success:false, msg: 'No header'});
        }
    },
    addBook: function(req, res) {
        var newBook = Book({
            name: req.body.name,
            quantity: req.body.quantity,
            userId: req.user._id
        });
        
        newBook.save(function(err, newBook) {
            if(err)
            console.log(err);
            else
            res.json({ message: 'Book added to the locker!', data: newBook });
        })
    },
    getBooks: function(req, res) {
        Book.find({ userId: req.user._id }, function(err, books) {
    if (err)
      res.send(err);

    res.json(books);
  });
    }
    
}

module.exports = functions;