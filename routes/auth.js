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

  throw new UnauthorizedError("Invalid user/password");

});


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post('/register', async function (req, res, next) {
  if (req.body === undefined) throw new BadRequestError();

  const { username, password, first_name, last_name, phone } = req.body;

  console.log("before new_user");
  await User.register({username,password,first_name,last_name,phone});

  if (await User.authenticate(username, password) === true) {
    const token = jwt.sign({ username }, SECRET_KEY);
    console.log(token);
    return res.json({ token });

  }

  throw new UnauthorizedError("Invalid user/password");
});

module.exports = router;