# UTS Trip Tracking Service

## Project Summary
The UTS Trip Tracking Service is a web application that solves the problem of manually managing domestic flight trip details across scattered notes or apps. It gives users one place to add, view, edit, and delete upcoming trips with clear validation rules and structured storage. The interface is built for interaction through a table + modal workflow, while the backend enforces data checking and validation for unique booking references and valid trip details.

## Technical Stack
- Frontend: HTML5 + JavaScript (DOM rendering, modal interactions, Fetch API calls)
- Styling: Custom CSS (responsive layout, modern visual theme, interactive buttons/modals)
- Backend and routing: Node.js + Express with REST endpoints
- Data layer: MySQL, with normalized tables for cities and trips
- Deployment: Not deployed in this assignment (locally viewed on localhost:3000)

## Feature List
- View all trips in a sorted table loaded dynamically from the API
- Add a new trip through a form
- Edit an existing trip from the trip details
- Delete a trip with confirmation prompt
- City validation to prevent identical origin and destination
- Server-side validation for required fields, seat count, and valid IDs

## Folder Structure
- public/index.html: Main single-page interface structure
- public/style.css: Global styles, responsive rules, and modal/table/button design
- public/js/main.js: Frontend logic for API calls, rendering rows, modal behavior, and validation
- server.js: Express server, static hosting, and REST API routes
- mysql/schema.sql: Database schema, seed data, and SQL view definition
- package.json: Node project metadata, dependencies, and start script

## Challenges Overcome
One key challenge was keeping frontend and backend validation consistent so invalid trips are blocked both before submission and at the API layer. Another challenge was handling edit mode cleanly using the same modal used for creating trips, without duplicating form logic. Managing relational data was also important: trips store city IDs, but the UI must display readable city names and keep mappings accurate during edits. We also needed to handle API error states (duplicate booking references, missing records, and server failures) so users receive clear feedback. Finally, the table and modal experience had to remain usable on smaller screens, which required responsive styling and overflow-safe table behavior. This ended up not being developed, however behaviour is mostly functional on smaller screens.

## Quick Start (Local)
1. Install dependencies:
	npm install
2. Create the database and tables:
	- Run mysql/schema.sql in MySQL.
3. Update database credentials in server.js if needed.
4. Start the server:
	npm start
5. Open:
	http://localhost:3000

