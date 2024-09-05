# Open Sustainability Index (frontend)

## Introduction for new contributors

See the README on https://github.com/Open-Sustainability-Index

## How to set up

Copy `.env.example` to `.env.local`

Running [`climate-wiki-backend`](https://github.com/Open-Sustainability-Index/open-sustainability-index-backend) locally is _optional_; the frontend will connect to the live backend if you don’t override `BACKEND_BASE_URL`.

## How to run

    npm run dev

## Pages

- Companies:
  - List: http://localhost:5174/companies?sort=company_name&order=asc
  - Company: http://localhost:5174/company/ap-moller-maersk
- Industries: http://localhost:5174/industries

## API

- GET http://localhost:5174/api

Note: the main API is in [`climate-wiki-backend`](https://github.com/Open-Sustainability-Index/open-sustainability-index-backend).
