\echo 'Delete and recreate messagely db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE messagely;
CREATE DATABASE messagely;
\connect messagely


CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  join_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_username TEXT NOT NULL REFERENCES users,
  to_username TEXT NOT NULL REFERENCES users,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE);

INSERT INTO users (
  username,
  password,
  first_name,
  last_name,
  phone,
  join_at)
VALUES ('johnsmith', 'password', 'John', 'Smith', '333.333.3333', '2020-01-01 12:00'),
        ('janedoe', 'password', 'Jane', 'Doe', '333.333.3333', '2020-01-01 12:00');

INSERT INTO messages (
  from_username,
  to_username,
  body,
  sent_at,
  read_at)
VALUES ('janedoe', 'johnsmith', 'Hi John!', '2023-12-25 12:30', '2024-1-25 12:30'),
('janedoe', 'johnsmith', 'Hi John PLEASE ANSWER!', '2023-12-25 12:30', '2024-1-25 12:30'),
('janedoe', 'johnsmith', 'JOOOOOOOOOOOOOOOOHN!', '2023-12-25 12:30', '2024-1-25 12:30'),
('johnsmith', 'janedoe', 'sup', '2024-1-25 12:30', '2024-1-25 12:35');


\echo 'Delete and recreate messagely_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE messagely_test;
CREATE DATABASE messagely_test;
\connect messagely_test

CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  join_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_username TEXT NOT NULL REFERENCES users,
  to_username TEXT NOT NULL REFERENCES users,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE);




