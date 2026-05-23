CREATE DATABASE IF NOT EXISTS address_book_db;
USE address_book_db;

CREATE TABLE IF NOT EXISTS address_books (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS contacts (
    id BIGINT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    address_book_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_contacts_address_books
        FOREIGN KEY (address_book_id) REFERENCES address_books(id)
        ON DELETE CASCADE,
    CONSTRAINT uk_contact_name_per_book
        UNIQUE (address_book_id, first_name, last_name)
);
