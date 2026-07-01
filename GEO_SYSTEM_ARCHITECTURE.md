# GEO_TECHNICAL_CONSTITUTION.md

# GEO Technical Constitution
### Version 1.0
### Last Updated: 2026-07-01

---

# Purpose

This document defines the technical philosophy of the GEO Project.

It is **not** a coding guideline.

It explains why the system exists, how knowledge should flow, and what principles every AI developer must preserve.

Every AI (Codex, ChatGPT, Claude, Gemini, etc.) must understand this document before modifying the project.

---

# 1. Knowledge First

The project does not begin with Articles.

The project begins with Knowledge.

Everything else is generated from knowledge.

Never reverse this order.

Correct Flow

Knowledge
→ Knowledge Graph
→ Learning Path
→ Article
→ Static JSON
→ Website

Wrong Flow

Article
→ Category
→ Link
→ Knowledge

Never build the project this way.

---

# 2. Single Source of Truth

There is only one source of truth.

It is the Knowledge Node.

Articles,
Summaries,
FAQs,
Schema,
Internal Links,
Metadata,

must never become independent sources.

They are generated views of the same knowledge.

---

# 3. Generate, Don't Duplicate

Never duplicate information.

Do not manually maintain

- FAQ
- Summary
- Related Articles
- Internal Links
- Schema
- Metadata

These should all be generated from the same Knowledge Graph whenever possible.

One fact.

Many views.

---

# 4. Knowledge Graph Before UI

The UI is only a presentation layer.

The Knowledge Graph is the real architecture.

Never redesign the interface before understanding the graph.

Changing UI must never damage knowledge relationships.

---

# 5. Learning Path Before Navigation

Users do not think like databases.

Users learn sequentially.

Every piece of content belongs to a Learning Path.

Learning Path

Level 1
↓

Level 2
↓

Level 3
↓

Level 4
↓

Level 5

Navigation follows Learning.

Not categories.

---

# 6. Living Knowledge

Knowledge never dies.

Knowledge evolves.

Never overwrite knowledge.

Never delete knowledge.

Instead

Version 1.0

↓

Version 2.0

↓

Version 3.0

Knowledge is accumulated.

History has value.

---

# 7. Relationship is More Important Than Content

A website is not a collection of pages.

It is a collection of relationships.

Every Knowledge Node should connect to other Nodes.

Core Relationship

Related Relationship

Expansion Relationship

The graph becomes smarter by increasing relationships,
not by increasing pages.

---

# 8. Evidence Before Opinion

Facts come before opinions.

Every important statement should be supported by

- official documents
- research
- statistics
- academic papers
- verified data

Do not optimize for persuasion.

Optimize for trust.

---

# 9. GEO Before SEO

SEO is no longer the final objective.

The project is built for

Generative Engine Optimization (GEO).

The primary consumers are

- AI Models
- AI Search Engines
- AI Agents

Human readers remain important,

but AI understanding is treated as a first-class requirement.

---

# 10. AI Native Architecture

Design every system so AI can understand it.

Prefer

Clear hierarchy

Explicit definitions

Entity relationships

Structured content

Semantic organization

Avoid

Ambiguous wording

Hidden relationships

Repeated facts

Duplicated knowledge

---

# 11. Domain Independence

Domains must remain independent.

Examples

Robo Advisor

ETF

Exchange Rate

Tax

Retirement

Economics

Each domain owns its knowledge.

However,

they share the same

Knowledge Engine.

Never tightly couple domains.

---

# 12. Static First

The public website is Static First.

Dynamic systems exist only for administration.

Admin

↓

Knowledge

↓

Generator

↓

Static JSON

↓

Website

The visitor should never depend on databases.

---

# 13. Minimal Modification Principle

When modifying the system,

prefer

small,

isolated,

traceable changes.

Avoid

large refactoring

unless absolutely necessary.

One issue.

One cause.

One fix.

---

# 14. Human Education First

The purpose of this website is education.

Not investment recommendation.

Not financial sales.

Not product promotion.

Knowledge must help readers

understand,

compare,

and think.

Readers make their own decisions.

---

# 15. Compliance First

Every feature must respect applicable financial regulations.

Especially

- Financial Consumer Protection principles
- Neutral language
- Risk disclosure
- No exaggerated claims
- No guaranteed returns

Education comes before marketing.

---

# 16. Future-Proof Design

The architecture must support

100 Nodes

↓

1,000 Nodes

↓

10,000 Nodes

without changing its philosophy.

Growth should increase knowledge,

not complexity.

---

# 17. GEO System Vision

The GEO Project is not simply a website.

It is a Living Knowledge Platform.

Its mission is

to organize trustworthy knowledge,

connect ideas,

teach people,

and become a reliable source for future AI systems.

Every modification should move the project closer to this vision.

---

# Feature Decision Rule

Every feature must improve at least one of the following:

1. Knowledge
2. Learning
3. AI Understanding
4. User Education
5. Static Publishing Quality

If a feature does not improve any of these,
it should not be added.

Before implementing a feature, always ask:

1. Does this improve the Knowledge Graph?

2. Does this improve the Learning Path?

3. Does this improve AI Understanding?

4. Does this improve user education?

5. Does this preserve the Static First architecture?

6. Does this introduce duplicate knowledge?

7. Can this be generated instead of manually maintained?

8. Will this improve GEO rather than only SEO?

9. Will this improve the Living Knowledge Graph?

10. Will this improve knowledge discovery or Learning Path navigation?

If the answer is mostly "No",

do not implement the feature.

Never add a feature

simply because it looks useful.

Every feature

must strengthen

Knowledge,
Learning,
or GEO.

If it does not,

it should not exist.

---

# Final Principle

Never ask

"How can we build another webpage?"

Never ask

"How can we add another feature?"

Always ask

"How can we improve the Knowledge Graph?"

"How can we improve Knowledge Discovery?"

"How can we improve the Learning Path?"

If the Knowledge Graph improves,

the website,

the AI,

the navigation,

the Learning Path,

and the user experience

will improve naturally.

Knowledge First.

Discovery Second.

Platform Third.

Always.