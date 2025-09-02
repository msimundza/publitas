# Image Slider Challenge

Draggable image slider using React and the HTML Canvas element, built with Vite.

## How to Run

There are two ways to run this project, depending on your goal.

---

### Option 1: Build and Run from Source

This is the standard developer workflow. It allows you to build the project from the source code and preview the production version.

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd publitas-marko-simundza
    ```

2.  **Install dependencies**
    ```bash
    npm i
    ```

3.  **Build and Preview**
    These commands will build the project for production and then start a local server to preview the result.
    ```bash
    npm run build
    npm run preview
    ```
    Then, open the URL provided in the terminal (usually `http://localhost:4173`).

---

### Option 2: Serve Pre-built Files from `dist/`

This option is for quickly viewing the project if you already have the `dist/` folder containing the built static files.

1.  **Navigate to the `dist` directory**
    ```bash
    cd /path/to/your/project/dist
    ```

2.  **Serve the files**
    Use any static file server. A simple one is `nws` (Node Web Server).

    *If you don't have `nws` installed globally, you can install it with:*
    ```bash
    npm install -g nws
    ```

    *Then, run the server from within the `dist` directory:*
    ```bash
    nws
    ```