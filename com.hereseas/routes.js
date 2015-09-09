var userRoute = require('./routes/userRoute');
var apartmentRoute = require('./routes/apartmentRoute');
var schoolRoute = require('./routes/schoolRoute');
var carRoute = require('./routes/carRoute');

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

    app.put('/user', sign.ensureAuthenticated,userRoute.editUser);
    
    app.get('/logout', sign.ensureAuthenticated,sign.logout);

    app.get('/apartments',apartmentRoute.getApartmentList);
    app.get('/apartments/three',apartmentRoute.getThreeApartments);
    app.get('/apartment/:id',apartmentRoute.getApartmentById);

    app.get('/apartments/draft',sign.ensureAuthenticated,apartmentRoute.getApartmentDraftList);
    app.get('/apartment/draft/:id',apartmentRoute.getApartmentDraftById);

    app.get('/apartments/:schoolId/search',apartmentRoute.searchApartment);

    app.post('/apartment',sign.ensureAuthenticated,apartmentRoute.createApartment);
    app.put('/apartment/:id',sign.ensureAuthenticated,apartmentRoute.editApartmentById);
    app.put('/apartment/post/:id',sign.ensureAuthenticated,apartmentRoute.postApartmentById);

    // app.post('/apartment',sign.ensureAuthenticated,apartmentRoute.addApartment);
    // app.put('/apartment/:id',sign.ensureAuthenticated,apartmentRoute.updateApartmentById);

    app.get('/school/:id',schoolRoute.getSchoolById);
    app.get('/schools',schoolRoute.getSchoolList);
    app.post('/school',schoolRoute.addSchool);
    app.put('/school/:id',schoolRoute.updateSchoolById);
    
   app.post('/m_upload_image', sign.ensureAuthenticated,apartmentRoute.image_upload);


    //APIs for cars
    app.post('/cars', sign.ensureAuthenticated, carRoute.createCar);

    app.get('/', function (req, res) {
        res.render('index');
    });

};
