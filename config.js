/**
 *	config
 */
var config = {
	website_name: 'Hereseas',
	description: 'Make our life easier!',
	site_static_host: '',
	port: 8080,

	auth_cookie_name: 'hereseas_cookie',

	session_secret: 'hereseas_secret',
	db: 'mongodb://127.0.0.1/hereseas_dev'

};


module.exports = config;