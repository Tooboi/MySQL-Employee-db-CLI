INSERT INTO departments (department_name)
VALUES ("Nursing"),
        ("Engineering"),
        ("Janatorial"),
        ("Legal");

INSERT INTO role (title, salary, department)
VALUES ("Head Nurse", 80000, 1),
        ("Doctor", 180000, 1),
        ("Cleaner", 65000, 3),
        ("Maintnence", 90000, 2),
        ("Lawyer", 200000, 4),
        ("Data Analytics", 100000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Rose", "Flanders", 1),
        ("Gary", "Pimmento", 2),
        ("Lisa", "Bran", 3),
        ("Florence", "Garcia", 4),
        ("Barry", "Lawburger", 5),
        ("Ben", "Sanders", 6);