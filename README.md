# YTO-Project

-   Basic Project Structure Plan:

    -   Backend: Django
    -   Frontend: React
    -   Database: PostgreSQL

-   Run dev build (for Windows):

    -   Backend: `cd backend` followed by `.venv/Scripts/Activate` and then `python manage.py runserver`
        -   Alternatively, run `make backend` to do the same thing
    -   Frontend: `cd frontend` followed by `npm run dev`
        -   Alternatively, run `make frontend` to do the same thing

-   Current features/functionality:

    -   Home page with trending videos, navbar for search, and tab side panel
    -   Settings page with various settings for dark mode, color theme, and infinite scroll
    -   Playlists page to view/edit/create playlists and add/edit/remove/play videos
    -   Channels page to view a channel's videos & statistics
    -   History page to view and delete previously watched videos

-   Future features to add:

    -   Download video feature (likely via yt-downloader & ffmpeg libs)
    -   Custom video player (for downloaded videos & maybe YouTube videos)
    -   Add video categories/tags to videos (for later search filter and home page videos)
    -   Add search filters to search bar (by channel, category, duration, upload date, etc.)
    -   Add watch later feature (likely use playlist feature for this)
    -   Add custom video recommendation (possibly via using AI/ML)
    -   Add comments to videos (maybe, but probably not)

-   Progress:

    -   07/19/2025:
        -   Added history page & various minor styling, error handling, and consistency changes
        -   Store watched videos history in postgres db
    -   06/01/2025:
        -   Added channel page & minor styling changes (not yet integrated subscribing/YouTube account linking)
        -   Allow playlists to play next video when not actively in tab
    -   05/31/2025:
        -   Added playlists page and player (not yet integrated YouTube playlists)
    -   05/30/2025:
        -   Improved settings page & added dynamic theme color changing ability
    -   05/28/2025:
        -   Migrated to TailwindCSS 3.4.17 and updated dependencies
    -   05/27/2025:
        -   Added basic settings page & dark mode
    -   05/26/2025:
        -   Minor QoL changes for development and removed some sensitive files being tracked by Git
    -   05/25/2025:
        -   Improved components from last commit, added trending videos to appear on home page
    -   05/24/2025:
        -   Added basic home page with navbar and side panel (no videos yet)
    -   05/23/2025:
        -   Completely scrapped and redid UI using TailwindCSS instead of Material UI
    -   05/22/2025:
        -   Infinite scroll added to search page using IntersectionObserver & page tokens
        -   Added Makefile to more easily run dev builds for backend & frontend
    -   05/11/2025:
        -   React frontend built to work for search and detail endpoint from backend (MaterialUI, dark mode & theme color options)
        -   Django backend successfully pulls from YouTube's API and serves custom API for frontend to use
