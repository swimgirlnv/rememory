# rememory

ENGL 1050J Multimedia Storytelling 11/6/2024
Final Project Pitch Link to prototype: https://rememory-one.vercel.app/
Link to Draft 1: https://docs.google.com/document/d/e/2PACX-1vRq475QjO9aEcY9OC4DPjU3mK-57qeybHmtDfp0IWL-03G7Kzldd_mrOwXIeyXjgKk_gAAMP5BGB6fm/pub 
Link to Draft 2: https://docs.google.com/document/d/e/2PACX-1vRZSIlIG_7aLuy82nO7uxqFkWhKnqCHckgAptehPPR4VnMsF0ks6hj4TuNOKPeRmzCtf7DD6FyfCbUM/pub 

## Personal Statement
I am a digital media developer and interdisciplinary creative with a strong background in interactive storytelling, web development, and data visualization. My practice focuses on blending narrative, technology, and design to create immersive, user-driven experiences. Currently, I am building an interactive map app that allows users to explore locations through memories, media, and embedded routes, transforming static spaces into dynamic narratives. This project builds on my interest in how digital tools can deepen connections with physical spaces, making information, memories, and personal narratives accessible and interactive.

## Project Description
The project is an interactive, multimedia-rich map application that reimagines how users engage with university spaces. This digital platform allows users to click on various campus buildings to reveal personal memories, explore multimedia elements, and trace routes between significant locations. Each building pop-up includes descriptive text, video, music, and photos, allowing the audience to engage with spaces through more than just location. Routes between buildings showcase pathways familiar to students, and each route includes audio or video narratives to enrich the journey.

This app fosters a connection between users and the university, inviting them to re-experience or explore spaces through the lens of lived experience. It will be accessible online and potentially integrated with campus tours or historical archives, turning the app into a continuously evolving storytelling tool. This project takes the form of a digital, interactive map application, utilizing web technologies like React, Leaflet, and multimedia integrations. By blending place, memory, and media, this app creates a meaningful way for users to engage with campus spaces beyond traditional, static maps.

## Project Contribution to Wider Interests
This interactive map app aligns with my broader goals of rethinking the ways we document, share, and engage with spatial and narrative data. My work has consistently explored how digital platforms can transform physical experiences, specifically focusing on how we navigate, remember, and narrate space. This project not only strengthens my technical practice but also engages my interest in bridging digital interfaces with user-generated content, effectively democratizing access to collective and personal histories.

Through this app, I am exploring a concept I call “digital memory landscapes,” where physical spaces become canvases for individual and collective memories. By allowing users to interact with memories, sounds, and visuals associated with each location, the app emphasizes the layers of experience that make up campus life. This approach aligns with my larger creative practice of creating tools and experiences that enable people to navigate and share narratives in ways that are participatory and immersive.

Beyond technical skills, this project engages questions about space, memory, and community that are central to my creative and intellectual pursuits. I am interested in how digital tools can enhance personal connection to space, offering new ways to explore and understand environments like university campuses. This project pushes my practice forward by experimenting with the layering of media types—text, audio, and video—and developing interactivity that makes users’ experiences active rather than passive.

This project could evolve into a toolkit for communities beyond the university, enabling museums, historical sites, or neighborhoods to create their own interactive maps enriched with personal stories and multimedia. By making space for layered, multimedia narratives within a map interface, I am creating a bridge between digital media and spatial storytelling that could have broader applications in community building, memory preservation, and digital archiving. This project is not just an app but a prototype for a different way to understand and connect with physical spaces through digital tools.


# Features in Progress
- Media Upload: a user is able to upload images, videos, or music to their Markers or Paths

- If not logged in you can't enter edit mode ;)

- on creating a new marker/path it immediately opens the edit modal

- re-fix the hooks so deletes/updates don't require hard refresh

- Tags + Shared memories: within the edit modal a user will be given suggested tags to mark the memory as. This will then sort the memory into a folder(s) within the right side panel that can open and see all the memories attached to that folder. (Potentially have a new type of Marker for a Shared Memory where clicking on it in the map will open the web of other memories attached to it.)
    - Within the right side panel, on clicking on a memory it will both open the view modal to see the memory and also zoom the map to the memory location.

    - changing zoom changes the pins in side bar
    - change the class year + year to make more sense
    - clicking on path zooms between locations
    - some paths are visible some paths aren't if there is a part 1 part 2
    - not until you click on marker with a path does the path show up
    - move through pins with an arrow
    - with paths, make new marker type that 
    - report button that on +x the thing hides
    - shadowban users on +x reports
    - give mod power to users?
    - everything has to be approved before going up

- Public Map and Private Map: A user can switch between a public and private map and the markers/paths are able to be toggled as public+private or private.


1. Tags + Shared Memories

a. Suggested Tags in Edit Modal

	•	Feature: Use existing memory content to suggest tags and allow users to select or create tags.
	•	Implementation:
	•	Continue refining the tag suggestion logic already added.
	•	Save the selected tags into Firestore under each memory.

b. Right Side Panel with Tags

	•	Feature: Sort memories into tag-based folders in the right panel. Clicking a tag shows all associated memories.
	•	Implementation:
	•	Add collapsible folders in the right panel for each tag.
	•	When a memory is clicked, the modal opens, and the map zooms to the memory location.

c. Shared Memory Marker

	•	Feature: Introduce a new marker type (e.g., “Shared Memory Marker”) to connect related memories visually.
	•	Implementation:
	•	Use a new marker icon to represent shared memories.
	•	Clicking on the marker shows a web of connected memories, possibly with lines or visual links between them.
	•	Add functionality to create these markers based on shared tags.

2. Zoom Adjustments

a. Pins Adjust to Map Zoom

	•	Feature: Adjust the list of visible pins in the right panel based on the current map view.
	•	Implementation:
	•	Use Leaflet’s onZoomEnd and onMoveEnd events to detect map changes.
	•	Filter pins in the right panel based on their visibility on the map.

b. Paths Visible Only When Relevant

	•	Feature: Some paths become visible only when certain markers are clicked.
	•	Implementation:
	•	Add a visible property to paths and toggle visibility based on marker interactions.

3. Improved Path and Marker Interaction

a. Clicking a Path Zooms Between Locations

	•	Feature: Clicking on a path zooms the map between its markers.
	•	Implementation:
	•	Use Leaflet’s fitBounds method to adjust the map view to show all markers in the path.

b. New Marker Type for Paths

	•	Feature: Add a specific marker type to represent path-related markers.
	•	Implementation:
	•	Introduce a “Path Marker” that visually differentiates markers that are part of paths.

4. Moderation Features

a. Report Button

	•	Feature: Add a “Report” button for memories and paths.
	•	Implementation:
	•	Increment a reportCount for each item when reported.
	•	Automatically hide items with more than a threshold (e.g., reportCount >= 3).

b. Shadowban Users

	•	Feature: Shadowban users based on the number of reports.
	•	Implementation:
	•	Track user activity and flag accounts with multiple reports.
	•	Prevent shadowbanned users from seeing their own banned content.

c. Moderator Powers

	•	Feature: Allow selected users to moderate content.
	•	Implementation:
	•	Add a “moderator” role in Firestore and restrict moderation actions (e.g., approving/hiding content) to users with this role.

5. Approval Workflow

a. Approval for All Content

	•	Feature: Require moderator approval for new markers, paths, and edits before they appear on the public map.
	•	Implementation:
	•	Add a status field to content (e.g., pending, approved, rejected).
	•	Show pending content only to moderators.

6. Public and Private Map

a. Toggle Between Public and Private Maps

	•	Feature: Allow users to switch between public and private maps.
	•	Implementation:
	•	Add a toggle button in the UI for switching modes.
	•	Filter markers and paths based on a visibility property (e.g., public, private).

b. Toggle Visibility of Content

	•	Feature: Let users mark markers and paths as public or private.
	•	Implementation:
	•	Add a visibility field to markers and paths.
	•	Use this field to determine which content is shown in each map mode.

7. Navigation Through Pins and Paths

a. Navigate Pins with Arrows

	•	Feature: Add arrows to navigate through pins in the right panel or modal.
	•	Implementation:
	•	Maintain a current index in the pin list and update it with arrow key interactions.

Prioritizing Features

	•	First Milestone:
	•	Tags in edit modal, shared memories, and tag-based folders.
	•	Zoom-based pin filtering.
	•	Public/private map toggle.
	•	Second Milestone:
	•	Path-related features (e.g., selective visibility, new marker type).
	•	Moderation tools (reporting, shadowbanning, approval workflow).
	•	Third Milestone:
	•	Enhanced navigation and shared memory visualizations.