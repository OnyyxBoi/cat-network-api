CREATE SCHEMA IF NOT EXISTS cat_network;
SET search_path = cat_network, public;

-- === Users ==================================================================
CREATE TABLE users (
  id               integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name             text        NOT NULL,
  first_name       text        NOT NULL,
  pseudonym        text        NOT NULL UNIQUE,
  age              integer     CHECK (age BETWEEN 0 AND 150),
  email            text        NOT NULL UNIQUE,
  password         text        NOT NULL,
  is_owner         boolean     NOT NULL DEFAULT false,
  is_veterinarian  boolean     NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- === Breeds =================================================================
CREATE TABLE breeds (
  id     integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name   text NOT NULL UNIQUE
);

-- === Clinics ================================================================
CREATE TABLE clinics (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text        NOT NULL,
  address    text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Clinic ↔ Veterinarian ======================================================
CREATE TABLE clinic_veterinarians (
  clinic_id integer NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  vet_id    integer NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  PRIMARY KEY (clinic_id, vet_id)
);

-- === Cats ===================================================================
CREATE TABLE cats (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text        NOT NULL,
  breed       integer     REFERENCES breeds(id),
  owner       integer     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  age         integer     CHECK (age BETWEEN 0 AND 40),
  weight      numeric(5,2) CHECK (weight > 0),
  main_clinic integer     REFERENCES clinics(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON cats (owner);
CREATE INDEX ON cats (breed);
CREATE INDEX ON cats (main_clinic);

-- === Appointments ===========================================================
CREATE TABLE appointments (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cat           integer NOT NULL REFERENCES cats(id)   ON DELETE CASCADE,
  veterinarian  integer NOT NULL REFERENCES users(id),
  date          timestamptz NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (veterinarian, date)
);

CREATE INDEX ON appointments (cat);
CREATE INDEX ON appointments (veterinarian);
CREATE INDEX ON appointments (date);
