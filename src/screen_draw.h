#ifndef SCREEN_DRAW_H
#define SCREEN_DRAW_H
#include <stdint.h>
#include <stddef.h>
#ifdef __cplusplus
extern "C" {
#endif

void screen_draw_text_8x8(uint32_t *fb, int fb_width, int fb_height, int x, int y, const char *text, uint32_t color);
void screen_draw_text_5x8(uint32_t *fb, int fb_width, int fb_height, int x, int y, const char *text, uint32_t color);
void screen_draw_fill_rect(uint32_t *fb, int fb_width, int fb_height, int x, int y, int w, int h, uint32_t color);
void screen_draw_rect(uint32_t *fb, int fb_width, int fb_height, int x, int y, int w, int h, uint32_t color);
void screen_draw_line(uint32_t *fb, int fb_width, int fb_height, int x0, int y0, int x1, int y1, uint32_t color);
void screen_draw_image(uint32_t *fb, int fb_width, int fb_height, int x, int y, const uint32_t *img, int img_w, int img_h);
void screen_draw_copy_framebuffer(uint32_t *fb, int fb_width, int fb_height, void *out_buf);

#ifdef __cplusplus
}
#endif
#endif // SCREEN_DRAW_H
