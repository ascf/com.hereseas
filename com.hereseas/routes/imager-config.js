exports.storages = {
  local: {
    provider: 'local',
    path: '/tmp',
    mode: 0777
  },
  rackspace: {
    provider: 'rackspace',
    username: process.env.IMAGER_RACKSPACE_USERNAME,
    apiKey: process.env.IMAGER_RACKSPACE_KEY,
    authUrl: 'https://lon.auth.api.rackspacecloud.com',
    region: 'IAD', // https://github.com/pkgcloud/pkgcloud/issues/276
    container: process.env.IMAGER_RACKSPACE_CONTAINER
  },
  amazon: {
    provider: 'amazon',
    key: "muxfjrbUARLKb0hSmJ2mWiK7Lz/RIszG74OAFkYy",
    keyId: "AKIAI3BMW7O3LM65VS2A",
    container: 'hereseas-images'
  }
}
exports.variants = {
  item: { // variant
    thumb: { // preset
      options: { // preset options
        pool: 5,
        scale: {
          width: 200,
          height: 150,
          type: 'contain',
          format: 'png'
        },
        crop: {
          width: 200,
          height: 150,
          x: 0,
          y: 0
        },
        format: 'png',
        rotate: 'auto'
      }
    },
    large: {
      format: 'png'
    }
  },
  gallery: {
    // ...
  }
};