CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  user_id           uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  auth_id           varchar(255) NOT NULL,
  username          varchar(255)
);

CREATE TABLE messages (
  message_id           uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id           uuid NOT NULL REFERENCES users(user_id),
  message           varchar(255) NOT NULL,
  created_at        timestamp WITH time zone NOT NULL DEFAULT now()
);
