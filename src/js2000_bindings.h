#ifndef JS2000_BINDINGS_H
#define JS2000_BINDINGS_H

#include "duktape.h"

// Register all JS bindings to the given Duktape context
void js2000_register_bindings(duk_context *ctx);

#endif // JS2000_BINDINGS_H
