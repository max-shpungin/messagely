"use strict";
const { NotFoundError } = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config")

/** User of the site. */

class User {

  /** Register new user. Returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    
    const hashed_pw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    console.log("got up to this point");
    const result = await db.query(
      `INSERT INTO users (username,
                          password,
                          first_name,
                          last_name,
                          phone,
                          join_at = current_timestamp)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING username, password, first_name, last_name, phone`,
      [username,
      hashed_pw,
      first_name,
      last_name,
      phone]);
      console.log("got up to this point too");

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

    const result = await db.query(`
          SELECT
              m.id,
              to_user.username,
              to_user.first_name,
              to_user.last_name,
              to_user.phone,
              m.body,
              m.sent_at,
              m.read_at

          FROM users as u
          JOIN messages as m ON
              u.username = m.from_username
          JOIN users as to_user on
              m.to_username = to_user.username
          WHERE u.username = $1
          ORDER BY m.sent_at DESC`,
          [username])

      const messages = result.rows
        .map(({id, body, sent_at, read_at, ...to_user}) => {
          // const {id, body, sent_at, read_at, ...to_user} = row;
          return {id, to_user, body, sent_at, read_at};
        });

      return messages;
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
