const pool = require('../utils/database_connection');

const viewTrainerInfo = async (user_id) => {
  const query =
  `
  SELECT
    *
  FROM
    trainers
  WHERE
    user_id = $1;
  `;

  const response = await pool.query(query, [user_id]);
  return response.rows;
}

const viewMemberProfiles = async () => {
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
    console.error('Error trying to view your schedule: ', error);
  }
}

const viewScheduleLog = async (id) => {
  try {
    const query =
    `
    SELECT
      *
    FROM
      schedule_logs
    WHERE
      trainer_id = $1;
    `;

    const response = await pool.query(query, [id]);
    console.log(response.rows);
  } catch (error) {
    console.error('Error trying to view your schedule: ', error);
    throw error;
  }
}

const cancelTrainingEvent = async (trainer_id, event_id, isGroupClass) => {
  try {
    let table, header;
    if (isGroupClass) {
      table = 'group_classes';
      header = 'class_';
    } else {
      table = 'training_sessions';
      header = 'session_';
    }

    await pool.query('BEGIN');

    const queryScheduleDelete =
    `
    DELETE FROM
      schedule_logs
    WHERE
      ${header}id = $1
    AND
      trainer_id = $2;
    `;

    await pool.query(queryScheduleDelete, [event_id, trainer_id]);
    
    const queryMainDelete =
    `
    DELETE FROM
      ${table}
    WHERE
      ${header}id = $1
    AND
      trainer_id = $2;
    `;

    await pool.query(queryMainDelete, [event_id, trainer_id]);

    await pool.query('COMMIT');

    console.log('Event cancelled successfully');
    return true;
  } catch (error) {
    console.error('Error trying to cancel event: ', error);
    throw error;
  }
}

module.exports = {
  viewTrainerInfo,
  viewMemberProfiles,
  viewScheduleLog,
  cancelTrainingEvent
}