# Jaseci Website - jaseci.org

This folder contains the static documentation website for the Jac programming language and the Jaseci runtime stack. The site introduces Jac, its features, community, and provides resources for getting started, learning, and contributing.

Will be hosted on www.jaseci.org

## Folder Structure

```
docs/
│
├── index.html           # Main landing page
├── aboutus.html         # About Us page
├── community.html       # Community Hub page
│
├── assets/              # Images and logos
│   ├── logo.png
│   ├── org1_logo.png
│   ├── org2_logo.png
│   ├── org3_logo.png
│   ├── leadership_team/
│   │   └── ...png
│   └── partners/
│       └── ...png
│
├── css/                 # Stylesheets
│   ├── landing.css
│   ├── aboutus.css
│   └── community.css
│
└── js/                  # JavaScript files
    ├── landing.js
    ├── feedback.js
    └── subscribe.js
```

## How to Run

1. **Clone or Download** this repository to your local machine.

2. **Run a Local Server**  
   For best results (especially for loading assets and scripts), use a simple HTTP server. For example, with Python:

   ```sh
   # For Python 3.x
   cd jaseci-website
   ```
   * Install dependencies

    ```
    npm install
    ```

    * Run locally

    ```
    npm run dev
    ```

---

After finishing all the customization, you can create a production build by running this command.

```
npm run build
```

For any issues or contributions, please visit the [main Jac & Jaseci GitHub repository](https://github.com/Jaseci-Labs/jaseci).
