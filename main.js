const express = require('express')
const cookie_parser = require('cookie-parser')
const body_parser= require('body-parser')
const bcrypt = require("bcryptjs");
const path = require("path");
const { pid } = require('process');
const { error } = require('console');
require('dotenv').config();
const Pool = require("pg").Pool

const pool = new Pool({
   user: process.env.PG_USER,
   host: process.env.PG_HOST,
   database: process.env.PG_DATABASE,
   password: process.env.PG_PASSWORD,
   port: process.env.PG_PORT,
})
const app = express();

let page = path.join(__dirname, 'public');
app.use(express.static(page))


/*function encrypt_pw(password, bysalt){
   bcrypt.hash(password, bysalt, (error, pass_enc) =>{
      if (error){
          throw error                                       //for later use: a encryption module.
      } else {
   }})
}*\

/* //SQL Abfrage für ein komplettes einsatzprotokoll
select p2."date" Datum, p2.e_start Einsatzbegin, p2.e_end Einsatzende, p2."desc" Beschreibun, p2.status Status, p2.exit_state Endverfahren, p."name" Patientenname, p."class", p.bith_date Patientengeburztag, p.pre_diseases Patientenvorerkrankun, u.u_name Sani_name
from protocols p2 
join patients p 
on p2.pid = p.pid 
join protocols_user pu 
on p2.mid = pu.mid 
join "user" u 
on pu.uid = u.uid
where p2.protocol_id = 
*/


app.get('/data/protocol', function (req, res) {
   let protocl_id = req.query
   if (protocl_id){
      pool.query(`select p2."date" Datum, p2.e_start Einsatzbegin, p2.e_end Einsatzende, p2."desc" Beschreibun, p2.status Status, p2.exit_state Endverfahren, p."name" Patientenname, p."class", p.bith_date Patientengeburztag, p.pre_diseases Patientenvorerkrankun, u.u_name Sani_name from protocols p2 join patients p on p2.pid = p.pid join protocols_user pu on p2.mid = pu.mid join "user" u on pu.uid = u.uid where p2.protocol_id = $1`, [protocl_id["pid"]], (error, results) => {
         if (error) {
           console.log(error)
         }
         res.status(200).json(results.rows)
       })
   }
   else {
      pool.query('select count(*) from protocols p', (error, resp) => {
         if (error){
            res.sendStatus(500)
         } else {
            res.send(resp).status(201)
         }
      })
   }
})

const server = app.listen(8080, function () {
   let host = server.address().address
   let port = server.address().port
   console.log(host)
   console.log("Example app listening at http://%s:%s", host, port)
})