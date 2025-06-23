#include "filesystem_bindings.h"
#include "filesystem.h"
#include "duktape.h"
#include "debug.h"
#include "js2000.h"

// C function to append text to a file, exposed to JS
duk_ret_t duk_append_text_file(duk_context *ctx) {
    const char *path = duk_require_string(ctx, 0);
    const char *text = duk_require_string(ctx, 1);
    int res = fs_append_to_file(path, text);
    duk_push_boolean(ctx, res == 0);
    return 1;
}

// C function to rename a file, exposed to JS
duk_ret_t duk_rename_file(duk_context *ctx) {
    const char *oldpath = duk_require_string(ctx, 0);
    const char *newpath = duk_require_string(ctx, 1);
    int res = fs_rename_file(oldpath, newpath);
    duk_push_boolean(ctx, res == 0);
    return 1;
}

// C function to check if a file exists, exposed to JS
duk_ret_t duk_file_exists(duk_context *ctx) {
    const char *path = duk_require_string(ctx, 0);
    int res = fs_file_exists(path);
    duk_push_boolean(ctx, res == 1);
    return 1;
}

// C function to copy a file, exposed to JS
// copyFile(src, dst, overwrite=true)
duk_ret_t duk_copy_file(duk_context *ctx) {
    const char *src = duk_require_string(ctx, 0);
    const char *dst = duk_require_string(ctx, 1);
    int overwrite = duk_get_boolean_default(ctx, 2, 1);
    int res = fs_copy_file(src, dst, overwrite);
    duk_push_boolean(ctx, res == 0);
    return 1;
}

// C function to copy all files in a directory, exposed to JS
// copyDirFiles(srcDir, dstDir, overwrite=true)
duk_ret_t duk_copy_dir_files(duk_context *ctx) {
    const char *src_dir = duk_require_string(ctx, 0);
    const char *dst_dir = duk_require_string(ctx, 1);
    int overwrite = duk_get_boolean_default(ctx, 2, 1);
    int res = fs_copy_dir_files(src_dir, dst_dir, overwrite);
    duk_push_boolean(ctx, res == 0);
    return 1;
}

// C function to copy files matching a pattern in a directory, exposed to JS
// copyDirFilesPattern(srcDir, dstDir, pattern, overwrite=true)
duk_ret_t duk_copy_dir_files_pattern(duk_context *ctx) {
    const char *src_dir = duk_require_string(ctx, 0);
    const char *dst_dir = duk_require_string(ctx, 1);
    const char *pattern = duk_require_string(ctx, 2);
    int overwrite = duk_get_boolean_default(ctx, 3, 1);
    int res = fs_copy_dir_files_pattern(src_dir, dst_dir, pattern, overwrite);
    duk_push_int(ctx, res);
    return 1;
}

// C function to read a file into a buffer, exposed to JS
// FS.readFile(path): returns Uint8Array or null
duk_ret_t duk_read_file(duk_context *ctx) {
    const char *path = duk_require_string(ctx, 0);
    FILE *f = fopen(path, "rb");
    if (!f) { duk_push_null(ctx); return 1; }
    fseek(f, 0, SEEK_END);
    long size = ftell(f);
    fseek(f, 0, SEEK_SET);
    if (size < 0) { fclose(f); duk_push_null(ctx); return 1; }
    void *buf = duk_push_fixed_buffer(ctx, size);
    size_t n = fread(buf, 1, size, f);
    fclose(f);
    if (n != (size_t)size) { duk_pop(ctx); duk_push_null(ctx); return 1; }
    duk_push_buffer_object(ctx, -1, 0, size, DUK_BUFOBJ_UINT8ARRAY);
    return 1;
}

// C function to read a file as a string, exposed to JS
// FS.readTextFile(path): returns string or null
duk_ret_t duk_read_text_file(duk_context *ctx) {
    const char *path = duk_require_string(ctx, 0);
    FILE *f = fopen(path, "rb");
    if (!f) { duk_push_null(ctx); return 1; }
    fseek(f, 0, SEEK_END);
    long size = ftell(f);
    fseek(f, 0, SEEK_SET);
    if (size < 0) { fclose(f); duk_push_null(ctx); return 1; }
    char *buf = (char*)malloc(size + 1);
    if (!buf) { fclose(f); duk_push_null(ctx); return 1; }
    size_t n = fread(buf, 1, size, f);
    fclose(f);
    if (n != (size_t)size) { free(buf); duk_push_null(ctx); return 1; }
    buf[size] = '\0';
    duk_push_string(ctx, buf);
    free(buf);
    return 1;
}

// C function to write a buffer to a file, exposed to JS
duk_ret_t duk_write_file(duk_context *ctx) {
    const char *path = duk_require_string(ctx, 0);
    duk_size_t len;
    void *buf = duk_require_buffer_data(ctx, 1, &len);
    int res = fs_write_file(path, buf, len);
    duk_push_boolean(ctx, res == (int)len);
    return 1;
}

// C function to write a string to a file, exposed to JS
// FS.writeTextFile(path, text): returns true on success
duk_ret_t duk_write_text_file(duk_context *ctx) {
    const char *path = duk_require_string(ctx, 0);
    const char *text = duk_require_string(ctx, 1);
    FILE *f = fopen(path, "wb");
    if (!f) { duk_push_boolean(ctx, 0); return 1; }
    size_t n = fwrite(text, 1, strlen(text), f);
    fclose(f);
    duk_push_boolean(ctx, n == strlen(text));
    return 1;
}

// C function to remove a file, exposed to JS
duk_ret_t duk_remove_file(duk_context *ctx) {
    const char *path = duk_require_string(ctx, 0);
    int res = fs_remove_file(path);
    duk_push_boolean(ctx, res == 0);
    return 1;
}

// C function to make a directory, exposed to JS
duk_ret_t duk_mkdir(duk_context *ctx) {
    const char *path = duk_require_string(ctx, 0);
    int res = fs_mkdir(path);
    duk_push_boolean(ctx, res == 0);
    return 1;
}

// C function to remove a directory, exposed to JS
duk_ret_t duk_rmdir(duk_context *ctx) {
    const char *path = duk_require_string(ctx, 0);
    int res = fs_rmdir(path);
    duk_push_boolean(ctx, res == 0);
    return 1;
}

// C function to get file size, exposed to JS
duk_ret_t duk_file_size(duk_context *ctx) {
    const char *path = duk_require_string(ctx, 0);
    long sz = fs_file_size(path);
    if (sz < 0) { duk_push_null(ctx); } else { duk_push_number(ctx, (duk_double_t)sz); }
    return 1;
}

// C function to move a file, exposed to JS
duk_ret_t duk_move_file(duk_context *ctx) {
    const char *src = duk_require_string(ctx, 0);
    const char *dst = duk_require_string(ctx, 1);
    int res = fs_move_file(src, dst);
    duk_push_boolean(ctx, res == 0);
    return 1;
}

// C function to check if a path is a directory, exposed to JS
duk_ret_t duk_is_dir(duk_context *ctx) {
    const char *path = duk_require_string(ctx, 0);
    int res = fs_is_dir(path);
    duk_push_boolean(ctx, res == 1);
    return 1;
}

// C function to check if a path is a file, exposed to JS
duk_ret_t duk_is_file(duk_context *ctx) {
    const char *path = duk_require_string(ctx, 0);
    int res = fs_is_file(path);
    duk_push_boolean(ctx, res == 1);
    return 1;
}

// C function to touch a file, exposed to JS
duk_ret_t duk_touch_file(duk_context *ctx) {
    const char *path = duk_require_string(ctx, 0);
    int res = fs_touch_file(path);
    duk_push_boolean(ctx, res == 0);
    return 1;
}

// C function to get file modification time, exposed to JS
duk_ret_t duk_get_mod_time(duk_context *ctx) {
    const char *path = duk_require_string(ctx, 0);
    long t = fs_get_mod_time(path);
    if (t < 0) { duk_push_null(ctx); } else { duk_push_number(ctx, (duk_double_t)t); }
    return 1;
}

// C function to list files in a directory, exposed to JS
duk_ret_t duk_list_files(duk_context *ctx) {
    const char *dirpath = duk_require_string(ctx, 0);
    duk_idx_t arr_idx = duk_push_array(ctx);
    char *files[256];
    int n = fs_list_files(dirpath, files, 256);
    if (n > 0) {
        for (int i = 0; i < n; ++i) {
            duk_push_string(ctx, files[i]);
            duk_put_prop_index(ctx, arr_idx, i);
            free(files[i]);
        }
    }
    return 1;
}

// C function to list directories in a directory, exposed to JS
duk_ret_t duk_list_dirs(duk_context *ctx) {
    const char *dirpath = duk_require_string(ctx, 0);
    duk_idx_t arr_idx = duk_push_array(ctx);
    char *dirs[256];
    int n = fs_list_dirs(dirpath, dirs, 256);
    if (n > 0) {
        for (int i = 0; i < n; ++i) {
            duk_push_string(ctx, dirs[i]);
            duk_put_prop_index(ctx, arr_idx, i);
            free(dirs[i]);
        }
    }
    return 1;
}