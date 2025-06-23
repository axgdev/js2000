// js2000 JavaScript Core API (2024)
//
// This file documents all global functions and FS methods available to JavaScript
// scripts running in the js2000 Libretro core. Use these APIs for file I/O, text
// rendering, input, and main loop control. No browser/DOM APIs are available.
//
// ---
//
// DUKTAPE JAVASCRIPT LIMITATIONS
//
// - Most standard ECMAScript 5.1 features are supported (functions, objects, arrays, math, etc).
// - No browser APIs (window, document, DOM, etc).
// - No setTimeout/setInterval or asynchronous features.
// - No require/import or module system by default.
// - Only the global functions and FS methods listed above are available for file and system access.
// - Scripts run synchronously and block until finished, unless setMainLoop is used.
// - You can define your own functions, use loops, and basic JS logic as usual.
//
// ---
//
// GLOBAL FUNCTIONS
//
// console.log(msg)
//   Print a message to the system log. Accepts any value (converted to string).
//   Example: console.log("Hello from JS!");
//
// print(msg)
//   Alias for console.log(msg).
//
// printToScreen(msg)
//   Print a message to an on-screen overlay (useful for debug/info).
//   Example: printToScreen("Hello!");
//
// drawText(x, y, text, color) [Do not use, not completed]
//   Draw text at (x, y) using the main font. Color is 0xAARRGGBB.
//   Example: drawText(10, 20, "Hello", 0xFFFFFFFF);
//
// drawTextSimple(x, y, text, color) [Do not use, not completed]
//   Draw text using a simple built-in font. Color is 0xAARRGGBB.
//
// drawText8x8(x, y, text, color)
//   Draw text using an 8x8 pixel bitmap font. Color is 0xAARRGGBB.
//
// drawText5x8(x, y, text, color)
//   Draw text using a 5x8 pixel bitmap font. Color is 0xAARRGGBB.
//
// clearScreen(color)
//   Fill the framebuffer with the given color (0xAARRGGBB).
//
// getInputState()
//   Returns an integer bitmask of the current button state (see docs for mapping).
//   Example: if (getInputState() & (1 << 4)) { /* Up pressed */ }
//
// setMainLoop(fn)
//   Register a function to be called every frame (60Hz). Your script will keep
//   running as long as this function is registered and does not throw.
//   Example: setMainLoop(function() { ... });
//
// ---
//
// FILESYSTEM: FS MODULE METHODS
//   All file/directory operations are available as methods of the global FS object.
//
// FS.readFile(path)
//   Reads the file at 'path'. Returns a Uint8Array (binary) or null if not found.
//   Example: var data = FS.readFile("/mnt/sda1/file.txt");
//
// FS.readTextFile(path)
//   Reads the file at 'path' and returns its contents as a string, or null if not found.
//   Example: var text = FS.readTextFile("/mnt/sda1/file.txt");
//
// FS.writeFile(path, buffer)
//   Writes a buffer (Uint8Array or ArrayBuffer) to 'path'. Returns true on success.
//
// FS.writeTextFile(path, text)
//   Writes a string to 'path' as a text file. Returns true on success.
//   Example: FS.writeTextFile("/mnt/sda1/file.txt", "Hello world!\n");
//
// FS.appendTextFile(path, text)
//   Appends a string to a file. Returns true on success.
//
// FS.removeFile(path)
//   Deletes the file at 'path'. Returns true on success.
//
// FS.renameFile(oldPath, newPath)
//   Renames/moves a file. Returns true on success.
//
// FS.mkdir(path)
//   Creates a directory. Returns true on success.
//
// FS.rmdir(path)
//   Removes a directory. Returns true on success.
//
// FS.fileExists(path)
//   Returns true if the file exists, false otherwise.
//
// FS.fileSize(path)
//   Returns the file size in bytes, or null if not found.
//
// FS.moveFile(src, dst)
//   Moves a file. Returns true on success.
//
// FS.isDir(path)
//   Returns true if the path is a directory.
//
// FS.isFile(path)
//   Returns true if the path is a file.
//
// FS.touchFile(path)
//   Creates the file if it does not exist, or updates its modification time.
//   Returns true on success.
//
// FS.getModTime(path)
//   Returns the modification time (UNIX timestamp), or null if not found.
//
// FS.listFiles(dirPath)
//   Returns an array of file names in the directory.
//
// FS.listDirs(dirPath)
//   Returns an array of subdirectory names in the directory.
//
// FS.copyFile(src, dst, overwrite=true)
//   Copies a file. Returns true on success. 'overwrite' is optional (default true).
//
// FS.copyDirFiles(srcDir, dstDir, overwrite=true)
//   Recursively copies all files and subdirectories.
//   Returns true on success.
//
// FS.copyDirFilesPattern(srcDir, dstDir, pattern, overwrite=true)
//   Recursively copies files matching a pattern (e.g. "*.txt").
//   Returns the number of files copied, or -1 on error.
//
// ---
//
// NOTES:
// - All paths are absolute (e.g. "/mnt/sda1/...").
// - No asynchronous APIs: all functions are synchronous/blocking.
// - No require/import/module system.
// - No browser APIs (window, document, etc).
// - Scripts run in a sandboxed environment with only the above APIs.
//
// Example usage:
//   if (FS.fileExists("/mnt/sda1/hello.txt")) {
//     var data = FS.readFile("/mnt/sda1/hello.txt");
//     print("File size: " + (data ? data.length : 0));
//   }
//
// ---

// Example: Scrollable file viewer using drawText5x8 and input
// Reads /mnt/sda1/log.txt and allows scrolling with d-pad

var FILENAME = '/mnt/sda1/log.txt';
var logText = FS.readTextFile(FILENAME);
var textStr = "";
if (logText === null) {
    textStr = 'Could not open ' + FILENAME;
} else {
    textStr = logText;
}
var lines = textStr.split('\n');

var scrollY = 0; // line offset
var scrollX = 0; // column offset
var lastInput = 0;
var debounce = 0;

var SCREEN_W = 320;
var SCREEN_H = 240;
var LINE_HEIGHT = 9; // 8px font + 1px spacing
var VISIBLE_LINES = Math.floor((SCREEN_H - 8) / LINE_HEIGHT);
var VISIBLE_COLS = Math.floor((SCREEN_W - 10) / 6); // 5px font + 1px spacing

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function draw() {
    // Clear screen (black)
    clearScreen(0xFF000000);
    // Draw visible lines
    for (var i = 0; i < VISIBLE_LINES; ++i) {
        var lineIdx = scrollY + i;
        if (lineIdx >= lines.length) break;
        var line = lines[lineIdx];
        var visible = line.substr(scrollX, VISIBLE_COLS);
        drawText5x8(5, 8 + i * LINE_HEIGHT, visible, 0xFFFFFFFF);
    }
    // Draw status bar
    var status = 'Y:' + (scrollY+1) + '/' + lines.length + '  X:' + (scrollX+1);
    drawText5x8(5, 0, status, 0xFF00FF00);
}

function handleInput() {
    var input = getInputState();
    if (debounce > 0) {
        debounce--;
        return;
    }
    // D-pad: Up=4, Down=5, Left=6, Right=7 (SF2000 order)
    var moved = false;
    if (input & (1 << 4)) { // Up
        scrollY = clamp(scrollY - 1, 0, Math.max(0, lines.length - VISIBLE_LINES));
        moved = true;
    } else if (input & (1 << 5)) { // Down
        scrollY = clamp(scrollY + 1, 0, Math.max(0, lines.length - VISIBLE_LINES));
        moved = true;
    } else if (input & (1 << 6)) { // Left
        scrollX = clamp(scrollX - 4, 0, 1000); // scroll left by 4 cols
        moved = true;
    } else if (input & (1 << 7)) { // Right
        scrollX = clamp(scrollX + 4, 0, 1000); // scroll right by 4 cols
        moved = true;
    }
    if (moved) debounce = 4; // simple debounce
}

setMainLoop(function() {
    handleInput();
    draw();
});
