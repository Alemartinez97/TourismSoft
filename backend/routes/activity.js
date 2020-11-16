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
  const activity = await knex("activity").select("*");
  for (let activit of activity) {
    activit.images = await knex("images")
      .where("idActivity", activit.id)
      .select("id", "path", "idActivity")
      .first();
  }
  return success(res, activity);
});
router.get("/:id", async function (req, res) {
  const activity = await knex("activity").where("id", req.params.id).first();
  const result = await knex("images")
    .where("images.idActivity", activity.id)
    .join("activity", { "images.idActivity": "activity.id" })
    .select();
  if (activity) {
    return success(res, result);
  }
  error(res);
});
router.post("/", upload.array("image"), async function (req, res) {
  const uploader = async (path) => await uploads(path, "images");
  let urls = new Array();
  const { body } = req;
  const t = await knex.transaction();
  if (req) {
    const files = req.files;
    for (let file of files) {
      const { path } = file;
      newPath = await uploader(path);
      urls.push(newPath);
    }
    try {
      const [id] = await knex("activity").transacting(t).insert({
        name: body.name,
        description: body.description,
        date: body.date,
        price: body.price,
      });

      for (let i = 0; i < urls.length; i++) {
        const urll = urls[i].url;
        await knex("images").transacting(t).insert({
          idActivity: id,
          path: urll,
        });
      }
      await t.commit();
      const activity = await knex("activity").where({ id }).select(["*"]);
      for (let activit of activity) {
        activit.images = await knex("images as i")
          .where({ "i.idActivity": id })
          .select(["i.id", "i.path", "i.idActivity"]);
      }
      //return res.redirect(303, `/activity/${id}`);
      return success(res, activity);
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
    await knex("activity").where({ id }).delete();
    await knex("images").where({ idActivity: id }).delete();
    return success(res);
  }
  return error(res, "Bad request", 400);
});

router.put("/:id", upload.array("image"), async function (req, res) {
  const uploader = async (path) => await uploads(path, "images");
  const { body, params } = req;
  const { id } = params;
  let urls = new Array();
  const files = req.files;
  for (let file of files) {
    const { path } = file;
    newPath = await uploader(path);
    urls.push(newPath);
  }
  if (id) {
    const t = await knex.transaction();
    try {
      await knex("activity").transacting(t).where({ id }).update({
        name: body.name,
        description: body.description,
        date: body.date,
        price: body.price,
      });
      await knex("images").transacting(t).where({ idActivity: id }).delete();
      for (let i = 0; i < urls.length; i++) {
        const urll = urls[i].url;
        await knex("images").transacting(t).insert({
          idActivity: id,
          path: urll,
        });
      }
      await t.commit();
      const activity = await knex("activity").where({ id }).select(["*"]);
      for (let activit of activity) {
        activit.images = await knex("images as i")
          .where({ "i.idActivity": id })
          .select(["i.id", "i.path", "i.idActivity"]);
      }

      //return res.redirect(303, `/activity/${id}`);
      return success(res, activity);
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  return error(res, "Bad request", 400, id);
});

module.exports = router;
