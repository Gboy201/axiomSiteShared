# Startup Quest - Interactive Adventure Website

An immersive 8-bit fantasy adventure website for a startup pitch competition. Users control a character through a pixelated world, exploring different areas to discover event information.

## 🎮 Features

- **Interactive 8-bit Fantasy World**: Explore a beautifully crafted pixel art map
- **Character Movement**: WASD/Arrow keys for desktop, touch controls for mobile
- **Multiple Rooms**: Schedule, Registration, Sponsors, Team, Contact, and About sections
- **Smooth Animations**: Character movement and room entry transitions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Signpost Navigation**: Clear guidance to different areas of the website

## 🚀 Live Demo

Visit the live website: [Your Vercel URL will go here]

## 🛠️ Local Development

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd startup-quest-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 📱 Controls

### Desktop
- **Movement**: WASD or Arrow Keys
- **Interact**: Spacebar
- **Close Room**: Escape key

### Mobile
- **Movement**: Touch D-pad controls
- **Interact**: Touch "ENTER" button
- **Close Room**: Touch X button in room

## 🏗️ Deployment to Vercel

1. **Connect to Vercel**
   ```bash
   vercel --prod
   ```

2. **Or deploy via GitHub**
   - Push to GitHub repository
   - Connect repository to Vercel dashboard
   - Deploy automatically on push

## 📁 Project Structure

```
startup-quest-website/
├── index.html          # Main HTML structure
├── styles.css         # 8-bit fantasy styling
├── game.js           # Game engine and logic
├── package.json      # Dependencies and scripts
├── vercel.json       # Vercel deployment config
└── README.md         # This file
```

## 🎨 Customization

### Adding New Rooms
1. Add room entrance to the `interactables` array in `game.js`
2. Add room data to the `rooms` object
3. Customize content with HTML formatting

### Modifying the Map
- Edit the `map` array in `createMap()` method
- Use tile codes: 0=grass, 1=path, 2=water, 3=tree, 4=signpost, 5=entrance

### Styling Changes
- Modify `styles.css` for visual adjustments
- Update color schemes, fonts, and animations
- Adjust responsive breakpoints

## 🎯 Event Customization

This template is designed for a startup pitch competition but can be easily adapted for:
- Conferences and workshops
- Product launches
- Company events
- Educational content
- Portfolio websites

## 🔧 Technical Details

- **Pure JavaScript**: No frameworks required
- **Canvas-based**: Smooth 60fps rendering
- **Mobile-first**: Touch controls and responsive design
- **Static hosting**: Works with any static hosting service
- **SEO-friendly**: Proper meta tags and structure

## 📄 License

MIT License - feel free to use this for your own events and projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you need help customizing this for your event, reach out to the development team! 