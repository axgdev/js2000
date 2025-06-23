// Example: Demonstrate printToScreen with scrolling effect
// Prints enough lines to fill and scroll the screen, with a delay between each

var TOTAL_LINES = 40; // More than PRINT_SCREEN_MAX_LINES (32)
var DELAY_FRAMES = 10; // Frames between prints
var currentLine = 0;
var frameCount = 0;

setMainLoop(function() {
    if (currentLine >= TOTAL_LINES) return;
    frameCount++;
    if (frameCount >= DELAY_FRAMES) {
        printToScreen("Line " + (currentLine + 1));
        currentLine++;
        frameCount = 0;
    }
});
