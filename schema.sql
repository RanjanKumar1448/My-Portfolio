CREATE DATABASE IF NOT EXISTS portfolio;

USE portfolio;

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    technologies VARCHAR(255),
    github VARCHAR(255)
);