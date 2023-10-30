const { default: mongoose } = require("mongoose");
const { Bought, BoughtDetail, Choice } = require("../../models");
const { showError } = require("../../lib");
const { boughts } = require("../profile/profile.controller");

class BoughtController {
  index = async (req, res, next) => {
    try {
      const boughts = await Bought.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
      ]).exec();
      const result = [];

      for (let bought of boughts) {
        const details = await BoughtDetail.aggregate([
          { $match: { boughtId: new mongoose.Types.ObjectId(bought._id) } },
          {
            $lookup: {
              from: "places",
              localField: "placeId",
              foreignField: "_id",
              as: "place",
            },
          },
        ]).exec();

        const temp = details.map((details) => {
          const places = details.places || []; // Check if 'places' is defined
          return {
            _id: details._id,
            boughtId: details.boughtId,
            placeId: details.placeId,
            qty: details.qty,
            price: details.price,
            total: details.total,
            createdAt: details.createdAt,
            updatedAt: details.updatedAt,
            __v: details.__v,
            places: places.length > 0 ? places[0] : null, // Handle 'places' being empty
          };
        });

        const user = bought.user || []; // Check if 'user' is defined
        result.push({
          _id: bought._id,
          userId: bought.userId,
          status: bought.status,
          createdAt: bought.createdAt,
          updatedAt: bought.updatedAt,
          __v: bought.__v,
          details: temp,
          user: user.length > 0 ? user[0] : null, // Handle 'user' being empty
        });
      }

      res.json(result);
    } catch (err) {
      showError(err, next);
    }
  };

  update = async (req, res, next) => {
    try {
      const { status } = req.body;

      const bought = await Bought.findByIdAndUpdate(req.params.id, { status });

      if (bought) {
        res.json({
          success: "Bought updated.",
        });
      } else {
        next({
          message: "Bought not found",
          status: 404,
        });
      }
    } catch (err) {
      validationError(err, next);
    }
  };

  destroy = async (req, res, next) => {
    try {
      await BoughtDetail.deleteMany({ boughtId: req.params.id });
      
      const bought = await Bought.findByIdAndDelete(req.params.id);
      if (bought) {
        res.json({
          success: "Bought removed.",
        });
      } else {
        next({
          message: "Bought not found",
          status: 404,
        });
      }
    } catch (err) {
      showError(err, next);
    }
  };
}

module.exports = new BoughtController();
