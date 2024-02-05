const inquirer = require('inquirer');
const mysql = require('mysql');
require('dotenv').config();

// Create a connection to the MySQL database AND HIDE IT IN THE ENV FILE
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  startApp();
});

// Function to start the application
function startApp() {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View Departments', 
        'View Positions', 
        'View Employees', 
        'View Managers', 
        'Add Department', 
        'Add Position', 
        'Add Employee', 
        'Remove Position', 
        'Remove Department', 
        'Remove Employee',
        'Exit'],
    })
    .then((answers) => {
      switch (answers.action) {
        case 'View Departments':
          viewDepartments();
          break;
        case 'View Positions':
          viewPositions();
          break;
        case 'View Employees':
          viewEmployees();
          break;
        case 'View Managers':
          viewManagers();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Add Position':
          addPosition();
          break;
        case 'Add Employee':
          addEmployee();
          break;
          case 'Remove Position':
          removePosition();
          break;
        case 'Remove Department':
          removeDepartment();
          break;
          case 'Remove Employee':
          removeEmployee();
          break;
        case 'Exit':
          connection.end();
          console.log('Goodbye!');
          break;
        default:
          console.log('Invalid choice. Please try again.');
          startApp();
      }
    });
}

// Function to view departments
function viewDepartments() {
  connection.query('SELECT * FROM departments', (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp();
  });
}

// Function to view positions
function viewPositions() {
  connection.query('SELECT * FROM positions', (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp();
  });
}

// Function to view employees
function viewEmployees() {
  connection.query('SELECT * FROM employees', (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp();
  });
}

// Function to view managers
function viewManagers() {
  connection.query('SELECT * FROM managers', (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp();
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department:',
    })
    .then((answers) => {
      const departmentName = answers.departmentName;
      // Insert the new department into the database
      connection.query('INSERT INTO departments (department_name) VALUES (?)', [departmentName], (err, result) => {
        if (err) throw err;
        console.log(`Department "${departmentName}" added successfully!`);
        startApp();
      });
    });
}

// Function to remove a department
function removeDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department:',
    })
    .then((answers) => {
      const departmentName = answers.departmentName;
      // Delete the department from the database
      connection.query('DELETE FROM departments WHERE department_name = ?', [departmentName], (err, result) => {
        if (err) throw err;
        console.log(`Department "${departmentName}" removed successfully!`);
        startApp();
      });
    });
}

// Function to add a position
function addPosition() {
  // Fetch the list of departments from the database
  connection.query('SELECT id, department_name FROM departments', (err, departmentResults) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'jobTitle',
          message: 'Enter the job title:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary:',
        },
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select the department for the position:',
          choices: departmentResults.map(department => ({ name: department.department_name, value: department.id })),
        },
      ])
      .then((answers) => {
        const jobTitle = answers.jobTitle;
        const salary = answers.salary;
        const departmentId = answers.departmentId;

        // Insert the new position into the database
        connection.query('INSERT INTO positions (job_title, salary, department_id) VALUES (?, ?, ?)', [jobTitle, salary, departmentId], (err, result) => {
          if (err) throw err;
          console.log(`Position "${jobTitle}" added successfully!`);
          startApp();
        });
      });
  });
}

// Function to remove a position
function removePosition() {
  inquirer
    .prompt({
      type: 'input',
      name: 'jobTitle',
      message: 'Enter the job title:',
    })
    .then((answers) => {
      const jobTitle = answers.jobTitle;
      // Delete the position from the database
      connection.query('DELETE FROM positions WHERE job_title = ?', [jobTitle], (err, result) => {
        if (err) throw err;
        console.log(`Position "${jobTitle}" removed successfully!`);
        startApp();
      });
    });
}

// Function to add an employee
function addEmployee() {
  // Fetch the list of departments from the database
  connection.query('SELECT * FROM departments', (err, departmentResults) => {
    if (err) throw err;

    // Fetch the list of job titles from the database
    connection.query('SELECT * FROM positions', (err, positionResults) => {
      if (err) throw err;

      // Fetch the list of managers' last names from the database
      connection.query('SELECT * FROM managers', (err, managerResults) => {
        if (err) throw err;

        inquirer
          .prompt([
            {
              type: 'input',
              name: 'firstName',
              message: 'Enter the employee\'s first name:',
            },
            {
              type: 'input',
              name: 'lastName',
              message: 'Enter the employee\'s last name:',
            },
            {
              type: 'list',
              name: 'jobTitle',
              message: 'Select the employee\'s job title:',
              choices: positionResults.map(position => ({ name: position.job_title, value: position.id })),
            },
            {
              type: 'list',
              name: 'departmentId',
              message: 'Select the department for the employee:',
              choices: departmentResults.map(department => ({ name: department.department_name, value: department.id })),
            },
            {
              type: 'list',
              name: 'managerLastName',
              message: 'Select the last name of the employee\'s manager:',
              choices: managerResults.map(manager => ({ name: manager.last_name, value: manager.id })),
            },
          ])
          .then((answers) => {
            const firstName = answers.firstName;
            const lastName = answers.lastName;
            const jobTitleId = answers.jobTitle;
            const departmentId = answers.departmentId;
            const managerId = answers.managerLastName;

            // Insert the new employee into the database
            connection.query('INSERT INTO employees (first_name, last_name, job_title, department_id, manager_id) VALUES (?, ?, ?, ?, ?)', [firstName, lastName, jobTitleId, departmentId, managerId], (err, result) => {
              if (err) throw err;
              console.log(`Employee "${firstName} ${lastName}" added successfully!`);
              startApp();
            });
          });
      });
    });
  });
}

// Function to remove an employee
function removeEmployee() {
  // Fetch the list of employees from the database
  connection.query('SELECT id, first_name, last_name FROM employees', (err, employeeResults) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee to remove:',
          choices: employeeResults.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
        },
      ])
      .then((answer) => {
        const employeeId = answer.employeeId;

        // Remove the selected employee from the database
        connection.query('DELETE FROM employees WHERE id = ?', [employeeId], (err, result) => {
          if (err) throw err;
          console.log(`Employee with ID ${employeeId} removed successfully!`);
          startApp();
        });
      });
  });
}