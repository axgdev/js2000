# Makefile for js2000 libretro core

TARGET_NAME := js2000

SOURCES_C := src/js2000.c src/js2000_bindings.c src/filesystem.c src/filesystem_bindings.c src/screen_draw.c src/screen_draw_bindings.c src/font8x8.c src/font5x8.c duktape/duktape.c

BUILD_DIR := build

CFLAGS :=
LDFLAGS :=

# Add path to libretro.h, dirent.h, and debug.h
ifeq ($(UNIFIED),1)
DIRENT_DEBUG_PATH := ../../src/
else
DIRENT_DEBUG_PATH := ../../
endif

INCFLAGS := -I../../libs/libretro-common/include -I./duktape -I$(DIRENT_DEBUG_PATH)
CFLAGS += $(INCFLAGS)

OBJECTS := $(addprefix $(BUILD_DIR)/,$(notdir $(SOURCES_C:.c=.o)))

TARGET := js2000.a
MIPS=/opt/mips32-mti-elf/2019.09-03-2/bin/mips-mti-elf-
CC = $(MIPS)gcc
AR = $(MIPS)ar
CFLAGS += -EL -march=mips32 -mtune=mips32 -msoft-float -G0 -mno-abicalls -fno-pic
CFLAGS += -ffast-math -fomit-frame-pointer -ffunction-sections -fdata-sections
CFLAGS += -DSF2000
STATIC_LINKING = 1

all: $(TARGET)

$(BUILD_DIR):
	@mkdir -p $@

ifeq ($(STATIC_LINKING), 1)
$(TARGET): $(BUILD_DIR) $(OBJECTS)
	$(AR) rcs $@ $(OBJECTS)
else
$(TARGET): $(BUILD_DIR) $(OBJECTS)
	$(CC) -o $@ $(OBJECTS) $(LDFLAGS)
endif

$(BUILD_DIR)/%.o: src/%.c | $(BUILD_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILD_DIR)/%.o: duktape/%.c | $(BUILD_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -rf $(BUILD_DIR) js2000.a

.PHONY: clean all
