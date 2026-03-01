# RetentionOS Backend (NestJS)

Production-oriented, multi-tenant retention engine with:
- Event ingestion API
- BullMQ-based asynchronous processing
- JSON rule engine for segmentation
- XP/level gamification primitives
- Journey execution hooks
- SDK/widget support services

## Architecture

```
src/
  app.module.ts
  modules/
    tenancy/
    events/
      controllers/
      dto/
      services/
      processors/
    rules/
      services/
      types/
    gamification/
      services/
    journeys/
      services/
      types/
    sdk/
    widgets/
db/
  schema.sql
```

### Core flow
1. Website JS SDK posts events to `POST /api/v1/events/ingest`.
2. Event is persisted to PostgreSQL and enqueued in BullMQ.
3. Worker loads active tenant rules and evaluates JSON conditions.
4. XP/level is updated.
5. Journey steps are resolved and actions dispatched.

## Event Ingestion API

### Endpoint
`POST /api/v1/events/ingest`

### Payload
```json
{
  "tenantSlug": "acme",
  "customerId": "cust_123",
  "eventName": "purchase",
  "properties": { "amount": 299, "plan": "pro" },
  "occurredAt": "2026-01-15T08:12:00.000Z"
}
```

## JSON Rule Definition Example

```json
{
  "all": [
    {
      "condition": {
        "field": "eventName",
        "operator": "eq",
        "value": "purchase"
      }
    },
    {
      "any": [
        {
          "condition": {
            "field": "properties.amount",
            "operator": "gte",
            "value": 100
          }
        },
        {
          "condition": {
            "field": "properties.plan",
            "operator": "in",
            "value": ["pro", "enterprise"]
          }
        }
      ]
    }
  ]
}
```

## JS SDK Example

```js
class RetentionOS {
  constructor({ tenantSlug, endpoint }) {
    this.tenantSlug = tenantSlug;
    this.endpoint = endpoint;
  }

  track(eventName, customerId, properties = {}) {
    return fetch(`${this.endpoint}/api/v1/events/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantSlug: this.tenantSlug,
        customerId,
        eventName,
        properties,
        occurredAt: new Date().toISOString()
      })
    });
  }
}
```

## React white-label widget shell

```tsx
export function RewardWidget({ theme, points }: { theme: any; points: number }) {
  return (
    <div style={{ background: theme.primaryColor, borderRadius: theme.borderRadius }}>
      <h3>{theme.brandName ?? 'Rewards'}</h3>
      <p>{points} XP</p>
    </div>
  );
}
```

## Scalability Notes
- Tenant isolation at data and query level (`tenant_id` on all tenant-owned tables).
- Queue decouples ingestion latency from processing throughput.
- Rule and journey definitions as JSONB for dynamic behavior without redeploy.
- Redis can be used both for queue backend and hot cache (profiles, segment cache).
- Horizontal scale: stateless API pods + independent worker autoscaling.
