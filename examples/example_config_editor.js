// example_config_editor.js
// Config file editor for js2000 core (JavaScript version)
//
// Features:
// - Lists .opt files in /mnt/sda1/cores/config
// - Loads and edits key/value pairs
// - Supports toggling values for entries with possible values (pipe-separated)
// - Navigation: Up/Down (entry), Left/Right (file), A (toggle), B (save)
//
// Limitations:
// - Only supports simple key = value pairs (no sections)
// - No legend parsing (unless present as comments)
// - No mouse/touch support

var CONFIG_DIR = '/mnt/sda1/cores/config';
var SCREEN_W = 320;
var SCREEN_H = 240;
var LINE_HEIGHT = 9;
var HEADER_H = 10;
var FOOTER_H = 10;
var VISIBLE_LINES = Math.floor((SCREEN_H - HEADER_H - FOOTER_H) / LINE_HEIGHT);

// State
var configFiles = [];
var currentFileIdx = 0;
var configEntries = [];
var scrollY = 0;
var selectedLine = 0;
var message = '';

// Add repeat counters for L and R
var lRepeat = 0;
var rRepeat = 0;

function listConfigFiles() {
    var files = FS.listFiles(CONFIG_DIR);
    if (!files) return [];
    var out = [];
    for (var i = 0; i < files.length; ++i) {
        if (files[i].length > 4 && files[i].substr(-4) === '.opt') {
            out.push(files[i]);
        }
    }
    return out;
}

function loadConfigFile(idx) {
    if (idx < 0 || idx >= configFiles.length) return false;
    var path = CONFIG_DIR + '/' + configFiles[idx];
    var text = FS.readTextFile(path);
    if (text === null) {
        message = 'Could not open ' + path;
        configEntries = [];
        return false;
    }
    configEntries = [];
    var legends = {};
    var lines = text.split('\n');
    // First pass: parse legends
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i].trim();
        if (line.substr(0, 4) === '### ') {
            // Updated regex to allow spaces between blocks
            var m = line.match(/\[([^\]]+)\]\s*:\s*\[([^\]]*)\]\s*:\s*\[([^\]]*)\]/);
            if (m && m[1]) {
                var key = m[1];
                var possible = m[3] ? m[3] : '';
                legends[key] = possible;
            }
        }
    }
    // Second pass: parse entries
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i].trim();
        if (!line || line[0] === '#' || line[0] === ';') continue;
        var eq = line.indexOf('=');
        if (eq > 0) {
            var key = line.substr(0, eq).trim();
            var value = line.substr(eq + 1).trim();
            var possible = legends[key] || '';
            configEntries.push({ key: key, value: value, orig: value, possible: possible });
        }
    }
    scrollY = 0;
    selectedLine = 0;
    message = '';
    return true;
}

function saveConfigFile() {
    var path = CONFIG_DIR + '/' + configFiles[currentFileIdx];
    // Read original file to preserve comments/formatting
    var origText = FS.readTextFile(path);
    if (origText === null) {
        message = 'Save failed: cannot read original';
        return false;
    }
    var lines = origText.split('\n');
    var outLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        var eq = line.indexOf('=');
        if (eq > 0) {
            var key = line.substr(0, eq).trim();
            // Find entry
            var found = false;
            for (var j = 0; j < configEntries.length; ++j) {
                if (configEntries[j].key === key) {
                    outLines.push(key + ' = ' + configEntries[j].value);
                    found = true;
                    break;
                }
            }
            if (!found) outLines.push(line);
        } else {
            outLines.push(line);
        }
    }
    // Add any new entries
    for (var j = 0; j < configEntries.length; ++j) {
        var found = false;
        for (var i = 0; i < lines.length; ++i) {
            var eq = lines[i].indexOf('=');
            if (eq > 0 && lines[i].substr(0, eq).trim() === configEntries[j].key) {
                found = true;
                break;
            }
        }
        if (!found) {
            outLines.push(configEntries[j].key + ' = ' + configEntries[j].value);
        }
    }
    var newText = outLines.join('\n');
    if (FS.writeTextFile(path, newText)) {
        message = 'Saved!';
        // Update orig values
        for (var k = 0; k < configEntries.length; ++k) configEntries[k].orig = configEntries[k].value;
        return true;
    } else {
        message = 'Save failed!';
        return false;
    }
}

function getPossibleValues(entry) {
    // Prefer legend possible values if present
    if (entry.possible && entry.possible.length > 0) {
        return entry.possible.split('|');
    }
    // Fallback: try to parse from value if pipe-separated
    var val = entry.value;
    if (val.length > 1 && val[0] === '"' && val[val.length-1] === '"') {
        val = val.substr(1, val.length-2);
    }
    if (val.indexOf('|') >= 0) {
        return val.split('|');
    }
    return null;
}

function toggleEntry(idx) {
    if (idx < 0 || idx >= configEntries.length) return;
    var entry = configEntries[idx];
    var vals = getPossibleValues(entry);
    console.log('toggleEntry ' + entry.key + ' current: ' + entry.value + ' possible: ' + (vals ? vals.join(',') : 'none'));
    if (!vals) return;
    // Remove quotes for comparison
    var cur = entry.value;
    if (cur.length > 1 && cur[0] === '"' && cur[cur.length-1] === '"') {
        cur = cur.substr(1, cur.length-2);
    }
    var idxVal = vals.indexOf(cur);
    var nextVal = vals[(idxVal + 1) % vals.length];
    // Add quotes if original was quoted
    if (entry.value.length > 1 && entry.value[0] === '"') {
        entry.value = '"' + nextVal + '"';
    } else {
        entry.value = nextVal;
    }
    console.log('Toggled ' + entry.key + ' to ' + entry.value);
}

function draw() {
    ScreenDraw.clear(0xFF101040);
    // Header
    var title = 'Config Editor: ' + (configFiles.length ? configFiles[currentFileIdx] : '(no files)');
    ScreenDraw.text5x8(4, 0, title, 0xFFFFFF00);
    // Entries
    for (var i = 0; i < VISIBLE_LINES; ++i) {
        var entryIdx = scrollY + i;
        if (entryIdx >= configEntries.length) break;
        var entry = configEntries[entryIdx];
        var y = HEADER_H + i * LINE_HEIGHT;
        var line = entry.key + ' = ' + entry.value;
        var color = (entryIdx === selectedLine) ? 0xFF00FF00 : 0xFFFFFFFF;
        ScreenDraw.text5x8(8, y, line, color);
        // Mark if changed
        if (entry.value !== entry.orig) {
            ScreenDraw.text5x8(SCREEN_W - 40, y, '*', 0xFFFF0000);
        }
    }
    // Footer
    var footer = 'Up/Down:Nav  L/R:File  A:Toggle  B:Save';
    ScreenDraw.text5x8(4, SCREEN_H - FOOTER_H, footer, 0xFFAAAAAA);
    if (message) {
        ScreenDraw.text5x8(4, SCREEN_H - FOOTER_H - LINE_HEIGHT, message, 0xFFFFFF00);
    }
}

function handleInput() {
    var input = getInputState();
    // D-pad: Up=4, Down=5, Left=6, Right=7, A=8, B=0, L=10, R=11
    if (handleInput.debounce > 0) { handleInput.debounce--; return; }
    var moved = false;
    // L button repeat logic
    if (input & (1 << 10)) { // L
        if (lRepeat === 0) {
            if (currentFileIdx > 0) { currentFileIdx--; loadConfigFile(currentFileIdx); moved = true; }
            lRepeat = 16; // Initial delay (frames)
        } else {
            lRepeat--;
        }
    } else {
        lRepeat = 0;
    }
    // R button repeat logic
    if (input & (1 << 11)) { // R
        if (rRepeat === 0) {
            if (currentFileIdx < configFiles.length - 1) { currentFileIdx++; loadConfigFile(currentFileIdx); moved = true; }
            rRepeat = 16; // Initial delay (frames)
        } else {
            rRepeat--;
        }
    } else {
        rRepeat = 0;
    }
    if (input & (1 << 4)) { // Up
        if (selectedLine > 0) { selectedLine--; moved = true; }
    } else if (input & (1 << 5)) { // Down
        if (selectedLine < configEntries.length - 1) { selectedLine++; moved = true; }
    } else if (input & (1 << 6)) { // Left
        if (currentFileIdx > 0) { currentFileIdx--; loadConfigFile(currentFileIdx); moved = true; }
    } else if (input & (1 << 7)) { // Right
        if (currentFileIdx < configFiles.length - 1) { currentFileIdx++; loadConfigFile(currentFileIdx); moved = true; }
    } else if (input & (1 << 8)) { // A
        console.log('A pressed: toggling entry ' + selectedLine + ' ' + (configEntries[selectedLine] ? configEntries[selectedLine].key : '(none)'));
        toggleEntry(selectedLine); moved = true;
    } else if (input & (1 << 0)) { // B
        saveConfigFile(); moved = true;
    }
    if (moved) {
        // Scroll to keep selectedLine visible
        if (selectedLine < scrollY) scrollY = selectedLine;
        if (selectedLine >= scrollY + VISIBLE_LINES) scrollY = selectedLine - VISIBLE_LINES + 1;
        handleInput.debounce = 6;
    }
}
handleInput.debounce = 0;

function mainInit() {
    configFiles = listConfigFiles();
    if (configFiles.length > 0) {
        loadConfigFile(0);
    } else {
        configEntries = [];
        message = 'No .opt files in ' + CONFIG_DIR;
    }
}

setMainLoop(function() {
    handleInput();
    draw();
});

mainInit();
