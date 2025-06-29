#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include "duktape.h"
#include "debug.h"
#include "js2000_bindings.h"
#include "filesystem.h"
#include "js2000.h"
#include "filesystem_bindings.h"
#include "libretro.h"
#include "screen_draw_bindings.h"

// Extern framebuffer from js2000.c
extern uint32_t js2000_fb[];

// Extern input_state_cb from js2000.c
extern retro_input_state_t input_state_cb;

// Print-to-screen buffer
#define PRINT_SCREEN_MAX_LINES 32
#define PRINT_SCREEN_LINE_LEN 80
static char print_screen_lines[PRINT_SCREEN_MAX_LINES][PRINT_SCREEN_LINE_LEN];
static int print_screen_line_count = 0;

static void print_screen_add_line(const char *msg) {
    // Scroll if full
    if (print_screen_line_count == PRINT_SCREEN_MAX_LINES) {
        for (int i = 1; i < PRINT_SCREEN_MAX_LINES; ++i) {
            strncpy(print_screen_lines[i-1], print_screen_lines[i], PRINT_SCREEN_LINE_LEN);
        }
        print_screen_line_count--;
    }
    strncpy(print_screen_lines[print_screen_line_count], msg, PRINT_SCREEN_LINE_LEN-1);
    print_screen_lines[print_screen_line_count][PRINT_SCREEN_LINE_LEN-1] = '\0';
    print_screen_line_count++;
}

// Helper: clear framebuffer to a given color
static void clear_screen_c(uint32_t color) {
    for (int y = 0; y < SCREEN_HEIGHT; ++y) {
        for (int x = 0; x < SCREEN_WIDTH; ++x) {
            js2000_fb[y * SCREEN_WIDTH + x] = color;
        }
    }
}

static void print_screen_render(void) {
    clear_screen_c(0xFF000000); // Black background
    int line_height = 9; // 8px font + 1px spacing
    int max_visible_lines = SCREEN_HEIGHT / line_height;
    int first = 0;
    if (print_screen_line_count > max_visible_lines) {
        first = print_screen_line_count - max_visible_lines;
    }
    int lines_to_draw = print_screen_line_count - first;
    for (int i = 0; i < lines_to_draw; ++i) {
        font_render_draw_text_5x8(js2000_fb, SCREEN_WIDTH, SCREEN_HEIGHT, 2, 2 + i*line_height, print_screen_lines[first + i], 0xFFFFFFFF);
    }
}

// C function for console.log and print
static duk_ret_t duk_console_log(duk_context *ctx) {
    const char *msg = duk_safe_to_string(ctx, 0);
    xlog("[js] %s\n", msg);
    return 0;
}

// C function for print (alias for console.log)
static duk_ret_t duk_print(duk_context *ctx) {
    return duk_console_log(ctx);
}


// Expose to JS: getInputState() returns an integer bitmask of current button state
static duk_ret_t duk_get_input_state(duk_context *ctx) {
    // Call input_state_cb for port 0, device RETRO_DEVICE_JOYPAD
    if (!input_state_cb) {
        duk_push_int(ctx, 0);
        return 1;
    }
    int state = 0;
    for (int i = 0; i < 16; ++i) {
        if (input_state_cb(0, RETRO_DEVICE_JOYPAD, 0, i)) {
            state |= (1 << i);
        }
    }
    duk_push_int(ctx, state);
    return 1;
}

// Expose to JS: setMainLoop(fn)
static duk_ret_t duk_set_main_loop(duk_context *ctx) {
    if (!duk_is_function(ctx, 0)) {
        return DUK_RET_TYPE_ERROR;
    }
    // Store the function in the global stash
    duk_push_global_stash(ctx);
    duk_dup(ctx, 0);
    duk_put_prop_string(ctx, -2, "__mainLoop");
    duk_pop(ctx);
    return 0;
}

// Expose to JS: printToScreen(msg)
static duk_ret_t duk_print_to_screen(duk_context *ctx) {
    const char *msg = duk_safe_to_string(ctx, 0);
    print_screen_add_line(msg);
    print_screen_render();
    return 0;
}

// Table for FS module using Duktape's duk_function_list_entry
static const duk_function_list_entry fs_function_list[] = {
    { "readFile", duk_read_file, 1 },
    { "readTextFile", duk_read_text_file, 1 },
    { "writeFile", duk_write_file, 2 },
    { "writeTextFile", duk_write_text_file, 2 },
    { "appendTextFile", duk_append_text_file, 2 },
    { "removeFile", duk_remove_file, 1 },
    { "renameFile", duk_rename_file, 2 },
    { "mkdir", duk_mkdir, 1 },
    { "rmdir", duk_rmdir, 1 },
    { "fileExists", duk_file_exists, 1 },
    { "fileSize", duk_file_size, 1 },
    { "moveFile", duk_move_file, 2 },
    { "isDir", duk_is_dir, 1 },
    { "isFile", duk_is_file, 1 },
    { "touchFile", duk_touch_file, 1 },
    { "getModTime", duk_get_mod_time, 1 },
    { "listFiles", duk_list_files, 1 },
    { "listDirs", duk_list_dirs, 1 },
    { "listFilesCount", duk_list_files_count, 1 },
    { "listDirsCount", duk_list_dirs_count, 1 },
    { "copyFile", duk_copy_file, DUK_VARARGS },
    { "copyDirFiles", duk_copy_dir_files, DUK_VARARGS },
    { "copyDirFilesPattern", duk_copy_dir_files_pattern, DUK_VARARGS },
    { NULL, NULL, 0 }
};

void js2000_register_bindings(duk_context *ctx) {
    // Register FS module
    duk_push_object(ctx); // -> [ FS ]
    duk_put_function_list(ctx, -1, fs_function_list);
    duk_put_global_string(ctx, "FS"); // global.FS = { ... }

    // Register console.log(msg) as a global JS function
    duk_push_object(ctx);
    duk_push_c_function(ctx, duk_console_log, 1);
    duk_put_prop_string(ctx, -2, "log");
    duk_put_global_string(ctx, "console");

    // Register print(msg) as a global JS function (alias for console.log)
    duk_push_c_function(ctx, duk_print, 1);
    duk_put_global_string(ctx, "print");

    // Register getInputState()
    duk_push_c_function(ctx, duk_get_input_state, 0);
    duk_put_global_string(ctx, "getInputState");

    // Register setMainLoop(fn)
    duk_push_c_function(ctx, duk_set_main_loop, 1);
    duk_put_global_string(ctx, "setMainLoop");

    // Register printToScreen(msg)
    duk_push_c_function(ctx, duk_print_to_screen, 1);
    duk_put_global_string(ctx, "printToScreen");

    // Register ScreenDraw module (drawing/text/framebuffer)
    register_screen_draw_module(ctx);
}
