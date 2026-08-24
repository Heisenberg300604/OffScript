# OffScript

## The Problem

A lot of people want to improve their communication skills, but one of the biggest problems is simple:

> **They don't practice speaking regularly.**

Even when someone decides to practice, another question immediately appears:

> *"Okay... but what am I supposed to talk about?"*

People usually end up talking about things they already know or feel comfortable discussing. That doesn't really challenge their ability to think and speak spontaneously.

Communication improves through practice — especially when you're forced to:

* Think about an unfamiliar subject
* Organize your thoughts quickly
* Explain an idea clearly
* Form an opinion
* Continue speaking without relying on a prepared script
* Become comfortable hearing your own voice
* Speak even when you aren't completely sure what to say

OffScript aims to make this practice **simple, repeatable, and consistent.**

---

## The Solution

OffScript gives users a randomly generated topic whenever they want to practice.

For example:

> **"Should AI-generated content be regulated?"**

The user can use Google or other resources to understand the topic and gather information.

Then they have to speak about it.

### The basic rule:

**Research → Think → Speak → Repeat**

The user should speak for a minimum of **2 minutes**.

There is no requirement to give the "correct" opinion.

The purpose is to practice **expressing thoughts clearly and confidently**, especially when the topic isn't something the user prepared for beforehand.

---

# Version 1

The first version will intentionally remain simple.

The goal of V1 is to validate one thing:

> **Can a simple daily speaking challenge encourage people to practice communication consistently?**

### 1. Random Topic Generator

The primary feature of OffScript.

Users can generate a completely random topic to speak about.

Topics can range across different categories, including:

* Technology
* AI
* Politics
* Economics
* Society
* Philosophy
* Education
* Environment
* Current affairs
* Everyday life
* Hypothetical situations
* Controversial questions
* Abstract ideas

Example:

> **"Will artificial intelligence make humans less creative?"**

The randomness is intentional.

Users shouldn't always get topics they're comfortable with.

---

### 2. Two-Minute Speaking Challenge

Every generated topic comes with a simple challenge:

> **Speak about this topic for at least 2 minutes.**

Users can research the topic before speaking.

However, the purpose is to encourage them to **speak in their own words rather than read a prepared script.**

---

### 3. Research Allowed

OffScript does **not** expect users to know everything.

Users are explicitly allowed to research their topic before speaking.

For example:

> **Topic:** "Should nuclear energy replace coal?"

The user can search Google, read articles, understand the subject, form their opinion, and then speak.

The research is part of the process.

The important part is that the final explanation comes from the user.

---

### 4. Speaking/Recording Session

Users can start a speaking session after receiving their topic.

The application provides a **minimum 2-minute timer** to encourage users to keep speaking.

The focus is on practicing the act of speaking rather than receiving an AI-generated score.

---

### 5. YouTube Unlisted Progress Archive

Users can optionally record their speaking session and upload the video to YouTube as **Unlisted**.

They can then save the video link with their completed challenge.

This gives users a personal archive of their speaking journey without requiring OffScript V1 to build its own video storage infrastructure.

Over time, users can go back and compare:

> **Day 1 vs Day 30**

and see their own progress.

---

### 6. Speaking Streak

Users can maintain a daily speaking streak by completing their challenge.

For example:

> 🔥 **14 day streak**

The goal is to encourage consistency rather than perfection.

Missing one day shouldn't mean the entire purpose of the application is lost — the streak is simply a motivational mechanism.

---

### 7. GitHub-Style Progress Heatmap

OffScript will include a contribution-style heatmap showing the user's speaking activity.

For example:

```text
Speaking Activity

Mon  Tue  Wed  Thu  Fri  Sat  Sun

🟩   🟩   ⬜   🟩   🟩   🟩   ⬜
🟩   🟩   🟩   🟩   ⬜   🟩   🟩
🟩   🟩   🟩   🟩   🟩   🟩   🟩
```

This gives users a visual representation of their consistency.

The idea is inspired by the way GitHub makes developers want to keep contributing.

Here, the contribution is:

> **You spoke today.**

---

## What V1 Will NOT Do

Keeping the first version focused is important.

OffScript V1 will **not** attempt to:

* Judge whether someone's opinion is correct
* Rate someone's intelligence
* Assign an arbitrary "confidence score"
* Analyze personality
* Automatically judge someone's communication ability
* Replace a human communication coach
* Become a social media platform
* Build a complicated AI feedback system

The first version is deliberately simple.

**Generate a topic → research → speak → record → track consistency.**

---

## Core Philosophy

OffScript is based on a simple idea:

> **You don't become comfortable speaking by watching videos about communication. You become comfortable by speaking.**

The application is designed to remove the friction between:

**"I want to improve my communication."**

and

**"Okay, let's actually practice."**

No elaborate course.

No long lessons.

No complicated exercises.

Just a topic.

Then:

> **Speak.**

---

## V1 User Flow

```text
Open OffScript
      ↓
Generate Random Topic
      ↓
Read Topic
      ↓
Research Topic (Optional)
      ↓
Start 2-Minute Challenge
      ↓
Speak
      ↓
Complete Challenge
      ↓
Optionally Upload Video to YouTube (Unlisted)
      ↓
Record Progress
      ↓
Update Speaking Streak / Heatmap
```

---

## Future Possibilities

These are intentionally **not part of V1**, but could be explored later if the core concept proves useful:

* Different difficulty levels
* Debate mode
* Interview mode
* Presentation mode
* Impromptu mode with limited preparation time
* Community challenges
* Anonymous video sharing
* Responses to other people's arguments
* Topic categories
* Weekly speaking challenges
* Public speaking leaderboard
* AI-assisted feedback
* Speech transcription
* Filler-word detection
* Speaking-speed analysis
* Progress analytics

The priority is to **validate the basic speaking loop first** before adding these features.

---

## The Goal

OffScript isn't trying to turn everyone into a professional speaker.

The goal is much simpler:

> **Make speaking practice easy enough that people actually do it.**

If someone who was previously uncomfortable speaking can open OffScript every day, receive a completely unexpected topic, and speak about it for two minutes without overthinking it — the product has done its job.

---

## Status

🚧 **Version 1 — In Development**

The initial focus is on building and validating the core speaking-practice experience before expanding the product.

## 🛠️ Tech Stack

OffScript V1 is intentionally built with a simple, modern stack focused on **performance, SEO, maintainability, and fast development**.

| Technology           | Purpose                                           |
| -------------------- | ------------------------------------------------- |
| **Next.js**          | Full-stack React framework, routing, SSR/SSG, SEO |
| **TypeScript**       | Type-safe application development                 |
| **Tailwind CSS**     | Styling and responsive UI                         |
| **shadcn/ui**        | Reusable UI components                            |
| **PostgreSQL**       | User, topic, challenge, and progress data         |
| **Drizzle ORM**      | Type-safe database queries and schema management  |
| **Vercel**           | Application deployment and hosting                |
| **Neon**             | Serverless PostgreSQL hosting                     |
| **YouTube Unlisted** | Optional video storage/progress archive           |
