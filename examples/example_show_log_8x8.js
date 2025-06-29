// Example: Show contents of /mnt/sda1/log.txt using ScreenDraw.text8x8
var logText = FS.readFile('/mnt/sda1/log.txt');
if (logText === null) {
    ScreenDraw.text8x8(8, 16, 'Could not open /mnt/sda1/log.txt', 0xFFFF0000);
} else {
    // Convert Uint8Array to string if needed
    var textStr = "";
    if (typeof logText === "string") {
        textStr = logText;
    } else if (logText instanceof Uint8Array) {
        for (var i = 0; i < logText.length; ++i) {
            textStr += String.fromCharCode(logText[i]);
        }
    }
    var lines = textStr.split('\n');
    var y = 8;
    for (var i = 0; i < lines.length; ++i) {
        ScreenDraw.text8x8(8, y, lines[i], 0xFFFFFFFF);
        y += 10; // line height for 8x8 font (8px + 2px spacing)
        if (y > 220) break; // avoid drawing off screen
    }
}
