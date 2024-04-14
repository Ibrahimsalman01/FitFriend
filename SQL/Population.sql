INSERT INTO users (username, email, password, role)
VALUES 
  ('john@example.com', 'john@example.com', 'password1', 'member'),
  ('jane@example.com', 'jane@example.com', 'password2', 'member'),
  ('alice@example.com', 'alice@example.com', 'password3', 'member'),
  ('newUser', 'user@email.com', 'p123', 'member'),
  ('trainer1@example.com', 'trainer1@example.com', 'password4', 'trainer'),
  ('trainer2@example.com', 'trainer2@example.com', 'password5', 'trainer'),
  ('admin1', 'admin1@email.com', 'password123', 'admin'),
  ('admin2@example.com', 'admin2@example.com', 'password7', 'admin');


INSERT INTO members (user_id, first_name, last_name, dob)
VALUES 
  (1, 'John', 'Doe', '1990-05-15'),
  (2, 'Jane', 'Smith', '1985-09-23'),
  (3, 'Alice', 'Johnson', '1995-02-10');


INSERT INTO trainers (user_id, first_name, last_name)
VALUES 
  (4, 'Trainer', 'One'),
  (5, 'Trainer', 'Two');


INSERT INTO admins (user_id, first_name, last_name)
VALUES 
  (6, 'Admin', '1'),
  (7, 'Admin', 'Two');


INSERT INTO health_metrics (member_id, weight, height, bmi)
VALUES 
  (1, 75.5, 180, 23.31), -- John Doe's health metrics
  (2, 63.2, 165, 23.18), -- Jane Smith's health metrics
  (3, 70.8, 172, 23.92); -- Alice Johnson's health metrics


INSERT INTO routines (member_id, routine_name, description)
VALUES 
  (1, 'Morning Workout', 'Cardio and strength training routine'),
  (2, 'Evening Yoga', 'Relaxation and flexibility routine'),
  (3, 'Weekly Run', 'Outdoor running routine');


INSERT INTO achievements (member_id, achievement_description, completion_date)
VALUES 
  (1, 'Completed 10k run', '2024-04-05'),
  (2, 'Achieved target weight loss', '2024-04-10'),
  (3, 'Improved flexibility', '2024-04-15');


INSERT INTO goals (member_id, goal_desc, start_date, end_date, goal_status)
VALUES 
  (1, 'Run a marathon', '2024-04-01', '2024-06-01', 'incomplete'),
  (2, 'Lose 5kg weight', '2024-04-01', '2024-05-01', 'incomplete'),
  (3, 'Improve endurance', '2024-04-01', '2024-05-01', 'incomplete');



INSERT INTO training_sessions (trainer_id, session_name, room_number, session_date, session_time)
VALUES 
  (1, 'Session 1', 101, '2024-04-15', '09:00:00'),
  (1, 'Session 2', 102, '2024-04-16', '10:00:00'),
  (2, 'Session 3', 103, '2024-04-17', '11:00:00'),
  (1, 'Session 4', 104, '2024-04-18', '12:00:00'),
  (2, 'Session 5', 105, '2024-04-19', '13:00:00');


INSERT INTO group_classes (trainer_id, class_name, room_number, class_date, class_time)
VALUES 
  (1, 'Yoga', 201, '2024-04-15', '09:00:00'),
  (2, 'Zumba', 202, '2024-04-15', '10:00:00'),
  (1, 'Pilates', 203, '2024-04-16', '11:00:00'),
  (2, 'Boxing', 204, '2024-04-16', '12:00:00');


INSERT INTO schedule_logs (session_id, trainer_id, log_name, room_number, log_date, log_time)
VALUES 
  (1, 1, 'Session 1', 101, '2024-04-15', '09:00:00'),
  (2, 1, 'Session 2', 102, '2024-04-16', '10:00:00'),
  (3, 2, 'Session 3', 103, '2024-04-17', '11:00:00'),
  (4, 1, 'Session 4', 104, '2024-04-18', '12:00:00'),
  (5, 2, 'Session 5', 105, '2024-04-19', '13:00:00');


INSERT INTO schedule_logs (class_id, trainer_id, log_name, room_number, log_date, log_time)
VALUES 
  (1, 1, 'Yoga', 201, '2024-04-15', '09:00:00'),
  (2, 2, 'Zumba', 202, '2024-04-15', '10:00:00'),
  (3, 1, 'Pilates', 203, '2024-04-16', '11:00:00'),
  (4, 2, 'Boxing', 204, '2024-04-16', '12:00:00');


INSERT INTO billing_logs (member_id, amount, signup_date)
VALUES 
  (1, 50.00, '2024-04-01'),
  (2, 75.00, '2024-04-02'),
  (3, 100.00, '2024-04-03');


INSERT INTO maintenance_logs (status, log_date)
VALUES 
  ('Performed maintenance', '2024-04-15'),
  ('Repaired equipment', '2024-04-16'),
  ('Cleaned facility', '2024-04-17'),
  ('Performed cleaning', '2024-04-18'),
  ('Replaced equipment', '2024-04-19');


INSERT INTO group_class_attendance (class_id, member_id)
VALUES 
  (1, 2),
  (1, 3),
  (2, 1),
  (3, 3);