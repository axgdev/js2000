# js2000 - JavaScript Libretro core for the SF2000/GB300 using Duktape

This is a minimal libretro core that loads and executes JavaScript scripts using the Duktape v2.7.0 engine for the SF2000 and GB300 handheld gaming devices.

Duktape is a lightweight JavaScript engine that is suitable for embedded systems, making it a good fit for the SF2000 and GB300.

## Steps to Use

### If you have the js2000 core installed already
- Write your JavaScript code in a file named `js;<script_name>.gba` (e.g., `js;hello.gba`).
- Place your `js;<script_name>.gba` file in the `ROMS` directory of your SF2000 or GB300 SD card.
- The `.gba` extension is used to trick the stock firmware into running the multicore loader, which will then load the JavaScript core and execute your script.
- Insert the SD card into your SF2000 or GB300, go to the USER section which contains the ROMS game list, type a to enter and place the selector on the `js;<script_name>.gba` file, and press start to run it.
- The script can take some time to execute, depending on its complexity.

### If you want to build the js2000 core from source
- Make sure you have the SF2000/GB300 Multicore project set up and the toolchain installed. You can find instructions in the SF2000/GB300 Multicore project
- Clone this repository inside of the `cores/` directory of the SF2000/GB300 Multicore project.
- On the root multicore project directory, run `make CONSOLE=js CORE=cores/js2000` to build the core.
- Place the resulting `core_87000000` file in the `/cores/js` directory of your SF2000 or GB300 SD card.
- Follow the steps in the above section to run your JavaScript scripts.


## Examples

You can find example scripts in the `examples/` directory of this repository. These scripts demonstrate basic usage of the Duktape JavaScript engine and the available APIs.

## API Overview

Warning: The API is still in development and may change in future versions. I'll do my best to keep this documentation up to date, but please refer to the source code for the most accurate information, particularly js2000_bindings.c.

DUKTAPE JAVASCRIPT LIMITATIONS

- Most standard ECMAScript 5.1 features are supported (functions, objects, arrays, math, etc).
- No browser APIs (window, document, DOM, etc).
- No setTimeout/setInterval or asynchronous features.
- No require/import or module system by default.
- Only the global functions and FS methods listed above are available for file and system access.
- Scripts run synchronously and block until finished, unless setMainLoop is used.
- You can define your own functions, use loops, and basic JS logic as usual.

```js
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
```

## Contributing

If you want to contribute to this project, feel free to open issues or pull requests. Contributions are welcome, especially in the form of new JavaScript scripts, improvements to the API, bug fixes or documentation updates.

## Credits
js2000 core is licensed under the MIT License.

Third-party components:

- **Duktape** (https://duktape.org/)
  - Copyright (c) 2013-present by Duktape authors (see duktape/AUTHORS.rst).
  - Licensed under the MIT license. See duktape/LICENSE.txt.

- **libretro-common** (https://github.com/libretro/libretro-common)
  - Copyright (C) 2010-2024 The RetroArch team.
  - Licensed under the MIT license. See the libretro.h header file for details.

- **SF2000/GB300 multicore** (https://github.com/axgdev/sf2000_gb300_multicore)
  - Copyright (c) 2025, Authors: gitlab.com/kobily, github.com/bnister, github.com/tzubertowski, github.com/axgdev source multicore contributors: https://github.com/axgdev/sf2000_gb300_multicore/graphs/contributors
  - Licensed under the ISC license. See sf2000_gb300_multicore/LICENSE for details.