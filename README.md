# Learning Management System (LMS)

Welcome to our Learning Management System (LMS) project! This system is designed to facilitate the management of courses, students, teachers, assignments, and other educational content in an organized and user-friendly environment.

The LMS provides the following features:

- **Course Management**: Create, update, and manage courses, assignments, and exams.
- **Student Enrollment**: Allow students to enroll in courses, track progress, and submit assignments.
- **Teacher Dashboard**: Teachers can manage their classes, grade assignments, and interact with students.

Our goal is to build an efficient, scalable, and easy-to-use platform that enhances the learning experience for both students and instructors.

## Prerequisites

Make sure you have **Docker** and **Docker Compose** installed on your machine before running the project.

- [Install Docker](https://www.docker.com/get-started)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

## Installation

To start running the project, clone the repository:

```bash
git clone https://github.com/Berkail/LMS-PFA
```

## Environment setup

Make sure to populate the your .env file according to .env.example
for both the back-end and front-end

**./back-end/.env**

```env
# Database Configuration
DB_HOST=           # e.g., postgres container name or localhost for local dev
DB_PORT=           # Default PostgreSQL port
DB_USERNAME=       # Change to your database username
DB_PASSWORD=       # Change to your database password
DB_NAME=           # Your database name

# Development Stage
NODE_ENV=development        # Set this to 'production' for production environments
```

**./front-end/.env**

```env
NEXT_PUBLIC_API_PREFIX=api/
```

## Running the project

Run the shell script at the root of the project to start the project's containers

```sh
./docker-compose-up.sh
```

## URL PATHS

After running the project, the following services will be available:

**backend:**

```sh
localhost/api
```

**frontend:**

```sh
localhost/
```

**postgresql:**

```sh
localhost:5432/
```

**pgAdmin:**

```sh
localhost:5050/
```
