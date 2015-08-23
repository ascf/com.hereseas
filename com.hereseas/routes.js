var userRoute = require('./routes/userRoute');
var apartmentRoute = require('./routes/apartmentRoute');
var schoolRoute = require('./routes/schoolRoute');

var sign = require('./routes/sign');

var passport = require('passport');

module.exports = function (app) {




    app.get('/test', function (req, res, next) {


        res.json({
            test: 'this is testing',
            userId: req.user.id
        });
    });


    app.get('/init', sign.initialize);

    app.get('/users', userRoute.getUserList);
    app.get('/user/:id', userRoute.getUser);
    app.post('/login', userRoute.login);
    app.post('/user', userRoute.createUser);

    app.get('/logout', sign.ensureAuthenticated,sign.logout);

    app.get('/apartments',apartmentRoute.getApartmentList);
    app.get('/apartments/three',apartmentRoute.getThreeApartments);
    app.get('/apartment/:id',apartmentRoute.getApartmentById);
    app.post('/apartment',sign.ensureAuthenticated,apartmentRoute.addApartment);
    app.put('/apartment/:id',sign.ensureAuthenticated,apartmentRoute.updateApartmentById);
    app.get('/apartments/:schoolId/search',apartmentRoute.searchApartment);



    app.get('/school/:id',schoolRoute.getSchoolById);
    app.get('/schools',schoolRoute.getSchoolList);
    app.post('/school',schoolRoute.addSchool);
    app.put('/school/:id',schoolRoute.updateSchoolById);
    
   app.post('/m_upload_image', sign.ensureAuthenticated,apartmentRoute.image_upload);



    app.get('/', function (req, res) {
        res.render('index');
    });

};
