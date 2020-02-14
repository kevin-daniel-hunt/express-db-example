CREATE DATABASE express_db_example;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email varchar(100) UNIQUE,
  name varchar(100),
  hash varchar(100),
  salt varchar(100),
  created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  name varchar(100),
  owner integer REFERENCES users(id),
  created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

create table groups_to_emails (
  id SERIAL PRIMARY KEY,
  groupId INTEGER NOT NULL REFERENCES groups(id),
  email varchar(100) NOT NULL,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unique (groupId, email)
);