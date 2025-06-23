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

#ifdef __cplusplus
}
#endif
#endif // FONT_RENDER_H
