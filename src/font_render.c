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

// Draw a filled rectangle
void font_render_fill_rect(uint32_t *fb, int fb_width, int fb_height, int x, int y, int w, int h, uint32_t color) {
    for (int py = y; py < y + h; ++py) {
        if (py < 0 || py >= fb_height) continue;
        for (int px = x; px < x + w; ++px) {
            if (px < 0 || px >= fb_width) continue;
            fb[py * fb_width + px] = color | 0xFF000000;
        }
    }
}

// Draw a rectangle outline
void font_render_draw_rect(uint32_t *fb, int fb_width, int fb_height, int x, int y, int w, int h, uint32_t color) {
    for (int i = 0; i < w; ++i) {
        int px = x + i;
        if (px >= 0 && px < fb_width) {
            if (y >= 0 && y < fb_height) fb[y * fb_width + px] = color | 0xFF000000;
            if ((y + h - 1) >= 0 && (y + h - 1) < fb_height) fb[(y + h - 1) * fb_width + px] = color | 0xFF000000;
        }
    }
    for (int i = 0; i < h; ++i) {
        int py = y + i;
        if (py >= 0 && py < fb_height) {
            if (x >= 0 && x < fb_width) fb[py * fb_width + x] = color | 0xFF000000;
            if ((x + w - 1) >= 0 && (x + w - 1) < fb_width) fb[py * fb_width + (x + w - 1)] = color | 0xFF000000;
        }
    }
}

// Draw a line (Bresenham's algorithm)
void font_render_draw_line(uint32_t *fb, int fb_width, int fb_height, int x0, int y0, int x1, int y1, uint32_t color) {
    int dx = abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    int dy = -abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    int err = dx + dy, e2;
    while (1) {
        if (x0 >= 0 && x0 < fb_width && y0 >= 0 && y0 < fb_height)
            fb[y0 * fb_width + x0] = color | 0xFF000000;
        if (x0 == x1 && y0 == y1) break;
        e2 = 2 * err;
        if (e2 >= dy) { err += dy; x0 += sx; }
        if (e2 <= dx) { err += dx; y0 += sy; }
    }
}

// Draw a raw 32bpp image (no format conversion)
void font_render_draw_image(uint32_t *fb, int fb_width, int fb_height, int x, int y, const uint32_t *img, int img_w, int img_h) {
    for (int iy = 0; iy < img_h; ++iy) {
        int py = y + iy;
        if (py < 0 || py >= fb_height) continue;
        for (int ix = 0; ix < img_w; ++ix) {
            int px = x + ix;
            if (px < 0 || px >= fb_width) continue;
            fb[py * fb_width + px] = img[iy * img_w + ix];
        }
    }
}
