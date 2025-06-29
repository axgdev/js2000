#ifndef FONT_RENDER_H
#define FONT_RENDER_H
#include <stdint.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

// Draw text using 8x8 font
void font_render_draw_text_8x8(uint32_t *fb, int fb_width, int fb_height, int x, int y, const char *text, uint32_t color);

// Draw text using 5x8 font
void font_render_draw_text_5x8(uint32_t *fb, int fb_width, int fb_height, int x, int y, const char *text, uint32_t color);

// Draw a filled rectangle
void font_render_fill_rect(uint32_t *fb, int fb_width, int fb_height, int x, int y, int w, int h, uint32_t color);
// Draw a rectangle outline
void font_render_draw_rect(uint32_t *fb, int fb_width, int fb_height, int x, int y, int w, int h, uint32_t color);
// Draw a line (Bresenham)
void font_render_draw_line(uint32_t *fb, int fb_width, int fb_height, int x0, int y0, int x1, int y1, uint32_t color);
// Draw a raw 32bpp image (no format conversion)
void font_render_draw_image(uint32_t *fb, int fb_width, int fb_height, int x, int y, const uint32_t *img, int img_w, int img_h);

#ifdef __cplusplus
}
#endif
#endif // FONT_RENDER_H
