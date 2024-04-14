const pool = require('../utils/database_connection');

const viewAllMembers = async () => {
  try {
    const query =
    `
    SELECT
      *
    FROM
      members;
    `;

    const response = await pool.query(query);
    console.log(response.rows);
  } catch (error) {
    console.error('Error when trying to view all members: ', error);
  }
}

const viewTrainers = async () => {
  const query =
  `
  SELECT
    *
  FROM
    trainers;
  `;

  const response = await pool.query(query);
  console.log(response.rows);
}

const roomAvailability = async (room_number) => {
  try {
    const tableList = ['training_sessions', 'group_classes'];

    for (let i = 0; i < 2; i++) {
      const table = tableList[i];
      
      const queryAvailability =
      `
      SELECT
        COUNT(*)
      FROM
        ${table}
      WHERE
        room_number = $1;
      `;
      const { rows } = await pool.query(queryAvailability, [room_number]);
      
      if (parseInt(rows[0].count) > 0) return false;
    }
  
    return true;
  } catch (error) {
    console.error('Error checking room availability: ', error);
    throw error;
  }
}

const trainerAvailability = async (trainer_id, date, time) => {
  try {
    const query = 
    `
    SELECT
      *
    FROM
      schedule_logs
    WHERE
      trainer_id = $1
    AND
      log_date = $2
    AND
      log_time = $3
    `;

    const response = await pool.query(query, [trainer_id, date, time]);
    return response.rowCount === 0;
  } catch (error) {
    console.error('Error checking room availability: ', error);
    throw error;
  }
}

const bookRoom = async (trainer_id, name, date, time, room_number, isGroupClass) => {
  if (!(await roomAvailability(room_number))) return false;
  if (!(await trainerAvailability(trainer_id, date, time))) return false;
  
  try {
    let table, header;

    if (isGroupClass) {
      table = 'group_classes';
      header = 'class_';
    } else {
      table = 'training_sessions';
      header = 'session_';
    }
  
    const queryRoomBook =
    `
    INSERT INTO ${table} (trainer_id, ${header}name, room_number, ${header}date, ${header}time)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `;
  
    const response = await pool.query(queryRoomBook, [trainer_id, name, room_number, date, time]);
    console.log(response.rows[0]);
    const { session_id, class_id } = response.rows[0];

    const queryScheduleUpdate =
    `
    INSERT INTO schedule_logs (session_id, class_id, trainer_id, log_name, room_number, log_date, log_time)
    VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;
  
    await pool.query(queryScheduleUpdate, [session_id, class_id, trainer_id, name, room_number, date, time]);

    console.log('Room booked successfully');
    return true;
  } catch (error) {
    console.error('Error booking room: ', error);
    throw error;
  }
}

const viewMaintenanceLog = async () => {
  try {
    const query =
    `
    SELECT
      *
    FROM
      maintenance_logs;
    `;

    const { rows } = await pool.query(query);
    console.log(rows);
  } catch (error) {
    console.error('Error viewing maintenance log: ', error);
    throw error;
  }
}

const addMaintenanceLog = async (status, log_date) => {
  try {
    const query =
    `
    INSERT INTO maintenance_logs (status, log_date)
    VALUES ($1, $2);
    `;

    await pool.query(query, [status, log_date]);
  } catch (error) {
    console.error('Error adding maintenance log: ', error);
    throw error;
  }
}

const removeMaintenanceLog = async (log_id) => {
  try {
    const query = 
    `
    DELETE FROM
      maintenance_logs
    WHERE
      log_id = $1;
    `;

    const response = await pool.query(query, [log_id]);
    return response.rowCount === 1;
  } catch (error) {
    console.error('Error removing maintenance log: ', error);
    throw error;
  }
}

const viewBillingLogs = async () => {
  try {
    const query = 
    `
    SELECT
      *
    FROM
      billing_logs;
    `;

    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error viewing billing logs: ', error);
    throw error;
  }
}

const viewAllUsers = async () => {
  const query =
  `
  SELECT
    *
  FROM
    users;
  `;

  const response = await pool.query(query);
  console.log(response.rows);
}

// also adds to billing log
const addMember = async (username, first_name, last_name, dob, signUpDate, amount) => {
  try {
    const queryFindUser =
    `
    SELECT
      *
    FROM
      users
    WHERE
      username = $1;
    `;

    const response = await pool.query(queryFindUser, [username]);
    const user_id = response.rows[0].user_id;
    
    const queryAddMember =
    `
    INSERT INTO members (user_id, first_name, last_name, dob)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;

    const newMember = await pool.query(queryAddMember, [user_id, first_name, last_name, dob]);
    const member_id = newMember.rows[0].member_id;

    const queryBillingInsert = 
    `
    INSERT INTO billing_logs (member_id, amount, signup_date)
    VALUES ($1, $2, $3);
    `;

    await pool.query(queryBillingInsert, [member_id, amount, signUpDate]);
    console.log('Member and Billing payment succesfully created');
  } catch (error) {
    console.error('Error adding member: ', error);
    throw error;
  } 
}

const removeMember = async (member_id) => {
  try {
    await pool.query('BEGIN')

    const queryBillingLogRemove =
    `
    DELETE FROM
      billing_logs
    WHERE
      member_id = $1;
    `;

    await pool.query(queryBillingLogRemove, [member_id]);

    const queryMemberRemove =
    `
    DELETE FROM
      members
    WHERE
      member_id = $1;
    `;

    await pool.query(queryMemberRemove, [member_id]);

    await pool.query('COMMIT');

    console.log('Member successfully removed');
  } catch (error) {
    console.error('Error trying to delete member: ', error);
  }
}

module.exports = {
  viewTrainers,
  viewAllUsers,
  viewAllMembers,
  roomAvailability,
  trainerAvailability,
  bookRoom,
  viewMaintenanceLog,
  addMaintenanceLog,
  removeMaintenanceLog,
  viewBillingLogs,
  addMember,
  removeMember
}