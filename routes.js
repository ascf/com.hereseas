var userRoute = require('./routes/userRoute');
var apartmentRoute = require('./routes/apartmentRoute');
var schoolRoute = require('./routes/schoolRoute');
var carRoute = require('./routes/carRoute');
var imageUploadRoute = require('./routes/imageUploadRoute');
var adminRoute = require('./routes/adminRoute');
var forgetterRoute = require('./routes/forgetterRoute');
var itemRoute = require('./routes/itemRoute');

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

    app.post('/user/active', sign.ensureAuthenticated, userRoute.activeUserSendEmail);
    app.post('/user/verify', userRoute.activeUserVerifyLink);

    app.put('/user', sign.ensureAuthenticated, userRoute.editUser);

    app.post('/avatar/m_upload_image', sign.ensureAuthenticated, upload.array("avatar", 1), imageUploadRoute.image_upload);

    app.post('/sendmessage', sign.ensureAuthenticated, userRoute.sendMessage);
    app.get('/contact', sign.ensureAuthenticated, userRoute.getUserContact);
    app.get('/message', sign.ensureAuthenticated, userRoute.getUserMessage);
    app.put('/readmessage', sign.ensureAuthenticated, userRoute.readMessage);

    app.get('/favorite', sign.ensureAuthenticated, userRoute.getFavorite);
    app.get('/favorite/list', sign.ensureAuthenticated, userRoute.getFavoriteList);
    app.post('/favorite', sign.ensureAuthenticated, userRoute.addFavorite);
    app.delete('/favorite', sign.ensureAuthenticated, userRoute.deleteFavorite);

    /*  apartment */
    app.get('/apartments/three', apartmentRoute.getThreeApartments);
    app.get('/apartment/:id', apartmentRoute.getApartmentById);
    app.get('/apartments/draft', sign.ensureAuthenticated, apartmentRoute.getApartmentDraftList);
    app.get('/apartment/draft/:id', sign.ensureAuthenticated, apartmentRoute.getApartmentDraftById);


    app.get('/apartments/:schoolId/search', apartmentRoute.searchApartment);
    app.get('/apartments', sign.ensureAuthenticated, apartmentRoute.getApartmentList);
    app.post('/apartment', sign.ensureAuthenticated, apartmentRoute.createApartment);

    app.put('/apartment/:id', sign.ensureAuthenticated, apartmentRoute.editApartmentById);
    app.put('/apartment/post/:id', sign.ensureAuthenticated, apartmentRoute.postApartmentById);

    app.post('/apartment/m_upload_image', sign.ensureAuthenticated, upload.array("apartment", 1), imageUploadRoute.image_upload);

    app.delete('/apartment/:id', sign.ensureAuthenticated, apartmentRoute.deleteApartmentById)


    /*  school */
    app.get('/school/:id', schoolRoute.getSchoolById);
    app.get('/schools', schoolRoute.getSchoolList);
    app.get('/schools/three', schoolRoute.getSchoolListThree);
    app.get('/school/:id/newstudents', schoolRoute.getSchoolNewStudents);
    app.get('/school/:id/students', schoolRoute.getSchoolStudents);

    /*  car */
    app.post('/car', sign.ensureAuthenticated, carRoute.createCar);
    app.put('/car/:id', sign.ensureAuthenticated, carRoute.editCarById);
    app.put('/car/post/:id', sign.ensureAuthenticated, carRoute.postCarById);
    app.get('/cars', sign.ensureAuthenticated, carRoute.getCarList);
    app.get('/car/:id', carRoute.getCarById);
    app.get('/cars/three', carRoute.getThreeCars);
    app.post('/car/m_upload_image', sign.ensureAuthenticated, upload.array("car", 1), imageUploadRoute.image_upload);
    app.get('/cars/draft', sign.ensureAuthenticated, carRoute.getCarDraftList);
    app.get('/car/draft/:id', sign.ensureAuthenticated, carRoute.getCarDraftById);
    app.delete('/car/:id', sign.ensureAuthenticated, carRoute.deleteCarById);

    /*  item */
    app.post('/item', sign.ensureAuthenticated, itemRoute.createItem);
    app.put('/item/:id', sign.ensureAuthenticated, itemRoute.editItemById);
    app.get('/item/:id', itemRoute.getItemById);
    app.get('/items/three', itemRoute.getThreeItems);


    /*  admin */
    app.post('/admin', sign.ensureAuthenticated, adminRoute.createAdmin);

    app.get('/admin/apartments', sign.ensureAuthenticated, apartmentRoute.adminGetApartmentId);
    app.get('/admin/apartment/:id', sign.ensureAuthenticated, apartmentRoute.adminGetApartmentAllInfo);
    app.put('/admin/editapartment/:id', sign.ensureAuthenticated, apartmentRoute.adminEditApartmentStatus);

    app.get('/admin/schoolid', sign.ensureAuthenticated, schoolRoute.adminGetSchoolId);

    app.get('/admin/schools', sign.ensureAuthenticated, schoolRoute.adminGetSchoolInfoList);

    app.get('/admin/school/:id', sign.ensureAuthenticated, schoolRoute.adminGetSchoolAllInfo);
    app.post('/admin/school', sign.ensureAuthenticated, schoolRoute.adminAddSchool);
    app.put('/admin/school/:id', sign.ensureAuthenticated, schoolRoute.adminUpdateSchoolById);
    app.put('/admin/school/:id/status', sign.ensureAuthenticated, schoolRoute.adminEditSchoolStatus);
    app.put('/admin/school/:id/connection', sign.ensureAuthenticated, schoolRoute.adminSetSchoolConnectionById);

    app.get('/admin/userid', userRoute.adminGetUserId);
    app.get('/admin/user/:id', userRoute.adminGetUserAllInfo);
    app.get('/admin/users', userRoute.adminGetUsers);


    app.put('/admin/edituser/:id', sign.ensureAuthenticated, userRoute.adminEditUserStatus);
    app.post('/admin/user/:id/active', userRoute.adminActiveUser);
    app.post('/admin/favorite/update',sign.ensureAuthenticated,adminRoute.updateFavorite);

    app.get('/admin/db/show', sign.ensureAuthenticated,adminRoute.showCollections);

    /* reset password */
    app.post('/beforereset', forgetterRoute.createForgetter);
    app.post('/checkreset', forgetterRoute.checkForgetter);
    app.put('/reset', forgetterRoute.resetForgetter);


    app.post('/admin/update', adminRoute.updateFavorite);


    app.get('/', function(req, res) {
        res.render('index');
    });

};