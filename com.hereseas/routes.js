var userRoute = require('./routes/userRoute');
var apartmentRoute = require('./routes/apartmentRoute');
var schoolRoute = require('./routes/schoolRoute');
var carRoute = require('./routes/carRoute');
var imageUploadRoute = require('./routes/imageUploadRoute');


var multer = require('multer');
var upload = multer({
    dest: 'uploads/'
});

var sign = require('./routes/sign');

var passport = require('passport');

module.exports = function(app) {



    app.get('/test', function(req, res, next) {


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




    app.post('/user/active',sign.ensureAuthenticated, userRoute.activeUserSendEmail);
    app.get('/verify', userRoute.activeUserVerifyLink);



    app.put('/user', sign.ensureAuthenticated, userRoute.editUser);

    app.get('/logout', sign.ensureAuthenticated, sign.logout);

    app.get('/apartments', apartmentRoute.getApartmentList);
    app.get('/apartments/three', apartmentRoute.getThreeApartments);
    app.get('/apartment/:id', apartmentRoute.getApartmentById);

    app.get('/apartments/draft', sign.ensureAuthenticated, apartmentRoute.getApartmentDraftList);
    app.get('/apartment/draft/:id', apartmentRoute.getApartmentDraftById);

    app.get('/apartments/:schoolId/search', apartmentRoute.searchApartment);

    app.post('/apartment', sign.ensureAuthenticated, apartmentRoute.createApartment);
    app.put('/apartment/:id', sign.ensureAuthenticated, apartmentRoute.editApartmentById);
    app.put('/apartment/post/:id', sign.ensureAuthenticated, apartmentRoute.postApartmentById);

    // app.post('/apartment',sign.ensureAuthenticated,apartmentRoute.addApartment);
    // app.put('/apartment/:id',sign.ensureAuthenticated,apartmentRoute.updateApartmentById);

    app.get('/school/:id', schoolRoute.getSchoolById);
    app.get('/schools', schoolRoute.getSchoolList);
    app.post('/school', schoolRoute.addSchool);
    app.put('/school/:id', schoolRoute.updateSchoolById);
    app.post('/m_upload_image', sign.ensureAuthenticated, apartmentRoute.image_upload);

    app.post('/apartment/m_upload_image',sign.ensureAuthenticated,upload.array("apartment", 1), imageUploadRoute.image_upload);


     app.post('/avatar/m_upload_image',sign.ensureAuthenticated,upload.array("avatar", 1), imageUploadRoute.image_upload);



    //APIs for cars
    app.post('/car', sign.ensureAuthenticated, carRoute.createCar);
    app.put('/car/:id', sign.ensureAuthenticated, carRoute.editCarById);
    app.put('/car/post/:id', sign.ensureAuthenticated, carRoute.postCarById);

    app.get('/', function(req, res) {
        res.render('index');
    });

};