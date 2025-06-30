// js2000.c - Libretro core for running JavaScript via Duktape
#include <stdio.h>
#include <string.h>
#include "libretro.h"
#include "duktape.h"
#include "debug.h"
#include "js2000_bindings.h"
#include "js2000.h"

// Framebuffer for text rendering
uint32_t js2000_fb[SCREEN_WIDTH * SCREEN_HEIGHT];

duk_context *ctx = NULL;
int js2000_script_finished = 0;

static retro_environment_t environ_cb;
static retro_video_refresh_t video_cb;
static retro_input_poll_t input_poll_cb;
retro_input_state_t input_state_cb;
static retro_audio_sample_t audio_cb;
static retro_audio_sample_batch_t audio_batch_cb;

void retro_set_environment(retro_environment_t cb) {
    environ_cb = cb;
}

void retro_init(void) {
    ctx = duk_create_heap_default();
    if (ctx) {
        js2000_register_bindings(ctx);
    }
}

void retro_deinit(void) {
    if (ctx) {
        duk_destroy_heap(ctx);
        ctx = NULL;
    }
}

unsigned retro_api_version(void) {
    return RETRO_API_VERSION;
}

void retro_get_system_info(struct retro_system_info *info) {
    memset(info, 0, sizeof(*info));
    info->library_name = "js2000";
    info->library_version = "1.0";
    info->valid_extensions = "js";
    info->need_fullpath = true;
    info->block_extract = false;
}

void retro_get_system_av_info(struct retro_system_av_info *info) {
    info->timing.fps = 60.0;
    info->timing.sample_rate = 44100.0;

    info->geometry.base_width = SCREEN_WIDTH;
    info->geometry.base_height = SCREEN_HEIGHT;
    info->geometry.max_width = SCREEN_WIDTH;
    info->geometry.max_height = SCREEN_HEIGHT;
    info->geometry.aspect_ratio = (float)SCREEN_WIDTH / (float)SCREEN_HEIGHT;
}

void retro_set_video_refresh(retro_video_refresh_t cb) { video_cb = cb; }
void retro_set_audio_sample(retro_audio_sample_t cb) { audio_cb = cb; }
void retro_set_audio_sample_batch(retro_audio_sample_batch_t cb) { audio_batch_cb = cb; }
void retro_set_input_poll(retro_input_poll_t cb) { input_poll_cb = cb;}
void retro_set_input_state(retro_input_state_t cb) { input_state_cb = cb; }

void retro_reset(void) {}

size_t retro_serialize_size(void) { return 0; }
bool retro_serialize(void *data, size_t size) { return false; }
bool retro_unserialize(const void *data, size_t size) { return false; }

void retro_cheat_reset(void) {}
void retro_cheat_set(unsigned index, bool enabled, const char *code) {}

void retro_set_controller_port_device(unsigned port, unsigned device) {}

bool retro_load_game(const struct retro_game_info *info) {
    xlog("retro_load_game: called\n");
    enum retro_pixel_format fmt = RETRO_PIXEL_FORMAT_XRGB8888;
    if (!environ_cb(RETRO_ENVIRONMENT_SET_PIXEL_FORMAT, &fmt)) {
        xlog("retro_load_game: failed to set pixel format\n");
        return false;
    }
    if (!ctx) {
        xlog("retro_load_game: ctx is NULL\n");
        return false;
    }
    if (!info) {
        xlog("retro_load_game: info is NULL\n");
        return false;
    }
    if (!info->path) {
        xlog("retro_load_game: info->path is NULL\n");
        return false;
    }
    // Transform path from /mnt/sda1/ROMS/js/hello to /mnt/sda1/ROMS/js;hello.gba
    char fixed_path[512];
    strncpy(fixed_path, info->path, sizeof(fixed_path)-5); // leave space for .gba and null
    fixed_path[sizeof(fixed_path)-5] = '\0';
    char *last_slash = strrchr(fixed_path, '/');
    if (last_slash) {
        *last_slash = ';';
        strncat(fixed_path, ".gba", sizeof(fixed_path)-strlen(fixed_path)-1);
        xlog("retro_load_game: transformed path to %s\n", fixed_path);
    } else {
        xlog("retro_load_game: could not find '/' in path, using original\n");
        strncpy(fixed_path, info->path, sizeof(fixed_path)-1);
        fixed_path[sizeof(fixed_path)-1] = '\0';
    }
    FILE *f = fopen(fixed_path, "rb");
    if (!f) {
        xlog("retro_load_game: failed to open file %s\n", fixed_path);
        return false;
    }
    fseek(f, 0, SEEK_END);
    long len = ftell(f);
    fseek(f, 0, SEEK_SET);
    xlog("retro_load_game: file size = %ld\n", len);
    char *buf = (char*)malloc(len+1);
    if (!buf) {
        xlog("retro_load_game: malloc failed\n");
        fclose(f);
        return false;
    }
    fread(buf, 1, len, f);
    buf[len] = '\0';
    fclose(f);
    xlog("retro_load_game: file read, evaluating JS\n");
    if (duk_peval_string(ctx, buf) != 0) {
        xlog("Duktape error: %s\n", duk_safe_to_string(ctx, -1));
        free(buf);
        return false;
    }
    xlog("retro_load_game: JS evaluated successfully\n");
    // Check if a main loop is registered
    duk_push_global_stash(ctx);
    int has_mainloop = 0;
    if (duk_get_prop_string(ctx, -1, "__mainLoop")) {
        has_mainloop = duk_is_function(ctx, -1);
    }
    duk_pop_2(ctx); // pop function and stash
    js2000_script_finished = has_mainloop ? 0 : 1;
    free(buf);
    return true;
}

bool retro_load_game_special(unsigned game_type, const struct retro_game_info *info, size_t num_info) { return false; }

void retro_unload_game(void) {
    if (ctx) duk_gc(ctx, 0);
}

unsigned retro_get_region(void) { return RETRO_REGION_NTSC; }
void *retro_get_memory_data(unsigned id) { return NULL; }
size_t retro_get_memory_size(unsigned id) { return 0; }

void retro_run(void) {
    input_poll_cb();
    // Main loop support: call JS main loop if registered
    if (ctx && !js2000_script_finished) {
        duk_push_global_stash(ctx);
        if (duk_get_prop_string(ctx, -1, "__mainLoop")) {
            if (duk_is_function(ctx, -1)) {
                if (duk_pcall(ctx, 0) != 0) {
                    // Log error, mark script as finished
                    xlog("mainLoop error: %s\n", duk_safe_to_string(ctx, -1));
                    js2000_script_finished = 1;
                }
            }
        }
        duk_pop_2(ctx); // pop function and stash
    }
    // Always show framebuffer
    if (video_cb) {
        video_cb(js2000_fb, SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH * sizeof(uint32_t));
    }
}
