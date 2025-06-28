#ifndef FILESYSTEM_H
#define FILESYSTEM_H

#include <stddef.h>

// Reads a file into buffer. Returns number of bytes read, or -1 on error.
int fs_read_file(const char *path, void *buffer, size_t maxlen);

// Writes buffer to file. Returns number of bytes written, or -1 on error.
int fs_write_file(const char *path, const void *buffer, size_t len);

// Renames a file. Returns 0 on success, -1 on error.
int fs_rename_file(const char *oldpath, const char *newpath);

// Lists files in a directory. Returns number of files, or -1 on error.
// Fills 'files' with up to max_files pointers to file names (caller frees).
int fs_list_files(const char *dirpath, char **files, size_t max_files);

// Removes a file. Returns 0 on success, -1 on error.
int fs_remove_file(const char *path);

// Creates a directory. Returns 0 on success, -1 on error.
int fs_mkdir(const char *path);

// Removes a directory. Returns 0 on success, -1 on error.
int fs_rmdir(const char *path);

// Checks if a file exists. Returns 1 if exists, 0 if not, -1 on error.
int fs_file_exists(const char *path);

// Gets the size of a file. Returns size in bytes, or -1 on error.
long fs_file_size(const char *path);

// Copies a file from src to dst. If overwrite is 0, skip existing files; if 1, overwrite. Returns 0 on success, -1 on error.
int fs_copy_file(const char *src, const char *dst, int overwrite);

// Moves a file from src to dst. Returns 0 on success, -1 on error.
int fs_move_file(const char *src, const char *dst);

// Lists directories in a directory. Returns number of dirs, or -1 on error.
// Fills 'dirs' with up to max_dirs pointers to dir names (caller frees).
int fs_list_dirs(const char *dirpath, char **dirs, size_t max_dirs);

// Copies all files from src_dir to dst_dir. If overwrite is 0, skip existing files; if 1, overwrite.
int fs_copy_dir_files(const char *src_dir, const char *dst_dir, int overwrite);

// Checks if a path is a directory. Returns 1 if dir, 0 if not, -1 on error.
int fs_is_dir(const char *path);

// Checks if a path is a regular file. Returns 1 if file, 0 if not, -1 on error.
int fs_is_file(const char *path);

// Creates an empty file or updates its modification time. Returns 0 on success, -1 on error.
int fs_touch_file(const char *path);

// Gets the last modification time of a file. Returns time (epoch seconds), or -1 on error.
long fs_get_mod_time(const char *path);

// Appends text to a file. Returns 0 on success, -1 on error.
int fs_append_to_file(const char *path, const char *text);

// Recursively copies all files and subdirectories from src_dir to dst_dir using the specified pattern.
// If pattern is NULL, copies all files. If overwrite is 0, skip existing files; if 1, overwrite.
// Returns the number of files copied, or -1 on error.
int fs_copy_dir_files_pattern(const char *src_dir, const char *dst_dir, const char *pattern, int overwrite);

// Counts regular files in a directory. Returns the number of files, or -1 on error.
int fs_list_files_count(const char *dirpath);

// Counts directories in a directory (excluding . and ..). Returns the number of directories, or -1 on error.
int fs_list_dirs_count(const char *dirpath);

#endif // FILESYSTEM_H
