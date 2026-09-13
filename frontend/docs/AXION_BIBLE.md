# COMPANY BIBLE — AXION (Public Version)
**Version:** 1.0.0-Public  
**Status:** Public Summary  
**Scope:** High-level principles and governance of AXION company  
**Note:** This is a deliberately limited public extract. Sensitive operational, technical, economic, and internal decision details are intentionally omitted.

---

## 1. Purpose of This Document

This public Bible outlines the non-negotiable principles that guide AXION as a company.  
It is intentionally high-level and does not contain implementation details, internal decision registers, personnel information, or operational parameters.

---

## 2. Core Design Principles (High-Level)

AXION systems are built around the following permanent principles:

- **No single point of total control** — no master credential that can unlock the entire infrastructure.
- **Scoped access** — credentials and permissions are limited to the specific service or function that needs them.
- **Secrets stay out of code** — production secrets are never stored in repositories.
- **Authentication is not authorization** — a valid credential does not automatically grant full system access.
- **Immutable audit trail** — critical events (especially financial and security) are recorded in an append-only manner.
- **Explicit state transitions** — important status changes only occur through defined, allowed transitions.
- **Idempotent critical operations** — repeated identical requests must not produce unintended side effects.
- **Clear separation** — company-level rules and project-level rules are kept distinct.
- **Approved decisions are binding** — changes to locked principles require proper authority and formal process.
- **Claims require evidence** — “approved” does not equal “verified in production.”

---

## 3. Payment & Financial Integrity Principles

All financial flows follow these rules:

1. Validate external inputs before trusting them.
2. Persist events before processing them.
3. Process events idempotently.
4. Use explicit state machines for transaction status.
5. Maintain append-only audit history.
6. Never silently override terminal states.

---

## 4. Security Principles

- Least privilege by default.
- Constant-time comparison for any secret or signature verification.
- Replay protection on financial paths.
- Strict redaction of secrets, tokens, and personal data from logs.
- All external inputs are treated as untrusted.
- Defense-in-depth on financial pathways.

---

## 5. Data & Privacy Principles

- Compliance with applicable personal data protection laws (including Indonesia’s UU PDP) is a design baseline, not an afterthought.
- Data minimization: collect and retain only what is necessary.
- Data subject rights (access, correction, deletion, portability) are supported with proper identity verification.
- Data is classified into clear sensitivity tiers before storage or processing.
- Sharing with third parties requires a lawful basis and appropriate agreements.
- Retention and deletion rules are defined per data category.

### Data Classification Tiers (Public Summary)

| Tier        | Meaning                                      |
|-------------|----------------------------------------------|
| PUBLIC      | May be published freely                      |
| INTERNAL    | For internal use only                        |
| CONFIDENTIAL| Leakage harms users or the business          |
| RESTRICTED  | Highest protection; system/financial critical|

---

## 6. AI External Usage Policy (Public)

**Prohibited** to send to third-party AI tools:
- Secrets and credentials
- Personal identifiable information (PII)
- Financial payloads or ledger data
- Production code that handles secrets or payments

**Allowed** (after redaction/anonymization):
- High-level architectural descriptions
- Synthetic or fully redacted code examples
- Anonymized error messages

New AI tools require formal risk evaluation and approval before use with internal data.

---

## 7. Economic Model (High-Level Only)

AXION Coin operates under a strict annual supply discipline and anti-inflation controls.  
Exact supply numbers, issuance formulas, carry-over rules, and operational parameters are internal and not published in this public version.

---

## 8. Governance (Public Summary)

- Clear separation of decision domains (architecture, business policy, security, token economy, operations).
- Locked principles can only be changed through formal Owner-level decisions.
- Escalation paths exist for high-risk or cross-domain issues.
- AI systems may assist with drafting but never hold decision authority.

Personnel assignments and internal decision registers are not included in this public document.

---

## 9. Document Status

This is a **public summary** derived from the internal Company Bible.  
It intentionally omits all sensitive, critical, operational, and internal decision details.  
For the full binding internal version, refer to the approved internal Company Bible under proper access controls.
