// Startup Quest - 8-bit Fantasy Game Engine
class StartupQuest {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.characterSpriteElement = document.getElementById('character-sprite');
        this.characterSpriteStatic = document.getElementById('character-sprite-static');
        this.staticCtx = this.characterSpriteStatic.getContext('2d');
        this.mapTitleOverlay = document.getElementById('map-title-overlay');
        this.roomModal = document.getElementById('room-modal');
        this.mobileControls = document.getElementById('mobile-controls');
        
        // Mobile debug elements
        this.mobileDebug = document.getElementById('mobile-debug');
        this.debugPlayer = document.getElementById('debug-player');
        this.debugNearest = document.getElementById('debug-nearest');
        this.debugDistance = document.getElementById('debug-distance');
        this.debugStatus = document.getElementById('debug-status');
        this.debugProgress = document.getElementById('debug-progress');
        
        // Static frame capture
        this.staticFrameCaptured = false;
        
        // Background image settings
        this.backgroundImage = new Image();
        this.imageLoaded = false;
        this.mapWidth = 1920; // Image will be scaled to fit
        this.mapHeight = 1080;
        this.camera = { x: 0, y: 0 };
        this.scale = 1; // Will be calculated based on screen size
        
        // Character sprite
        this.characterSprite = new Image();
        this.characterSpriteLoaded = false;
        
        // Collision map
        this.collisionMap = new Image();
        this.collisionMapLoaded = false;
        this.collisionCanvas = null;
        this.collisionCtx = null;
        this.collisionCheckCounter = 0;
        
        // Portal system
        this.portalMap = new Image();
        this.portalMapLoaded = false;
        this.portalCanvas = null;
        this.portalCtx = null;
        this.portalImage = new Image();
        this.portalImageLoaded = false;
        // Portal interaction
        this.portals = [];
        this.portalScaleX = 1;
        this.portalScaleY = 1;
        
        // Portal teleportation system
        this.portalTeleportTimer = 0;
        this.currentPortalIndex = -1;
        this.teleportDelay = 90; // 1.5 seconds at 60 FPS
        this.isAtPortalCenter = false;
        this.hasLoggedPortalCount = false;
        this.mapOpacity = 1.0; // For fade effect during teleportation
        this.isTeleporting = false; // Flag to prevent state changes during teleportation
        
        // Player properties
        this.player = {
            x: this.mapWidth / 2, // Start in center
            y: this.mapHeight / 2,
            width: 24,
            height: 24,
            speed: 4.0, // Faster, responsive movement
            direction: 'down',
            isMoving: false,
            animFrame: 0,
            animTimer: 0
        };
        
        // Input handling
        this.keys = {};
        this.touchDirection = null;
        this.firstKeyPressed = false; // Debug flag for first load issues
        
        // Game state
        this.currentRoom = null;
        this.gameLoaded = false;
        this.titleFaded = false;
        
        // Initialize
        this.setupCanvas();
        this.createRoomData();
        
        // Set up event listeners immediately since we're using window.addEventListener('load')
        this.setupEventListeners();
        
        // IMMEDIATE START - Set flags but let portal detection happen when map loads
        // console.log(`🚀 STARTING GAME IMMEDIATELY - Initializing core systems!`);
        
        // Set flags for immediate game start
        this.imageLoaded = true;
        this.characterSpriteLoaded = true;
        this.collisionMapLoaded = true;
        // Note: portalMapLoaded and portalImageLoaded will be set when assets actually load
        
        // Load assets in background while game runs
        this.loadBackgroundImage();
        this.loadCharacterSprite();
        this.loadCollisionMap();
        this.loadPortalMap();
        this.loadPortalImage();
        
        // Add page show listener to reset opacity when returning via back button
        window.addEventListener('pageshow', (event) => {
            // This fires when page is shown, including back button navigation
            if (event.persisted) {
                // Page was loaded from cache (back button used)
                this.resetOpacityAfterReturn();
            }
        });
        
        // Also add focus listener as backup for other navigation cases
        window.addEventListener('focus', () => {
            this.resetOpacityAfterReturn();
        });
        
        // Start the game after a brief delay to ensure everything is ready
        setTimeout(() => {
            this.startGame();
        }, 500);
    }
    
    setupCanvas() {
        const updateCanvasSize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            
            // Debug canvas positioning
                    // console.log(`🔧 Canvas size: ${this.canvas.width}x${this.canvas.height}`);
        // console.log(`🔧 Window size: ${window.innerWidth}x${window.innerHeight}`);
        // console.log(`🔧 Canvas offset: ${this.canvas.offsetTop}px from top`);
        };
        
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', e => e.preventDefault());
        
        // Prevent mobile scrolling and zooming on canvas
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        // Calculate scale to fit image nicely on screen
        this.updateScale();
    }
    
    updateScale() {
        // Scale the map for a wider view - see more of the world
        const scaleX = (this.canvas.width * 1.4) / this.mapWidth;
        const scaleY = (this.canvas.height * 1.4) / this.mapHeight;
        this.scale = Math.max(scaleX, scaleY, 0.5); // Minimum scale of 0.5 for zoomed out view
    }
    
    loadBackgroundImage() {
        // Load your actual beautiful fantasy image
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => {
            // Get the actual dimensions of your image
            this.mapWidth = this.backgroundImage.naturalWidth;
            this.mapHeight = this.backgroundImage.naturalHeight;
            
            // CRITICAL: Recalculate collision scaling factors with new map dimensions
            this.recalculateCollisionScaling();
            
            // Update player starting position to center of your image
            this.player.x = this.mapWidth / 2;
            this.player.y = this.mapHeight / 2;
            

            
            // console.log(`✅ Background image loaded during gameplay`);
        };
        
        this.backgroundImage.onerror = () => {
            // console.log("Could not load your image, creating fallback...");
            // Fallback to programmatic background if image fails to load
            this.createBeautifulBackground();
            // console.log(`✅ Using fallback background`);
        };
        
        // Load your actual beautiful fantasy image file
        this.backgroundImage.src = 'map.png';
    }
    
    loadCharacterSprite() {
        this.characterSprite.onload = () => {
            // Set the HTML img element source
            this.characterSpriteElement.src = 'dragon.gif';
            
            // Capture first frame for static version
            this.captureStaticFrame();
            // console.log(`✅ Dragon sprite loaded during gameplay`);
        };
        
        this.characterSprite.onerror = () => {
            // console.log("Could not load dragon.gif character sprite");
            // console.log(`⚠️ Game will continue without dragon sprite`);
        };
        
        this.characterSprite.src = 'dragon.gif';
    }
    
    captureStaticFrame() {
        // Wait a moment for the image to be ready, then capture first frame
        setTimeout(() => {
            this.characterSpriteStatic.width = 100;
            this.characterSpriteStatic.height = 100;
            this.staticCtx.drawImage(this.characterSprite, 0, 0, 100, 100);
            this.staticFrameCaptured = true;
        }, 100);
    }
    
    recalculateCollisionScaling() {
        // Only recalculate if collision canvas exists
        if (this.collisionCanvas && this.collisionMapLoaded) {
            // Recalculate scale ratios for coordinate conversion
            this.collisionScaleX = this.collisionCanvas.width / this.mapWidth;
            this.collisionScaleY = this.collisionCanvas.height / this.mapHeight;
            
                    // console.log(`🔧 RECALCULATED Collision coordinate conversion:`);
        // console.log(`   Scale X: ${this.collisionScaleX.toFixed(3)} (${this.collisionCanvas.width}/${this.mapWidth})`);
        // console.log(`   Scale Y: ${this.collisionScaleY.toFixed(3)} (${this.collisionCanvas.height}/${this.mapHeight})`);
            
            if (this.collisionScaleX !== 1 || this.collisionScaleY !== 1) {
                // console.log(`📐 Different dimensions - scaling coordinates properly`);
            } else {
                // console.log(`✅ Same dimensions - direct coordinate mapping`);
            }
        }
    }
    
    loadCollisionMap() {
        this.collisionMap.onload = () => {
            // Create a canvas to read pixel data from the collision map
            this.collisionCanvas = document.createElement('canvas');
            this.collisionCanvas.width = this.collisionMap.naturalWidth;
            this.collisionCanvas.height = this.collisionMap.naturalHeight;
            this.collisionCtx = this.collisionCanvas.getContext('2d');
            
            // Draw the collision map to the canvas so we can read pixels
            this.collisionCtx.drawImage(this.collisionMap, 0, 0);
            this.collisionMapLoaded = true;
            
            // console.log(`🗺️ Collision map loaded successfully!`);
            // console.log(`📏 Collision map (Component 1.png): ${this.collisionCanvas.width}x${this.collisionCanvas.height}`);
            // console.log(`📏 Game map (map.png): ${this.mapWidth}x${this.mapHeight}`);
            // console.log(`🎮 Player starting position: (${this.player.x}, ${this.player.y})`);
            
            // Calculate initial scale ratios for coordinate conversion
            this.recalculateCollisionScaling();
            
            // console.log(`✅ Collision map loaded during gameplay`);
        };
        
        this.collisionMap.onerror = () => {
            // console.log("❌ Could not load Component 1.png collision map");
            // console.log(`⚠️ Game will continue without collision detection`);
        };
        
        this.collisionMap.src = 'Component 1.png';
    }
    
    loadPortalMap() {
        this.portalMap.onload = () => {
            // Create a canvas to read pixel data from the portal map
            this.portalCanvas = document.createElement('canvas');
            this.portalCanvas.width = this.portalMap.naturalWidth;
            this.portalCanvas.height = this.portalMap.naturalHeight;
            this.portalCtx = this.portalCanvas.getContext('2d');
            
            // Draw the portal map to the canvas so we can read pixels
            this.portalCtx.drawImage(this.portalMap, 0, 0);
            this.portalMapLoaded = true;
            
            // console.log(`🌀 Portal map loaded successfully!`);
            // console.log(`📏 Portal map (Component 2.png): ${this.portalCanvas.width}x${this.portalCanvas.height}`);
            
            // Calculate scale ratios for coordinate conversion
            this.portalScaleX = this.portalCanvas.width / this.mapWidth;
            this.portalScaleY = this.portalCanvas.height / this.mapHeight;
            
            // console.log(`🔧 Portal coordinate conversion:`);
            // console.log(`   Scale X: ${this.portalScaleX.toFixed(3)} (${this.portalCanvas.width}/${this.mapWidth})`);
            // console.log(`   Scale Y: ${this.portalScaleY.toFixed(3)} (${this.portalCanvas.height}/${this.mapHeight})`);
            
            // ✅ CRITICAL: Find portal locations NOW that map is loaded
            this.findPortalLocations();
            // console.log(`✅ Portal map loaded and portals detected during gameplay`);
        };
        
        this.portalMap.onerror = () => {
            // console.log("❌ Could not load Component 2.png portal map");
            // console.log(`⚠️ Game will continue without portals`);
        };
        
        this.portalMap.src = 'Component 2.png';
    }
    
    findPortalLocations() {
        // Only initialize portals once
        if (this.portals.length > 0) {
            return;
        }
        
        // HARDCODED PORTAL COORDINATES - Original correct positions
        this.portals = [
            { x: 165, y: 274, width: 64, height: 64, rotation: 0, rotationSpeed: 0, isActive: false },  // Portal 1
            { x: 847, y: 280, width: 64, height: 64, rotation: 0, rotationSpeed: 0, isActive: false },  // Portal 2
            { x: 499, y: 296, width: 64, height: 64, rotation: 0, rotationSpeed: 0, isActive: false },  // Portal 3
            { x: 859, y: 568, width: 64, height: 64, rotation: 0, rotationSpeed: 0, isActive: false },  // Portal 4
            { x: 177, y: 562, width: 64, height: 64, rotation: 0, rotationSpeed: 0, isActive: false },  // Portal 5 (team portal - moved right by 50px)
            { x: 202, y: 843, width: 64, height: 64, rotation: 0, rotationSpeed: 0, isActive: false },  // Portal 6
            { x: 837, y: 838, width: 64, height: 64, rotation: 0, rotationSpeed: 0, isActive: false }   // Portal 7
        ];
        
        // console.log(`✅ HARDCODED portals initialized! Total: ${this.portals.length} portals`);
    }
    
    // adjustMiddleLeftPortal() - REMOVED: Coordinates already include the adjustment
    
    loadPortalImage() {
        this.portalImage.onload = () => {
            this.portalImageLoaded = true;
            // console.log(`🚪 Portal image loaded successfully!`);
            // console.log(`📏 Portal image dimensions: ${this.portalImage.naturalWidth}x${this.portalImage.naturalHeight}`);
            
            // Update portal dimensions if we already found portals but didn't have image dimensions
            if (this.portals.length > 0) {
                this.portals.forEach(portal => {
                    portal.width = this.portalImage.naturalWidth;
                    portal.height = this.portalImage.naturalHeight;
                });
                // console.log(`🔄 Updated ${this.portals.length} portal dimensions to ${this.portalImage.naturalWidth}x${this.portalImage.naturalHeight}`);
            }
            
            // console.log(`✅ Portal image loaded during gameplay`);
        };
        
        this.portalImage.onerror = () => {
            // console.log("❌ Could not load portal.png");
            // console.log(`⚠️ Game will continue without portal graphics`);
        };
        
        this.portalImage.src = 'portal.png';
    }
    

    
    updatePortalRotations() {
        if (!this.portalImageLoaded || this.portals.length === 0) return;
        
        const portalSize = 120; // Match the render size
        const maxDistance = portalSize / 2; // Maximum interaction distance
        
        this.portals.forEach(portal => {
            const portalCenterX = portal.x;
            const portalCenterY = portal.y;
            const portalHalfSize = portalSize / 2;
            
            // Check if player overlaps with portal
            const isInPortal = (
                this.player.x + this.player.width / 2 > portalCenterX - portalHalfSize &&
                this.player.x - this.player.width / 2 < portalCenterX + portalHalfSize &&
                this.player.y + this.player.height / 2 > portalCenterY - portalHalfSize &&
                this.player.y - this.player.height / 2 < portalCenterY + portalHalfSize
            );
            
            if (isInPortal) {
                // Calculate distance from player center to portal center
                const playerCenterX = this.player.x;
                const playerCenterY = this.player.y;
                const distance = Math.sqrt(
                    Math.pow(playerCenterX - portalCenterX, 2) + 
                    Math.pow(playerCenterY - portalCenterY, 2)
                );
                
                // Calculate rotation speed based on proximity (closer = faster)
                // Distance ranges from 0 (center) to maxDistance (edge)
                const proximityFactor = Math.max(0, (maxDistance - distance) / maxDistance);
                const baseRotationSpeed = 0.008; // Very slow base rotation
                const maxRotationSpeed = 0.05; // Moderate fast rotation when very close
                
                portal.rotationSpeed = baseRotationSpeed + (proximityFactor * maxRotationSpeed);
                portal.isActive = true;
                
                // Update rotation angle
                portal.rotation += portal.rotationSpeed;
                if (portal.rotation > Math.PI * 2) {
                    portal.rotation -= Math.PI * 2; // Keep angle between 0 and 2π
                }
            } else {
                // Gradually transition to idle rotation when player leaves
                const idleRotationSpeed = -0.003; // Very slow counterclockwise rotation
                
                if (portal.isActive) {
                    // Gradually slow down from active rotation
                    portal.rotationSpeed *= 0.95; // Decay factor
                    if (Math.abs(portal.rotationSpeed - idleRotationSpeed) < 0.005) {
                        portal.rotationSpeed = idleRotationSpeed;
                        portal.isActive = false;
                    }
                } else {
                    // Maintain idle rotation
                    portal.rotationSpeed = idleRotationSpeed;
                }
                
                // Update rotation angle
                portal.rotation += portal.rotationSpeed;
                if (portal.rotation > Math.PI * 2) {
                    portal.rotation -= Math.PI * 2;
                } else if (portal.rotation < 0) {
                    portal.rotation += Math.PI * 2;
                }
            }
        });
    }
    
    checkPortalInteraction() {
        // Debug: Always log portal count on first call
        if (!this.hasLoggedPortalCount) {
                    // console.log(`Portal system initialized with ${this.portals.length} portals`);
        // console.log(`📱 Is mobile device: ${/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}`);
        // console.log(`📱 Screen dimensions: ${window.innerWidth}x${window.innerHeight}`);
        // console.log(`📱 Canvas dimensions: ${this.canvas.width}x${this.canvas.height}`);
        // console.log(`📱 Map dimensions: ${this.mapWidth}x${this.mapHeight}`);
        // console.log(`📱 Scale: ${this.scale}`);
            this.hasLoggedPortalCount = true;
        }
        
        // Debug: Basic info
        if (this.portals.length === 0) {
            // console.log("No portals found!");
            return;
        }
        
        // If already teleporting, keep faded and don't change state
        if (this.isTeleporting) {
            this.mapOpacity = 0.2; // Keep faded
            return;
        }
        

        
        let nearestPortalIndex = -1;
        let minDistance = Infinity;
        
        this.portals.forEach((portal, index) => {
                    // Portal coordinates are already the center
        const portalCenterX = portal.x;
        const portalCenterY = portal.y;
        
        // Adjust player coordinates for navbar offset in portal detection (mobile only)
        const playerCenterX = this.player.x + this.player.width / 2;
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const playerCenterY = (this.player.y + this.player.height / 2) - (isMobileDevice ? 60 : 0); // Subtract navbar offset only on mobile
            
            const distance = Math.sqrt(
                Math.pow(playerCenterX - portalCenterX, 2) + 
                Math.pow(playerCenterY - portalCenterY, 2)
            );
            
            // Enhanced mobile debugging for portal detection
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            // Debug logs removed
            
            // Check if player is within portal area (70px radius)
            if (distance <= 70) {
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestPortalIndex = index;
                }
                portal.isActive = true;
            } else {
                portal.isActive = false;
            }
        });
        
        // Check if player is at the center of a portal (within 50px of center)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (nearestPortalIndex !== -1 && minDistance <= 50) {
            if (this.currentPortalIndex === nearestPortalIndex) {
                // Continue timing for the same portal
                this.portalTeleportTimer++;
                
                // Calculate fade effect - start fading at 50% progress
                const fadeStartTime = this.teleportDelay * 0.5;
                if (this.portalTeleportTimer >= fadeStartTime) {
                    const fadeProgress = (this.portalTeleportTimer - fadeStartTime) / (this.teleportDelay - fadeStartTime);
                    this.mapOpacity = 1.0 - (fadeProgress * 0.8); // Fade to 20% opacity
                } else {
                    this.mapOpacity = 1.0; // Full opacity
                }
                
                // Debug: Show progress every 30 frames (half second) - REMOVED
                
                if (this.portalTeleportTimer >= this.teleportDelay) {
                    // Teleport logic - debug removed
                    this.isTeleporting = true; // Set teleporting flag
                    this.mapOpacity = 0.2; // Keep faded during transition
                    this.teleportToPage(nearestPortalIndex);
                }
            } else {
                // Started standing at a new portal center
                this.currentPortalIndex = nearestPortalIndex;
                this.portalTeleportTimer = 0;
                this.mapOpacity = 1.0; // Reset opacity
                
                // Started teleport timer - debug removed
            }
            this.isAtPortalCenter = true;
        } else {
            // Player moved away from portal center or not close enough
            if (this.portalTeleportTimer > 0) {
                // Teleport cancelled - debug removed
            }
            this.portalTeleportTimer = 0;
            this.currentPortalIndex = -1;
            this.isAtPortalCenter = false;
            
            // Only reset opacity if not already teleporting
            if (!this.isTeleporting) {
                this.mapOpacity = 1.0;
            }
        }
        
        // Update mobile debug overlay
        if (isMobile) {
            this.updateMobileDebug(nearestPortalIndex, minDistance);
        }
    }
    
    updateMobileDebug(nearestPortalIndex, minDistance) {
        if (!this.debugPlayer) return; // Elements not found
        
        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;
        
        // Update player position
        this.debugPlayer.textContent = `Player: (${Math.round(playerCenterX)}, ${Math.round(playerCenterY)})`;
        
        // Update nearest portal info
        if (nearestPortalIndex !== -1) {
            const portal = this.portals[nearestPortalIndex];
            this.debugNearest.textContent = `Portal ${nearestPortalIndex + 1}: (${portal.x}, ${portal.y})`;
            this.debugDistance.textContent = `Distance: ${Math.round(minDistance)}px`;
            
            // Update status based on distance
            if (minDistance <= 50) {
                this.debugStatus.textContent = `Status: IN CENTER (≤50px)`;
                this.debugStatus.style.color = '#00ff00'; // Green
            } else if (minDistance <= 70) {
                this.debugStatus.textContent = `Status: In Range (≤70px)`;
                this.debugStatus.style.color = '#ffff00'; // Yellow
            } else {
                this.debugStatus.textContent = `Status: Too Far (need ≤70px)`;
                this.debugStatus.style.color = '#ff6666'; // Red
            }
            
            // Update teleport progress
            if (this.portalTeleportTimer > 0) {
                const progress = Math.round((this.portalTeleportTimer / this.teleportDelay) * 100);
                this.debugProgress.textContent = `Progress: ${progress}% (${this.portalTeleportTimer}/${this.teleportDelay})`;
                this.debugProgress.style.color = '#00ffff'; // Cyan
            } else {
                this.debugProgress.textContent = `Progress: 0%`;
                this.debugProgress.style.color = '#888888'; // Gray
            }
        } else {
            this.debugNearest.textContent = `Portal: None detected`;
            this.debugDistance.textContent = `Distance: ∞`;
            this.debugStatus.textContent = `Status: Searching...`;
            this.debugStatus.style.color = '#888888'; // Gray
            this.debugProgress.textContent = `Progress: 0%`;
            this.debugProgress.style.color = '#888888'; // Gray
        }
    }
    
    teleportToPage(portalIndex) {
        if (portalIndex >= this.portals.length) return;
        
        const portal = this.portals[portalIndex];
        const position = this.getPortalPosition(portal);
        
        // Define portal destinations by position
        const portalDestinations = {
            'top-left': 'about.html',
            'top-middle': 'apply.html', 
            'top-right': 'sponsors.html',
            'middle-left': 'team.html',
            'middle-right': 'contact.html',
            'bottom-left': 'https://lu.ma/7epaq2w3',
            'bottom-right': 'schedule.html'
        };
        
        const destination = portalDestinations[position];
        if (destination) {
            // Store portal information for return positioning
            const portalData = {
                x: portal.x,
                y: portal.y,
                position: position,
                portalIndex: portalIndex
            };
            localStorage.setItem('lastPortalUsed', JSON.stringify(portalData));
            
            // console.log(`🚪 Teleporting from ${position} portal to: ${destination}`);
            // console.log(`💾 Stored portal data for return:`, portalData);
            

            
            window.location.href = destination;
        } else {
            // console.log(`⚠️ No destination defined for ${position} portal`);
        }
    }
    
    getPortalPosition(portal) {
        // Divide map into 3x3 grid and determine portal position
        const leftThird = this.mapWidth * 0.33;
        const rightThird = this.mapWidth * 0.67;
        const topThird = this.mapHeight * 0.33;
        const bottomThird = this.mapHeight * 0.67;
        
        let horizontal, vertical;
        
        // Determine horizontal position
        if (portal.x < leftThird) {
            horizontal = 'left';
        } else if (portal.x > rightThird) {
            horizontal = 'right';
        } else {
            horizontal = 'middle';
        }
        
        // Determine vertical position
        if (portal.y < topThird) {
            vertical = 'top';
        } else if (portal.y > bottomThird) {
            vertical = 'bottom';
        } else {
            vertical = 'middle';
        }
        
        const position = `${vertical}-${horizontal}`;
        // console.log(`📍 Portal at (${portal.x.toFixed(0)}, ${portal.y.toFixed(0)}) classified as: ${position}`);
        
        return position;
    }
    
    isValidPosition(x, y) {
        // Check if a position is valid (not blocked by collision)
        if (!this.collisionMapLoaded || !this.collisionCtx) {
            return true; // If no collision map, assume valid
        }
        
        try {
                    // Check the same points as in movement collision detection
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const playerSize = isMobileDevice ? 5 : 8; // Smaller collision box on mobile for less restrictive detection
        const checkPoints = [
            { x: x, y: y },                           // Center
            { x: x - playerSize, y: y },              // Left
            { x: x + playerSize, y: y },              // Right
            { x: x, y: y - playerSize },              // Top
            { x: x, y: y + playerSize }               // Bottom
        ];
        
        for (let point of checkPoints) {
            // Convert game coordinates to collision map coordinates
            // Adjust Y coordinate for navbar offset before collision check (mobile only)
            const adjustedPointY = point.y - (isMobileDevice ? 60 : 0); // Subtract navbar offset only on mobile
            const collisionX = Math.floor(point.x * this.collisionScaleX);
            const collisionY = Math.floor(adjustedPointY * this.collisionScaleY);
            
            // Make sure we're within bounds
            if (collisionX < 0 || collisionX >= this.collisionCanvas.width ||
                collisionY < 0 || collisionY >= this.collisionCanvas.height) {
                continue;
            }
            
            // Get the pixel color at this position
            const imageData = this.collisionCtx.getImageData(collisionX, collisionY, 1, 1);
            const [r, g, b, a] = imageData.data;
            
            // Check if it's a white (blocked) area - less restrictive on mobile
            const whiteThreshold = isMobileDevice ? 250 : 245; // Higher threshold = less restrictive on mobile
            const isWhite = r > whiteThreshold && g > whiteThreshold && b > whiteThreshold;
            
            if (isWhite) {
                return false; // Position is blocked
            }
        }
            
            return true; // All check points are clear
        } catch (error) {
            // console.log(`⚠️ Error checking position validity: ${error.message}`);
            return true; // Assume valid if error
        }
    }
    
    findNearestValidPosition(targetX, targetY, portalX, portalY) {
        // If target position is already valid, use it
        if (this.isValidPosition(targetX, targetY)) {
            // console.log(`✅ Target position (${targetX.toFixed(0)}, ${targetY.toFixed(0)}) is valid`);
            return { x: targetX, y: targetY };
        }
        
        // console.log(`❌ Target position (${targetX.toFixed(0)}, ${targetY.toFixed(0)}) is blocked, searching for valid position...`);
        
        // Search in expanding circles around the target position
        const maxSearchRadius = 150; // Maximum search distance
        const searchStep = 20; // Step size for search grid
        
        for (let radius = searchStep; radius <= maxSearchRadius; radius += searchStep) {
            // Check positions in a circle around the target
            const numPoints = Math.max(8, Math.floor(radius / 10)); // More points for larger radius
            
            for (let i = 0; i < numPoints; i++) {
                const angle = (i / numPoints) * 2 * Math.PI;
                const testX = targetX + Math.cos(angle) * radius;
                const testY = targetY + Math.sin(angle) * radius;
                
                // Make sure within map bounds
                if (testX < 50 || testX > this.mapWidth - 50 || 
                    testY < 50 || testY > this.mapHeight - 50) {
                    continue;
                }
                
                if (this.isValidPosition(testX, testY)) {
                    // console.log(`✅ Found valid position at (${testX.toFixed(0)}, ${testY.toFixed(0)}) - distance: ${radius}px from target`);
                    return { x: testX, y: testY };
                }
            }
        }
        
        // If no valid position found near target, try near the portal itself
                    // console.log(`⚠️ No valid position found near target, trying portal area...`);
        
        for (let radius = 60; radius <= 120; radius += 20) {
            const numPoints = 8;
            for (let i = 0; i < numPoints; i++) {
                const angle = (i / numPoints) * 2 * Math.PI;
                const testX = portalX + Math.cos(angle) * radius;
                const testY = portalY + Math.sin(angle) * radius;
                
                // Make sure within map bounds
                if (testX < 50 || testX > this.mapWidth - 50 || 
                    testY < 50 || testY > this.mapHeight - 50) {
                    continue;
                }
                
                if (this.isValidPosition(testX, testY)) {
                    // console.log(`✅ Found valid position near portal at (${testX.toFixed(0)}, ${testY.toFixed(0)})`);
                    return { x: testX, y: testY };
                }
            }
        }
        
        // Last resort: use map center (should always be valid)
        // console.log(`🚨 Using map center as fallback position`);
        return { x: this.mapWidth / 2, y: this.mapHeight / 2 };
    }
    
    createBeautifulBackground() {
        // Create a canvas to draw the beautiful fantasy world
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = this.mapWidth;
        bgCanvas.height = this.mapHeight;
        const bgCtx = bgCanvas.getContext('2d');
        
        // Draw the beautiful background inspired by your image
        // Deep blue water background
        const gradient = bgCtx.createRadialGradient(
            this.mapWidth/2, this.mapHeight/2, 0,
            this.mapWidth/2, this.mapHeight/2, this.mapWidth/2
        );
        gradient.addColorStop(0, '#1e40af');
        gradient.addColorStop(1, '#1e3a8a');
        bgCtx.fillStyle = gradient;
        bgCtx.fillRect(0, 0, this.mapWidth, this.mapHeight);
        
        // Central island (main area)
        this.drawIsland(bgCtx, this.mapWidth/2, this.mapHeight/2, 400, 300, '#22c55e');
        
        // Crystal tower (top right)
        this.drawIsland(bgCtx, this.mapWidth*0.75, this.mapHeight*0.25, 200, 150, '#581c87');
        this.drawBuilding(bgCtx, this.mapWidth*0.75, this.mapHeight*0.25, '#a855f7', 'tower');
        
        // Volcanic island (bottom)
        this.drawIsland(bgCtx, this.mapWidth/2, this.mapHeight*0.8, 300, 150, '#7c2d12');
        this.drawLava(bgCtx, this.mapWidth/2, this.mapHeight*0.8, 150, 80);
        
        // Forest islands (left and right)
        this.drawIsland(bgCtx, this.mapWidth*0.2, this.mapHeight*0.4, 180, 200, '#22c55e');
        this.drawTrees(bgCtx, this.mapWidth*0.2, this.mapHeight*0.4, 150, 150);
        
        this.drawIsland(bgCtx, this.mapWidth*0.8, this.mapHeight*0.6, 180, 200, '#22c55e');
        this.drawBuilding(bgCtx, this.mapWidth*0.8, this.mapHeight*0.6, '#8b4513', 'house');
        
        // Wooden houses and portals
        this.drawBuilding(bgCtx, this.mapWidth/2 - 100, this.mapHeight/2, '#8b4513', 'house');
        this.drawBuilding(bgCtx, this.mapWidth/2 + 100, this.mapHeight/2, '#8b4513', 'house');
        
        // Magic portals
        this.drawPortal(bgCtx, this.mapWidth*0.3, this.mapHeight*0.3, '#10b981');
        this.drawPortal(bgCtx, this.mapWidth*0.7, this.mapHeight*0.7, '#f59e0b');
        
        // Central statue/crystal
        this.drawStatue(bgCtx, this.mapWidth/2, this.mapHeight/2 - 50);
        
        // Stone paths connecting areas
        this.drawPath(bgCtx, this.mapWidth/2, this.mapHeight/2, this.mapWidth*0.75, this.mapHeight*0.25);
        this.drawPath(bgCtx, this.mapWidth/2, this.mapHeight/2, this.mapWidth*0.2, this.mapHeight*0.4);
        this.drawPath(bgCtx, this.mapWidth/2, this.mapHeight/2, this.mapWidth*0.8, this.mapHeight*0.6);
        
        this.backgroundImage = bgCanvas;
    }
    
    drawIsland(ctx, x, y, width, height, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x, y, width/2, height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Add shore
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 8;
        ctx.stroke();
    }
    
    drawBuilding(ctx, x, y, color, type) {
        if (type === 'tower') {
            // Crystal tower
            ctx.fillStyle = color;
            ctx.fillRect(x - 30, y - 60, 60, 120);
            // Tower top
            ctx.beginPath();
            ctx.moveTo(x - 40, y - 60);
            ctx.lineTo(x, y - 100);
            ctx.lineTo(x + 40, y - 60);
            ctx.closePath();
            ctx.fill();
        } else if (type === 'house') {
            // Wooden house
            ctx.fillStyle = color;
            ctx.fillRect(x - 25, y - 25, 50, 50);
            // Roof
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.moveTo(x - 35, y - 25);
            ctx.lineTo(x, y - 50);
            ctx.lineTo(x + 35, y - 25);
            ctx.closePath();
            ctx.fill();
            // Door
            ctx.fillStyle = '#4b5563';
            ctx.fillRect(x - 8, y - 5, 16, 25);
        }
    }
    
    drawTrees(ctx, centerX, centerY, width, height) {
        for (let i = 0; i < 12; i++) {
            const x = centerX + (Math.random() - 0.5) * width;
            const y = centerY + (Math.random() - 0.5) * height;
            
            // Tree trunk
            ctx.fillStyle = '#92400e';
            ctx.fillRect(x - 4, y - 10, 8, 20);
            
            // Tree foliage
            ctx.fillStyle = '#166534';
            ctx.beginPath();
            ctx.arc(x, y - 10, 15, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawLava(ctx, centerX, centerY, width, height) {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, width/2, height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Lava bubbles
        ctx.fillStyle = '#fbbf24';
        for (let i = 0; i < 6; i++) {
            const x = centerX + (Math.random() - 0.5) * width * 0.8;
            const y = centerY + (Math.random() - 0.5) * height * 0.8;
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawPortal(ctx, x, y, color) {
        // Portal ring
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.stroke();
        
        // Portal energy
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawStatue(ctx, x, y) {
        // Statue base
        ctx.fillStyle = '#6b7280';
        ctx.beginPath();
        ctx.arc(x, y + 20, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Crystal
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(x - 8, y - 20, 16, 40);
        
        // Crystal glow
        ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawPath(ctx, x1, y1, x2, y2) {
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // Path edges
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 4;
        ctx.stroke();
    }
    
    setupEventListeners() {
        // console.log(`🎮 Setting up event listeners... DOM ready state: ${document.readyState}`);
        
        // Remove existing listeners first to prevent duplicates
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
        }
        if (this.keyupHandler) {
            document.removeEventListener('keyup', this.keyupHandler);
        }
        
        // Create bound handlers
        this.keydownHandler = (e) => {
            this.keys[e.code] = true;
            // Temporary debug log for first load issues - remove after testing
            if (!this.firstKeyPressed) {
                // console.log(`🎮 First key pressed: ${e.code} - movement should work now!`);
                this.firstKeyPressed = true;
            }
        };
        
        this.keyupHandler = (e) => {
            this.keys[e.code] = false;
        };
        
        // Keyboard controls
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
        // console.log(`✅ Keyboard event listeners attached`);
        
        // Mobile controls - check if elements exist first
        const dpadButtons = document.querySelectorAll('.dpad-btn');
        // console.log(`🔍 Found ${dpadButtons.length} mobile control buttons`);
        // console.log(`📱 User agent: ${navigator.userAgent}`);
        // console.log(`📱 Touch support: ${'ontouchstart' in window || navigator.maxTouchPoints > 0}`);
        // Force mobile controls to be visible for debugging
        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // console.log(`📱 Mobile device detected - forcing controls visibility`);
            mobileControls.style.display = 'flex';
            mobileControls.style.opacity = '1';
            mobileControls.style.visibility = 'visible';
            mobileControls.style.pointerEvents = 'auto';
        }
        
        dpadButtons.forEach(btn => {
            // console.log(`📱 Setting up button: ${btn.dataset.direction}`);
            // Touch events
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.touchDirection = btn.dataset.direction;
                btn.classList.add('pressed');
                // console.log(`📱 Touch start: ${btn.dataset.direction}`);
            }, { passive: false });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.touchDirection = null;
                btn.classList.remove('pressed');
                // console.log(`📱 Touch end: ${btn.dataset.direction}`);
            }, { passive: false });
            
            btn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.touchDirection = null;
                btn.classList.remove('pressed');
                // console.log(`📱 Touch cancel: ${btn.dataset.direction}`);
            }, { passive: false });
            
            // Mouse events for desktop testing
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.touchDirection = btn.dataset.direction;
                btn.classList.add('pressed');
            });
            
            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.touchDirection = null;
                btn.classList.remove('pressed');
            });
            
            btn.addEventListener('mouseleave', (e) => {
                this.touchDirection = null;
                btn.classList.remove('pressed');
            });
        });
        

        
        // Room modal close
        document.getElementById('close-room').addEventListener('click', () => {
            this.closeRoom();
        });
        
        // Close room on escape
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && !this.roomModal.classList.contains('hidden')) {
                this.closeRoom();
            }
        });
    }
    
    createMap() {
        // Enhanced map legend inspired by the beautiful image:
        // 0 = deep water, 1 = grass, 2 = stone path, 3 = forest/trees, 4 = volcanic rock, 5 = crystal area
        // 6 = sand/shore, 7 = lava, 8 = magical portal, 9 = building, 10 = bridge
        
        // Create a large, beautiful world inspired by the provided image
        this.map = this.generateEnhancedMap();
    }
    
    generateEnhancedMap() {
        const map = Array(this.mapHeight).fill().map(() => Array(this.mapWidth).fill(0));
        
        // Fill with deep water as base
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                map[y][x] = 0; // Deep water
            }
        }
        
        // Create main central island (inspired by your image's central area)
        this.createIsland(map, 15, 10, 20, 18, 1); // Main grass island
        
        // Create paths on main island
        this.createPath(map, 25, 15, 25, 25, 2); // Central vertical path
        this.createPath(map, 15, 20, 35, 20, 2); // Central horizontal path
        
        // Create forest areas
        this.createForestArea(map, 10, 5, 8, 8);
        this.createForestArea(map, 32, 6, 6, 7);
        this.createForestArea(map, 8, 25, 7, 6);
        
        // Create volcanic island (bottom area)
        this.createIsland(map, 18, 28, 14, 10, 4); // Volcanic rock
        this.createLavaArea(map, 20, 30, 10, 6);
        
        // Create crystal/magical island (top right)
        this.createIsland(map, 35, 5, 12, 10, 5); // Crystal area
        
        // Create smaller islands
        this.createIsland(map, 5, 15, 8, 8, 1); // West island
        this.createIsland(map, 40, 25, 8, 8, 1); // East island
        
        // Create bridges connecting islands
        this.createBridge(map, 13, 19, 15, 19);
        this.createBridge(map, 35, 19, 40, 19);
        this.createBridge(map, 24, 25, 26, 28);
        
        // Add shore areas around islands
        this.addShoreAreas(map);
        
        return map;
    }
    
    createIsland(map, startX, startY, width, height, tileType) {
        for (let y = startY; y < startY + height && y < this.mapHeight; y++) {
            for (let x = startX; x < startX + width && x < this.mapWidth; x++) {
                if (x >= 0 && y >= 0) {
                    // Create organic island shape
                    const centerX = startX + width / 2;
                    const centerY = startY + height / 2;
                    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                    const maxDistance = Math.min(width, height) / 2;
                    
                    if (distance <= maxDistance + Math.sin(x * 0.5) * 2 + Math.cos(y * 0.5) * 2) {
                        map[y][x] = tileType;
                    }
                }
            }
        }
    }
    
    createPath(map, startX, startY, endX, endY, tileType) {
        const dx = Math.abs(endX - startX);
        const dy = Math.abs(endY - startY);
        const x1 = startX < endX ? 1 : -1;
        const y1 = startY < endY ? 1 : -1;
        let x = startX;
        let y = startY;
        let err = dx - dy;
        
        while (true) {
            if (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
                map[y][x] = tileType;
                // Make path wider
                if (x + 1 < this.mapWidth) map[y][x + 1] = tileType;
                if (y + 1 < this.mapHeight) map[y + 1][x] = tileType;
            }
            
            if (x === endX && y === endY) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x += x1; }
            if (e2 < dx) { err += dx; y += y1; }
        }
    }
    
    createForestArea(map, startX, startY, width, height) {
        for (let y = startY; y < startY + height && y < this.mapHeight; y++) {
            for (let x = startX; x < startX + width && x < this.mapWidth; x++) {
                if (x >= 0 && y >= 0 && map[y][x] === 1) {
                    if (Math.random() > 0.3) {
                        map[y][x] = 3; // Forest
                    }
                }
            }
        }
    }
    
    createLavaArea(map, startX, startY, width, height) {
        for (let y = startY; y < startY + height && y < this.mapHeight; y++) {
            for (let x = startX; x < startX + width && x < this.mapWidth; x++) {
                if (x >= 0 && y >= 0 && map[y][x] === 4) {
                    if (Math.random() > 0.5) {
                        map[y][x] = 7; // Lava
                    }
                }
            }
        }
    }
    
    createBridge(map, startX, startY, endX, endY) {
        this.createPath(map, startX, startY, endX, endY, 10);
    }
    
    addShoreAreas(map) {
        for (let y = 1; y < this.mapHeight - 1; y++) {
            for (let x = 1; x < this.mapWidth - 1; x++) {
                if (map[y][x] === 0) { // If water
                    // Check if adjacent to land
                    const adjacent = [
                        map[y-1][x], map[y+1][x], map[y][x-1], map[y][x+1]
                    ];
                    if (adjacent.some(tile => tile > 0)) {
                        map[y][x] = 6; // Shore
                    }
                }
            }
        }
    }
    

    
    createRoomData() {
        this.rooms = {
            schedule: {
                title: '📅 Competition Schedule',
                content: `
<h3>Day 1 - Friday</h3>
<p><strong>9:00 AM</strong> - Registration & Welcome Coffee</p>
<p><strong>10:00 AM</strong> - Opening Ceremony</p>
<p><strong>11:00 AM</strong> - Pitch Workshop</p>
<p><strong>1:00 PM</strong> - Lunch & Networking</p>
<p><strong>2:30 PM</strong> - First Round Pitches</p>
<p><strong>5:00 PM</strong> - Feedback Sessions</p>

<h3>Day 2 - Saturday</h3>
<p><strong>9:00 AM</strong> - Breakfast & Mentoring</p>
<p><strong>10:30 AM</strong> - Semi-Final Pitches</p>
<p><strong>1:00 PM</strong> - Lunch Break</p>
<p><strong>2:30 PM</strong> - Final Pitches</p>
<p><strong>4:00 PM</strong> - Awards Ceremony</p>
<p><strong>5:00 PM</strong> - Celebration Party</p>
                `
            },
            registration: {
                title: '📝 Register Now',
                content: `
<h3>Ready to Join the Quest?</h3>
<p>Registration is now open for Startup Quest 2024!</p>

<div style="background: #1a1a2e; padding: 15px; margin: 15px 0; border: 2px solid #ffd700;">
<h4>🎯 What You Need:</h4>
<p>• A brilliant startup idea</p>
<p>• 3-minute pitch presentation</p>
<p>• Passion for innovation</p>
<p>• Registration fee: $50</p>
</div>

<h4>📧 Contact Information:</h4>
<p><strong>Email:</strong> register@startupquest.com</p>
<p><strong>Phone:</strong> (555) 123-4567</p>
<p><strong>Deadline:</strong> March 15, 2024</p>

<p><em>Early bird discount: $35 before March 1st!</em></p>
                `
            },
            sponsors: {
                title: '🤝 Our Amazing Sponsors',
                content: `
<h3>Thank You to Our Partners!</h3>

<div style="text-align: center; margin: 20px 0;">
<h4>🥇 Gold Sponsors</h4>
<p><strong>TechVentures Capital</strong></p>
<p><strong>Innovation Labs Inc.</strong></p>
<p><strong>Future Fund Ventures</strong></p>
</div>

<div style="text-align: center; margin: 20px 0;">
<h4>🥈 Silver Sponsors</h4>
<p><strong>Digital Dynamics</strong></p>
<p><strong>StartupHub Co.</strong></p>
<p><strong>Growth Partners LLC</strong></p>
</div>

<div style="text-align: center; margin: 20px 0;">
<h4>🥉 Bronze Sponsors</h4>
<p><strong>Local Business Network</strong></p>
<p><strong>Community Coffee Co.</strong></p>
<p><strong>Office Space Solutions</strong></p>
</div>

<p><em>Interested in sponsoring? Contact us at sponsors@startupquest.com</em></p>
                `
            },
            team: {
                title: '👥 Meet Our Team',
                content: `
<h3>The People Behind Startup Quest</h3>

<div style="margin: 15px 0;">
<h4>🎯 Sarah Johnson - Event Director</h4>
<p>Former startup founder with 10+ years in venture capital. Passionate about helping entrepreneurs succeed.</p>
</div>

<div style="margin: 15px 0;">
<h4>💻 Mike Chen - Tech Lead</h4>
<p>Full-stack developer and startup advisor. Loves building innovative solutions and mentoring new founders.</p>
</div>

<div style="margin: 15px 0;">
<h4>📊 Emma Rodriguez - Operations Manager</h4>
<p>Event planning expert with a background in business development. Ensures everything runs smoothly.</p>
</div>

<div style="margin: 15px 0;">
<h4>🎨 Alex Kim - Creative Director</h4>
<p>Designer and brand strategist who helps startups tell their story visually and compellingly.</p>
</div>

<p><em>Our team is here to support you throughout your startup journey!</em></p>
                `
            },
            contact: {
                title: '📞 Get in Touch',
                content: `
<h3>We'd Love to Hear From You!</h3>

<div style="background: #1a1a2e; padding: 15px; margin: 15px 0; border: 2px solid #ffd700;">
<h4>📧 Email Contacts:</h4>
<p><strong>General Inquiries:</strong> info@startupquest.com</p>
<p><strong>Registration:</strong> register@startupquest.com</p>
<p><strong>Sponsorship:</strong> sponsors@startupquest.com</p>
<p><strong>Press:</strong> media@startupquest.com</p>
</div>

<h4>📍 Location:</h4>
<p><strong>Innovation Center</strong></p>
<p>123 Entrepreneur Avenue</p>
<p>Tech City, TC 12345</p>

<h4>📱 Social Media:</h4>
<p><strong>Twitter:</strong> @StartupQuest</p>
<p><strong>LinkedIn:</strong> /company/startup-quest</p>
<p><strong>Instagram:</strong> @startupquest2024</p>

<p><em>Follow us for updates and behind-the-scenes content!</em></p>
                `
            },
            about: {
                title: '🌟 About Startup Quest',
                content: `
<h3>Your Journey to Success Starts Here</h3>

<p>Startup Quest is more than just a pitch competition - it's an adventure that transforms innovative ideas into thriving businesses.</p>

<div style="background: #1a1a2e; padding: 15px; margin: 15px 0; border: 2px solid #ffd700;">
<h4>🎯 Our Mission:</h4>
<p>To empower entrepreneurs by providing a platform to showcase their ideas, connect with investors, and join a community of innovators.</p>
</div>

<h4>🏆 Why Participate?</h4>
<p>• <strong>$50,000</strong> in total prize money</p>
<p>• Direct access to top-tier investors</p>
<p>• Mentorship from successful entrepreneurs</p>
<p>• Networking with like-minded innovators</p>
<p>• Media exposure for your startup</p>

<h4>📈 Past Success Stories:</h4>
<p>Over 200 startups have participated in our competitions, with 85% receiving follow-up investment interest and 60% securing seed funding within 6 months.</p>

<p><em>Ready to embark on your startup quest? Register today!</em></p>
                `
            }
        };
    }
    
// Removed complex asset loading - game now starts immediately
    
    startGame() {
        // Start the game immediately
        this.gameLoaded = true;
        
        // Ensure movement is enabled by resetting any blocking flags
        this.currentRoom = null;
        
        // Verify event listeners are working (debug for hard refresh issues)
        // console.log(`🔧 Event listeners check - Handler exists: ${!!this.keydownHandler}`);
        // console.log(`🔧 Test key press any key (WASD or arrows) to confirm movement works`);
        
        // Force re-setup as a safety measure for hard refresh scenarios
        this.setupEventListeners();
        
        this.gameLoop();
        
        // CRITICAL: Reset all game state to prevent crashes and bugs
        this.mapOpacity = 1.0;
        this.isTeleporting = false;
        this.portalTeleportTimer = 0;
        this.currentPortalIndex = -1;
        this.isAtPortalCenter = false;
        this.currentRoom = null; // ✅ CRUCIAL: Enables movement after "Go Back"
        
        // CRITICAL: Recalculate collision scaling to fix coordinate shift issues
        // console.log('🔧 Recalculating collision scaling in startGame...');
        this.recalculateCollisionScaling();
        
        // Reset portal states to prevent interaction bugs
        if (this.portals && this.portals.length > 0) {
            this.portals.forEach(portal => {
                portal.isActive = false;
                portal.rotation = 0;
                portal.rotationSpeed = 0;
            });
        }
        
        // Ensure portals are initialized if they weren't already and portal map is ready
        if (this.portals.length === 0 && this.portalMapLoaded && this.portalCtx) {
            // console.log(`⚠️ Portals not initialized but portal map is ready - initializing now...`);
            this.findPortalLocations();
        } else if (this.portals.length === 0) {
            // console.log(`⚠️ Portals not initialized and portal map not ready yet - will initialize when map loads`);
        }
        
        // Check if player is returning from a page via Go Back button
        const returnFromPage = localStorage.getItem('returnFromPage');
        const lastPortalUsed = localStorage.getItem('lastPortalUsed');
        
        if (returnFromPage && lastPortalUsed) {
            try {
                const portalData = JSON.parse(lastPortalUsed);
                let targetX, targetY;
                
                // Check if this is a mobile device
                const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                
                if (isMobileDevice) {
                    // Special positioning for MOBILE ONLY
                    if (portalData.position === 'top-right') {
                        // Position 35px to the bottom left of sponsors portal (mobile)
                        targetX = portalData.x - 35; // 35px to the left
                        targetY = portalData.y + 35; // 35px below
                        
                        // console.log(`🎯 Mobile sponsors portal positioning: (${targetX}, ${targetY})`);
                    } else if (portalData.position === 'middle-right') {
                        // Special positioning for contact portal (mobile)
                        // Position 25px to the left of contact portal
                        targetX = portalData.x - 25; // 25px to the left
                        targetY = portalData.y; // Same Y position as portal
                        
                        // console.log(`🎯 Mobile contact portal positioning: (${targetX}, ${targetY})`);
                    } else if (portalData.position === 'bottom-right') {
                        // Special positioning for schedule portal (mobile)
                        // Position 25px to the left of schedule portal
                        targetX = portalData.x - 25; // 25px to the left
                        targetY = portalData.y; // Same Y position as portal
                        
                        // console.log(`🎯 Mobile schedule portal positioning: (${targetX}, ${targetY})`);
                    } else if (portalData.position === 'top-middle') {
                        // Special positioning for apply portal (mobile)
                        // Position 25px below the apply portal
                        targetX = portalData.x; // Same X position as portal
                        targetY = portalData.y + 25; // 25px below
                        
                        // console.log(`🎯 Mobile apply portal positioning: (${targetX}, ${targetY})`);
                    } else {
                        // Default positioning for mobile
                        const offsetDistance = 100; // Distance from portal center
                        
                        // Calculate initial offset position (slightly below and to the right of portal)
                        targetX = portalData.x + offsetDistance;
                        targetY = portalData.y + offsetDistance;
                    }
                } else {
                    // Desktop positioning - custom positioning per portal with 75px offsets
                    if (portalData.position === 'top-right') {
                        // Position 75px to the bottom left of sponsors portal (desktop)
                        targetX = portalData.x - 75; // 75px to the left
                        targetY = portalData.y + 75; // 75px below
                        
                        // console.log(`🎯 Desktop sponsors portal positioning: (${targetX}, ${targetY})`);
                    } else if (portalData.position === 'middle-right') {
                        // Special positioning for contact portal (desktop)
                        // Position 75px to the left of contact portal
                        targetX = portalData.x - 75; // 75px to the left
                        targetY = portalData.y; // Same Y position as portal
                        
                        // console.log(`🎯 Desktop contact portal positioning: (${targetX}, ${targetY})`);
                    } else if (portalData.position === 'bottom-right') {
                        // Special positioning for schedule portal (desktop)
                        // Position 75px to the left of schedule portal
                        targetX = portalData.x - 75; // 75px to the left
                        targetY = portalData.y; // Same Y position as portal
                        
                        // console.log(`🎯 Desktop schedule portal positioning: (${targetX}, ${targetY})`);
                    } else if (portalData.position === 'top-middle') {
                        // Special positioning for apply portal (desktop)
                        // Position 75px below the apply portal
                        targetX = portalData.x; // Same X position as portal
                        targetY = portalData.y + 75; // 75px below
                        
                        // console.log(`🎯 Desktop apply portal positioning: (${targetX}, ${targetY})`);
                    } else {
                        // Default positioning for desktop (other portals)
                        const offsetDistance = 100; // Distance from portal center
                        
                        // Calculate initial offset position (slightly below and to the right of portal)
                        targetX = portalData.x + offsetDistance;
                        targetY = portalData.y + offsetDistance;
                    }
                }
                
                // Make sure player doesn't go outside map bounds
                targetX = Math.max(50, Math.min(this.mapWidth - 50, targetX));
                targetY = Math.max(50, Math.min(this.mapHeight - 50, targetY));
                
                // Find a valid (non-collision) position near the target
                const validPosition = this.findNearestValidPosition(targetX, targetY, portalData.x, portalData.y);
                this.player.x = validPosition.x;
                this.player.y = validPosition.y;
                
                // console.log(`🔄 Player returning from ${returnFromPage} - positioned near ${portalData.position} portal at (${this.player.x.toFixed(0)}, ${this.player.y.toFixed(0)})`);
                
                // Clear the return flag so normal center positioning works for fresh visits
                localStorage.removeItem('returnFromPage');
            } catch (error) {
                // console.log(`⚠️ Error parsing portal data, using center position:`, error);
                this.player.x = this.mapWidth / 2;
                this.player.y = this.mapHeight / 2;
            }
        } else {
            // Fresh start - position at center of map
            this.player.x = this.mapWidth / 2;
            this.player.y = this.mapHeight / 2;
            // console.log(`🎮 Fresh game start - player positioned at center (${this.player.x.toFixed(0)}, ${this.player.y.toFixed(0)})`);
        }
        
        this.player.isMoving = false;
        
        // Update camera to center on the reset player position
        this.updateCamera();
        

        
        // Initialize character sprites properly
        this.characterSpriteStatic.classList.remove('hidden');
        this.characterSpriteElement.classList.add('hidden');
        this.characterSpriteStatic.style.display = 'block';
        this.characterSpriteElement.style.display = 'none';
        
        // Explicitly reset character sprite opacity styles and force immediate render
        this.characterSpriteStatic.style.opacity = '1';
        this.characterSpriteElement.style.opacity = '1';
        
        // Force a render to apply the opacity reset immediately
        this.render();
        
        // Show title overlay on the map after game loads
        this.mapTitleOverlay.classList.remove('hidden');
        
        // Force an immediate update of character sprite positioning with correct opacity
        if (this.characterSpriteStatic && this.characterSpriteElement) {
            this.updateCharacterSprite();
        }
        
        // console.log(`🔄 Game state reset - Opacity: ${this.mapOpacity}, Teleporting: ${this.isTeleporting}`);
        // console.log(`🎯 Player position reset to center: (${this.player.x}, ${this.player.y})`);
        // console.log(`🐉 Character sprites initialized - Static visible, Animated hidden`);
        // console.log(`🎮 Game started immediately - Fresh start every time!`);
    }
    
    resetOpacityAfterReturn() {
        // Only reset opacity - don't interfere with navigation
        // console.log('🔄 Resetting opacity after back button return');
        
        // Force reset all visual opacity when user returns to page
        this.mapOpacity = 1.0;
        this.isTeleporting = false;
        this.portalTeleportTimer = 0;
        this.currentPortalIndex = -1;
        
        // CRITICAL: Recalculate collision scaling to fix coordinate misalignment
        // console.log('🔧 Recalculating collision scaling after page return...');
        this.recalculateCollisionScaling();
        
        // Reset character sprite opacities immediately
        if (this.characterSpriteStatic) {
            this.characterSpriteStatic.style.opacity = '1';
        }
        if (this.characterSpriteElement) {
            this.characterSpriteElement.style.opacity = '1';
        }
        
        // Force render to apply changes immediately
        if (this.gameLoaded && this.canvas && this.ctx) {
            this.render();
        }
    }
    
    gameLoop() {
        this.update();
        this.render();
        if (this.gameLoaded) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    
    update() {
        if (this.currentRoom) return; // Don't update movement when in room
        
        this.handleInput();
        this.updatePlayer();
        this.updateCamera();
        this.updatePortalRotations();
        
        // Check for portal interaction and teleportation
        // Debug logging commented out for coordinate collection
        this.checkPortalInteraction();
    }
    
    handleInput() {
        const wasMoving = this.player.isMoving;
        let moveX = 0, moveY = 0;
        let hasInput = false;
        
        // Keyboard input
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            moveY = -1;
            this.player.direction = 'up';
            hasInput = true;
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            moveY = 1;
            this.player.direction = 'down';
            hasInput = true;
        }
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            moveX = -1;
            this.player.direction = 'left';
            hasInput = true;
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            moveX = 1;
            this.player.direction = 'right';
            hasInput = true;
        }
        
        // Touch input
        if (this.touchDirection) {
            switch (this.touchDirection) {
                case 'up':
                    moveY = -1;
                    this.player.direction = 'up';
                    hasInput = true;
                    break;
                case 'down':
                    moveY = 1;
                    this.player.direction = 'down';
                    hasInput = true;
                    break;
                case 'left':
                    moveX = -1;
                    this.player.direction = 'left';
                    hasInput = true;
                    break;
                case 'right':
                    moveX = 1;
                    this.player.direction = 'right';
                    hasInput = true;
                    break;
            }
        }
        
        // Set moving state based on input and successful movement
        this.player.isMoving = false;
        
        // Apply movement with collision detection
        if (hasInput && (moveX !== 0 || moveY !== 0)) {
            const newX = this.player.x + moveX * this.player.speed;
            const newY = this.player.y + moveY * this.player.speed;
            
            if (this.canMoveTo(newX, newY)) {
                this.player.x = newX;
                this.player.y = newY;
                this.player.isMoving = true; // Only set to true if actually moved
                
                // Debug movement on mobile (reduce frequency)
                if (this.touchDirection && Math.random() < 0.1) {
                    // console.log(`📱 Player moved: (${this.player.x.toFixed(0)}, ${this.player.y.toFixed(0)}) via ${this.touchDirection}`);
                }
                
                // Fade out title on first movement
                if (!this.titleFaded) {
                    this.mapTitleOverlay.style.opacity = '0';
                    this.titleFaded = true;
                }
            } else if (this.touchDirection) {
                // Debug blocked movement on mobile
                // console.log(`📱 Movement blocked at: (${newX.toFixed(0)}, ${newY.toFixed(0)}) via ${this.touchDirection}`);
            }
        }
        
        // Reset animation if stopped moving
        if (wasMoving && !this.player.isMoving) {
            this.player.animFrame = 0;
        }
    }
    
    canMoveTo(x, y) {
        // Check basic bounds to keep character on the image
        if (x < 20 || x >= this.mapWidth - 20 || y < 20 || y >= this.mapHeight - 20) {
            return false;
        }
        
        // Check collision map if loaded
        if (this.collisionMapLoaded && this.collisionCtx) {
            try {
                // Check if this is a mobile device for less restrictive collision
                const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                
                // Make collision less restrictive on mobile
                const playerSize = isMobileDevice ? 5 : 8; // Smaller collision box on mobile
                const checkPoints = [
                    { x: x, y: y },                           // Center
                    { x: x - playerSize, y: y },              // Left
                    { x: x + playerSize, y: y },              // Right
                    { x: x, y: y - playerSize },              // Top
                    { x: x, y: y + playerSize }               // Bottom
                ];
                
                let hasCollision = false;
                
                for (let point of checkPoints) {
                    // Convert game coordinates to collision map coordinates
                    // Adjust Y coordinate for navbar offset before collision check (mobile only)
                    const adjustedPointY = point.y - (isMobileDevice ? 60 : 0); // Subtract navbar offset only on mobile
                    const collisionX = Math.floor(point.x * this.collisionScaleX);
                    const collisionY = Math.floor(adjustedPointY * this.collisionScaleY);
                    
                    // Make sure we're within bounds
                    if (collisionX < 0 || collisionX >= this.collisionCanvas.width || 
                        collisionY < 0 || collisionY >= this.collisionCanvas.height) {
                        continue;
                    }
                    
                    // Get the pixel color at this position
                    const imageData = this.collisionCtx.getImageData(collisionX, collisionY, 1, 1);
                    const [r, g, b, a] = imageData.data;
                    
                    // Check if it's a white (blocked) area - less restrictive threshold on mobile
                    const whiteThreshold = isMobileDevice ? 250 : 245; // Higher threshold = less restrictive on mobile
                    const isWhite = r > whiteThreshold && g > whiteThreshold && b > whiteThreshold;
                    
                    if (isWhite) {
                        hasCollision = true;
                        break; // Exit early if collision found
                    }
                }
                
                return !hasCollision;
                
            } catch (error) {
                // console.log(`⚠️ Collision detection error: ${error.message}`);
                return true; // Allow movement if collision detection fails
            }
        }
        
        // If no collision map loaded, allow movement
        return true;
    }
    
    rectIntersects(rect1, rect2) {
        // Check if two rectangles intersect
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    isOnPath(x, y, x1, y1, x2, y2, width) {
        // Check if point (x,y) is on the path between (x1,y1) and (x2,y2)
        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) param = dot / lenSq;
        
        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = x - xx;
        const dy = y - yy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance <= width;
    }
    
    updatePlayer() {
        if (this.player.isMoving) {
            this.player.animTimer++;
            if (this.player.animTimer >= 10) {
                this.player.animFrame = (this.player.animFrame + 1) % 4;
                this.player.animTimer = 0;
            }
        }
    }
    
    updateCamera() {
        // Smooth camera following
        const targetX = this.player.x * this.scale - this.canvas.width / 2;
        const targetY = this.player.y * this.scale - this.canvas.height / 2;
        
        // Smooth camera movement
        this.camera.x += (targetX - this.camera.x) * 0.08;
        this.camera.y += (targetY - this.camera.y) * 0.08;
        
        // Clamp camera to scaled map bounds
        const maxX = this.mapWidth * this.scale - this.canvas.width;
        const maxY = this.mapHeight * this.scale - this.canvas.height;
        this.camera.x = Math.max(0, Math.min(this.camera.x, maxX));
        this.camera.y = Math.max(0, Math.min(this.camera.y, maxY));
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update scale if canvas size changed
        this.updateScale();
        
        // Draw background image
        if (this.imageLoaded) {
            this.renderBackground();
            this.renderPortals();
    
        }
        
        // Update animated character position
        if (!this.currentRoom) {
            this.updateCharacterSprite();
        }
        
        // Draw interaction hint
        this.renderInteractionHint();
    }
    
    renderBackground() {
        // Apply fade effect during teleportation
        this.ctx.save();
        this.ctx.globalAlpha = this.mapOpacity;
        
        // Draw the scaled background image
        this.ctx.drawImage(
            this.backgroundImage,
            -this.camera.x,
            -this.camera.y,
            this.mapWidth * this.scale,
            this.mapHeight * this.scale
        );
        
        this.ctx.restore();
    }
    
    renderPortals() {
        if (!this.portalImageLoaded || this.portals.length === 0) {
            if (this.portals.length === 0) {
                console.log("⚠️ No portals to render - portals array is empty");
            }
            return;
        }
        
        // Apply fade effect during teleportation
        this.ctx.save();
        this.ctx.globalAlpha = this.mapOpacity;
        
        let visiblePortals = 0;
        this.portals.forEach((portal, index) => {
            // Calculate screen position with camera offset
            const drawX = portal.x * this.scale - this.camera.x;
            const drawY = portal.y * this.scale - this.camera.y;
            
            // Reduced debug logging for performance
            if (Math.random() < 0.001) { // Log very occasionally
                console.log(`🌀 Portal ${index} render: (${portal.x}, ${portal.y}) -> (${drawX.toFixed(1)}, ${drawY.toFixed(1)})`);
            }
            
            // Only draw if visible on screen
            if (drawX > -portal.width && drawX < this.canvas.width + portal.width && 
                drawY > -portal.height && drawY < this.canvas.height + portal.height) {
                
                visiblePortals++;
                
                // Draw the portal image at fixed 120px size with rotation
                const portalSize = 120;
                const centerX = drawX;
                const centerY = drawY;
                const scaledSize = portalSize * this.scale;
                
                // Save canvas state
                this.ctx.save();
                
                // Move to portal center and rotate
                this.ctx.translate(centerX, centerY);
                this.ctx.rotate(portal.rotation);
                
                // Draw the portal centered at origin (0,0) after translation
                this.ctx.drawImage(
                    this.portalImage,
                    -scaledSize / 2,
                    -scaledSize / 2,
                    scaledSize,
                    scaledSize
                );
                
                // Restore canvas state
                this.ctx.restore();
            }
        });
        
        // Performance: Only log portal count occasionally
        if (Math.random() < 0.001) {
            console.log(`📊 Rendering ${visiblePortals}/${this.portals.length} portals visible on screen`);
        }
        this.ctx.restore();
    }
    

    
    updateCharacterSprite() {
        // Calculate character position on screen
        const drawX = this.player.x * this.scale - this.camera.x;
        const drawY = this.player.y * this.scale - this.camera.y;
        
        // Fixed size: 100px
        const spriteWidth = 100;
        const spriteHeight = 100;
        
        // Center the sprite on the player position
        const centeredX = drawX - spriteWidth/2 + (this.player.width * this.scale)/2;
        const centeredY = drawY - spriteHeight/2 + (this.player.height * this.scale)/2;
        
        // Debug logging (occasionally)
        if (Math.random() < 0.01) {
            console.log(`🐉 Sprite position: (${centeredX.toFixed(1)}, ${centeredY.toFixed(1)}) Moving: ${this.player.isMoving}`);
        }
        
        // Show animated GIF when moving, static when not moving
        if (this.player.isMoving) {
            // Show animated sprite
            this.characterSpriteElement.classList.remove('hidden');
            this.characterSpriteStatic.classList.add('hidden');
            this.characterSpriteElement.style.display = 'block';
            this.characterSpriteStatic.style.display = 'none';
        
            // Position animated sprite
            this.characterSpriteElement.style.left = `${centeredX}px`;
            this.characterSpriteElement.style.top = `${centeredY}px`;
            this.characterSpriteElement.style.width = `${spriteWidth}px`;
            this.characterSpriteElement.style.height = `${spriteHeight}px`;
            this.characterSpriteElement.style.opacity = this.mapOpacity;
            this.characterSpriteElement.style.zIndex = '50';
        } else {
            // Show static sprite
            this.characterSpriteElement.classList.add('hidden');
            this.characterSpriteStatic.classList.remove('hidden');
            this.characterSpriteElement.style.display = 'none';
            this.characterSpriteStatic.style.display = 'block';
        
            // Position static sprite
            this.characterSpriteStatic.style.left = `${centeredX}px`;
            this.characterSpriteStatic.style.top = `${centeredY}px`;
            this.characterSpriteStatic.style.width = `${spriteWidth}px`;
            this.characterSpriteStatic.style.height = `${spriteHeight}px`;
            this.characterSpriteStatic.style.opacity = this.mapOpacity;
            this.characterSpriteStatic.style.zIndex = '50';
        }
    }
    
    renderInteractionHint() {

    }
    

    
    enterRoom(roomName) {
        if (this.rooms[roomName]) {
            this.currentRoom = roomName;
            this.showRoom(this.rooms[roomName]);
        }
    }
    
    showRoom(room) {
        document.getElementById('room-title').innerHTML = room.title;
        document.getElementById('room-body').innerHTML = room.content;
        this.roomModal.classList.remove('hidden');
        
        // Show player in bottom left
        const playerInRoom = document.getElementById('player-in-room');
        playerInRoom.style.display = 'block';
    }
    
    showInfo(title, content) {
        document.getElementById('room-title').innerHTML = title;
        document.getElementById('room-body').innerHTML = `<p>${content}</p>`;
        this.roomModal.classList.remove('hidden');
        
        // Hide player in room for info displays
        document.getElementById('player-in-room').style.display = 'none';
    }
    
    closeRoom() {
        this.roomModal.classList.add('hidden');
        this.currentRoom = null;
        
        // Hide player in room
        document.getElementById('player-in-room').style.display = 'none';
    }
}

// Start the game when page is fully loaded (including all resources)
window.addEventListener('load', () => {
    console.log(`🚀 Window loaded - DOM state: ${document.readyState}`);
    
    // Small delay to ensure everything is completely ready
    setTimeout(() => {
        console.log(`🎮 Creating StartupQuest instance...`);
        new StartupQuest();
    }, 100);
}); 