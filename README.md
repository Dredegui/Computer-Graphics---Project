# Computer Graphics Project at IST

This repository contains a project developed for the Computer Graphics course at Instituto Superior Técnico (IST). The goal of the project is to explore 3D graphics rendering and animation using the **Three.js** library.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Directory Structure](#directory-structure)
- [Controls](#controls)

---

## Overview

This project showcases a 3D environment featuring a robot and a trailer, modeled and animated using **Three.js**. Users can interact with the scene, control the robot and trailer, and switch between different camera perspectives. The project demonstrates the principles of 3D graphics, including object transformations, collision detection, and animation.

## Features

- 3D rendering with **Three.js**
- Interactive robot and trailer animations
- Multiple camera perspectives (orthogonal and perspective)
- Collision detection between objects
- Keyboard controls for user interaction
- Dynamic transformations such as robot arm, leg, and head movements
- Visual debugging options (e.g., wireframe toggle)

## Technologies Used

- **Three.js**: JavaScript 3D library for rendering and animations.
- **HTML/CSS**: For basic web page structure and styling.
- **JavaScript**: For logic, controls, and animations.

## Setup and Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Dredegui/Computer-Graphics---Project.git
   cd Computer-Graphics---Project/B
   ```

2. Open the `index.html` file in your preferred web browser. No additional setup is needed as this project does not require a server or build tools.

## Usage

Once the project is loaded in your browser:

1. Use the keyboard controls (see [Controls](#controls)) to interact with the robot and trailer.
2. Switch between different camera views to explore the scene.
3. Observe the animations, transformations, and collision detection.

## Directory Structure

```plaintext
Computer-Graphics---Project/
├── B/                  # Main project directory
│   ├── css/            # Contains CSS styles
│   │   └── style.css   # Styles for the web page
│   ├── js/             # JavaScript files
│   │   ├── three.js    # Three.js library
│   │   ├── dat.gui.js  # GUI for debugging and parameter tweaking
│   │   ├── Stats.js    # Performance monitoring
│   │   ├── OrbitControls.js # Camera controls for the scene
│   │   ├── VRButton.js # WebXR VR support
│   │   └── main-script.js # Core logic and animation
│   └── index.html      # Entry point for the web page
├── C/                  # (Optional) Alternate or additional project components
│   ├── css/
│   └── js/
```

## Controls

Here are the keyboard controls for interacting with the scene:

### Robot Controls

- `F` / `R`: Rotate the robot's head.
- `W` / `S`: Rotate the robot's legs.
- `E` / `D`: Move the robot's arms.
- `Q` / `A`: Rotate the robot's feet.

### Trailer Controls

- Arrow Keys (`↑`, `↓`, `←`, `→`): Move the trailer.

### Camera Controls

- Numbers `1` to `5`: Switch between predefined camera views.

### Other Controls

- `6`: Toggle wireframe mode.

---

Enjoy exploring the world of 3D graphics!
