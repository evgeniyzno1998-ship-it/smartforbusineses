# RetentionOS Core Engine

Production-grade, multi-tenant behavioral infrastructure built on NestJS + PostgreSQL + Redis + BullMQ.

## Step 1 Scope (Completed)
- Modular NestJS project skeleton for bounded contexts.
- Core AppModule wiring for Postgres + Redis + BullMQ.
- Production schema for event-first and append-only processing model.

## Project Structure

```txt
src/
  app.module.ts
  main.ts
  common/
    database/
  modules/
    auth/
    tenancy/
    users/
    events/
    rules/
    segments/
    gamification/
    journeys/
    rewards/
    billing/
    sdk/
    widgets/
db/
  schema.sql
```

## Architecture Decisions

1. **TypeORM** selected for NestJS-native integration, transactional consistency, and repository-based domain services.
2. **Append-only events table** is immutable source of truth; behavioral snapshot stays in `user_profiles`.
3. **Strict tenant isolation** is enforced by `tenant_id` on tenant-owned records and composite uniqueness constraints.
4. **BullMQ async backbone** decouples ingestion from processing and supports retries + DLQ patterns.
5. **Optimistic locking ready** via `version` columns in mutable aggregate tables (`user_profiles`, definitions).

## Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```
