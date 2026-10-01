# NLETA Website - National Lift Escalator Testing Agency

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Server
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

### 3. Access the Website
Open your browser and go to: `http://localhost:3000`

## Project Structure
```
nleta/
├── public/              # Frontend files
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styling
│   ├── script.js       # Frontend JavaScript
│   └── logo.png        # Company logo (add your logo here)
├── data/               # Backend data storage
│   └── inquiries.json  # Contact form submissions
├── server.js           # Express backend server
├── package.json        # Dependencies
└── README.md          # This file
```

## Features
- Responsive design with your brand colors (#171145 and #E6ACAC)
- Contact form with backend API
- Form submissions stored in JSON file
- Smooth scrolling navigation
- Mobile-friendly layout

## Next Steps
1. Add your logo as `public/logo.png`
2. Update content in `public/index.html`
3. Customize services and about sections
