// rom_list_generator.js
// ROM List Generator with clean pink UI
// Generates .gba files from ROM directories

// Configuration
var BASE_DIR = '/mnt/sda1';
var CORES_DIR = BASE_DIR + '/cores';
var ROMS_DIR = BASE_DIR + '/ROMS';

// Pink Color Palette (0xAARRGGBB format) - High contrast for readability
var COLORS = {
    // Background colors
    bg_main: 0xFFFFB6C1,        // Light pink background
    bg_darker: 0xFFFF91A4,      // Slightly darker pink
    bg_lightest: 0xFFFFC0CB,    // Very light pink
    
    // Text colors - High contrast for readability
    text_title: 0xFF000080,     // Navy blue for titles
    text_main: 0xFF000000,      // Black for main text
    text_success: 0xFF006400,   // Dark green for success
    text_warning: 0xFFCC0000,   // Dark red for warnings
    text_info: 0xFF000080,      // Navy blue for info
    text_white: 0xFFFFFFFF,     // Pure white
    text_file: 0xFF4B0082,      // Indigo for file names
    
    // UI elements
    border: 0xFF8B008B,         // Dark magenta for borders
    highlight: 0xFFFFE4E1,      // Misty rose for highlights
    shadow: 0xFFDDA0DD          // Plum for shadows
};

// State
var generatedFiles = [];
var processedCores = 0;
var totalCores = 0;
var currentCore = '';
var currentFile = '';
var isGenerating = false;
var animFrame = 0;
var statusMessage = '';
var completionTime = 0;
var coreNames = [];
var currentCoreIndex = 0;

function log(msg) {
    console.log('[ROM Gen] ' + msg);
    statusMessage = msg;
}

function getBaseName(filename) {
    var lastDot = filename.lastIndexOf('.');
    if (lastDot > 0) {
        return filename.substring(0, lastDot);
    }
    return filename;
}

function drawStars(frame) {
    // Simple animated stars using basic characters
    var stars = [
        {x: 30, y: 30}, {x: 280, y: 50}, {x: 50, y: 200},
        {x: 270, y: 180}, {x: 150, y: 40}, {x: 200, y: 220}
    ];
    
    for (var i = 0; i < stars.length; i++) {
        var star = stars[i];
        var twinkle = (frame + i * 10) % 60;
        var brightness = twinkle < 30 ? twinkle : 60 - twinkle;
        var alpha = Math.floor(brightness * 255 / 30);
        var color = (alpha << 24) | 0xFFFFFF;
        
        if (brightness > 15) {
            ScreenDraw.text5x8(star.x, star.y, '*', color);
        }
    }
}

function drawBorder() {
    // Simple border using basic characters
    for (var x = 0; x < 320; x += 10) {
        ScreenDraw.text5x8(x, 5, '~', COLORS.border);
        ScreenDraw.text5x8(x, 235, '~', COLORS.border);
    }
    
    for (var y = 10; y < 240; y += 10) {
        ScreenDraw.text5x8(5, y, '|', COLORS.border);
        ScreenDraw.text5x8(315, y, '|', COLORS.border);
    }
    
    // Corner decorations
    ScreenDraw.text5x8(5, 5, '+', COLORS.border);
    ScreenDraw.text5x8(315, 5, '+', COLORS.border);
    ScreenDraw.text5x8(5, 235, '+', COLORS.border);
    ScreenDraw.text5x8(315, 235, '+', COLORS.border);
}

function drawProgressBar(x, y, width, progress) {
    // Simple progress bar
    var filled = Math.floor(width * progress);
    
    // Background
    for (var i = 0; i < width; i += 5) {
        ScreenDraw.text5x8(x + i, y, '-', COLORS.bg_darker);
    }
    
    // Filled portion
    for (var i = 0; i < filled; i += 5) {
        ScreenDraw.text5x8(x + i, y, '=', COLORS.text_success);
    }
    
    // Progress indicator
    if (filled < width) {
        ScreenDraw.text5x8(x + filled, y, '>', COLORS.text_title);
    }
}

function processCore(coreName) {
    var romDir = ROMS_DIR + '/' + coreName;
    currentCore = coreName;
    
    log('Processing ' + coreName + '...');
    
    if (!FS.isDir(romDir)) {
        log('No ROMs for ' + coreName);
        return 0;
    }
    
    var romFiles = FS.listFiles(romDir);
    if (!romFiles || romFiles.length === 0) {
        log('Empty ROM dir: ' + coreName);
        return 0;
    }
    
    var generated = 0;
    
    for (var i = 0; i < romFiles.length; i++) {
        var romFile = romFiles[i];
        
        if (romFile.charAt(0) === '.') continue;
        
        var romBaseName = getBaseName(romFile);
        var gbaFileName = coreName + ';' + romBaseName + '.gba';
        var gbaPath = ROMS_DIR + '/' + gbaFileName;
        
        console.log(gbaFileName);
        
        if (FS.touchFile(gbaPath)) {
            generatedFiles.push(gbaFileName);
            currentFile = gbaFileName;
            log('Created: ' + gbaFileName);
            generated++;
        } else {
            log('Failed to create: ' + gbaFileName);
        }
    }
    
    log('Created ' + generated + ' files for ' + coreName);
    return generated;
}

function startGeneration() {
    if (isGenerating) return;
    
    log('Starting ROM generation...');
    
    if (!FS.isDir(CORES_DIR)) {
        log('ERROR: No cores directory!');
        return;
    }
    
    coreNames = FS.listDirs(CORES_DIR);
    if (!coreNames || coreNames.length === 0) {
        log('ERROR: No cores found!');
        return;
    }
    
    isGenerating = true;
    totalCores = coreNames.length;
    processedCores = 0;
    currentCoreIndex = 0;
    generatedFiles = [];
    currentCore = '';
    currentFile = '';
}

function processNextCore() {
    if (!isGenerating || currentCoreIndex >= coreNames.length) {
        // Generation complete
        if (isGenerating) {
            log('*** GENERATION COMPLETE! ***');
            log('Created ' + generatedFiles.length + ' ROM files total!');
            log('All .gba files are ready to use!');
            isGenerating = false;
            currentCore = '';
            currentFile = '';
        }
        return;
    }
    
    var coreName = coreNames[currentCoreIndex];
    processCore(coreName);
    processedCores++;
    currentCoreIndex++;
}

function draw() {
    // Clean pink background
    ScreenDraw.clear(COLORS.bg_main);
    
    // Animated twinkling stars
    drawStars(animFrame);
    
    // Border
    drawBorder();
    
    // Title
    var titleY = 20;
    ScreenDraw.text8x8(80, titleY, 'ROM List Generator', COLORS.text_title);
    ScreenDraw.text5x8(50, titleY + 12, 'Creates .gba stub files from roms/* folders', COLORS.text_info);
    ScreenDraw.text5x8(40, titleY + 22, 'WARNING: This process can take a long time', COLORS.text_warning);
    
    var y = 65;
    
    if (totalCores > 0) {
        // Progress section
        ScreenDraw.text5x8(20, y, 'Progress:', COLORS.text_main);
        y += 10;
        
        var progress = totalCores > 0 ? processedCores / totalCores : 0;
        drawProgressBar(20, y, 280, progress);
        y += 15;
        
        var progressText = processedCores + '/' + totalCores + ' cores';
        if (isGenerating && currentCore) {
            progressText += ' (Processing: ' + currentCore + ')';
        }
        ScreenDraw.text5x8(20, y, progressText, COLORS.text_info);
        y += 10;
        
        // Show current file being created
        if (isGenerating && currentFile) {
            ScreenDraw.text5x8(20, y, 'Creating: ' + currentFile, COLORS.text_file);
            y += 10;
        }
        y += 5;
    }
    
    // Generated files count
    ScreenDraw.text5x8(20, y, 'Generated files: ' + generatedFiles.length, COLORS.text_success);
    y += 15;
    
    // Status message
    if (statusMessage) {
        var msgColor = statusMessage.indexOf('ERROR') >= 0 ? COLORS.text_warning : COLORS.text_main;
        ScreenDraw.text5x8(20, y, statusMessage, msgColor);
        y += 10;
    }
    
    // Recent files list
    if (generatedFiles.length > 0) {
        y += 10;
        ScreenDraw.text5x8(20, y, 'Recent files:', COLORS.text_title);
        y += 10;
        
        var startIdx = Math.max(0, generatedFiles.length - 12);
        for (var i = startIdx; i < generatedFiles.length && y < 210; i++) {
            var fileName = generatedFiles[i];
            if (fileName.length > 45) {
                fileName = fileName.substring(0, 42) + '...';
            }
            ScreenDraw.text5x8(25, y, '- ' + fileName, COLORS.text_file);
            y += 9;
        }
        
        if (generatedFiles.length > 12) {
            ScreenDraw.text5x8(25, y, '... and ' + (generatedFiles.length - 12) + ' more!', COLORS.text_info);
        }
    }
    
    // Controls at bottom
    var controlsY = 225;
    if (isGenerating) {
        ScreenDraw.text5x8(20, controlsY, 'Working... Please wait!', COLORS.text_warning);
    } else if (generatedFiles.length > 0 && statusMessage.indexOf('COMPLETE') >= 0) {
        ScreenDraw.text5x8(20, controlsY, '*** DONE! *** A: Generate Again', COLORS.text_success);
    } else {
        ScreenDraw.text5x8(20, controlsY, 'A: Start Generation', COLORS.text_white);
    }
    
    // Footer credit
    ScreenDraw.text5x8(200, 230, 'Scripted by Prosty', COLORS.text_info);
    
    animFrame++;
    if (animFrame > 120) animFrame = 0;
}

function handleInput() {
    var input = getInputState();
    
    if (handleInput.debounce > 0) {
        handleInput.debounce--;
        return;
    }
    
    if (input & (1 << 8)) { // A button
        if (!isGenerating) {
            startGeneration();
            handleInput.debounce = 30;
        }
    }
}
handleInput.debounce = 0;

// Initialize
log('ROM List Generator ready!');
log('Press A to start generation!');

setMainLoop(function() {
    handleInput();
    
    // Process one core per frame to show progress
    if (isGenerating) {
        processNextCore();
    }
    
    draw();
});