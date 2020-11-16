const fs = require("fs");
const { success, error } = require("../response");
const { knex } = require("../db");
const multer = require("multer");
const router = require("express").Router();
const { uploads } = require("../config/cloudinaryConfig");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/pgn") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 2024 * 5,
  },
  fileFilter: fileFilter,
});
router.get("/", async function (req, res) {
  const accommodation = await knex("accommodation")
    // .join("service", { "service.idAccommodation": "accommodation.id" })
    // .join("diningRoom", {
    //   "diningRoom.idAccommodation": "accommodation.id"
    // })
    // .leftJoin("installation", {
    //   "installation.idAccommodation": "accommodation.id",
    // })
    // .leftJoin("roomandbath", {
    //   "roomandbath.idAccommodation": "accommodation.id",
    // })
    .select("*");
  for (let accommodat of accommodation) {
    accommodat.images = await knex("imageacco")
      .where("idAccommodation", accommodat.id)
      .select("*");
  }
  for (let accommodat of accommodation) {
    accommodat.roomandbath = await knex("roomandbath")
      .where("idAccommodation", accommodat.id)
      .select("*");
  }
  for (let accommodat of accommodation) {
    accommodat.service = await knex("service")
      .where("idAccommodation", accommodat.id)
      .select("*");
  }
  for (let accommodat of accommodation) {
    accommodat.diningRoom = await knex("diningRoom")
      .where("idAccommodation", accommodat.id)
      .select("*");
  }
  for (let accommodat of accommodation) {
    accommodat.installation = await knex("installation")
      .where("idAccommodation", accommodat.id)
      .select("*");
  }
  console.log("imagenes; ", accommodation);
  return success(res, accommodation);
});
// router.get("/:id", async function (req, res) {
//   const activity = await knex("activity").where("id", req.params.id).first();
//   const result = await knex("images")
//     .where("images.idActivity", activity.id)
//     .join("activity", { "images.idActivity": "activity.id" })
//     .select();
//   if (activity) {
//     return success(res, result);
//   }
//   error(res);
// });
// const saveMap = async (id, lng, lat) => {
//   const fileName = `images/place-${id}-map.png`;
//   const map = new StaticMaps({
//     width: 600,
//     height: 400
//   });
//   const location = [Number(lat), Number(lng)];
//   const marker = {
//     img: fsPath.resolve("images/marker.png"),
//     offsetX: 24,
//     offsetY: 48,
//     width: 48,
//     height: 48,
//     coord: location
//   };
//   map.addMarker(marker);

//   await map.render(location, 15);
//   await map.image.save(fsPath.resolve(fileName));
//   return fsPath.resolve(fileName);
// };
router.post("/", upload.array("image"), async function (req, res) {
  const uploader = async (path) => await uploads(path, "images");
  let urls = new Array();
  console.log("urls", urls);
  const { body } = req;
  const t = await knex.transaction();
  const [longitude, latitude] = (body.location || "0,0").split(",");
  if (req) {
    const files = req.files;
    console.log("files", files);
    for (let file of files) {
      const { path } = file;
      newPath = await uploader(path);
      console.log("newPath", newPath);
      urls.push(newPath);
    }
    try {
      const [id] = await knex("accommodation")
        .transacting(t)
        .insert({
          name: body.name,
          description: body.description,
          delegacy: body.delegacy,
          room: body.room,
          hed: body.hed,
          bath: body.bath,
          location: knex.raw("ST_GeomFromText('POINT(? ?)', 4326)", [
            Number(longitude),
            Number(latitude),
          ]),
          latitude: Number(latitude),
          longitude: Number(longitude),
        });
      for (let i = 0; i < urls.length; i++) {
        const urll = urls[i].url;
        console.log("urll", urll);
        await knex("imageacco").transacting(t).insert({
          idAccommodation: id,
          path: urll,
        });
      }
      await knex("service").transacting(t).insert({
        idAccommodation: id,
        wifi: body.wifi,
        iron: body.iron,
        airConditioned: body.airConditioned,
        cable: body.cable,
        heating: body.heating,
        waterHot: body.waterHot,
      });
      await knex("diningRoom").transacting(t).insert({
        idAccommodation: id,
        kitchen: body.kitchen,
        microwave: body.microwave,
        basicKitchenTools: body.basicKitchenTools,
        crockeryandcutlery: body.crockeryandcutlery,
        coffeMaker: body.coffeMaker,
        refrigerator: body.refrigerator,
      });
      await knex("installation").transacting(t).insert({
        idAccommodation: id,
        pool: body.pool,
        parking: body.parking,
        gym: body.gym,
        elevator: body.elevator,
      });
      await knex("roomandbath").transacting(t).insert({
        idAccommodation: id,
        shampoo: body.shampoo,
        hairDryer: body.hairDryer,
        hangers: body.hangers,
      });

      await t.commit();
      const accommodation = await knex("accommodation").where({id}).select(["*"]);
      for (let accommodat of accommodation) {
        accommodat.images = await knex("imageacco as i")
          .where({ "i.idAccommodation": accommodat.id })
          .select(["*"]);
      }
      for (let accommodat of accommodation) {
        accommodat.roomandbath = await knex("roomandbath")
          .where("idAccommodation", accommodat.id)
          .select("*");
      }
      for (let accommodat of accommodation) {
        accommodat.service = await knex("service")
          .where("idAccommodation", accommodat.id)
          .select("*");
      }
      for (let accommodat of accommodation) {
        accommodat.diningRoom = await knex("diningRoom")
          .where("idAccommodation", accommodat.id)
          .select("*");
      }
      for (let accommodat of accommodation) {
        accommodat.installation = await knex("installation")
          .where("idAccommodation", accommodat.id)
          .select("*");
      }
      console.log("reuslt: ", accommodation);
      //return res.redirect(303, `/activity/${id}`);
      return success(res, accommodation);
    } catch (e) {
      await t.rollback();
      throw e;
    }
  } else {
    return error(res, "Bad request", 400);
  }
});

router.delete("/:id", async function (req, res) {
  const {
    params: { id },
  } = req;
  if (id) {
    await knex("service").where({ idAccommodation: id }).delete();
    await knex("diningRoom").where({ idAccommodation: id }).delete();
    await knex("installation").where({ idAccommodation: id }).delete();
    await knex("roomandbath").where({ idAccommodation: id }).delete();
    await knex("imageacco").where({ idAccommodation: id }).delete();
    await knex("accommodation").where({ id }).delete();
    return success(res);
  }
  return error(res, "Bad request", 400);
});

router.put("/:id", upload.array("image"), async function (req, res) {
  const uploader = async (path) => await uploads(path, "images");
  const { body, params } = req;
  const { id } = params;
  let urls = new Array();
  const [longitude, latitude] = (body.location || "0,0").split(",");
  const files = req.files;
  for (let file of files) {
    const { path } = file;
    console.log("path:", path);
    newPath = await uploader(path);
    urls.push(newPath);
  }
  if (id) {
    const t = await knex.transaction();
    try {
      await knex("accommodation")
        .transacting(t)
        .where({ id })
        .update({
          name: body.name,
          description: body.description,
          delegacy: body.delegacy,
          room: body.room,
          hed: body.hed,
          bath: body.bath,
          location: knex.raw("ST_GeomFromText('POINT(? ?)', 4326)", [
            Number(longitude),
            Number(latitude),
          ]),
          latitude: Number(latitude),
          longitude: Number(longitude),
        });
      await knex("service")
        .transacting(t)
        .where({ idAccommodation: id })
        .delete();
      await knex("service").transacting(t).insert({
        idAccommodation: id,
        wifi: body.wifi,
        iron: body.iron,
        airConditioned: body.airConditioned,
        cable: body.cable,
        heating: body.heating,
        waterHot: body.waterHot,
      });
      await knex("diningRoom")
        .transacting(t)
        .where({ idAccommodation: id })
        .delete();
      await knex("diningRoom").transacting(t).insert({
        idAccommodation: id,
        kitchen: body.kitchen,
        microwave: body.microwave,
        basicKitchenTools: body.basicKitchenTools,
        crockeryandcutlery: body.crockeryandcutlery,
        coffeMaker: body.coffeMaker,
        refrigerator: body.refrigerator,
      });
      await knex("installation")
        .transacting(t)
        .where({ idAccommodation: id })
        .delete();
      await knex("installation").transacting(t).insert({
        idAccommodation: id,
        pool: body.pool,
        parking: body.parking,
        gym: body.gym,
        elevator: body.elevator,
      });
      await knex("roomandbath")
        .transacting(t)
        .where({ idAccommodation: id })
        .delete();
      await knex("roomandbath").transacting(t).insert({
        idAccommodation: id,
        shampoo: body.shampoo,
        hairDryer: body.hairDryer,
        hangers: body.hangers,
      });
      await knex("imageacco")
        .transacting(t)
        .where({ idAccommodation: id })
        .delete();
      for (let i = 0; i < urls.length; i++) {
        const urll = urls[i].url;
        await knex("imageacco").transacting(t).insert({
          idAccommodation: id,
          path: urll,
        });
      }
      await t.commit();
      const accommodation = await knex("accommodation").where({id}).select(["*"]);
      for (let accommodat of accommodation) {
        accommodat.images = await knex("imageacco as i")
          .where({ "i.idAccommodation": accommodat.id })
          .select(["*"]);
      }
      for (let accommodat of accommodation) {
        accommodat.roomandbath = await knex("roomandbath")
          .where("idAccommodation", accommodat.id)
          .select("*");
      }
      for (let accommodat of accommodation) {
        accommodat.service = await knex("service")
          .where("idAccommodation", accommodat.id)
          .select("*");
      }
      for (let accommodat of accommodation) {
        accommodat.diningRoom = await knex("diningRoom")
          .where("idAccommodation", accommodat.id)
          .select("*");
      }
      for (let accommodat of accommodation) {
        accommodat.installation = await knex("installation")
          .where("idAccommodation", accommodat.id)
          .select("*");
      }
      //return res.redirect(303, `/activity/${id}`);
      return success(res, accommodation);
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  return error(res, "Bad request", 400, id);
});

module.exports = router;
