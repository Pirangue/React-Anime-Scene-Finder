# 🔍 Anime Scene Finder (React)

A React-based reverse image search application that identifies anime from screenshots. Upload an image and discover which anime, episode, and exact moment it's from using the trace.moe API.

## Features

- **Image Upload** — Drag and drop or click to upload anime screenshots
- **URL Search** — Paste a direct image URL to search
- **Similarity Score** — Results show percentage match confidence (90%+ typically means correct)
- **Episode Information** — Get exact anime, season, episode, and timestamp
- **Anilist Integration** — Fetch detailed anime info including titles and status
- **Advanced Options** — Cut black borders for better accuracy, filter results by Anilist ID
- **API Key Support** — Optional API key for sponsors with higher quotas
- **Quota Tracking** — View your current usage and remaining quota
- **Multiple Results** — Get multiple matches ranked by similarity

## How It Works

1. **Choose Upload Method:**
   - **Upload File:** Drag and drop or click to select a local image/video
   - **URL:** Paste a direct link to an image

2. **Configure Options:**
   - Cut Black Borders — Automatically crop borders for better matching
   - Include Anilist Info — Get detailed anime information
   - Filter by Anilist ID — Narrow results to a specific anime (optional)

3. **Search:**
   - Click 🔎 **Buscar Anime** to start the reverse image search
   - The app analyzes the image and queries the trace.moe database

4. **View Results:**
   - Results sorted by similarity score
   - Green badge for high confidence matches (90%+)
   - Shows anime title, episode number, and timestamp

## Technologies Used

- **React** — Component-based UI framework
- **Vite** — Fast build tool and dev server
- **CSS** — Modern card-based layout with responsive design
- **JavaScript (ES6+)** — API integration, file handling, state management

## APIs Used

- **trace.moe API** — Reverse image search for anime
- **Anilist API** — Optional detailed anime information

## Quota Information

- **Free Users:** Limited searches per month
- **Sponsors:** Higher quotas with API key
- **Modal:** Click 📊 **Minha Cota** to view usage

## Error Handling

- File size validation (max 25MB)
- Loading animation during search
- Error banners for failed searches
- Helpful hints for improving match accuracy

## Setup - React + Vite

This project is built with React and Vite. For more information about the setup, see the [Vite React documentation](https://vitejs.dev/).

---

**Find any anime from a screenshot in seconds! 🎬✨**
