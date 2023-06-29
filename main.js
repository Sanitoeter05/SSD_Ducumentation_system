const express = require("express");
const body_parser = require("body-parser");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();
const Pool = require("pg").Pool;
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
const app = express();
const session = require("express-session");

app.use(
    session({
        secret: process.env.EX_SESS_SEC,
        saveUninitialized: true,
        cookie: { maxAge: Infinity },
        resave: false,
    })
);

let page = path.join(__dirname, "public");
app.use(express.static(page));

app.use(express.urlencoded({ extended: false }));
app.use(
    express.json({
        type: ["application/json", "text/plain"],
    })
);

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

/* SQL Abfrage für ein komplettes einsatzprotokoll
select p2."date" Datum, p2.e_start Einsatzbegin, p2.e_end Einsatzende, p2."desc" Beschreibun, p2.status Status, p2.exit_state Endverfahren, p."name" Patientenname, p."class", p.bith_date Patientengeburztag, p.pre_diseases Patientenvorerkrankun, u.u_name Sani_name
from protocols p2
join patients p
on p2.pid = p.pid
join protocols_user pu
on p2.mid = pu.mid
join "user" u
on pu.uid = u.uid
where p2.protocol_id = $1

SQL dür die infos der jewailigen protokolle
select p."date" datum, p.status status
from protocols p
*/

app.get("/data/protocol", function (req, res) {
    /* GET Request for protocol data*/ let protocl_id = req.query.pid;
    let protocol_get_info = req.query.pgi;
    console.log(protocl_id, protocol_get_info);
    if (protocl_id) {
        /* GET a full list of a specific protocol sheet*/
        pool.query(
            `select p2."date" Datum, p2.e_start Einsatzbegin, p2.e_end Einsatzende, p2."desc" Beschreibun, p2.status Status, p2.exit_state Endverfahren, p."name" Patientenname, p."class", p.bith_date Patientengeburztag, p.pre_diseases Patientenvorerkrankun, u.u_name Sani_name from protocols p2 join patients p on p2.pid = p.pid join protocols_user pu on p2.mid = pu.mid join "user" u on pu.uid = u.uid where p2.protocol_id = $1`,
            [protocl_id],
            (error, results) => {
                if (error) {
                    console.log(error);
                }
                res.status(200).json(results.rows);
                console.log(results.rows);
            }
        );
    } else if (protocol_get_info) {
        /* GET Basic protocol info for all protocols */
        pool.query(
            'select p."date" datum, p.status status from protocols p',
            (error, resp) => {
                if (error) {
                    res.sendStatus(500);
                } else {
                    res.send(resp.rows).status(200);
                }
                console.log("debug2");
            }
        );
    } else {
        pool.query("select count(*) from protocols p", (error, resp) => {
            /* GET Protocol count */
            if (error) {
                res.sendStatus(500);
            } else {
                res.send(resp.rows).status(200);
            }
            console.log("debug3");
        });
    }
});

app.post("/data/protocol", function (req, res) {
    /* POST new data to the database */ 
    let mid = 0;
});

/*
Query to get full user information

select u.u_name "name", u."role" "rolle", u.birth_day "Geburztag" from "user" u where uid = $1


Count userdata
select count(*) from "user" u


Query to get User name and the corresponding uid
select u.u_name, u.uid  from  "user" u

*/

app.get("/data/user", function (req, res) {
    /* Fetch Userdata */ let uid = req.query.uid;
    let count = req.query.count;
    if (uid) {
        /* Fetch Full userdata for managment */
        pool.query(
            'select u.u_name "name", u."role" "rolle", u.birth_day "Geburztag" from "user" u where uid = $1',
            [uid],
            (error, resp) => {
                if (error) {
                    res.sendStatus(500);
                    console.log(error);
                } else {
                    res.send(resp.rows).status(200);
                }
            }
        );
    } else if (count) {
        /* count user entrys */
        pool.query('select count(*) from "user" u', (error, resp) => {
            if (error) {
                res.sendStatus(500);
                console.log(error);
            } else {
                res.send(resp.rows).status(200);
            }
        });
    } else {
        /*Get user information for protocols with uid*/
        pool.query('select u.u_name, u.uid  from  "user" u', (error, resp) => {
            if (error) {
                res.sendStatus(500);
                console.log(error);
            } else {
                res.send(resp.rows).status(200);
            }
        });
    }
});

/*

Add new userdata to the database
INSERT INTO public."user" (u_name, u_passwd, "role", birth_day) VALUES($1, $2, $3, $4);

Check if a Login try is valid:
select u.u_name, u.uid, u.u_passwd  from "user" u where u.u_email = :$1
*/

/*I18N implementation */

app.post("/data/user", function (req, res) {
    /* GET User data */ let u_pass = req.body.u_pass;
    let u_email = req.body.u_email;
    let login = req.body.login;
    if (login) {
        /* check if its a Login Request*/
        if ((u_pass, u_email))
            pool.query(
                'select u.u_name, u.uid, u.u_passwd  from "user" u where u.u_email = $1;',
                [u_email],
                (error, resp) => {
                    if (error) {
                        res.sendStatus(500);
                        console.log(error);
                    } else {
                        let u_passwd_enc = resp.rows[0].u_passwd;
                        bcrypt.compare(u_pass, u_passwd_enc, (err, respo) => {
                            /*Check if the passowrd is correct */
                            if (err) {
                                resp.sendStatus(500);
                                console.log(err);
                            } else if (respo) {
                                req.session.uid = resp.rows[0].uid;
                                req.session.u_name = resp.rows[0].u_name;
                                res.send({
                                    uid: resp.rows[0].uid,
                                    u_name: resp.rows[0].u_name,
                                }).status(200);
                            } else {
                                res.sendStatus(401);
                            }
                        });
                    }
                }
            );
    } else {
        let u_name = req.body.u_name;
        let u_role = req.body.u_role;
        let u_b_day = req.body.u_b_day;

        u_b_day = new Date(u_b_day);
        if (
            (u_name,
            u_pass,
            u_role,
            u_b_day,
            u_b_day instanceof Date && !isNaN(u_b_day.valueOf()))
        ) {
            bcrypt.hash(u_pass, 10, (error, pass_enc) => {
                if (error) {
                    console.log(error);
                } else {
                    pool.query(
                        'INSERT INTO public."user" (u_name, u_passwd, "role", birth_day, u_email) VALUES($1, $2, $3, $4, $5);',
                        [u_name, pass_enc, u_role, u_b_day, u_email],
                        (error, resp) => {
                            if (error) {
                                res.sendStatus(500);
                                console.log(error);
                            } else {
                                console.log(resp);
                                res.sendStatus(201);
                            }
                        }
                    );
                }
            });
        } else {
            res.sendStatus(400);
        }
    }
});

/*get user info*/
app.get("/get_current_user_inf", function (req, res) {
    let uid = req.session.uid;
    let u_name = req.session.u_name;
    if ((uid, u_name)) {
        res.send({ uid: uid, u_name: u_name }).status(200);
    } else {
        res.send({ uid: "", u_name: "" });
    }
});
const server = app.listen(8080, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log(host);
    console.log("Example app listening at http://%s:%s", host, port);
});
