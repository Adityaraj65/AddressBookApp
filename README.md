# Address Book Management System

Monolithic Spring Boot backend for managing address books and contacts.

## Tech Stack

- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL
- Maven
- Lombok
- Jakarta Validation
- JUnit 5

## Project Structure

```text
src/main/java/com/addressbook
├── config
├── controller
├── dto
├── entity
├── exception
├── repository
├── service
└── util
```

## Database

Default MySQL configuration is in `src/main/resources/application.properties`.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/address_book_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
```

The SQL schema is also available at `src/main/resources/schema.sql`.

## Run

```bash
mvn spring-boot:run
```

The API runs on:

```text
http://localhost:8080
```

## Tests

```bash
mvn test
```

Tests use an in-memory H2 database with MySQL compatibility mode.

## Address Book APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/address-books` | Create address book |
| GET | `/address-books/{id}` | Get address book |
| GET | `/address-books` | Get all address books |
| PUT | `/address-books/{id}` | Update address book |
| DELETE | `/address-books/{id}` | Delete address book |
| GET | `/address-books/{id}/contacts` | Get contacts in an address book |
| POST | `/address-books/{id}/contacts` | Add contact to an address book |
| POST | `/address-books/{id}/contacts/bulk` | Add multiple contacts to an address book |

### Address Book Request

```json
{
  "name": "Family"
}
```

## Contact APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/contacts` | Add contact |
| POST | `/contacts/bulk` | Add multiple contacts |
| GET | `/contacts/{id}` | Get contact |
| GET | `/contacts` | Get all contacts |
| PUT | `/contacts/{id}` | Update contact |
| DELETE | `/contacts/{id}` | Delete contact |
| GET | `/contacts/search/city?city=Austin` | Search by city |
| GET | `/contacts/search/state?state=Texas` | Search by state |
| GET | `/contacts/search?keyword=family` | Search across address books |
| GET | `/contacts/grouped/city` | View contacts grouped by city |
| GET | `/contacts/grouped/state` | View contacts grouped by state |
| GET | `/contacts/count/city` | Count contacts by city |
| GET | `/contacts/count/state` | Count contacts by state |
| GET | `/contacts/sort?by=name&direction=asc` | Sort by name, city, state, or zip |

### Contact Request

```json
{
  "addressBookId": 1,
  "firstName": "Alex",
  "lastName": "Morgan",
  "address": "123 Main Street",
  "city": "Austin",
  "state": "Texas",
  "zip": "78701",
  "phoneNumber": "+1 555 123 4567",
  "email": "alex.morgan@example.com"
}
```

### Bulk Contact Request

```json
{
  "contacts": [
    {
      "addressBookId": 1,
      "firstName": "Alex",
      "lastName": "Morgan",
      "address": "123 Main Street",
      "city": "Austin",
      "state": "Texas",
      "zip": "78701",
      "phoneNumber": "+1 555 123 4567",
      "email": "alex.morgan@example.com"
    }
  ]
}
```

## Validation and Errors

The API validates required fields, email format, phone format, and zip format. Duplicate contacts are blocked within the same address book using `firstName + lastName`.

Handled exceptions:

- `ResourceNotFoundException` returns `404`
- `DuplicateContactException` returns `409`
- `ValidationException` and request validation failures return `400`
