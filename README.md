# How to run

## Install packages
- Run command `npm install`

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
## How to run unit tests
Run command `npm run test `