DROP TABLE IF EXISTS group_class_attendance;
DROP TABLE IF EXISTS billing_logs;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS routines;
DROP TABLE IF EXISTS member_sessions;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS health_metrics;
DROP TABLE IF EXISTS schedule_logs;
DROP TABLE IF EXISTS maintenance_logs;
DROP TABLE IF EXISTS group_classes;
DROP TABLE IF EXISTS training_sessions;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS trainers;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS users;



CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  role VARCHAR(20) -- 'member', 'trainer', 'admin'
);


CREATE TABLE members (
  member_id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(user_id),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  dob DATE
);


CREATE TABLE trainers (
  trainer_id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(user_id),
  first_name VARCHAR(50),
  last_name VARCHAR(50)
);


CREATE TABLE admins (
  admin_id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(user_id),
  first_name VARCHAR(50),
  last_name VARCHAR(50)
);


CREATE TABLE training_sessions (
  session_id SERIAL PRIMARY KEY,
  trainer_id INT REFERENCES trainers(trainer_id),
  session_name VARCHAR(100),
  room_number INT UNIQUE,
  session_date DATE,
  session_time TIME
);

CREATE TABLE group_classes (
  class_id SERIAL PRIMARY KEY,
  trainer_id INT REFERENCES trainers(trainer_id),
  class_name VARCHAR(100),
  room_number INT UNIQUE,
  class_date DATE,
  class_time TIME
);


CREATE TABLE billing_logs (
  billing_id SERIAL PRIMARY KEY,
  member_id INT REFERENCES members(member_id),
  amount NUMERIC(10, 2),
  signup_date DATE
);

CREATE TABLE goals (
  goal_id SERIAL PRIMARY KEY,
  member_id INT REFERENCES members(member_id),
  goal_desc TEXT,
  start_date DATE,
  end_date DATE,
  goal_status VARCHAR(10) DEFAULT 'incomplete'
);

CREATE TABLE routines (
  routine_id SERIAL PRIMARY KEY,
  member_id INT REFERENCES members(member_id),
  routine_name VARCHAR(50),
  description TEXT
);

CREATE TABLE member_sessions (
  session_id SERIAL PRIMARY KEY,
  member_id INT REFERENCES members(member_id)
);

CREATE TABLE achievements (
  achievement_id SERIAL PRIMARY KEY,
  member_id INT REFERENCES members(member_id),
  achievement_description TEXT,
  completion_date DATE
);

CREATE TABLE health_metrics (
  metric_id SERIAL PRIMARY KEY,
  member_id INT REFERENCES members(member_id),
  weight NUMERIC(8, 2), -- kg
  height NUMERIC(8, 2), -- cm
  bmi NUMERIC(8, 2) -- weight / (height / 100)^2
);

CREATE TABLE schedule_logs (
  sched_id SERIAL PRIMARY KEY,
  session_id INT REFERENCES training_sessions(session_id),
  class_id INT REFERENCES group_classes(class_id),
  trainer_id INT REFERENCES trainers(trainer_id),
  log_name VARCHAR(100),
  room_number INT,
  log_date DATE,
  log_time TIME
);

CREATE TABLE maintenance_logs (
  log_id SERIAL PRIMARY KEY,
  status TEXT,
  log_date DATE
);

CREATE TABLE group_class_attendance (
  attendance_id SERIAL PRIMARY KEY,
  class_id INT REFERENCES group_classes(class_id),
  member_id INT REFERENCES members(member_id),
  UNIQUE(class_id, member_id)
);