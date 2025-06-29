#ifndef FILESYSTEM_BINDINGS_H
#define FILESYSTEM_BINDINGS_H
#include "duktape.h"
#ifdef __cplusplus
extern "C" {
#endif
void register_filesystem_module(duk_context *ctx);
#ifdef __cplusplus
}
#endif
#endif // FILESYSTEM_BINDINGS_H