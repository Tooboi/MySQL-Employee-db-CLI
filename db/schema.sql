DROP DATABASE IF EXISTS factory_db;
CREATE DATABASE factory_db;

USE factory_db;

CREATE TABLE department (
    id INT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
)