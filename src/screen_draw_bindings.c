#include "screen_draw_bindings.h"
#include "screen_draw.h"
#include "font8x8.h"
#include "font5x8.h"
#include "js2000.h"
#include <string.h>
#include <stdint.h>

extern uint32_t js2000_fb[];

// JS: ScreenDraw.text8x8(x, y, text, color)
static duk_ret_t duk_sd_text_8x8(duk_context *ctx) {
    int nargs = duk_get_top(ctx);
    if (nargs < 4) return DUK_RET_TYPE_ERROR;
    int x = duk_to_int(ctx, 0);
    int y = duk_to_int(ctx, 1);
    const char *text = duk_to_string(ctx, 2);
    uint32_t color = (uint32_t)duk_to_uint32(ctx, 3);
    screen_draw_text_8x8(js2000_fb, SCREEN_WIDTH, SCREEN_HEIGHT, x, y, text, color);
    return 0;
}

// JS: ScreenDraw.text5x8(x, y, text, color)
static duk_ret_t duk_sd_text_5x8(duk_context *ctx) {
    int nargs = duk_get_top(ctx);
    if (nargs < 4) return DUK_RET_TYPE_ERROR;
    int x = duk_to_int(ctx, 0);
    int y = duk_to_int(ctx, 1);
    const char *text = duk_to_string(ctx, 2);
    uint32_t color = (uint32_t)duk_to_uint32(ctx, 3);
    screen_draw_text_5x8(js2000_fb, SCREEN_WIDTH, SCREEN_HEIGHT, x, y, text, color);
    return 0;
}

// JS: ScreenDraw.fillRect(x, y, w, h, color)
static duk_ret_t duk_sd_fill_rect(duk_context *ctx) {
    int x = duk_to_int(ctx, 0);
    int y = duk_to_int(ctx, 1);
    int w = duk_to_int(ctx, 2);
    int h = duk_to_int(ctx, 3);
    uint32_t color = (uint32_t)duk_to_uint32(ctx, 4);
    screen_draw_fill_rect(js2000_fb, SCREEN_WIDTH, SCREEN_HEIGHT, x, y, w, h, color);
    return 0;
}

// JS: ScreenDraw.rect(x, y, w, h, color)
static duk_ret_t duk_sd_rect(duk_context *ctx) {
    int x = duk_to_int(ctx, 0);
    int y = duk_to_int(ctx, 1);
    int w = duk_to_int(ctx, 2);
    int h = duk_to_int(ctx, 3);
    uint32_t color = (uint32_t)duk_to_uint32(ctx, 4);
    screen_draw_rect(js2000_fb, SCREEN_WIDTH, SCREEN_HEIGHT, x, y, w, h, color);
    return 0;
}

// JS: ScreenDraw.line(x0, y0, x1, y1, color)
static duk_ret_t duk_sd_line(duk_context *ctx) {
    int x0 = duk_to_int(ctx, 0);
    int y0 = duk_to_int(ctx, 1);
    int x1 = duk_to_int(ctx, 2);
    int y1 = duk_to_int(ctx, 3);
    uint32_t color = (uint32_t)duk_to_uint32(ctx, 4);
    screen_draw_line(js2000_fb, SCREEN_WIDTH, SCREEN_HEIGHT, x0, y0, x1, y1, color);
    return 0;
}

// JS: ScreenDraw.imageRaw(buffer, w, h, x, y)
static duk_ret_t duk_sd_image_raw(duk_context *ctx) {
    void *buf = duk_require_buffer_data(ctx, 0, NULL);
    int w = duk_to_int(ctx, 1);
    int h = duk_to_int(ctx, 2);
    int x = duk_to_int(ctx, 3);
    int y = duk_to_int(ctx, 4);
    screen_draw_image(js2000_fb, SCREEN_WIDTH, SCREEN_HEIGHT, x, y, (const uint32_t*)buf, w, h);
    return 0;
}

// JS: ScreenDraw.getFramebuffer() -> Uint32Array
static duk_ret_t duk_sd_get_framebuffer(duk_context *ctx) {
    void *buf = duk_push_fixed_buffer(ctx, SCREEN_WIDTH * SCREEN_HEIGHT * 4);
    screen_draw_copy_framebuffer(js2000_fb, SCREEN_WIDTH, SCREEN_HEIGHT, buf);
    duk_push_buffer_object(ctx, -1, 0, SCREEN_WIDTH * SCREEN_HEIGHT * 4, DUK_BUFOBJ_UINT32ARRAY);
    return 1;
}

// JS: ScreenDraw.clear(color)
static duk_ret_t duk_sd_clear(duk_context *ctx) {
    uint32_t color = (uint32_t)duk_to_uint32(ctx, 0);
    screen_draw_fill_rect(js2000_fb, SCREEN_WIDTH, SCREEN_HEIGHT, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, color);
    return 0;
}

// JS: ScreenDraw.printToScreen(msg)
static duk_ret_t duk_sd_print_to_screen(duk_context *ctx) {
    // For now, just draw the string at (2,2) using 5x8 font, white color
    const char *msg = duk_to_string(ctx, 0);
    screen_draw_text_5x8(js2000_fb, SCREEN_WIDTH, SCREEN_HEIGHT, 2, 2, msg, 0xFFFFFFFF);
    return 0;
}

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
        screen_draw_text_5x8(js2000_fb, SCREEN_WIDTH, SCREEN_HEIGHT, 2, 2 + i*line_height, print_screen_lines[first + i], 0xFFFFFFFF);
    }
}

// Expose to JS: printToScreen(msg)
static duk_ret_t duk_print_to_screen(duk_context *ctx) {
    const char *msg = duk_safe_to_string(ctx, 0);
    print_screen_add_line(msg);
    print_screen_render();
    return 0;
}

// Deprecated JS drawing functions for backward compatibility
void register_deprecated_draw_functions(duk_context *ctx) {
    // Alias: drawText8x8 = ScreenDraw.text8x8
    duk_get_global_string(ctx, "ScreenDraw");
    duk_get_prop_string(ctx, -1, "text8x8");
    duk_put_global_string(ctx, "drawText8x8");
    duk_pop(ctx); // Balance the stack after using ScreenDraw
    // Alias: drawText5x8 = ScreenDraw.text5x8
    duk_get_global_string(ctx, "ScreenDraw");
    duk_get_prop_string(ctx, -1, "text5x8");
    duk_put_global_string(ctx, "drawText5x8");
    duk_pop(ctx); // Balance the stack after using ScreenDraw
    // Alias: clearScreen = ScreenDraw.clear
    duk_get_global_string(ctx, "ScreenDraw");
    duk_get_prop_string(ctx, -1, "clear");
    duk_put_global_string(ctx, "clearScreen");
    duk_pop(ctx); // Balance the stack after using ScreenDraw
}

// Duktape function list for ScreenDraw module
static const duk_function_list_entry screendraw_function_list[] = {
    { "text8x8", duk_sd_text_8x8, 4 },
    { "text5x8", duk_sd_text_5x8, 4 },
    { "fillRect", duk_sd_fill_rect, 5 },
    { "rect", duk_sd_rect, 5 },
    { "line", duk_sd_line, 5 },
    { "imageRaw", duk_sd_image_raw, 5 },
    { "getFramebuffer", duk_sd_get_framebuffer, 0 },
    { "clear", duk_sd_clear, 1 },
    { "printToScreen", duk_sd_print_to_screen, 1 },
    { NULL, NULL, 0 }
};

void register_screen_draw_module(duk_context *ctx) {
    duk_push_object(ctx);
    duk_put_function_list(ctx, -1, screendraw_function_list);
    duk_put_global_string(ctx, "ScreenDraw");

    // Register printToScreen(msg)
    duk_push_c_function(ctx, duk_print_to_screen, 1);
    duk_put_global_string(ctx, "printToScreen");
    
    register_deprecated_draw_functions(ctx);
}
