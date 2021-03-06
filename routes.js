var userRoute = require('./routes/userRoute');
var apartmentRoute = require('./routes/apartmentRoute');
var schoolRoute = require('./routes/schoolRoute');
var carRoute = require('./routes/carRoute');
var imageUploadRoute = require('./routes/imageUploadRoute');
var adminRoute = require('./routes/adminRoute');
var forgetterRoute = require('./routes/forgetterRoute');
var itemRoute = require('./routes/itemRoute');
var forumRoute = require('./routes/forumRoute');
var professorRoute = require('./routes/professorRoute');
var eventRoute = require('./routes/eventRoute');

var tools = require('./common/tools');

var imageUploadTestRoute = require('./routes/imageUploadTestRoute');

var User = require('./models').User;

var multer = require('multer');
var upload = multer({
    dest: 'uploads/'
});

var sign = require('./routes/sign');

var passport = require('passport');

module.exports = function(app) {


    app.get('/test', function(req, res, next) {

        // var sanitizeHtml = require('sanitize-html');
        // var dirty = '<p><img src="https://s3.amazonaws.com/hereseas-public-images/forum/26de3a81-d73e-4370-8b2b-ddca35d5f2b1.gif"/><span class="rangySelectionBoundary">&#65279;</span><span class="rangySelectionBoundary">&#65279;</span></p><p><br/></p><p><br/></p><p>为了显示部分内容</p><p>   test!!!</p><p>蛤蛤 蛤蛤 蛤蛤</p';
        // var clean = sanitizeHtml(dirty, {
        //     allowedTags: [],
        //     allowedAttributes: []
        // });
        // User.findOne({
        //     id: "req.user.id"
        // }, function(err, user) {
        //     console.log(user.id);
        // });

        // console.log(asd.sad);

        res.json({
            test: 'this is testing'
        });
    });


    app.get('/init', sign.initialize);


    /*   user */
    //app.get('/users', userRoute.getUserList);
    app.get('/user/:id', userRoute.getUser);
    app.get('/userself', sign.ensureAuthenticated, userRoute.getSelfInfo);
    app.post('/user', userRoute.createUser);
    app.post('/login', userRoute.login);
    app.get('/logout', sign.ensureAuthenticated, sign.logout);
    app.post('/user/active', userRoute.activeUserSendEmail);
    app.post('/user/verify', userRoute.activeUserVerifyLink);
    app.put('/user', sign.ensureAuthenticated, userRoute.editUser);
    app.post('/avatar/m_upload_image', sign.ensureAuthenticated, upload.array("avatar", 1), imageUploadRoute.image_upload);
    app.get('/user/allpost/:id', userRoute.getUserAllPost);

    //app.post('/user/sendmilkemail', userRoute.sendMilkEmail);

    /* reset password */
    app.post('/beforereset', forgetterRoute.createForgetter);
    app.post('/checkreset', forgetterRoute.checkForgetter);
    app.put('/reset', forgetterRoute.resetForgetter);


    /*  message */
    app.post('/sendmessage', sign.ensureAuthenticated, userRoute.sendMessage);
    app.get('/contact', sign.ensureAuthenticated, userRoute.getUserContact);
    app.get('/message', sign.ensureAuthenticated, userRoute.getUserMessage);
    app.get('/unreadmessage', sign.ensureAuthenticated, userRoute.getUserUnreadMessage)
    app.put('/readmessage', sign.ensureAuthenticated, userRoute.readMessage);
    app.get('/unreadmessage', sign.ensureAuthenticated, userRoute.getUserUnreadMessage)


    /*  favorite */
    app.get('/favorite', sign.ensureAuthenticated, userRoute.getFavorite);
    app.get('/favorite/list', sign.ensureAuthenticated, userRoute.getFavoriteList);
    app.post('/favorite', sign.ensureAuthenticated, userRoute.addFavorite);
    app.delete('/favorite', sign.ensureAuthenticated, userRoute.deleteFavorite);


    /*  school */
    app.get('/school/:id', schoolRoute.getSchoolById);
    app.get('/schools', schoolRoute.getSchoolList);
    app.get('/schools/three', schoolRoute.getSchoolListThree);
    app.get('/school/:id/newstudents', schoolRoute.getSchoolNewStudents);
    app.get('/school/:id/students', schoolRoute.getSchoolStudents);


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


    /*  car */
    app.post('/car', sign.ensureAuthenticated, carRoute.createCar);
    app.put('/car/:id', sign.ensureAuthenticated, carRoute.editCarById);
    app.put('/car/post/:id', sign.ensureAuthenticated, carRoute.postCarById);
    app.get('/cars', sign.ensureAuthenticated, carRoute.getCarList);
    app.get('/car/:id', carRoute.getCarById);
    app.get('/cars/three', carRoute.getThreeCars);
    app.get('/cars/:schoolId/search', carRoute.searchCar);
    app.post('/car/m_upload_image', sign.ensureAuthenticated, upload.array("car", 1), imageUploadRoute.image_upload);
    app.get('/cars/draft', sign.ensureAuthenticated, carRoute.getCarDraftList);
    app.get('/car/draft/:id', sign.ensureAuthenticated, carRoute.getCarDraftById);
    app.delete('/car/:id', sign.ensureAuthenticated, carRoute.deleteCarById);


    /*  item */
    app.post('/item', sign.ensureAuthenticated, itemRoute.createItem);
    app.put('/item/:id', sign.ensureAuthenticated, itemRoute.editItemById);
    app.put('/item/post/:id', sign.ensureAuthenticated, itemRoute.postItemById);
    app.get('/items', sign.ensureAuthenticated, itemRoute.getItemList);
    app.get('/item/:id', itemRoute.getItemById);
    app.get('/items/three', itemRoute.getThreeItems);
    app.get('/items/other/:id', itemRoute.getUserOtherItems);
    app.get('/items/:schoolId/search', itemRoute.searchItem);
    app.post('/item/m_upload_image', sign.ensureAuthenticated, upload.array("item", 1), imageUploadRoute.image_upload);
    app.delete('/item/:id', sign.ensureAuthenticated, itemRoute.deleteItemById);


    /*  forum */
    app.get('/forum/:id/threads', forumRoute.getThreadsBySchoolId);
    app.get('/forum/thread/:id', forumRoute.getThreadById);
    app.get('/forum/thread/:id/comments', forumRoute.getCommentsByThreadId);
    app.post('/forum/thread', sign.ensureAuthenticated, forumRoute.createThread);
    app.post('/forum/comment', sign.ensureAuthenticated, forumRoute.createComment);
    app.post('/forum/m_upload_image', sign.ensureAuthenticated, upload.array("forum", 1), imageUploadRoute.image_upload);

    /* professor */
    app.post('/professor', sign.ensureAuthenticated, professorRoute.createProfessor);
    app.post('/professor/rate', sign.ensureAuthenticated, professorRoute.createRate);
    app.get('/professors', professorRoute.getProfessorList);
    app.get('/professor/:id', professorRoute.getProfessor);
    app.get('/school/:id/departments', professorRoute.getDepartmentList);
    app.get('/professor/:id/rates', professorRoute.getProfessorRates);

    /* event */
    app.post('/event213/user', eventRoute.saveParticipantInfo);

    app.get('/admin/event213/users', sign.ensureAuthenticated, eventRoute.getAllParticipantsInfo);


    /*  admin */
    app.get('/admin/schoolid', sign.ensureAuthenticated, schoolRoute.adminGetSchoolId);
    app.get('/admin/schools', sign.ensureAuthenticated, schoolRoute.adminGetSchoolInfoList);
    app.get('/admin/school/:id', sign.ensureAuthenticated, schoolRoute.adminGetSchoolAllInfo);
    app.post('/admin/school', sign.ensureAuthenticated, schoolRoute.adminAddSchool);
    app.put('/admin/school/:id', sign.ensureAuthenticated, schoolRoute.adminUpdateSchoolById);
    app.put('/admin/school/:id/status', sign.ensureAuthenticated, schoolRoute.adminEditSchoolStatus);
    app.put('/admin/school/:id/connection', sign.ensureAuthenticated, schoolRoute.adminSetSchoolConnectionById);
    app.put('/admin/school/:id/department', sign.ensureAuthenticated, schoolRoute.adminUpdateSchoolDepartmentById);

    app.get('/admin/userid', userRoute.adminGetUserId);
    app.get('/admin/user/:id', userRoute.adminGetUserAllInfo);
    app.get('/admin/users', userRoute.adminGetUsers);
    app.put('/admin/edituser/:id', sign.ensureAuthenticated, userRoute.adminEditUserStatus);
    app.post('/admin/user/:id/active', userRoute.adminActiveUser);
    app.post('/admin/favorite/update', sign.ensureAuthenticated, adminRoute.updateFavorite);
    app.get('/admin/db/show', sign.ensureAuthenticated, adminRoute.showCollections);
    app.post('/admin/update', adminRoute.updateFavorite);
    app.get('/admin/apartments', sign.ensureAuthenticated, apartmentRoute.adminGetApartmentId);
    app.get('/admin/apartment/:id', sign.ensureAuthenticated, apartmentRoute.adminGetApartmentAllInfo);
    app.put('/admin/editapartment/:id', sign.ensureAuthenticated, apartmentRoute.adminEditApartmentStatus);
    app.get('/admin/cars', sign.ensureAuthenticated, carRoute.adminGetCars);
    app.put('/admin/editcar/:id', sign.ensureAuthenticated, carRoute.adminEditCarStatus);
    app.put('/admin/thread/:id/status', sign.ensureAuthenticated, forumRoute.adminEditThreadStatus);
    app.put('/admin/comment/:id/status', sign.ensureAuthenticated, forumRoute.adminEditCommentStatus);
    app.post('/admin', sign.ensureAuthenticated, adminRoute.createAdmin);
    //app.post('/picture/m_upload_image', upload.array("picture", 1), imageUploadTestRoute.image_upload_test);


    app.post('/admin/sendemail', sign.ensureAuthenticated, adminRoute.adminSendEmail);


    app.get('/', function(req, res) {
        res.render('index');
    });

};