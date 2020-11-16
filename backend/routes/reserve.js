// const express = require("express");
const { success, error } = require("../response");
const { knex } = require('../db');
const router = require('express').Router();
router.get("/", async function (req, res) {
  const reserves = await knex("reserve")
    .join("person", { "reserve.idPerson": "person.id" })
    .select([
      "person.name",
      "person.email",
      "person.whatsapp",
      "reserve.start",
      "reserve.end",
      "reserve.person",
      "reserve.message",
    ]);
  return success(res, reserves);
});

router.post("/", async function (req, res) {
  const { body } = req;
  console.log("error", body);
  if (body.name) {
    const t = await knex.transaction();
    try {
      const person = await knex("person").select(["person.id", "person.email"]);
      let stat = true;
      for (let i = 0; i < person.length; i++) {
        if (person[i].email === body.email) {
          await knex("reserve").transacting(t).insert({
            idPerson: person[i].id,
            start: body.start,
            end: body.end,
            person: body.person,
            message: body.message,
          });
          stat = +false;
          await t.commit();
          return success(res);
        }
      }
      if (stat) {
        const [id] = await knex("person").transacting(t).insert({
          name: body.name,
          email: body.email,
          whatsapp: body.whatsapp,
        });
        await knex("reserve").transacting(t).insert({
          idPerson: id,
          start: body.start,
          end: body.end,
          person: body.person,
          message: body.message,
        });
        await t.commit();
        return success(res);
      }
    } catch (e) {
      await t.rollback();
      throw e;
    }
  } else {
    return error(res, "Bad request", 400);
  }
});

router.delete("/:id", async function(req, res) {
  const {
    params: { id }
  } = req;
  if (id) {
    await knex("reserve")
      .where({  id })
      .delete();
    return success(res);
  }
  return error(res, "Bad request", 400);
});

router.put("/:id", async function (req, res) { 
  const { body, params } = req;
  const { id } = params;
  if (id) {
    const t = await knex.transaction();
    try {
      await knex("reserve")
        .transacting(t)
        .where({ "reserve.id": id })
        .join("person", { "reserve.idPerson": "person.id" })
        .update({
          name: body.name,
          email: body.email,
          whatsapp: body.whatsapp,
          start: body.start,
          end: body.end,
          person: body.person,
          message: body.message,
        });
      await t.commit();
      return success(res);
    } catch (e) {
      t.rollback();
      throw e;
    }
  }
  return error(res, "Bad request", 400, id);
});

module.exports = router;
