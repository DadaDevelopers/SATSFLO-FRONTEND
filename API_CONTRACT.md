# SatsFlo API Contract

> Frontend → Backend request/response reference.
> Base URL: `https://satsflo-backend.onrender.com/api/v1`
> Auth header: `Authorization: Bearer <accessToken>` (marked **🔒** where required)

---

## Auth

### POST /auth/register
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "confirm_password": "string",
  "acceptTerms": true
}
```
**Response used:** `data.data.accessToken`, `data.data.refreshToken`, `data.data.user`

---

### POST /auth/login
```json
{
  "email": "string",
  "password": "string"
}
```
**Response used:** `data.data.accessToken`, `data.data.refreshToken`, `data.data.user`

---

### POST /auth/forgot-password
```json
{
  "email": "string"
}
```
No response body used.

---

### POST /auth/verify-otp
```json
{
  "email": "string",
  "otp": "string"
}
```
**Response used:** `data.data.reset_token` (falls back to `data.reset_token`, `data.data.token`, `data.token`)
⚠️ Frontend expects field named **`reset_token`**

---

### POST /auth/reset-password/:token  *(token in URL path)*
```json
{
  "password": "string",
  "confirm_password": "string"
}
```
No response body used.

---

### POST /auth/refresh
```json
{
  "refreshToken": "string"
}
```
**Response used:** `data.data.accessToken`, `data.data.refreshToken`

---

### POST /auth/logout 🔒
```json
{
  "refreshToken": "string"
}
```
No response body used.

---

### POST /auth/logout-all 🔒
*(no body)*

---

### GET /auth/me 🔒
**Response used:** `data.data.name`, `data.data.email`, `data.data.avatar`
(falls back to `data.name`, `data.email`, `data.avatar`)

---

## Users

### GET /users/profile 🔒
**Response used:** `data.data.name`, `data.data.phone`, `data.data.date_of_birth` (expects `YYYY-MM-DD`), `data.data.language`

---

### PUT /users/profile 🔒
```json
{
  "name": "string",
  "phone": "string",
  "date_of_birth": "YYYY-MM-DD"
}
```
Also called with just `{ "language": "string" }` from language settings.

---

### DELETE /users/account 🔒
```json
{
  "password": "string"
}
```

---

## Cycle Profile

### POST /cycle-profile 🔒  *(onboarding — called once)*
```json
{
  "last_period_start": "YYYY-MM-DD",
  "cycle_length": 28,
  "period_length": 5,
  "luteal_phase_length": 14,
  "ignore_irregular_cycle": false
}
```

### PUT /cycle-profile 🔒  *(settings updates — partial updates)*
Called with one or more of:
```json
{ "cycle_length": 28 }
{ "period_length": 5 }
{ "luteal_phase_length": 14 }
{ "last_period_start": "YYYY-MM-DD" }
{ "ignore_irregular_cycle": false }
```

### GET /cycle-profile 🔒
**Response used (frontend reads):**
```json
{
  "cycle_length": 28,
  "period_length": 5,
  "last_period_start": "YYYY-MM-DD",
  "current_day": 11,
  "days_until_period": 18,
  "days_until_ovulation": 3,
  "ovulation_day": 14,
  "current_phase": "follicular"
}
```
> ✅ Backend confirmed returning all fields above as of latest fix.

---

## Cycles

### GET /cycles/current 🔒
**Response used:**
```json
{
  "current_day": 11,
  "cycle_length": 28,
  "period_length": 5,
  "days_until_next_period": 18
}
```
Home screen falls back to `GET /cycle-profile` if this returns non-ok.

---

### POST /cycles/start 🔒
```json
{
  "start_date": "YYYY-MM-DD"
}
```

---

### POST /cycles/end 🔒
```json
{
  "end_date": "YYYY-MM-DD"
}
```

---

## Day Logs

### GET /logs/:date 🔒
`:date` = `YYYY-MM-DD`
**Response used:** `data.data.flow`, `data.data.symptoms[]`, `data.data.mood[]`, `data.data.notes`, `data.data.weight`, `data.data.temperature`, `data.data.water_intake`

---

### PUT /logs/:date 🔒
`:date` = `YYYY-MM-DD`
```json
{
  "flow": "string | null",
  "symptoms": ["string"],
  "mood": ["string"],
  "notes": "string",
  "weight": "number | null",
  "temperature": "number | null",
  "water_intake": 0
}
```

---

## Water Settings

### GET /water-settings 🔒
**Response used:** `data.data.daily_goal_ml` (falls back to `data.daily_goal_ml`)

---

### PUT /water-settings 🔒
```json
{
  "daily_goal_ml": 2000
}
```

---

## Journal

### GET /journal?month=YYYY-MM 🔒
**Response used:** array of:
```json
{
  "id": "string",
  "date": "YYYY-MM-DD",
  "title": "string",
  "content": "string",
  "mood": "string"
}
```
⚠️ Frontend reads day from `date` field using string split (not `new Date()`) to avoid UTC offset issues.

---

### POST /journal 🔒
```json
{
  "title": "string | undefined",
  "content": "string",
  "mood": "string | undefined",
  "date": "YYYY-MM-DD"
}
```
> `title` and `mood` are optional. `content` may be empty string if user left notes blank.

---

## Partner

### POST /partner/invite 🔒
*(no body)*
**Response used:** `data.data.invite_code` (falls back to `data.invite_code`, `data.data.code`, `data.code`)
⚠️ Frontend expects field named **`invite_code`** or **`code`**

---

### POST /partner/accept 🔒
```json
{
  "invite_code": "string"
}
```
6-character alphanumeric code entered by user.

---

### PUT /partner/nickname 🔒
```json
{
  "my_nickname": "string",
  "partner_nickname": "string"
}
```

---

## Wallet

### GET /wallet/lightning 🔒
**Response used:** `data.data.lightning_address` (falls back to `data.lightning_address`)

---

### PUT /wallet/lightning 🔒
```json
{
  "lightning_address": "string"
}
```
Value is one of: `"Blink"`, `"Bitnob"`, `"Breeze"`, `"Phoenix"`, `"Aqua"`

---

## Payments

### POST /payments/validate 🔒
```json
{
  "lightning_address": "string"
}
```
**Response used:** success/failure only (`response.ok`)

---

### POST /payments/tip 🔒
```json
{
  "lightning_address": "string",
  "amount_sats": 1000,
  "note": "string"
}
```
**Response used:** success/failure only (`response.ok`)

---

## Lightning

### GET /lightning/wallet 🔒
**Response used:** `data.data.balance` (falls back to `data.balance`, `data.data.balance_sats`, `data.balance_sats`)
⚠️ Frontend expects field named **`balance`** or **`balance_sats`** (integer, in sats)

---

## Chats (DMs)

### GET /chats 🔒
**Response used:** array of:
```json
{
  "id": "string",
  "recipient": { "name": "string" },
  "name": "string",
  "last_message": "string",
  "updated_at": "ISO timestamp",
  "is_online": false
}
```

---

### GET /chats/:conversationId 🔒
**Response used:** `data.data.messages[]` — array of:
```json
{
  "id": "string | number",
  "content": "string",
  "is_sent": true,
  "created_at": "ISO timestamp"
}
```

---

### POST /chats/:conversationId 🔒
```json
{
  "content": "string"
}
```

---

## Groups

### GET /groups 🔒
**Response used:** array of:
```json
{
  "id": "string",
  "name": "string",
  "last_message": "string",
  "members_count": 0
}
```

---

## Threads

### GET /threads
*(public — no token)*
**Response used:** array of:
```json
{
  "id": "string",
  "content": "string",
  "user": { "name": "string" },
  "created_at": "ISO timestamp",
  "likes_count": 0,
  "comments_count": 0,
  "is_liked": false
}
```

---

### POST /threads 🔒
```json
{
  "title": "",
  "content": "string",
  "category": "general"
}
```

---

### POST /threads/:id/like 🔒
*(no body)*

---

### DELETE /threads/:id/like 🔒
*(no body)*

---

### GET /threads/:id
*(public)*
**Response used:** single thread object (same shape as GET /threads items)

---

### GET /threads/:id/comments
*(public)*
**Response used:** array of:
```json
{
  "id": "string",
  "content": "string",
  "user": { "name": "string" },
  "created_at": "ISO timestamp"
}
```

---

### POST /threads/:id/comments 🔒
```json
{
  "content": "string"
}
```

---

## Known Field Name Sensitivities

| Endpoint | Field | Notes |
|---|---|---|
| POST /auth/verify-otp | `reset_token` in response | Frontend reads `reset_token` first, then falls back to `token` |
| POST /partner/invite | `invite_code` in response | Falls back to `code` |
| GET /lightning/wallet | `balance` in response | Falls back to `balance_sats` |
| GET /cycles/current | `days_until_next_period` | Not `days_until_period` |
| POST /auth/register | `acceptTerms` | camelCase |
| POST /auth/refresh | `refreshToken` | camelCase |
| POST /auth/logout | `refreshToken` | camelCase |

---

## Response Envelope

All endpoints return JSON. Frontend always tries `data.data.<field>` first, then `data.<field>` as fallback. Example:

```js
const token = data?.data?.accessToken ?? data?.accessToken;
```
