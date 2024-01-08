"use strict";
const { NotFoundError } = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const BCRYPT_WORK_FACTOR = require("./config")

/** User of the site. */

class User {

  /** Register new user. Returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {

    const hashed_pw = bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(`
      INSERT INTO users ( username,
                          password,
                          first_name,
                          last_name,
                          phone)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING username, password, first_name, last_name, phone
    `,[username,
      hashed_pw,
      first_name,
      last_name,
      phone]);

    return result.rows[0]; //TODO: return instance of User vs db query?
  }

  /** Authenticate: is username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT password
          FROM users
          WHERE username = $1`,
        [username]);

    const user = result.rows[0];

    if (user) {
      if (await bcrypt.compare(password, user.password) === true) {
        return true;
      }
    }
    return false;
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    await db.query(
      `UPDATE users
          SET last_login_at = current_timestamp
          WHERE username = $1`,
        [username]);
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

  static async all() {
    const results = await db.query(
      `SELECT username, first_name, last_name
          FROM users`);

    return results.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const results = await db.query(
      `SELECT username, first_name, last_name, phone, join_at, last_login_at
          FROM users
          WHERE username = $1`
        [username]);

    return results.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {

    // WITH to_user AS (
    //   SELECT  username,
    //           first_name,
    //           last_name,
    //           phone
    //     FROM users
    // )

    const result = db.query(`

    SELECT m.id, u.username, m.body, m.sent_at, m.read_at
    FROM users as u
      JOIN messages as m
        ON u.username = m.from_username
      WHERE username = $1`,
      [username])

  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {

    const result = db.query(`

    SELECT m.id, u.username, m.body, m.sent_at, m.read_at
    FROM users as u
      JOIN messages as m
        ON u.username = m.to_username
      WHERE username = $1`,
      [username])

  }
}


module.exports = User;
