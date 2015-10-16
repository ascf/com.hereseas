/**
 * Created by yangmang on 7/4/15.
 */


hereseasApp.config(function (
                             $translateProvider, $httpProvider,
                             $translatePartialLoaderProvider,
                             localStorageServiceProvider, APP) {

    //$httpProvider.defaults.withCredentials = true;


    /**
     *  each module loads its own translation file - making it easier to create translations
     *  also translations are not loaded when they aren't needed
     *  each module will have a il8n folder that will contain its translations
     */
        //$translateProvider.useLoader('$translatePartialLoader', {
        //    urlTemplate: '{part}/il8n/{lang}.json'
        //});

    $translateProvider.translations('en',{
        'LOGIN.TITLE':'Please log in!',
        'LOGIN.EMAIL.LABEL':'Email',
        'LOGIN.EMAIL.PLEASE_ENTER':'Please input a valid email',
        'LOGIN.EMAIL.PLEASE_VALID':'Please input a valid email',
        'LOGIN.PASSWORD.LABEL': 'Password',
        'LOGIN.PASSWORD.PLEASE_ENTER': 'Please input a password',
        'LOGIN.REMEMBER': 'Remember me',
        'LOGIN.FORGOT': 'Forgot your password?',
        'LOGIN.BUTTON': 'Log in',
        'LOGIN.SIGNUP_LINK': 'Join us',
        'LOGIN.SOCIAL.OR': 'Log in via social media'
    });


    // make sure all values used in translate are sanitized for security
    $translateProvider.useSanitizeValueStrategy('sanitize');

    // cache translation files to save load on server
    $translateProvider.useLoaderCache(true);

    // get languages set in APP constant
    var languageKeys = [];
    for (var lang in APP.languages) {
        languageKeys.push(APP.languages[lang].key);
    }
    /**
     *  try to detect the users language by checking the following
     *      navigator.language
     *      navigator.browserLanguage
     *      navigator.systemLanguage
     *      navigator.userLanguage
     */
    $translateProvider
        .registerAvailableLanguageKeys(languageKeys, {
            'en_US': 'en',
            'en_UK': 'en'
        })
        .use('en');

    // store the users language preference in a cookie
    $translateProvider.useLocalStorage();


});