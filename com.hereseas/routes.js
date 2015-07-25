var userRoute = require('./routes/userRoute');
var apartmentRoute = require('./routes/apartmentRoute');
var schoolRoute = require('./routes/schoolRoute');

var passport = require('passport');

module.exports = function (app) {


    app.get('/test', function (req, res, next) {
        res.json({
            test: 'this is testing'
        });
    });

    app.post('/login', userRoute.login);
    app.post('/user', userRoute.createUser);
    app.get('/user', userRoute.getUserList);
    app.get('/user/:id', userRoute.getUser);


    app.get('/apartments',apartmentRoute.getApartmentList);
    app.post('/apartment',apartmentRoute.addApartment);
    app.put('/apartment',apartmentRoute.updateApartmentById);

    app.get('/school/:id',schoolRoute.getSchoolById);
    app.get('/schools',schoolRoute.getSchoolList);
   
    app.post('/school',schoolRoute.addSchool);



    

    app.get('/', function (req, res) {
        res.render('index_new');
    });

};
