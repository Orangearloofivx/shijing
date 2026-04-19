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

