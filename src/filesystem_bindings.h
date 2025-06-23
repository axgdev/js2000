#ifndef FILESYSTEM_BINDINGS_H
#define FILESYSTEM_BINDINGS_H

#ifdef __cplusplus
extern "C" {
#endif

#include "duktape.h"

duk_ret_t duk_append_text_file(duk_context *ctx);
duk_ret_t duk_rename_file(duk_context *ctx);
duk_ret_t duk_file_exists(duk_context *ctx);
duk_ret_t duk_copy_file(duk_context *ctx);
duk_ret_t duk_copy_dir_files(duk_context *ctx);
duk_ret_t duk_read_file(duk_context *ctx);
duk_ret_t duk_read_text_file(duk_context *ctx);
duk_ret_t duk_write_file(duk_context *ctx);
duk_ret_t duk_write_text_file(duk_context *ctx);
duk_ret_t duk_remove_file(duk_context *ctx);
duk_ret_t duk_mkdir(duk_context *ctx);
duk_ret_t duk_rmdir(duk_context *ctx);
duk_ret_t duk_file_size(duk_context *ctx);
duk_ret_t duk_move_file(duk_context *ctx);
duk_ret_t duk_is_dir(duk_context *ctx);
duk_ret_t duk_is_file(duk_context *ctx);
duk_ret_t duk_touch_file(duk_context *ctx);
duk_ret_t duk_get_mod_time(duk_context *ctx);
duk_ret_t duk_list_files(duk_context *ctx);
duk_ret_t duk_list_dirs(duk_context *ctx);
duk_ret_t duk_copy_dir_files_pattern(duk_context *ctx);

#ifdef __cplusplus
}
#endif

#endif // FILESYSTEM_BINDINGS_H