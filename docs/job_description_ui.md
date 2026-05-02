# Job Description UI Overview

## Purpose

The Job Description UI allows recruiters to create, review, parse, and manage job descriptions from the frontend dashboard.

This feature connects the frontend with the existing backend Job Description and Job Skill APIs.

## Main Routes

```text
/job-descriptions
/job-descriptions/new
/job-descriptions/:id
```

## Implemented Features

- Display a list of job descriptions.
- Create a new job description with raw JD text.
- View job description detail.
- Display the original raw JD text.
- Trigger JD parsing from the detail page.
- Display parsed JD data returned by the AI service.
- Display parsed responsibilities, requirements, nice-to-have items, skills, experience, education, and domain keywords.
- Display job skills synced from parsed data.
- Add job skills manually.
- Edit job skills manually.
- Delete job skills manually.
- Show skill type and importance using required, preferred, and core badges.

## Feature Structure

The frontend implementation is located in:

```text
src/features/job-descriptions
```

Main folders:

```text
api
components
hooks
types
validations
```

## API Usage

The feature uses the shared `apiClient` and endpoint constants from:

```text
src/lib/api
```

Main API operations:

```text
GET    /job-descriptions
POST   /job-descriptions
GET    /job-descriptions/:id
POST   /job-descriptions/:id/parse
GET    /job-descriptions/:id/parsed-data
GET    /job-descriptions/:id/skills
POST   /job-descriptions/:id/skills
PATCH  /job-skills/:skillId
DELETE /job-skills/:skillId
```

## Job Skill Management

Manual job skill management is used as a review and correction layer after parsing.

Recruiters can add, edit, or delete skills when:

- the raw JD does not mention a skill clearly enough,
- the parser misses a skill,
- a skill needs to be changed from preferred to required,
- a skill needs to be marked as core,
- the scoring weight needs to be adjusted.

These job skills are later used for candidate matching and scoring.

## Notes

The UI does not call the AI service directly. It calls the backend, and the backend coordinates parsing with the AI service.

The parser result is stored in `parsedData`, while job skills are stored separately and can be manually adjusted by the recruiter.
