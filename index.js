const pool = require('./utils/database_connection');
const prompt = require('prompt-sync')();
const membersRouter = require('./controllers/members');
const trainersRouter = require('./controllers/trainers');
const adminRouter = require('./controllers/admin');
const userRouter = require('./controllers/users');
require('dotenv').config();

const main = async () => {
  console.log('\nWelcome to FitFriend!\n');

  while (true) {
    console.log(
      `\tMain Menu:
      (1) User Registration
      (2) User Login
      (q) Exit\n`
    );

    const userInp = prompt('Enter your selection: ');
    
    switch (userInp) {
      case '1':
        await userRegistration();
        break;
      case '2':
        await userLoginMenu();
        break;
      case 'q':
        console.log('Thanks for using FitFriend! Goodbye!');
        return;
      default:
        console.log('Invalid selection. Please try again!');
    }
  }
}

const userRegistration = async () => {
  console.log('\tUser Registration:\n');
  const username = prompt('Enter a username: ');
  const password = prompt('Enter password: ');
  const email = prompt('Enter an email: ');

  await userRouter.createUser(username, password, email);
}

const userLoginMenu =  async () => {
  console.log('\tUser Login:\n');
  const username = prompt('Enter your username: ');
  const password = prompt('Enter your password: ');
  let user;

  if (user = await userRouter.userLogin(username, password)) {
    if (user.role === 'member') await memberMenu(user);
    else if (user.role === 'trainer') await trainerMenu(user);
    else if (user.role === 'admin') await adminMenu(user);
  } else {
    console.log('Invalid username or password');
  }
}

const memberMenu = async (user) => {
  console.log(`Welcome ${user.username}!\n`);

  const response = await membersRouter.getDashBoard(user.user_id);
  user.member_id = response.memberStats.member_id;

  while (true) {
    console.log(
      `\tMember Menu:
      (1) View Dashboard
      (2) Update Personal Information
      (3) Sign up for a Training Event
      (4) Cancel registered Training Event
      (q) Logout\n`
    );

    const userInp = prompt('Enter your selection: ');
    
    switch (userInp) {
      case '1':
        await viewDashBoard(user);
        break;
      case '2':
        await updatePersonalInfo(user);
        break;
      case '3':
        await signUpForSession(user);
        break;
      case '4':
        await cancelSession(user);
        break;
      case 'q':
        console.log('Logging out...');
        return;
      default:
        console.log('Invalid selection. Please try again!');
    }
  }
}

const viewDashBoard = async (user) => {
  const dashBoard = await membersRouter.getDashBoard(user.user_id);
  console.log(dashBoard);
}

const updatePersonalInfo = async (user) => {
  const response = await membersRouter.getDashBoard(user.user_id);
  const { member_id } = response.memberStats;

  const firstName = prompt('Enter new first name: ');
  const lastName = prompt('Enter new last name: ');
  const email = prompt('Enter new email: ');
  const dob = prompt('Enter new date of birth: ');

  const argList = [firstName, lastName, email, dob];

  for (let i = 0; i < argList.length; i++) {
    if (argList[i].length === 0) argList[i] = undefined;
  }

  await membersRouter.updatePersonalInfo(member_id, argList[0], argList[1], argList[2], argList[3]);
  console.log('Information updated successfully!');
}

const signUpForSession = async (user) => {
  const sessionClassObj = await membersRouter.viewSessionsAndClasses();
  const eventType = prompt("Which event type would you like to sign up for? ('session' or 'class'): ");
  
  if (eventType === 'session') {
    console.log(sessionClassObj.sessions);
  } else {
    console.log(sessionClassObj.classes);
  }

  const id = prompt('Whats the class/session id of the event you want to sign up for? ');
  const isGroupClass = eventType === 'class' ? true : false;

  await membersRouter.signUpForSession(id, user.member_id, isGroupClass);

  console.log('Succesfully registered for event');
}

const cancelSession = async (user) => {
  const eventType = prompt("Are you cancelling a 'session' or 'class'? ");

  if (eventType === 'session') {
    await membersRouter.viewMemberSessions(user.member_id);
  } else if (eventType === 'class') {
    await membersRouter.viewGroupAttendance(user.member_id);
  }

  const eventId = prompt("What's the ID of the event you want to cancel? ");
  const isGroupClass = eventType === 'class' ? true : false;

  await membersRouter.cancelSession(eventId, user.member_id, isGroupClass);
}


const trainerMenu = async (user) => {
  console.log(`Welcome ${user.username}!\n`);
  
  const trainerInfo = await trainersRouter.viewTrainerInfo(user.user_id);
  user.trainer_id = trainerInfo[0].trainer_id;

  while (true) {
    console.log(
      `\tTrainer Menu:
      (1) View Member Profile
      (2) View Schedule Log
      (3) Cancel Training Event
      (q) Logout`
    );

    const userInp = prompt('Enter your selection: ');
    
    switch (userInp) {
      case '1':
        await viewMemberProfiles(user);
        break;
      case '2':
        await viewScheduleLog(user);
        break;
      case '3':
        await cancelTrainingEvent(user);
        break;
      case 'q':
        console.log('Logging out...');
        return;
      default:
        console.log('Invalid selection. Please try again!');
    }
  }
}

const viewMemberProfiles = async (user) => {
  await trainersRouter.viewMemberProfiles();
}

const viewScheduleLog = async (user) => {
  await trainersRouter.viewScheduleLog(user.trainer_id);
}

const cancelTrainingEvent = async (user) => {
  const eventType = prompt("Do you want to cancel a 'session' or 'class'? ");
  const isGroupClass = eventType === 'class' ? true : false;
  await trainersRouter.viewScheduleLog(user.trainer_id);

  const eventId = Number(prompt("What's the ID of the event you want to cancel (session_id or class_id)? "));

  await trainersRouter.cancelTrainingEvent(user.trainer_id, eventId, isGroupClass);
  console.log('Successfully cancelled event');
}

const adminMenu = async (user) => {
  console.log(`Welcome ${user.username}!\n`);

  while (true) {
    console.log(
      `\tAdmin Menu:
      (1) Book a room
      (2) Add Maintenance Log
      (3) Remove Maintenance Log
      (4) Add Member
      (5) Remove Member
      (q) Logout`
    );

    const userInp = prompt('Enter your selection: ');
    
    switch (userInp) {
      case '1':
        await bookRoom(user);
        break;
      case '2':
        await addMaintenanceLog(user);
        break;
      case '3':
        await removeMaintenanceLog(user);
        break;
      case '4':
        await addMember(user);
        break;
      case '5':
        await removeMember(user);
        break;
      case 'q':
        console.log('Logging out...');
        return;
      default:
        console.log('Invalid selection. Please try again!');
    }
  }
}

const bookRoom = async (user) => {
  console.log('Here is a list of trainers:');
  await adminRouter.viewTrainers();

  const trainer_id = Number(prompt('Enter the ID of the trainer you wish to train the event: '));
  const name = prompt('What will the event be called? ');
  const date = prompt('What date will the event take place (format: yyyy-mm-dd)? ');
  const time = prompt('When will the event take place (format: hh:mm:ss)? ');
  const room_number = Number(prompt("What room will the event take place in (integer 0-999)? "));
  const eventType = prompt("Is it a 'session' or 'class'? ");
  const isGroupClass = eventType === 'class' ? true : false;
  
  await adminRouter.bookRoom(trainer_id, name, date, time, room_number, isGroupClass);
  console.log('Successfully booked event');
}

const addMaintenanceLog = async (user) => {
  const status = prompt("What's the reason for the log? ");
  const date = prompt("What's the date when the issue occured (format:yyyy-mm-dd)? ");

  await adminRouter.addMaintenanceLog(status, date);
  console.log('Successfully created maintenance log');
}

const removeMaintenanceLog = async (user) => {
  await adminRouter.viewMaintenanceLog();

  const log_id = Number(prompt("Enter the ID of the log you want to delete: "));

  await adminRouter.removeMaintenanceLog(log_id);
  console.log('Removed maintenance log successfully');
}

const addMember = async (user) => {
  await adminRouter.viewAllUsers();

  const username = prompt("What's the username of the user you want to add to members? ");
  const first_name = prompt("What's the user's first name? ");
  const last_name = prompt("What's the user's last name? ");
  const dob = prompt("What's the user's date of birth (format: yyyy-mm-dd)? ");
  const signup_date = prompt("What's the date the user wants to sign up (format: yyyy-mm-dd)? ");


  await adminRouter.addMember(username, first_name, last_name, dob, signup_date, 50.00);
}

const removeMember = async (user) => {
  await adminRouter.viewAllMembers();

  const member_id = Number(prompt("What's the ID of the member you want to remove? "));

  await adminRouter.removeMember(member_id);
}

console.log('Attempting to connect to the database');
pool
  .connect()
  .then(async () => {
    console.log('Successfully connected to the database');
    main();
  })
  .catch(error => {
    console.error('Error in connecting/initializing database: ', error);
  });