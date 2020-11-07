CREATE DATABASE jwttutorial;

-- 1. download and uuid extension
-- 2. create the table in sql shell
CREATE TABLE users(
user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
user_name VARCHAR(255) NOT NULL,
user_email VARCHAR(255) NOT NULL,
user_password VARCHAR(255) NOT NULL
);



-- 3. insert fake users - don't specify user id because it's automatically generated 
INSERT INTO users (user_name, user_email, user_password) 
VALUES ('henry', 'henryly123@gmail.com', 'kthl8822');