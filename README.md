# How to run

### Install packages
- Run command `npm install`
### How to run project
- Run command `npm run start`
### How to run unit tests
- Run command `npm run test `
## Architechture
### Layered architecture (Controller-Service-Repository)
#### Controller (API/Presentation Layer)
- Validate permission
- Validate request body
- Send & receive data
#### Service (Business Logic Layer)
- Store business rules
- Handle logic
#### Repository (Data Access Layer)
- Connect to database CRUD
## Libraries
- @nestjs/common: The main NestJS package that includes Decorators, Interfaces, Classes, and basic functions.
- @nestjs/core: For build project.
- @nestjs/testing: For support unit test.
- class-validator: Data Validation for DTO.
- crypto: UUID is generator
# Optimization
### Apply microservice architecture to support intensive data and more people access.
- Scalability
- Technology Flexibility
- Maintainability
- Fault Isolation
### How to handle when many users want to reserve the ticket at the same time
Apply Message Queue to receive all reserve request, Then process each item in sequence (First-come, First-served).