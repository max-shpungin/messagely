"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const User = require("../models/user");

const Router = require("express").Router;
const router = new Router();

/** POST /login: {username, password} => {token} */

router.post('/login', async function (req, res, next) {
  if (req.body === undefined) throw new BadRequestError();
  const { username, password } = req.body;

  if (await User.authenticate(username, password) === true) {
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  }

  //TODO: Do we need to update the login timestamp in this route? -- Yes

  throw new UnauthorizedError("Invalid user/password");

});


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post('/register', async function (req, res, next) {
  if (req.body === undefined) throw new BadRequestError();

  const { username, password, first_name, last_name, phone } = req.body;

  await User.register({username,password,first_name,last_name,phone});

  if (await User.authenticate(username, password) === true) {
    const token = jwt.sign({ username }, SECRET_KEY); //TODO: only need this from User.register
    
    return res.json({ token }); //TODO: update logintimestamp as well

  }

  throw new UnauthorizedError("Invalid user/password"); //TODO: if an err happens, not the right error -- if db err, should be in Models
});

module.exports = router;