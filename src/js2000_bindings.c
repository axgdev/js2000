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

void js2000_register_bindings(duk_context *ctx) {
    // Register FS module
    register_filesystem_module(ctx);

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

    // Register ScreenDraw module (drawing/text/framebuffer)
    register_screen_draw_module(ctx);
}
