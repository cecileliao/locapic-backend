
var express = require('express');
var router = express.Router();
require ('../models/connection')

const Place = require('../models/places');

router.post('/', (req, res) => {
	// Check if the place has not already been added
	Place.findOne({ name: req.body.name }).then(dbData => {
		if (dbData === null) {
            // Creates new document
            const newPlace = new Place({
                nickname: req.body.nickname,
                name: req.body.name,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
            });

            // Finally save in database
            newPlace.save().then(() => {
                res.json({ result: true });
            });
		} else {
			// Place already exists in database
			res.json({ result: false, error: 'Place already saved' });
		}
	});
});


router.get("/:nickname", (req, res) => {
  Place.find({
    nickname: { $regex: new RegExp(req.params.nickname, "i") },
  }).then(data => {
    if (data) {
      res.json({ result: true, places: data });
    } else {
      res.json({ result: false, error: "Place not found" });
    }
  });
});

router.delete("/", (req, res) => {
  Place.deleteOne({
    nickname: { $regex: new RegExp(req.body.nickname, "i")  },
    name: { $regex: new RegExp(req.body.name, "i") },
  }).then(deletedDoc => {
    if (deletedDoc.deletedCount > 0) {
      // if document successfully deleted
      // Place.find().then(data => {
        res.json({ result: true });
      // });
    } else {
      res.json({ result: false, error: "Place not found" });
    }
  });
});

module.exports = router;