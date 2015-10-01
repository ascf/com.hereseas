var userRoute = require('./routes/userRoute');
var apartmentRoute = require('./routes/apartmentRoute');
var schoolRoute = require('./routes/schoolRoute');
var carRoute = require('./routes/carRoute');
var imageUploadRoute = require('./routes/imageUploadRoute');
var adminRoute = require('./routes/adminRoute');


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


    /*   user */
    app.get('/users', userRoute.getUserList);
    app.get('/user/:id', userRoute.getUser);
    app.get('/userself', sign.ensureAuthenticated, userRoute.getSelfInfo);

    app.post('/user', userRoute.createUser);
    app.post('/login', userRoute.login);
    app.get('/logout', sign.ensureAuthenticated, sign.logout);

    app.post('/user/active',sign.ensureAuthenticated, userRoute.activeUserSendEmail);
    app.post('/user/verify', userRoute.activeUserVerifyLink);

    app.put('/user', sign.ensureAuthenticated, userRoute.editUser);

    app.post('/avatar/m_upload_image',sign.ensureAuthenticated,upload.array("avatar", 1), imageUploadRoute.image_upload);


    /*  apartment */
    app.get('/apartments', apartmentRoute.getApartmentList);
    app.get('/apartments/three', apartmentRoute.getThreeApartments);
    app.get('/apartment/:id', apartmentRoute.getApartmentById);
    app.get('/apartments/draft', sign.ensureAuthenticated, apartmentRoute.getApartmentDraftList);
    app.get('/apartment/draft/:id', apartmentRoute.getApartmentDraftById);
    app.get('/apartments/:schoolId/search', apartmentRoute.searchApartment);

    app.post('/apartment', sign.ensureAuthenticated, apartmentRoute.createApartment);

    app.put('/apartment/:id', sign.ensureAuthenticated, apartmentRoute.editApartmentById);
    app.put('/apartment/post/:id', sign.ensureAuthenticated, apartmentRoute.postApartmentById);

    app.post('/apartment/m_upload_image',sign.ensureAuthenticated,upload.array("apartment", 1), imageUploadRoute.image_upload);

    /*  school */
    app.get('/school/:id', schoolRoute.getSchoolById);
    app.get('/schools', schoolRoute.getSchoolList);
    app.get('/schools/three', schoolRoute.getSchoolListThree);

    
    app.post('/school', schoolRoute.addSchool);
    app.put('/school/:id', schoolRoute.updateSchoolById);


    //APIs for cars
    app.post('/car', sign.ensureAuthenticated, carRoute.createCar);
    app.put('/car/:id', sign.ensureAuthenticated, carRoute.editCarById);
    app.put('/car/post/:id', sign.ensureAuthenticated, carRoute.postCarById);

    //admin
    app.post('/admin', adminRoute.createAdmin);
    app.get('/admin/test', sign.ensureAuthenticated, adminRoute.test);


    //admin calls

    app.get('/admin/user/:id', userRoute.getUserAllInfo);
    app.post('/temp/user/:id', userRoute.tempUser);


    app.get('/', function(req, res) {
        res.render('index');
    });

};