# ADR-005: Server-Sent Events (SSE) for Real-Time Multi-Agent Trace Streaming

## Status
Accepted

## Context
Multi-agent investigations execute multiple steps over 2 to 4 seconds (supervisor planning, cycle detection, entity resolution, critic challenging, evidence verification, case filing). With traditional synchronous HTTP POST requests, the frontend investigator workbench remains blocked with a static spinner until the entire pipeline terminates, creating poor UX and preventing the analyst from observing intermediate reasoning.

## Decision
We implemented Server-Sent Events (SSE) over HTTP via `GET /api/v1/investigations/stream/{case_id}`:
1. **Unidirectional Event Stream:** Uses standard `text/event-stream` MIME type, avoiding the stateful connection overhead and heartbeat complexities of bi-directional WebSockets.
2. **Standardized Event Schema:** Emits typed events:
   - `AGENT_STARTED`
   - `TOOL_CALL`
   - `EVIDENCE_FOUND`
   - `CRITIC_CHALLENGE`
   - `SCORE_UPDATED`
   - `AGENT_COMPLETED`
3. **Nginx Reverse Proxy Compatibility:** Explicitly disabled proxy buffering (`proxy_buffering off;`) and set `proxy_read_timeout 86400s;` in `nginx.conf` to guarantee sub-millisecond event propagation through ingress proxies.

## Consequences
- **Positive:**
  - Real-time animated step transitions and forensic log updates on the frontend.
  - Native browser reconnection handling via `EventSource`.
  - Minimal server memory footprint compared to persistent full-duplex WebSocket sockets.
- **Negative:**
  - SSE is strictly server-to-client; client interruptions or mid-investigation guidance require separate REST control requests.
