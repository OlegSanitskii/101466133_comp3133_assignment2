require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./models/Employee');

const photos = [
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1776034812/employee_photos/ihjhvtukzcxvzejef0ay.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1776034601/employee_photos/ky4bpwfzdduvtzva6vek.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771799019/employee_photos/ledjkviq2djm14ssxj29.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797534/employee_photos/tomjmtz5bxj17vnp7uzo.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797532/employee_photos/kka68v71kwscukg404mz.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797532/employee_photos/bra8dopzh7igdr0ujfxl.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797530/employee_photos/xiohzkunwgvlcvo4pw1x.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797529/employee_photos/nwy6crmxfrrgyuqrq1r1.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797529/employee_photos/p3itsipbyexhbfegbsiw.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797527/employee_photos/eebbglbb1ef2n6tjh3qr.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797526/employee_photos/efbxjsvyq4xvf2yjp5kz.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797525/employee_photos/hn59mys4bfuwxpokc2wu.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797524/employee_photos/bkj0ta8fcywq1hmiwgo4.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797523/employee_photos/dhckmd8hmrtzb5bgxziz.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797522/employee_photos/zyi7sejtickyj9vli4y1.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797521/employee_photos/cau0kcrxaibiwyihy0fh.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797520/employee_photos/vghehh6xa432rvoos4ct.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771797519/employee_photos/qt75whw6l7twq89bfvjg.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1771796820/employee_photos/ndabp2lrhui7aieft1qt.jpg",
  "https://res.cloudinary.com/dltzsfqfp/image/upload/v1776034812/employee_photos/ihjhvtukzcxvzejef0ay.jpg"
];

const employees = [
  { first_name: 'John', last_name: 'Smith', email: 'john.smith1@example.com', gender: 'Male', designation: 'Developer', salary: 4500, date_of_joining: new Date('2024-01-10'), department: 'IT', employee_photo: photos[0] },
  { first_name: 'Emma', last_name: 'Johnson', email: 'emma.johnson2@example.com', gender: 'Female', designation: 'QA Engineer', salary: 4200, date_of_joining: new Date('2024-02-05'), department: 'QA', employee_photo: photos[1] },
  { first_name: 'Liam', last_name: 'Brown', email: 'liam.brown3@example.com', gender: 'Male', designation: 'Backend Developer', salary: 5200, date_of_joining: new Date('2024-03-12'), department: 'IT', employee_photo: photos[2] },
  { first_name: 'Olivia', last_name: 'Davis', email: 'olivia.davis4@example.com', gender: 'Female', designation: 'HR Specialist', salary: 3900, date_of_joining: new Date('2024-04-02'), department: 'HR', employee_photo: photos[3] },
  { first_name: 'Noah', last_name: 'Miller', email: 'noah.miller5@example.com', gender: 'Male', designation: 'Project Manager', salary: 6500, date_of_joining: new Date('2024-05-18'), department: 'Management', employee_photo: photos[4] },
  { first_name: 'Sophia', last_name: 'Wilson', email: 'sophia.wilson6@example.com', gender: 'Female', designation: 'Designer', salary: 4100, date_of_joining: new Date('2024-06-01'), department: 'Design', employee_photo: photos[5] },
  { first_name: 'James', last_name: 'Moore', email: 'james.moore7@example.com', gender: 'Male', designation: 'DevOps Engineer', salary: 5600, date_of_joining: new Date('2024-07-11'), department: 'IT', employee_photo: photos[6] },
  { first_name: 'Isabella', last_name: 'Taylor', email: 'isabella.taylor8@example.com', gender: 'Female', designation: 'Business Analyst', salary: 4700, date_of_joining: new Date('2024-08-06'), department: 'Business', employee_photo: photos[7] },
  { first_name: 'Benjamin', last_name: 'Anderson', email: 'benjamin.anderson9@example.com', gender: 'Male', designation: 'Frontend Developer', salary: 5000, date_of_joining: new Date('2024-09-14'), department: 'IT', employee_photo: photos[8] },
  { first_name: 'Mia', last_name: 'Thomas', email: 'mia.thomas10@example.com', gender: 'Female', designation: 'Recruiter', salary: 4000, date_of_joining: new Date('2024-10-03'), department: 'HR', employee_photo: photos[9] },
  { first_name: 'Lucas', last_name: 'Jackson', email: 'lucas.jackson11@example.com', gender: 'Male', designation: 'System Analyst', salary: 4800, date_of_joining: new Date('2024-11-08'), department: 'IT', employee_photo: photos[10] },
  { first_name: 'Charlotte', last_name: 'White', email: 'charlotte.white12@example.com', gender: 'Female', designation: 'Accountant', salary: 4300, date_of_joining: new Date('2024-12-01'), department: 'Finance', employee_photo: photos[11] },
  { first_name: 'Henry', last_name: 'Harris', email: 'henry.harris13@example.com', gender: 'Male', designation: 'Security Engineer', salary: 5400, date_of_joining: new Date('2025-01-09'), department: 'IT', employee_photo: photos[12] },
  { first_name: 'Amelia', last_name: 'Martin', email: 'amelia.martin14@example.com', gender: 'Female', designation: 'Marketing Specialist', salary: 4100, date_of_joining: new Date('2025-02-15'), department: 'Marketing', employee_photo: photos[13] },
  { first_name: 'Alexander', last_name: 'Thompson', email: 'alexander.thompson15@example.com', gender: 'Male', designation: 'Database Admin', salary: 5700, date_of_joining: new Date('2025-03-12'), department: 'IT', employee_photo: photos[14] },
  { first_name: 'Harper', last_name: 'Garcia', email: 'harper.garcia16@example.com', gender: 'Female', designation: 'Product Owner', salary: 6200, date_of_joining: new Date('2025-04-04'), department: 'Management', employee_photo: photos[15] },
  { first_name: 'Daniel', last_name: 'Martinez', email: 'daniel.martinez17@example.com', gender: 'Male', designation: 'Support Engineer', salary: 3900, date_of_joining: new Date('2025-05-20'), department: 'Support', employee_photo: photos[16] },
  { first_name: 'Evelyn', last_name: 'Robinson', email: 'evelyn.robinson18@example.com', gender: 'Female', designation: 'UI Designer', salary: 4400, date_of_joining: new Date('2025-06-17'), department: 'Design', employee_photo: photos[17] },
  { first_name: 'Matthew', last_name: 'Clark', email: 'matthew.clark19@example.com', gender: 'Male', designation: 'Tech Lead', salary: 7200, date_of_joining: new Date('2025-07-07'), department: 'IT', employee_photo: photos[18] },
  { first_name: 'Abigail', last_name: 'Rodriguez', email: 'abigail.rodriguez20@example.com', gender: 'Female', designation: 'Operations Coordinator', salary: 4050, date_of_joining: new Date('2025-08-28'), department: 'Operations', employee_photo: photos[19] }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    await Employee.deleteMany({});
    console.log('Existing employees removed');

    await Employee.insertMany(employees);
    console.log('20 employees inserted successfully');

    await mongoose.disconnect();
    console.log('Done');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();