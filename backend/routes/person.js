// const express = require("express");
// const { success, error } = require("../response");
//const { knex } = require('../db');
// const router = express.Router();
// const nodemailer = require('nodemailer');
// // const creds = require('../config/config');

//  let transport = {
//  host: 'smtp.gmail.com',
// port:465,
//  secure:true,
//   auth: {
//     user: creds.USER,
//     pass: creds.PASS
//   }
// }
// let transporter = nodemailer.createTransport(transport)

// transporter.verify((error, success) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Server is ready to take messages');
//   }
// });
// router.get("/", async function(req, res) {
//   const reserves = await knex("reserve").select([
//     "id",
//     "start",
//     "end",
//     "person",
//     "message",
//   ]);
//   return success(res, reserves);
// });

// router.get("/:id", async function(req, res) {
//   const persons = await knex("person")
//     .select(["id", "name", "address", "email", "cuit", "dni",
//     "phoneNumber",
//     "location",
//     "province"])
//     .where({ deleted: false })
//     .andWhere(where);
//   if (persons.length) {
//     return success(res, persons[0]);
//   }
//   error(res);
// });

// router.post("/", async function(req, res) {
//   const { body } = req;
//   console.log("error",body)
//   if (body.name) {
//     const t = await knex.transaction();
//     try {
//       const [id] = await knex("person")
//         .transacting(t)
//         .insert({
//           name: body.name,
//           email: body.email,
//         });
//         await knex("reserve")
//         .transacting(t)
//         .insert({
//           idPerson: id,
//           start: body.start,
//           end: body.end,
//           person: body.person,
//           message: body.message,
//         });
//         // let mail = {
//         //   from: body.name,
//         //   to: creds.USER,  //Change to email address that you want to receive messages on
//         //   subject: 'New Message from Contact Form',
//         //   text: body
//         // }
      
//         // transporter.sendMail(mail, (err, data) => {
//         //   if (err) {
//         //     res.json({
//         //       msg: 'fail'
//         //     })
//         //   } else {
//         //     res.json({
//         //       msg: 'success'
//         //     })
//         //   }
//         // })
//       await t.commit();
//       return success(res);
//     } catch (e) {
//       await t.rollback();
//       throw e;
//     }   
//   } else{
//     return error(res, "Bad request", 400);
//   }

// });

// router.delete("/:id", async function(req, res) {
//   const {
//     params: { id }
//   } = req;
//   if (id) {
//     await knex("person")
//       .where({  id })
//       .delete();
//     return success(res);
//   }
//   return error(res, "Bad request", 400);
// });

// router.put("/:id", async function(req, res) {
//   const { body, params } = req;
//   const { id } = params;
//   if (id) {
//     const t = await knex.transaction();
    
//     await knex("person")
//       .transacting(t)
//       .update({
//         name: body.name,
//         address: body.address,
//         email: body.email,
//         cuit: body.cuit,
//         dni: body.dni,
//         phoneNumber: body.phoneNumber,
//         location: body.location,
//         province: body.province
//       })
//       .where({
//         id
//       });
//     await t.commit();
//     return success(res);
//   }

//   return error(res, "Bad request", 400, id);
// });

// module.exports = router;