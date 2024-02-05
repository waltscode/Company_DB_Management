DROP DATABASE IF EXISTS inq_employees_db;
CREATE DATABASE inq_employees_db;
USE inq_employees_db;

CREATE TABLE departments (
id INT AUTO_INCREMENT NOT NULL,
department_name VARCHAR(30) NOT NULL, 
PRIMARY KEY (id)
);

INSERT INTO departments(department_name) VALUES
('Sales'),
('Engineering'),
('Customer Service'),
('Management');

CREATE TABLE positions (
id INT AUTO_INCREMENT NOT NULL,
job_title VARCHAR(30) NOT NULL,
department_id INT,
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES departments (id)
);

ALTER TABLE positions
ADD COLUMN salary DECIMAL(10, 2); 

UPDATE positions
SET salary = 
    CASE 
        WHEN job_title = 'Customer Service' AND department_id = 3 THEN 50000
        WHEN job_title = 'Salesperson' AND department_id = 1 THEN 60000
        WHEN job_title = 'Software Engineer' AND department_id = 2 THEN 75000
        WHEN job_title = 'Manager' AND department_id = 4 THEN 90000
        ELSE NULL
    END
WHERE id IS NOT NULL AND salary IS NULL;

INSERT INTO positions (job_title, department_id) VALUES
('Customer Service', '3'),
('Salesperson', '1'),
('Software Engineer', '2'),
('Manager', '4'); 

CREATE TABLE managers (
id INT AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
department_id INT,
job_title VARCHAR(30) NOT NULL DEFAULT 'Manager',
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES departments (id)
);

INSERT INTO managers (first_name, last_name, department_id) VALUES
('Ali', 'Maqsood', '2'),
('John', 'Walters', '3'),
('Rocky', 'TheDog', '1'),
('Lebron', 'James', '4'); 

CREATE TABLE employees (
id INT AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
department_id INT, 
job_title INT,
PRIMARY KEY (id), 
 FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (job_title) REFERENCES positions(id)
    );

ALTER TABLE employees
ADD COLUMN manager_id INT,
ADD CONSTRAINT fk_manager
    FOREIGN KEY (manager_id)
    REFERENCES managers(id);
    
    
INSERT INTO employees (first_name, last_name, department_id, job_title) VALUES
('Alice', 'Brown', 1, 2),
    ('Bob', 'Jones', 2, 1),
    ('Catherine', 'Williams', 3, 3),
    ('David', 'Taylor', 1, 1),
    ('Eva', 'Miller', 2, 3),
    ('Frank', 'White', 3, 2),
    ('Grace', 'Anderson', 1, 3),
    ('Henry', 'Clark', 2, 1),
    ('Ivy', 'Moore', 3, 2),
    ('Jack', 'Hill', 1, 1),
    ('Kelly', 'Green', 2, 3),
    ('Leo', 'Parker', 3, 2),
    ('Mike', 'David', 1, 2),
    ('Josh', 'Denny', 2, 1),
    ('Celine', 'Dion', 3, 3);
    
UPDATE employees
SET manager_id = 
    CASE 
        WHEN first_name = 'Alice' AND last_name = 'Brown' THEN 3
        WHEN first_name = 'Bob' AND last_name = 'Jones' THEN 1
        WHEN first_name = 'Catherine' AND last_name = 'Williams' THEN 2
        WHEN first_name = 'David' AND last_name = 'Taylor' THEN 3
        WHEN first_name = 'Eva' AND last_name = 'Miller' THEN 1
        WHEN first_name = 'Frank' AND last_name = 'White' THEN 2
        WHEN first_name = 'Grace' AND last_name = 'Anderson' THEN 3
        WHEN first_name = 'Henry' AND last_name = 'Clark' THEN 1
        WHEN first_name = 'Ivy' AND last_name = 'Moore' THEN 2
        WHEN first_name = 'Jack' AND last_name = 'Hill' THEN 3
        WHEN first_name = 'Kelly' AND last_name = 'Green' THEN 1
        WHEN first_name = 'Leo' AND last_name = 'Parker' THEN 2
        WHEN first_name = 'Mike' AND last_name = 'David' THEN 3
        WHEN first_name = 'Josh' AND last_name = 'Denny' THEN 1
        WHEN first_name = 'Celine' AND last_name = 'Dion' THEN 2
        ELSE NULL
    END
WHERE manager_id IS NULL;
