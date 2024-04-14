const pool = require('../utils/database_connection');

// Dashboard Display
const getDashBoard = async (id) => {
  try {
    const queryMemberStats = 
    `
    SELECT
      m.member_id,
      m.first_name,
      m.last_name,
      h.weight,
      h.height,
      h.bmi
    FROM
      members m
    JOIN 
      health_metrics h ON m.member_id = h.member_id
    WHERE
      m.member_id = $1;
    `;

    const queryRoutines = 
    `
    SELECT
      routine_name,
      description
    FROM
      routines
    WHERE
      member_id = $1;
    `;

    const queryAchievements = 
    `
    SELECT
      achievement_description,
      completion_date
    FROM
      achievements
    WHERE
      member_id = $1;
    `;

    const [ memberStats, routines, achievements ] = await Promise.all([
      pool.query(queryMemberStats, [id]),
      pool.query(queryRoutines, [id]),
      pool.query(queryAchievements, [id])
    ]);

    const dashBoardObj = {
      memberStats: memberStats.rows[0],
      routines: routines.rows,
      achievements: achievements.rows
    }

    return dashBoardObj;
  } catch (error) {
    console.error('Error fetching dashboard data: ', error);
    throw error;
  }
}

// Profile Management
const updatePersonalInfo = async (id, firstName, lastName, email, dob) => {
  if (id === undefined) {
    throw new Error('Member ID required for updating Member information.');
  }

  try {
    const argumentObj = {
      first_name: firstName,
      last_name: lastName,
      email,
      dob
    }

    const queryArguments = [];
    let queryClause = '';

    Object.entries(argumentObj).forEach(([ attribute, value ], index) => {
      if (value !== undefined && value !== null) {
        queryClause += `${attribute} = $${index + 1}, `;
        queryArguments.push(value);
      }
    });

    queryClause = queryClause.slice(0, -2);

    const queryUpdate = 
    `
    UPDATE
      members
    SET
      ${queryClause}
    WHERE
      member_id = $${queryArguments.length + 1};
    `;

    queryArguments.push(id);

    const response = await pool.query(queryUpdate, queryArguments);
    return response.rowCount === 1;
  } catch (error) {
    console.error('Error updating personal info: ', error);
  }
}

// Schedule Management
const checkForOverlappingSessions = async (sessionIdOrClassId, member_id, isGroupClass) => {
  let tableName, idColumnName;
  if (isGroupClass) {
      tableName = 'group_class_attendance';
      idColumnName = 'class_id';
  } else {
      tableName = 'member_sessions';
      idColumnName = 'session_id';
  }

  try {
      const overlapQuery = `
          SELECT 
            1
          FROM 
            ${tableName}
          WHERE 
            member_id = $1
          AND 
            ${idColumnName} = $2;
      `;
      const { rows } = await pool.query(overlapQuery, [member_id, sessionIdOrClassId]);
      return rows.length > 0;
  } catch (error) {
      console.error('Error checking for overlapping sessions: ', error);
  }
}

const viewSessionsAndClasses = async () => {
  const querySessions =
  `
  SELECT
    *
  FROM
    training_sessions;
  `;

  const responseSessions = await pool.query(querySessions);

  const queryClasses =
  `
  SELECT
    *
  FROM
    group_classes;
  `;

  const responseClasses = await pool.query(queryClasses);

  const sessionClassObj = {
    sessions: responseSessions.rows,
    classes: responseClasses.rows
  }

  return sessionClassObj;
}

const signUpForSession = async (sessionIdOrClassId, member_id, isGroupClass) => {
  try {
      const hasOverlap = await checkForOverlappingSessions(sessionIdOrClassId, member_id, isGroupClass);
      if (hasOverlap) {
          return false;
      }

      let tableName, idColumnName;
      if (isGroupClass) {
          tableName = 'group_class_attendance';
          idColumnName = 'class_id';
      } else {
          tableName = 'member_sessions';
          idColumnName = 'session_id';
      }


      const signUpQuery = `
          INSERT INTO ${tableName} (${idColumnName}, member_id)
          VALUES ($1, $2)
      `;
      await pool.query(signUpQuery, [sessionIdOrClassId, member_id]);
      return true;
  } catch (error) {
      console.error('Error signing up for session: ', error);
      throw error;
  }
}

const viewMemberSessions = async (member_id) => {
  const query =
  `
  SELECT
    *
  FROM
    member_sessions
  WHERE
    member_id = $1;
  `;

  const response = await pool.query(query, [member_id]);
  console.log(response.rows);
}

const viewGroupAttendance = async (member_id) => {
  const query =
  `
  SELECT
    *
  FROM
    group_class_attendance
  WHERE
    member_id = $1;
  `;

  const response = await pool.query(query, [member_id]);
  console.log(response.rows);
}

const cancelSession = async (sessionIdOrClassId, member_id, isGroupClass) => {
  let tableName, idColumnName;
  if (isGroupClass) {
      tableName = 'group_class_attendance';
      idColumnName = 'class_id';
  } else {
      tableName = 'member_sessions';
      idColumnName = 'session_id';
  }

  try {
      const cancelQuery = `
          DELETE FROM ${tableName}
          WHERE ${idColumnName} = $1
          AND member_id = $2
      `;
      await pool.query(cancelQuery, [sessionIdOrClassId, member_id]);
      return true;
  } catch (error) {
      console.error('Error canceling session: ', error);
      throw error;
  }
}

module.exports = {
  getDashBoard,
  updatePersonalInfo,
  checkForOverlappingSessions,
  viewSessionsAndClasses,
  signUpForSession,
  viewMemberSessions,
  viewGroupAttendance,
  cancelSession
}