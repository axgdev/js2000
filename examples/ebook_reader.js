/**
 * GB300 Ebook Reader by SjslTech
 *
 * Place your Txt Files in the "EBOOKS" folder on the root of the SD Card (Create it if it doesn't already exist)
 *
 * Supports Subdirectories
 *
 * Not all special characters are supported, and will show up as a "?"
 * Currently a Limit of 256 Files Per Directory
 *
 */

// --- Constants ---
var ROOT_EBOOKS_DIR = "/mnt/sda1/EBOOKS"; // The absolute root for ebooks

// Screen dimensions
var SCREEN_W = 320;
var SCREEN_H = 240;

// Colors (0xAARRGGBB format)
var COLOR_BLACK = 0xFF000000;
var COLOR_WHITE = 0xFFFFFFFF;
var COLOR_GRAY = 0xFFCCCCCC;
var COLOR_HIGHLIGHT = 0xFFFFFF00; // Yellow for selected item
var COLOR_DIRECTORY = 0xFF00FF00; // Green for directory names
var COLOR_ERROR = 0xFFFF0000;
// Red for error messages

// Font dimensions for drawText8x8
var FONT_WIDTH = 8;
var FONT_HEIGHT = 8;
var LINE_SPACING = 2;
// Additional spacing between lines for readability
var TOTAL_LINE_HEIGHT = FONT_HEIGHT + LINE_SPACING;

// Screen layout padding
var PADDING_X = 8;
var PADDING_Y = 8;
var HEADER_H = 10; // title space
var FOOTER_H = 10;
// For messages/instructions and general button prompts

// Calculate visible lines based on actual screen dimensions
// This is the number of text lines that can fit in the content area
var VISIBLE_LINES_CONTENT = Math.floor((SCREEN_H - HEADER_H - FOOTER_H - 2 * PADDING_Y) / TOTAL_LINE_HEIGHT);
if (VISIBLE_LINES_CONTENT < 1) VISIBLE_LINES_CONTENT = 1; // Ensure at least one line can always be displayed

// Gamepad button mappings
// D-pad: Up=4, Down=5, Left=6, Right=7
// Buttons: A=8, B=0, L=10, R=11
var BUTTON_UP = 1 << 4;
var BUTTON_DOWN = 1 << 5;
var BUTTON_LEFT = 1 << 6;
var BUTTON_RIGHT = 1 << 7;
var BUTTON_SELECT = 1 << 8; // 'A' button
var BUTTON_BACK = 1 << 0;
// 'B' button
var BUTTON_L = 1 << 10;
var BUTTON_R = 1 << 11;

// Scrolling constants
var PAGE_SCROLL_LINES = VISIBLE_LINES_CONTENT;
// Scroll by one screen height
var LARGE_SCROLL_FACTOR = 10; // Number of pages for L/R button scroll

// --- Global State Variables ---
var currentState = 'SPLASH'; // Initial state is SPLASH

var currentDirectory = ROOT_EBOOKS_DIR; // Track current browsed directory
var fileList = [];
// Array of ebook filenames and directory names (e.g., ["book1.txt", "[DIR] Folder/"])
var selectedFileIndex = 0;
// Index of the currently highlighted item in the list

var fileContent = "";
// Raw content of the currently loaded ebook
var contentLines = [];
// fileContent split into an array of lines, word-wrapped if necessary
var scrollOffset = 0;
// Current top line visible in READING mode or list

var message = '';
// General message display for errors/info

// Input debounce to prevent rapid actions when buttons are held
var inputDebounce = 0;
var DEBOUNCE_FRAMES = 6; // Frames to wait before processing same button again

// New: Store the input state from the previous frame for single-press detection
var lastInputState = 0;
// --- Helper Functions ---

/**
 * Normalizes a path: trims whitespace, replaces multiple slashes with single,
 * and ensures it starts with a leading slash.
 * Does NOT enforce trailing slashes; that's up to the caller based on context (file vs dir).
 * @param {string} path
 * @returns {string} Normalized path.
 */
function normalizePath(path) {
    if (typeof path !== 'string' || !path) return '';
    path = path.trim(); // Crucial: Remove leading/trailing whitespace
    path = path.replace(/\/\/+/g, '/');
    // Replace multiple slashes with a single one
    // Ensure it starts with a '/' if it's not empty and doesn't already
    if (path.length > 0 && path[0] !== '/') {
        path = '/' + path;
    }
    return path;
}


/**
 * Gets the parent directory of a given path.
 * Ensures the returned path is normalized and ends with a slash.
 * @param {string} path The current directory path.
 * @returns {string} Normalized parent directory path ending with a slash.
 */
function getParentDirectory(path) {
    path = normalizePath(path);
    // Normalize the input path first

    // If it's already the root ebooks directory, return it as is.
    if (path === normalizePath(ROOT_EBOOKS_DIR + '/')) {
        return normalizePath(ROOT_EBOOKS_DIR + '/');
    }

    // Remove trailing slash if present for consistent splitting, unless it's just '/'
    if (path.length > 1 && path[path.length - 1] === '/') {
        path = path.substring(0, path.length - 1);
    }

    var parts = path.split('/').filter(Boolean); // Split and remove empty strings

    if (parts.length === 0) {
        // This case should ideally be caught by the ROOT_EBOOKS_DIR check
        // but acts as a fallback to prevent going above the intended root.
        return normalizePath(ROOT_EBOOKS_DIR + '/');
    }

    parts.pop(); // Remove the last part (current directory name)

    var parentPath = '/' + parts.join('/');
    // Ensure the parent path always ends with a slash for directory Browse
    if (parentPath[parentPath.length - 1] !== '/') {
        parentPath += '/';
    }

    return normalizePath(parentPath); // Normalize again to clean up any double slashes from concatenation
}


/**
 * Loads all .txt files and subdirectories from currentDirectory and populates fileList.
 * Sets a message if no files are found or directory is inaccessible.
 */
function loadFileList() {
    var allFiles = FS.listFiles(currentDirectory);
    var allDirs = FS.listDirs(currentDirectory);
    // Check if the directory exists and is accessible.
    // If both return null/undefined, the directory likely doesn't exist or is inaccessible.
    if (!allFiles && !allDirs) {
        message = "Error: Dir '" + currentDirectory + "' not found or inaccessible!";
        fileList = []; // Ensure fileList is empty
        selectedFileIndex = -1;
        // No items available
        scrollOffset = 0;
        return;
    }

    var tempFileList = [];

    // Add ".." for navigating up, if not at the root ebooks directory
    // Compare normalized paths to be robust
    if (normalizePath(currentDirectory) !== normalizePath(ROOT_EBOOKS_DIR + '/')) {
        tempFileList.push({ name: "..", type: "dir" });
    }

    // Add directories
    if (allDirs) {
        for (var i = 0; i < allDirs.length; i++) {
            var dirItemName = allDirs[i].trim();
            // Trim potential whitespace from FS results
            if (dirItemName !== "..") { // Ensure ".." is not added twice if FS lists it directly
                tempFileList.push({ name: "[DIR] " + dirItemName, type: "dir" });
            }
        }
    }

    // Add .txt files
    if (allFiles) {
        for (var i = 0; i < allFiles.length; i++) {
            var fileItemName = allFiles[i].trim();
            // Trim potential whitespace from FS results
            if (fileItemName.endsWith(".txt")) {
                tempFileList.push({ name: fileItemName, type: "file" });
            }
        }
    }

    // Sort alphabetically, with directories (and "..") appearing before files
    tempFileList.sort(function(a, b) {
        var aIsDir = a.type === "dir";
        var bIsDir = b.type === "dir";

        // Prioritize directories over files
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;

     
        // Special handling for ".." to always be at the very top
        if (a.name === ".." && b.name !== "..") return -1; // ".." should be first
        if (a.name !== ".." && b.name === "..") return 1; // ".." should be first

        // Otherwise, sort alphabetically by name
        return a.name.localeCompare(b.name);
    });
    fileList = tempFileList;

    if (fileList.length === 0) {
        if (normalizePath(currentDirectory) === normalizePath(ROOT_EBOOKS_DIR + '/')) {
            message = "No .txt files or subdirs in EBOOKS.";
        } else {
            message = "No contents in this directory.";
        }
        selectedFileIndex = -1;
        // Indicate no items available
    } else {
        message = '';
        // Clear previous messages
        selectedFileIndex = 0;
        // Always reset selection to the first item when loading a new list
    }
    scrollOffset = 0;
    // Reset scroll for the list itself
}

/**
 * Reads the content of a selected file and prepares it for display.
 * This function also performs a very basic word wrap.
 * @param {string} filename The name of the file to load.
 */
function loadFileContent(filename) {
    // Ensure filename is trimmed before path construction
    var trimmedFilename = filename.trim();
    var fullPath = currentDirectory + trimmedFilename;
    fileContent = FS.readTextFile(fullPath);

    if (fileContent === null) {
        message = "[ERROR] Could not read file: " + trimmedFilename;
        fileContent = message; // Display error in content area
    } else {
        message = '';
        // Clear previous messages
    }

    // Basic word wrapping:
    // Determine max characters per line for 8x8 font and SCREEN_W
    var maxCharsPerLine = Math.floor((SCREEN_W - 2 * PADDING_X) / FONT_WIDTH);
    contentLines = [];
    var rawLines = fileContent.split('\n');

    for (var i = 0; i < rawLines.length; i++) {
        // FIX: Remove carriage return character if present, which might be displayed as '?'
        var line = rawLines[i].replace(/\r$/, '');

        if (line.length <= maxCharsPerLine) {
            contentLines.push(line);
        } else {
            // Simple greedy word wrap
            var tempLine = "";
            var words = line.split(' ');
            for (var j = 0; j < words.length; j++) {
                var word = words[j];
                // Check if adding the word (plus a space if not the first word) exceeds maxCharsPerLine
                if ((tempLine.length > 0 ? tempLine.length + 1 : 0) + word.length <= maxCharsPerLine) {
                    tempLine += (tempLine.length > 0 ? " " : "") + word;
                } else {
                    contentLines.push(tempLine);
                    // Push the accumulated line
                    tempLine = word;
                    // Start a new line with the current word
                }
            }
            if (tempLine.length > 0) { // Push any remaining text in tempLine
                contentLines.push(tempLine);
            }
        }
    }
    scrollOffset = 0;
    // Reset scroll position when a new file is loaded
}

// --- Drawing Functions ---

/**
 * Draws the header for both states.
 * @param {string} title The title text to display.
 */
function drawHeader(title) {
    drawText8x8(PADDING_X, PADDING_Y, title, COLOR_WHITE);
}

/**
 * Draws the footer for both states.
 * @param {string} instructions Instructions for the user.
 */
function drawFooter(instructions) {
    drawText8x8(PADDING_X, SCREEN_H - FOOTER_H - PADDING_Y, instructions, COLOR_GRAY);
    if (message) {
        // Position message above the regular footer text
        drawText8x8(PADDING_X, SCREEN_H - FOOTER_H - PADDING_Y - TOTAL_LINE_HEIGHT, message, COLOR_ERROR);
    }
}

/**
 * Draws the file list on the screen.
 */
function drawFileList() {
    clearScreen(COLOR_BLACK);
    drawHeader("Ebook Reader: " + currentDirectory); // Show current path

    var startY = HEADER_H + PADDING_Y + TOTAL_LINE_HEIGHT;
    // Start drawing files below header

    // Calculate effective visible lines for file list (leaving space for message/footer)
    var effectiveVisibleLines = Math.floor((SCREEN_H - startY - FOOTER_H - 2 * PADDING_Y) / TOTAL_LINE_HEIGHT);
    if (effectiveVisibleLines < 1) effectiveVisibleLines = 1;

    // Adjust scrollY for file list to keep selected item visible
    // Ensure scrollOffset for list is within valid bounds
    var maxListScroll = Math.max(0, fileList.length - effectiveVisibleLines);
    // Ensure selectedFileIndex is valid, especially after loadFileList might reset it to 0
    if (selectedFileIndex < 0 && fileList.length > 0) {
        selectedFileIndex = 0;
    } else if (selectedFileIndex >= fileList.length && fileList.length > 0) {
        selectedFileIndex = fileList.length - 1;
    }


    if (selectedFileIndex < scrollOffset) {
        scrollOffset = selectedFileIndex;
    } else if (selectedFileIndex >= scrollOffset + effectiveVisibleLines) {
        scrollOffset = selectedFileIndex - effectiveVisibleLines + 1;
    }
    // Clamp scrollOffset to valid range
    scrollOffset = Math.max(0, Math.min(scrollOffset, maxListScroll));
    var displayStartIndex = scrollOffset;


    for (var i = 0; i < effectiveVisibleLines; i++) {
        var fileIdx = displayStartIndex + i;
        if (fileIdx >= fileList.length) break;

        var item = fileList[fileIdx];
        var y = startY + (i * TOTAL_LINE_HEIGHT);
        var color = (fileIdx === selectedFileIndex) ? COLOR_HIGHLIGHT : COLOR_WHITE;
        if (item.type === "dir") {
            color = (fileIdx === selectedFileIndex) ?
            COLOR_HIGHLIGHT : COLOR_DIRECTORY;
        }
        drawText8x8(PADDING_X, y, item.name, color);
    }

    // Draw scroll indicators for the file list
    if (displayStartIndex > 0) {
        // Draw up arrow at a fixed position
        drawText8x8(SCREEN_W - PADDING_X - FONT_WIDTH, startY - TOTAL_LINE_HEIGHT, "▲", COLOR_GRAY);
    }
    if (displayStartIndex + effectiveVisibleLines < fileList.length) {
        // Draw down arrow at a fixed position
        drawText8x8(SCREEN_W - PADDING_X - FONT_WIDTH, startY + (effectiveVisibleLines * TOTAL_LINE_HEIGHT), "▼", COLOR_GRAY);
    }

    drawFooter("Up/Down:Nav  A:Open/Dir");
}

/**
 * Draws the content of the currently loaded file.
 */
function drawFileContent() {
    clearScreen(COLOR_BLACK);
    // Ensure selectedFileIndex is valid before accessing fileList
    var titleFileName = (fileList.length > 0 && selectedFileIndex >= 0 && selectedFileIndex < fileList.length) ?
    fileList[selectedFileIndex].name : "Unknown File";
    drawHeader("Reading: " + titleFileName);

    var startY = HEADER_H + PADDING_Y;
    // Display visible lines
    for (var i = 0; i < VISIBLE_LINES_CONTENT; i++) {
        var lineIdx = scrollOffset + i;
        if (lineIdx >= contentLines.length) break;

        var line = contentLines[lineIdx];
        var y = startY + (i * TOTAL_LINE_HEIGHT);
        drawText8x8(PADDING_X, y, line, COLOR_WHITE);
    }

    // Page Info (moved to bottom right, aligned with footer)
    var totalContentLines = contentLines.length;
    var totalPages = Math.ceil(totalContentLines / VISIBLE_LINES_CONTENT);
    var currentPage = Math.floor(scrollOffset / VISIBLE_LINES_CONTENT) + 1;
    // Clamp currentPage to 1 if totalPages is 0 (empty file) for better display
    if (totalPages === 0 && totalContentLines === 0) {
        currentPage = 0;
    } else if (totalPages === 0) { // Should not happen if contentLines has content and VISIBLE_LINES_CONTENT > 0
        currentPage = 1;
        totalPages = 1;
    }

    var pageInfoText = "Page " + currentPage + " / " + totalPages;
    var pageInfoTextWidth = pageInfoText.length * FONT_WIDTH;

    // Position page info at the bottom right, aligned with the bottom of the footer
    var pageInfoX = SCREEN_W - PADDING_X - pageInfoTextWidth;
    var pageInfoY = SCREEN_H - FOOTER_H - PADDING_Y; // Align with the bottom of the instructions line

    drawText8x8(pageInfoX, pageInfoY, pageInfoText, COLOR_GRAY);
    // Updated Footer instructions: ONLY "B: Back"
    drawFooter("B: Back");
}

/**
 * Draws the splash screen.
 */
function drawSplashScreen() {
    clearScreen(COLOR_BLACK);
    var titleText = "TEXT FILE READER";
    var byText = "by SjslTech";

    // Calculate positions to center the text
    var titleWidth = titleText.length * FONT_WIDTH;
    var byWidth = byText.length * FONT_WIDTH;

    var titleX = (SCREEN_W - titleWidth) / 2;
    var titleY = (SCREEN_H / 2) - (TOTAL_LINE_HEIGHT / 2) - (TOTAL_LINE_HEIGHT / 2); // Slightly above center

    var byX = (SCREEN_W - byWidth) / 2;
    var byY = (SCREEN_H / 2) + (TOTAL_LINE_HEIGHT / 2); // Slightly below center

    drawText8x8(titleX, titleY, titleText, COLOR_WHITE);
    drawText8x8(byX, byY, byText, COLOR_GRAY);

    drawFooter("Press any button to continue...");
}


// --- Input Handler ---

/**
 * Main input handling function, designed to be called every frame.
 * Includes debounce logic and single-press detection for file browser.
 */
function handleInput() {
    var currentInputState = getInputState();
    var actionTaken = false;

    if (currentState === 'SPLASH') {
        // Any button press transitions from splash to LISTING
        if (currentInputState !== 0 && !(lastInputState !== 0)) { // Check if any button is pressed
            currentState = 'LISTING';
            loadFileList(); // Load the file list once after splash
            actionTaken = true;
        }
    } else if (currentState === 'LISTING') {
        // Only trigger action on the "rising edge" (button just pressed)
        // Up button
        if ((currentInputState & BUTTON_UP) && !(lastInputState & BUTTON_UP)) {
            if (fileList.length > 0) {
                selectedFileIndex = (selectedFileIndex - 1 + fileList.length) % fileList.length;
            } else {
                selectedFileIndex = -1;
            }
            actionTaken = true;
        }
        // Down button
        else if ((currentInputState & BUTTON_DOWN) && !(lastInputState & BUTTON_DOWN)) {
            if (fileList.length > 0) {
                selectedFileIndex = (selectedFileIndex + 1) % fileList.length;
            } else {
                selectedFileIndex = -1;
            }
            actionTaken = true;
        }
        // Select (A) button
        else if ((currentInputState & BUTTON_SELECT) && !(lastInputState & BUTTON_SELECT)) {
            if (fileList.length > 0 && selectedFileIndex >= 0) {
                var selectedItem = fileList[selectedFileIndex];
                if (selectedItem.type === "dir") {
                    if (selectedItem.name === "..") {
                        currentDirectory = getParentDirectory(currentDirectory);
                        // Ensure currentDirectory ends with a slash after getting parent, as it's a directory
                        if (currentDirectory[currentDirectory.length - 1] !== '/') {
                             currentDirectory += '/';
                        }
                    } else {
                        // Navigate into subdirectory.
                        // Remove "[DIR] " prefix.
                        // Trim any potential whitespace from the extracted directory name
                        var dirName = selectedItem.name.substring(5).trim();
                        currentDirectory = normalizePath(currentDirectory + dirName); // Normalize the combined path
                        // Ensure currentDirectory ends with a slash, as it's a directory
                        if (currentDirectory[currentDirectory.length - 1] !== '/') {
                           
                            currentDirectory += '/';
                        }
                    }
                    loadFileList();
                    // Reload list for the new directory
                    actionTaken = true;
                    // Action taken, so debounce not needed for this state
                } else if (selectedItem.type === "file") {
                    loadFileContent(selectedItem.name);
                    // Pass just the filename, loadFileContent will trim
                    currentState = 'READING';
                    actionTaken = true; // Action taken
                }
            } else {
                message = "No items to open!";
            }
        }
    } else if (currentState === 'READING') {
        var maxScroll = Math.max(0, contentLines.length - VISIBLE_LINES_CONTENT);
        // For reading mode, we want continuous scrolling, so we use the time-based debounce
        if (inputDebounce > 0) {
            inputDebounce--;
        } else {
            // Check for button presses for continuous scroll
            if (currentInputState & BUTTON_UP) {
                scrollOffset = Math.max(0, scrollOffset - 1);
                actionTaken = true;
            } else if (currentInputState & BUTTON_DOWN) {
                scrollOffset = Math.min(maxScroll, scrollOffset + 1);
                actionTaken = true;
            } else if (currentInputState & BUTTON_LEFT) {
                scrollOffset = Math.max(0, scrollOffset - PAGE_SCROLL_LINES);
                actionTaken = true;
            } else if (currentInputState & BUTTON_RIGHT) {
                scrollOffset = Math.min(maxScroll, scrollOffset + PAGE_SCROLL_LINES);
                actionTaken = true;
            } else if (currentInputState & BUTTON_L) {
                scrollOffset = Math.max(0, scrollOffset - (PAGE_SCROLL_LINES * LARGE_SCROLL_FACTOR));
                actionTaken = true;
            } else if (currentInputState & BUTTON_R) {
                scrollOffset = Math.min(maxScroll, scrollOffset + (PAGE_SCROLL_LINES * LARGE_SCROLL_FACTOR));
                actionTaken = true;
            }
            // If any of the above continuous scroll actions occurred, reset debounce
            if (actionTaken) {
                inputDebounce = DEBOUNCE_FRAMES;
            }
        }

        // B button in reading mode (single press detection)
        if ((currentInputState & BUTTON_BACK) && !(lastInputState & BUTTON_BACK)) {
            currentState = 'LISTING';
            fileContent = ""; // Clear content to potentially free memory
            contentLines = [];
            scrollOffset = 0; // Reset scroll for list view
            actionTaken = true;
            // Action taken
            message = '';
            // Clear any message when returning to list
        }
    }

    // Update lastInputState at the end of the frame for the next frame's comparison
    lastInputState = currentInputState;
}

// --- Main Initialization Function ---
function mainInit() {
    message = "Loading Ebook Reader...";
    // Initial message is now handled by the splash screen state

    currentDirectory = normalizePath(ROOT_EBOOKS_DIR); // Ensure consistent path format
    // Ensure ROOT_EBOOKS_DIR always ends with a slash as it's a directory
    if (currentDirectory[currentDirectory.length - 1] !== '/') {
        currentDirectory += '/';
    }

    // loadFileList() is now called after the splash screen is dismissed
    // No need to set selectedFileIndex or scrollOffset here as it's done in loadFileList
}

// --- Main Loop and Initialization Order ---

// 1. Set the main loop function (must be defined before mainInit calls it implicitly)
setMainLoop(function() {
    handleInput(); // Process input
    if (currentState === 'SPLASH') {
        drawSplashScreen();
    } else if (currentState === 'LISTING') {
        drawFileList(); // Draw the appropriate screen based on state
    } else if (currentState === 'READING') {
        drawFileContent();
    }
});
// 2. Call the main initialization function
mainInit();
