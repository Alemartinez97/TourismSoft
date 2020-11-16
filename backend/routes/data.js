// const express = require("express");
const { success, error } = require("../response");
const { knex } = require("../db");
const router = require("express").Router();
router.get("/", async function (req, res) {
  const person = await knex("reserve")
    .join("person", { "reserve.idPerson": "person.id" })
    .select([
      "person.id",
      "person.name",
      "person.email",
      "person.whatsapp",
      "reserve.id",
      "reserve.start",
      "reserve.end",
      "reserve.person",
      "reserve.message",
    ]);
  const activity = await knex("activity").select("*");
  for (let activit of activity) {
    activit.images = await knex("images")
      .where("idActivity", activit.id)
      .select("id", "path","idActivity");
  }
  const accommodation = await knex("accommodation")
  // .join("service", { "service.idAccommodation": "accommodation.id" })
  // .join("diningRoom", {
  //   "diningRoom.idAccommodation": "accommodation.id",
  // })
  // .join("installation", {
  //   "installation.idAccommodation": "accommodation.id",
  // })
  // .join("roomandbath", {
  //   "roomandbath.idAccommodation": "accommodation.id",
  // })
  .select(["*"]);
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
  accommodat.diningRoom= await knex("diningRoom")
    .where("idAccommodation", accommodat.id)
    .select("*");
}
for (let accommodat of accommodation) {
  accommodat.installation = await knex("installation")
    .where("idAccommodation", accommodat.id)
    .select("*");
}
  const data = {
    person,
    activity,
    accommodation 
  };
  return success(res, data);
});
module.exports = router;
