#ifndef SCREEN_DRAW_BINDINGS_H
#define SCREEN_DRAW_BINDINGS_H
#include "duktape.h"
#ifdef __cplusplus
extern "C" {
#endif
void register_screen_draw_module(duk_context *ctx);
#ifdef __cplusplus
}
#endif
#endif // SCREEN_DRAW_BINDINGS_H
