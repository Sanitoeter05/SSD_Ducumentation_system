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

app.get("/sanis.html", function (req, res) {
    if (req.session.uid) {
        res.sendFile(__dirname + "/secureFolder/sanis.html");
    } else {
        res.sendStatus(403);
    }
});

app.get("/patients.html", function (req, res) {
    if (req.session.uid) {
        res.sendFile(__dirname + "/secureFolder/patients.html");
    } else {
        res.sendStatus(403);
    }
});
app.get("/user.html", function (req, res) {
    if (req.session.uid) {
        res.sendFile(__dirname + "/secureFolder/user.html");
    } else {
        res.sendStatus(401);
    }
});

app.get("/protocol.html", function (req, res) {
    if (req.session.uid) {
        res.sendFile(__dirname + "/secureFolder/protocol.html");
    } else {
        res.sendStatus(401);
    }
});

app.get("/login.html", function (req, res) {
    if (req.session.uid) {
        res.redirect("/index.html");
    } else {
        res.sendFile(__dirname + "/secureFolder/login.html");
    }
});

app.get("/register_patients.html", function (req, res) {
    let role = req.session.role;
    let is_active = true;
    if (role) {
        let roles = role.split(", ");
        roles.forEach((element) => {
            if (element === "Inactive") {
                is_active = false;
            }
        });
        if (is_active) {
            res.sendFile(__dirname + "/secureFolder/register_patients.html");
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(401);
    }
});

app.get("/register.html", function (req, res) {
    if ((req.session.role, req.session.uid)) {
        let veryfied = false;
        let roles = req.session.role;
        let roles_array = roles.split(", ");
        roles_array.forEach((element) => {
            console.log(element);
            if (element === "Admin") {
                res.sendFile(__dirname + "/secureFolder/register.html");
                veryfied = true;
            }
        });
        if (!veryfied) {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
});

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
    /* GET Request for protocol data*/
    let protocl_id = req.query.pid;
    let protocol_get_info = req.query.pgi;
    let uid = req.session.uid;

    if (uid) {
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
                }
            );
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
});

app.get("/data/count/protocols", function (req, res) {
    /* count user entrys */
    pool.query("select count(*) from protocols p", (error, resp) => {
        if (error) {
            res.sendStatus(500);
            console.log(error);
        } else {
            res.send(resp.rows).status(200);
        }
    });
});

/*
app.post("/data/protocol", function (req, res) {
    // POST new data to the database  
    let mid = 0;
});
*/

/* 

GET count of registert patients 

select count(*) from patients p;

GET patient info
select p."name" , p."class" ,p.pre_diseases  from patients p where pid = $1;

GET Gerneral patient info
'select p."name" , p."class" ,p.pid  from patients p limit 10 offset $1;'
  

*/

app.get("/data/patient", function (req, res) {
    let pid = req.query.pid;
    let pat_get_inf = req.query.pat_get_inf;
    let uid = req.session.uid;
    if (uid) {
        if (pid) {
            pool.query(
                'select p."name" , p."class" ,p.pre_diseases  from patients p where pid = $1;',
                [pid],
                (error, resp) => {
                    if (error) {
                        res.sendStatus(500);
                        console.log(error);
                    } else {
                        res.send(resp.rows).status(200);
                    }
                }
            );
        } else if (pat_get_inf) {
            let offset = req.query.offset;
            pool.query(
                'select p."name" , p."class" ,p.pid  from patients p offset $1;',
                [offset],
                (err, resp) => {
                    if (err) {
                        res.sendStatus(500);
                        console.log(err);
                    } else {
                        res.send(resp.rows).status(200);
                    }
                }
            );
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
});

app.get("/data/count/patient", function (req, res) {
    /* count user entrys */
    pool.query("select count(*) from patients p", (error, resp) => {
        if (error) {
            res.sendStatus(500);
            console.log(error);
        } else {
            res.send(resp.rows).status(200);
        }
    });
});

/*query for adding new patients 

*/

app.post("/data/patients", function (req, res) {
    let role = req.session.role;
    let is_user = false;
    let array_role = role.split(", ");
    let name = req.body.name;
    let p_class = req.body.p_class;
    let birth_day = req.body.birth_day;
    birth_day = new Date(birth_day);
    let pre_diseases = req.body.pre_diseases;
    array_role.forEach((element) => {
        if (element === "User") {
            is_user = true;
        }
    });
    if ((is_user, name, p_class, birth_day, pre_diseases)) {
        pool.query(
            `INSERT INTO public.patients ("name", "class", bith_date, pre_diseases)VALUES($1, $2, $3, $4);`,
            [name, p_class, birth_day, pre_diseases],
            (err, resp) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            }
        );
    } else {
        res.sendStatus(400);
        console.log(is_user, name, p_class, birth_day, pre_diseases);
    }
});

/*
Query to get full user information

select u.u_name, u.u_email, u.uid, STRING_AGG(r."role", ', ') from "user" u join role_user ru on u.role_id = ru.role_map_id join "role" r on ru.role_id = r.role_id where u.uid = $1 group by uid ; 
Count userdata
select count(*) from "user" u;


Query to get User name and the corresponding uid
select u.u_name, u.uid  from  "user" u;

*/

app.get("/data/user", function (req, res) {
    /* Fetch Userdata */
    let uid = req.query.uid;
    let uuid = req.session.uid;
    let get_user_inf = req.query.get_user_inf;

    if (uuid) {
        if (uid) {
            /* Fetch Full userdata for managment */
            pool.query(
                `select u.u_name, u.u_email, u.uid, STRING_AGG(r."role", ', ') from "user" u join role_user ru on u.role_id = ru.role_map_id join "role" r on ru.role_id = r.role_id where u.uid = $1 group by uid ;`,
                [uid],
                (error, resp) => {
                    if (error) {
                        res.sendStatus(500);
                        console.log(error);
                    } else {
                        if (resp.rowCount > 0) {
                            let data = resp.rows;
                            let base = [];
                            data.forEach((element) => {
                                base = Object.assign({}, base, element);
                            });
                            res.send(base).status(200);
                        } else {
                            res.send(resp.rows).status(200);
                        }
                    }
                }
            );
        } else if (get_user_inf) {
            /*Get user information for user with uid*/
            pool.query(
                'select u.u_name, u.uid  from  "user" u',
                (error, resp) => {
                    if (error) {
                        res.sendStatus(500);
                        console.log(error);
                    } else {
                        res.send(resp.rows).status(200);
                    }
                }
            );
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(400);
    }
});

app.get("/data/count/user", function (req, res) {
    /* count user entrys */
    pool.query('select count(*) from "user" u', (error, resp) => {
        if (error) {
            res.sendStatus(500);
            console.log(error);
        } else {
            res.send(resp.rows).status(200);
        }
    });
});
/*

Add new userdata to the database
INSERT INTO public."user" (u_name, u_passwd, "role", birth_day) VALUES($1, $2, $3, $4);

Check if a Login try is valid:
select u.u_name, u.uid, u.u_passwd, string_agg(r."role", ', ')  from "user" u join role_user ru on u.role_id = ru.role_map_id join "role" r on ru.role_id = r.role_id where u.u_email = $1 GROUP by u.uid ;
*/

/*I18N implementation */

app.post("/data/user", function (req, res) {
    /* GET User data */
    let u_pass = req.body.u_pass;
    let u_email = req.body.u_email;
    let login = req.body.login;
    let role = req.session.role;
    let is_admin = false;
    if (role) {
        role = role.split(", ");
        role.forEach((element) => {
            if (element === "Admin") {
                is_admin = true;
            }
        });
    }
    if (login) {
        /* check if its a Login Request*/
        if ((u_pass, u_email))
            pool.query(
                `select u.u_name, u.uid, u.u_passwd, string_agg(r."role", ', ')  from "user" u join role_user ru on u.role_id = ru.role_map_id join "role" r on ru.role_id = r.role_id where u.u_email = $1 GROUP by u.uid ;`,
                [u_email],
                (error, resp) => {
                    if (error) {
                        res.sendStatus(500);
                        console.log(error);
                        console.log("HELP ME ");
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
                                req.session.role = resp.rows[0].string_agg;
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
    } else if (is_admin) {
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
                                if (error.code === "23505") {
                                    res.sendStatus(409);
                                } else {
                                    res.sendStatus(500);
                                }
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
    } else {
        res.sendStatus(400);
    }
});

/*get user info*/
app.get("/get_current_user_inf", function (req, res) {
    let uid = req.session.uid;
    let u_name = req.session.u_name;
    let u_role = req.session.role;
    if ((uid, u_name, u_role)) {
        res.send({ "uid": uid, "u_name": u_name, "u_role": u_role }).status(200);
    } else {
        res.send({ uid: "", u_name: "" });
    }
});

/*logut function */
app.get("/logout", function (req, res) {
    req.session.uid = "";
    req.session.u_name = "";
    req.session.role = "";
    res.sendStatus(200);
});

app.get("/data/roles", function (req, res) {
    let uid = req.session.uid;
    if (uid) {
        pool.query('select * from "role" r; ', (err, resp) => {
            if (err) {
                res.sendStatus(500);
                console.log(err);
            } else {
                res.send(resp.rows).status(200);
            }
        });
    } else {
        res.sendStatus(401);
    }
});

/* Database CLEANUP 

    GET deletable databaseentrys
    select * from protocols p where date < current_date - interval '10 years';
*/

app.get("/data/cleanup", function(req,res){
    let uid = req.session.uid
    let roles = req.session.roles
    let is_admin = false

    if (is_admin === true, uid) {
        pool.query("select * from protocols p where date < current_date - interval '10 years';", (err, resp) => {
            if(err){
                res.sendStatus(500)
                console.log(err)
            } else {
                res.send(resp).status(200)
            }
        })
    }
})

app.delete("/data/cleanup", function(req,res){
    let uid = req.session.uid
    let roles = req.session.roles
    let is_admin= false

    let what = req.body.what

    if (is_admin, uid){
        if (!isNaN(what)){
            pool.query("delete * from protocols where protocol_id = $1;", [what], (erro, resp)=>{
                if (erro){
                    res.sendStatus(500)
                    console.log(erro)
                }else{
                    res.sendStatus(204)
                }
            })
        } else  if (what === "ALL"){
            //TODO add DELETE all wheere DATE <= now-10
        }
    }
})

const server = app.listen(8080, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log(host);
    console.log("Example app listening at http://%s:%s", host, port);
});

// TODO Add user settings!

// TODO Sprache vereinheitlichen

// TODO Change klasse from patients to be undynamic for the protocols

// TODO protokolle darstellen und einlesen