<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# NestJS Authentication & Authorization Template

This project is a template built using [NestJS](https://nestjs.com/) that implements authentication, authorization, and role/permission management. It provides a foundation for handling user access based on roles and permissions.

## Features

- **JWT Authentication**: Secure login system using JSON Web Tokens (JWT).
- **Role Management**: Create and manage user roles.
- **Permission Management**: Assign specific permissions to roles and users.
- **Access Control**: Protect routes using role-based and permission-based authorization.
- **Scalable Architecture**: Modular and scalable structure following NestJS best practices.

## Installation

1. Clone this repository:

   ```bash
      git clone git@github.com:agsyarif/nest-auth.git
      cd nest-auth
2. Install dependencies:

    ```bash
      npm install
3. Copy .env.example:

    ```bash
      cp .env.example .env
4. Run database migrations:

    ```bash
    npx prisma migrate dev --name init --seed
5. Start the application:
    ```bash
    npm run start:dev