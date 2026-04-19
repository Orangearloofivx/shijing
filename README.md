# Shijing

### AI Garden Material Recommendation & Design Assistant

Shijing is a full-stack AI product for landscaping and garden-material retail. It helps users upload a garden photo, receive AI-assisted style analysis, preview material textures directly on the image, and generate a personalized garden plan with material suggestions, quantities, and pricing guidance.

This project was inspired by a real small-business use case: helping customers make faster, more confident decisions when choosing stones and landscaping materials.

---

## Why this project exists

Traditional landscaping and material sales often rely on manual consultation:

* customers struggle to imagine how materials will look in their own space
* recommendations depend heavily on salesperson experience
* estimating quantities and preparing suggestions takes time
* material catalogs are difficult to keep updated across devices

Shijing turns that workflow into an interactive AI-assisted product.

---

## What the product does

### 1. AI style analysis

Users can upload a garden photo and optionally describe their preferences.
The system analyzes the uploaded image and returns:

* a suggested design direction
* descriptive style tags
* recommended materials
* a best-fit reference style for further generation

### 2. Reference-style image generation

After selecting a style reference, users can generate an AI renovation preview based on the original garden photo.
The generation flow is designed to preserve:

* camera angle
* perspective
* spatial layout
* architectural structure

### 3. Material texture preview

Users can preview selected materials directly on top of the uploaded garden photo using a canvas-based brush workflow.
This includes:

* brush / erase tools
* opacity control
* blend modes
* in-context texture painting

### 4. AI-generated garden plan

Once users choose a style and material, they can generate a structured garden proposal including:

* style direction
* design concept
* material list
* suggested quantities
* pricing ranges
* construction notes
* planting pairings

### 5. Material library admin panel

The project also includes an admin interface for managing materials:

* upload new material image
* add Chinese / English names
* assign category
* write short descriptions
* sync materials to the main app
* delete materials

---

## Product flow

```text
Upload garden photo
    ↓
AI analyzes the space and suggests style/material direction
    ↓
User selects a reference style
    ↓
AI generates a renovation preview
    ↓
User tests materials on the image with interactive texture painting
    ↓
User fills in optional area measurements
    ↓
AI generates a personalized garden plan
```

---

## Tech stack

**Frontend**

* HTML
* CSS
* Vanilla JavaScript
* Canvas API

**AI / model orchestration**

* GPT-4o for structured plan generation
* Gemini image-preview models for image-to-image garden visualization
* Netlify Functions as the AI request gateway

**Data / persistence**

* Supabase for material storage and cross-device persistence
* localStorage fallback when remote loading is unavailable

**Deployment**

* Netlify

---

## Architecture overview

```text
User
  ↓
Frontend (index.html)
  ├─ Step 1: upload + AI analysis
  ├─ Step 2: material texture preview via canvas
  └─ Step 3: AI garden plan generation
  ↓
Netlify Function (/.netlify/functions/analyze)
  ├─ GPT-4o request for structured text output
  └─ Gemini image-preview request for renovation image generation
  ↓
Supabase
  └─ materials table for custom material storage

Admin (admin.html)
  └─ create / read / delete custom materials
```

---

## Repository structure

```text
.
├── index.html      # Main customer-facing application
├── admin.html      # Admin panel for managing materials
└── README.md
```

> Note: this repository currently contains the frontend and admin interface. The serverless function used at `/.netlify/functions/analyze` should be deployed separately in the corresponding Netlify functions directory.

---

## Key implementation details

### Multistep product UX

The app is designed as a 3-step guided flow rather than a generic chatbot:

1. AI style analysis
2. texture preview
3. garden plan generation

This makes the product easier for non-technical retail customers to understand and use.

### Structured AI outputs

Instead of returning free-form text only, the plan generator expects structured JSON and renders it into a proposal-like UI.
This improves consistency and makes the output easier to turn into a sales workflow.

### Visual decision support

A major design goal is reducing imagination friction.
Customers do not just receive text recommendations; they can also:

* see a generated renovation concept
* try material textures directly on their own image

### Catalog management for real business use

The admin panel allows new materials to be added without editing source code, making the project more practical for a small retailer.

---

## Running locally

Because this project is currently a static frontend plus external services, the easiest way to run it locally is with a simple static server.

### Option 1: VS Code Live Server

Open the project folder and run `index.html` with Live Server.

### Option 2: Python static server

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/index.html
```

---

## Required services

To make the full project work, you need:

### 1. Supabase

Create a `materials` table with fields similar to:

* `id`
* `name`
* `name_en`
* `cat`
* `description`
* `img`
* `created_at`

### 2. Netlify Functions

Implement a serverless endpoint at:

```text
/.netlify/functions/analyze
```

This endpoint should proxy requests to:

* GPT-4o for structured text generation
* Gemini image-preview models for image generation

### 3. API keys

Store API keys securely in server-side environment variables.
Do **not** expose private keys in frontend code in production.

---

## Example use cases

* A customer uploads a photo of their backyard and asks for a minimalist design direction.
* A salesperson uses the app to demonstrate how limestone or bluestone would look in the space.
* A store manager adds newly arrived materials through the admin panel.
* A customer requests a proposal with rough area-based quantity estimates and planting suggestions.

---

## Current limitations

This project is already functional as a product prototype, but there are several areas to improve:

* stronger authentication for the admin panel
* stricter database security / row-level policies
* better image masking for more precise material placement
* richer inventory / pricing integration
* quotation export (PDF / CRM / order sheet)
* analytics for usage, conversion, and recommendation quality
* more robust generation rate limiting

---

## Future improvements

Potential next steps include:

* add user accounts and saved projects
* integrate real inventory and stock availability
* support side-by-side comparison of multiple materials
* add cost estimation based on full area breakdown
* export structured proposals for sales follow-up
* support multilingual customer-facing output
* add feedback loops to improve recommendation quality

---

## What this project demonstrates

This project is best understood as an **AI product engineering** project rather than a pure ML research project.
It demonstrates:

* product thinking around a real business problem
* multimodal UX design
* AI-assisted workflow design
* full-stack integration across frontend, AI services, and database storage
* internal tooling via the admin panel
* experience designing software for small business operations

---

## Screenshots

Add screenshots here before publishing the repository.

Suggested sections:

* home / upload step
* style analysis result
* AI renovation preview
* texture painting interface
* generated garden plan
* admin material management panel

Example markdown:

```md
![Upload Step](./screenshots/upload.png)
![AI Preview](./screenshots/preview.png)
![Garden Plan](./screenshots/plan.png)
![Admin Panel](./screenshots/admin.png)
```

---

## Disclaimer

This repository is a product prototype built for a real-world landscaping materials use case. Some implementation details may need additional hardening before production deployment, especially around authentication, security policies, and backend key management.

---

## License

MIT

---

## Contact

If you are using this repository as a portfolio project, replace this section with your own contact details, demo link, and GitHub profile.
