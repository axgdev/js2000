#include "font_render.h"
#include <string.h>
#include <stdint.h>
#include "font8x8.h"
#include "font5x8.h"

void font_render_draw_text_8x8(uint32_t *fb, int fb_width, int fb_height, int x, int y, const char *text, uint32_t color) {
    for (const char *p = text; *p; ++p) {
        unsigned char ch = (unsigned char)*p;
        if (ch < 32 || ch > 127) ch = '?';
        const uint8_t *glyph = font8x8_basic[ch - 32];
        for (int row = 0; row < 8; ++row) {
            for (int col = 0; col < 8; ++col) {
                if (glyph[row] & (1 << (7 - col))) {
                    int px = x + col;
                    int py = y + row;
                    if (px >= 0 && px < fb_width && py >= 0 && py < fb_height) {
                        fb[py * fb_width + px] = color | 0xFF000000;
                    }
                }
            }
        }
        x += 8;
    }
}

void font_render_draw_text_5x8(uint32_t *fb, int fb_width, int fb_height, int x, int y, const char *text, uint32_t color) {
    for (const char *p = text; *p; ++p) {
        unsigned char ch = (unsigned char)*p;
        if (ch < 32 || ch > 127) ch = '?';
        const uint8_t *glyph = font5x8_basic[ch - 32];
        for (int col = 0; col < 5; ++col) {
            uint8_t bits = glyph[col];
            for (int row = 0; row < 8; ++row) {
                if (bits & (1 << row)) {
                    int px = x + col;
                    int py = y + row;
                    if (px >= 0 && px < fb_width && py >= 0 && py < fb_height) {
                        fb[py * fb_width + px] = color | 0xFF000000;
                    }
                }
            }
        }
        x += 6; // 5px width + 1px spacing
    }
}
