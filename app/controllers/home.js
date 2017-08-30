var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');
  Location = mongoose.model('Location');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Article.find(function (err, articles, item) {
    if (err) return next(err);
    res.render('index', {
      title: 'Nightlife Coordination App',
      articles: articles,
      location: item,
      lat: -23.54312,
      long: -46.642748
    });
  });
});




router.post('/nearme', function (req, res, next) {

    // Setup limit
    var limit = req.body.limit || 10;

    // Default max distance to 10 kilometers
    var maxDistance = req.body.distance || 10;

    // Setup coords Object = [ <longitude> , <latitude> ]
    var coords = [];
    // Create the array
    coords[0] = req.body.longitude;
    coords[1] = req.body.latitude;

    // find a location
    Location.find({
        'coordinates': {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: coords
                },
                // distance to radians
                $maxDistance: maxDistance * 1609.34, spherical: true
            }
        }
    }).limit(limit).exec(function (err, stores) {
        if (err) {
            return res.status(500).json(err);
        }

        //res.status(200).json(stores);

        res.render('locations', {
            title: 'Locations',
            location: stores,
            lat: -23.54312,
            long: -46.642748
        });
    });
});



