#include "filesystem.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <sys/stat.h>
#include <unistd.h>
#include <errno.h>
#include <time.h>

int fs_read_file(const char *path, void *buffer, size_t maxlen) {
    FILE *f = fopen(path, "rb");
    if (!f) return -1;
    size_t n = fread(buffer, 1, maxlen, f);
    fclose(f);
    return (int)n;
}

int fs_write_file(const char *path, const void *buffer, size_t len) {
    FILE *f = fopen(path, "wb");
    if (!f) return -1;
    size_t n = fwrite(buffer, 1, len, f);
    fclose(f);
    return (int)n;
}

// Appends text to a file. Returns 0 on success, -1 on error.
int fs_append_to_file(const char *path, const char *text) {
    FILE *f = fopen(path, "a");
    if (!f) return -1;
    int res = fputs(text, f);
    fclose(f);
    return (res < 0) ? -1 : 0;
}

int fs_rename_file(const char *oldpath, const char *newpath) {
    return rename(oldpath, newpath);
}

int fs_list_files(const char *dirpath, char **files, size_t max_files) {
    DIR *dir = opendir(dirpath);
    if (!dir) return -1;
    struct dirent *entry;
    size_t count = 0;
    while ((entry = readdir(dir)) && count < max_files) {
        if (entry->d_type == DT_REG) {
            files[count] = strdup(entry->d_name);
            if (!files[count]) break;
            count++;
        }
    }
    closedir(dir);
    return (int)count;
}

int fs_remove_file(const char *path) {
    return remove(path);
}

int fs_mkdir(const char *path) {
    return mkdir(path, 0777);
}

int fs_rmdir(const char *path) {
    return rmdir(path);
}

int fs_file_exists(const char *path) {
    struct stat st;
    if (stat(path, &st) == 0) return 1;
    if (errno == ENOENT) return 0;
    return -1;
}

long fs_file_size(const char *path) {
    struct stat st;
    if (stat(path, &st) == 0) return (long)st.st_size;
    return -1;
}

// Copy file with overwrite option
int fs_copy_file(const char *src, const char *dst, int overwrite) {
    if (!overwrite && fs_file_exists(dst) == 1) return 0;
    FILE *in = fopen(src, "rb");
    if (!in) return -1;
    FILE *out = fopen(dst, "wb");
    if (!out) { fclose(in); return -1; }
    char buf[4096];
    size_t n;
    int ret = 0;
    while ((n = fread(buf, 1, sizeof(buf), in)) > 0) {
        if (fwrite(buf, 1, n, out) != n) { ret = -1; break; }
    }
    fclose(in);
    fclose(out);
    return ret;
}

int fs_is_dir(const char *path) {
    struct stat st;
    if (stat(path, &st) != 0) return -1;
    return S_ISDIR(st.st_mode) ? 1 : 0;
}

int fs_is_file(const char *path) {
    struct stat st;
    if (stat(path, &st) != 0) return -1;
    return S_ISREG(st.st_mode) ? 1 : 0;
}

int fs_touch_file(const char *path) {
    FILE *f = fopen(path, "ab");
    if (!f) return -1;
    fclose(f);
    // utime/utimensat not available in sf2000, just return success after file creation
    return 0;
}

long fs_get_mod_time(const char *path) {
    struct stat st;
    if (stat(path, &st) != 0) return -1;
    return (long)st.st_mtime;
}

int fs_move_file(const char *src, const char *dst) {
    if (rename(src, dst) == 0) return 0;
    // Fallback: copy then remove
    if (fs_copy_file(src, dst, 1) == 0) {
        return fs_remove_file(src);
    }
    return -1;
}

int fs_list_dirs(const char *dirpath, char **dirs, size_t max_dirs) {
    DIR *dir = opendir(dirpath);
    if (!dir) return -1;
    struct dirent *entry;
    size_t count = 0;
    while ((entry = readdir(dir)) && count < max_dirs) {
        if (entry->d_type == DT_DIR && strcmp(entry->d_name, ".") != 0 && strcmp(entry->d_name, "..") != 0) {
            dirs[count] = strdup(entry->d_name);
            if (!dirs[count]) break;
            count++;
        }
    }
    closedir(dir);
    return (int)count;
}

// Recursively copy all files and subdirectories from src_dir to dst_dir. If overwrite is 0, skip existing files; if 1, overwrite.
int fs_copy_dir_files(const char *src_dir, const char *dst_dir, int overwrite) {
    struct stat st;
    if (stat(src_dir, &st) != 0 || !S_ISDIR(st.st_mode)) return -1;
    if (fs_mkdir(dst_dir) != 0 && errno != EEXIST) return -1;
    DIR *dir = opendir(src_dir);
    if (!dir) return -1;
    struct dirent *entry;
    char src_path[512], dst_path[512];
    int result = 0;
    while ((entry = readdir(dir))) {
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0) continue;
        snprintf(src_path, sizeof(src_path), "%s/%s", src_dir, entry->d_name);
        snprintf(dst_path, sizeof(dst_path), "%s/%s", dst_dir, entry->d_name);
        if (stat(src_path, &st) != 0) { result = -1; continue; }
        if (S_ISDIR(st.st_mode)) {
            if (fs_copy_dir_files(src_path, dst_path, overwrite) != 0) result = -1;
        } else if (S_ISREG(st.st_mode)) {
            if (!overwrite && fs_file_exists(dst_path) == 1) continue;
            if (fs_copy_file(src_path, dst_path, overwrite) != 0) result = -1;
        }
    }
    closedir(dir);
    return result;
}

// Minimal fnmatch implementation: supports '*' and '?'
static int mini_fnmatch(const char *pattern, const char *string) {
    while (*pattern) {
        if (*pattern == '*') {
            pattern++;
            if (!*pattern) return 1; // Trailing * matches everything
            while (*string) {
                if (mini_fnmatch(pattern, string)) return 1;
                string++;
            }
            return 0;
        } else if (*pattern == '?') {
            if (!*string) return 0;
            pattern++;
            string++;
        } else {
            if (*pattern != *string) return 0;
            pattern++;
            string++;
        }
    }
    return *string == '\0';
}

// Recursively copy files matching a pattern from src_dir to dst_dir. Returns number of files copied, or -1 on error.
int fs_copy_dir_files_pattern(const char *src_dir, const char *dst_dir, const char *pattern, int overwrite) {
    struct stat st;
    if (stat(src_dir, &st) != 0 || !S_ISDIR(st.st_mode)) return -1;
    if (fs_mkdir(dst_dir) != 0 && errno != EEXIST) return -1;
    DIR *dir = opendir(src_dir);
    if (!dir) return -1;
    struct dirent *entry;
    char src_path[512], dst_path[512];
    int copied = 0;
    while ((entry = readdir(dir))) {
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0) continue;
        snprintf(src_path, sizeof(src_path), "%s/%s", src_dir, entry->d_name);
        snprintf(dst_path, sizeof(dst_path), "%s/%s", dst_dir, entry->d_name);
        if (stat(src_path, &st) != 0) continue;
        if (S_ISDIR(st.st_mode)) {
            int sub = fs_copy_dir_files_pattern(src_path, dst_path, pattern, overwrite);
            if (sub > 0) copied += sub;
        } else if (S_ISREG(st.st_mode)) {
            if (mini_fnmatch(pattern, entry->d_name)) {
                if (!overwrite && fs_file_exists(dst_path) == 1) continue;
                if (fs_copy_file(src_path, dst_path, overwrite) == 0) copied++;
            }
        }
    }
    closedir(dir);
    return copied;
}
