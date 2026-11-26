# QuickNotes — DevSecOps Microservices Project

A lightweight, containerized two-service web application (`web` + `api` + PostgreSQL) built to demonstrate a 12-stage automated DevSecOps pipeline, multi-AZ high availability, auto-scaling, and observability on AWS.

## Architecture Overview
- **`web`**: Frontend UI service (Node.js/Express) exposing `/health` and serving the note board.
- **`api`**: Backend REST API (Node.js/Express) exposing `/health` and `/api/notes` backed by PostgreSQL.
- **`db`**: PostgreSQL database (Docker container locally; Amazon RDS in private subnets on AWS).

## Git Branching & Solo Workflow Strategy
- **`main`**: Protected production branch. Direct pushes are blocked; every change must enter via a Pull Request after passing all CI checks.
- **`feature/<topic>`**: Short-lived branches created from `main` for every feature, fix, or pipeline change.
- **Pull Requests**: Every branch is merged via PR to maintain an auditable history of changes and automated gate checks.
