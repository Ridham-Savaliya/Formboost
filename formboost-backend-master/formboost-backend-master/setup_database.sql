-- Complete database setup for FormBoost
USE formboost_db;

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS UserPlans;
DROP TABLE IF EXISTS Plans;

-- Create Plans table
CREATE TABLE Plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  formLimit INT NOT NULL DEFAULT 5,
  submissionLimit INT NOT NULL DEFAULT 100,
  isFree BOOLEAN NOT NULL DEFAULT FALSE,
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create UserPlans table (note: table name is UserPlans, not userplans)
CREATE TABLE UserPlans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  planId INT NOT NULL,
  startDate DATETIME NOT NULL,
  endDate DATETIME NOT NULL,
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (planId) REFERENCES Plans(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert free plan
INSERT INTO Plans (name, description, price, formLimit, submissionLimit, isFree, isActive) 
VALUES ('Free Plan', 'Basic free plan with limited features', 0.00, 5, 100, TRUE, TRUE);

-- Show created tables and verify
SHOW TABLES;
SELECT * FROM Plans;
DESCRIBE UserPlans;
