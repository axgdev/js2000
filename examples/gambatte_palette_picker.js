// gambatte_palette_picker.js
// Gambatte/Gameboy Color Palette Picker for Gambatte Core
// Visual palette configuration with real color preview

// Configuration
var BASE_DIR = '/mnt/sda1';
var CONFIG_FILE = BASE_DIR + '/cores/config/gambatte.opt';

// Colors - Clean blue theme
var COLORS = {
    bg_main: 0xFF87CEEB,        // Sky blue background
    bg_darker: 0xFF4682B4,      // Steel blue
    text_title: 0xFF000080,     // Navy blue for titles
    text_main: 0xFF000000,      // Black for main text
    text_success: 0xFF006400,   // Dark green
    text_warning: 0xFFCC0000,   // Dark red
    text_info: 0xFF000080,      // Navy blue
    text_white: 0xFFFFFFFF,     // White
    border: 0xFF4169E1,         // Royal blue
    selected: 0xFFFFD700        // Gold selection
};

// TWB64 Pack 1 Palettes (001-100)
var TWB64_PACK1_PALETTES = [
    "TWB64 001 - Aqours Blue", "TWB64 002 - Anime Expo Ver", "TWB64 003 - Spongebob Yellow",
    "TWB64 004 - Patrick Star Pink", "TWB64 005 - Neon Red", "TWB64 006 - Neon Blue",
    "TWB64 007 - Neon Yellow", "TWB64 008 - Neon Green", "TWB64 009 - Neon Pink",
    "TWB64 010 - Mario Red", "TWB64 011 - Nick Orange", "TWB64 012 - Virtual Vision",
    "TWB64 013 - Golden Wild", "TWB64 014 - DMG-099", "TWB64 015 - Classic Blurple",
    "TWB64 016 - 765 Production Ver.", "TWB64 017 - Superball Ivory", "TWB64 018 - Crunchyroll Orange",
    "TWB64 019 - Muse Pink", "TWB64 020 - School Idol Blue", "TWB64 021 - Gamate Ver.",
    "TWB64 022 - Greenscale Ver.", "TWB64 023 - Odyssey Gold", "TWB64 024 - Super Saiyan God",
    "TWB64 025 - Super Saiyan Blue", "TWB64 026 - ANIMAX BLUE", "TWB64 027 - BMO Ver.",
    "TWB64 028 - Game.com Ver.", "TWB64 029 - Sanrio Pink", "TWB64 030 - Timmy Turner Pink",
    "TWB64 031 - Fairly OddPalette", "TWB64 032 - Danny Phantom Silver", "TWB64 033 - Link's Awakening DX Ver.",
    "TWB64 034 - Travel Wood", "TWB64 035 - Pokemon Ver.", "TWB64 036 - Game Grump Orange",
    "TWB64 037 - Scooby-Doo Mystery Ver.", "TWB64 038 - Pokemon mini Ver.", "TWB64 039 - Supervision Ver.",
    "TWB64 040 - DMG Ver.", "TWB64 041 - Pocket Ver.", "TWB64 042 - Light Ver.",
    "TWB64 043 - All Might Hero Palette", "TWB64 044 - U.A. High School Uniform", "TWB64 045 - Pikachu Yellow",
    "TWB64 046 - Eevee Brown", "TWB64 047 - Microvision Ver.", "TWB64 048 - TI-83 Ver.",
    "TWB64 049 - Aegis Cherry", "TWB64 050 - Hunter Green", "TWB64 051 - Labo Fawn",
    "TWB64 052 - NEKU PURPLE", "TWB64 053 - Yo-kai Pink", "TWB64 054 - Rockman Vision",
    "TWB64 055 - Gyarados Blue", "TWB64 056 - Evangelion Green", "TWB64 057 - Equestrian Pink",
    "TWB64 058 - Bmo Ver.", "TWB64 059 - Inspector Gadget Ver.", "TWB64 060 - Christmas Gold",
    "TWB64 061 - Pepsi Vision", "TWB64 062 - Bubblun Green", "TWB64 063 - Bobblun Blue",
    "TWB64 064 - Baja Blast Storm", "TWB64 065 - Olympic Gold", "TWB64 066 - LisAni Orange!",
    "TWB64 067 - Liella Purple!", "TWB64 068 - Olympic Silver", "TWB64 069 - Olympic Bronze",
    "TWB64 070 - ANA Flight Blue", "TWB64 071 - Nijigasaki Orange", "TWB64 072 - holoblue",
    "TWB64 073 - WWE White and Red", "TWB64 074 - Yoshi Egg Green", "TWB64 075 - Pokedex Red",
    "TWB64 076 - FamilyMart Vision", "TWB64 077 - Camellia Pink", "TWB64 078 - Samsung Blue",
    "TWB64 079 - Gameboy Printer Ver.", "TWB64 080 - Gargoyle Gray Ver.", "TWB64 081 - Mischief GB Ver.",
    "TWB64 082 - Shantae Vision", "TWB64 083 - Skyward Sword Green", "TWB64 084 - Batman Vision",
    "TWB64 085 - Solid Snake Vision", "TWB64 086 - Donkey Kong Ver.", "TWB64 087 - Evangelion Unit-01",
    "TWB64 088 - Stargate Event Horizon", "TWB64 089 - Stargate Milky Way", "TWB64 090 - Star Trek Vision",
    "TWB64 091 - House Stark Wolfe", "TWB64 092 - House Lannister Gold", "TWB64 093 - House Targaryen Red",
    "TWB64 094 - House Tyrell Green", "TWB64 095 - Cerulean Cave Blue", "TWB64 096 - Straw Hat Red",
    "TWB64 097 - Sword Art Cyan", "TWB64 098 - Deku Alpha Emerald", "TWB64 099 - Blue Stripes Ver.",
    "TWB64 100 - Precure Marble Raspberry"
];

// TWB64 Pack 2 Palettes (101-200)
var TWB64_PACK2_PALETTES = [
    "TWB64 101 - 765PRO Pink", "TWB64 102 - CINDERELLA Blue", "TWB64 103 - MILLION Yellow!",
    "TWB64 104 - SideM Green", "TWB64 105 - SHINY Sky Blue", "TWB64 106 - Angry Volcano Ver.",
    "TWB64 107 - NBA Vision", "TWB64 108 - NFL Vision", "TWB64 109 - MLB Vision",
    "TWB64 110 - Anime Digivice Ver.", "TWB64 111 - Aquatic Iro", "TWB64 112 - Tea Midori",
    "TWB64 113 - Sakura Pink", "TWB64 114 - Wisteria Murasaki", "TWB64 115 - Oni Aka",
    "TWB64 116 - Golden Kiiro", "TWB64 117 - Silver Shiro", "TWB64 118 - Fruity Orange",
    "TWB64 119 - AKB48 Pink", "TWB64 120 - Miku Blue", "TWB64 121 - Tri Digivice Ver.",
    "TWB64 122 - Survey Corps Uniform", "TWB64 123 - Island Green", "TWB64 124 - Nogizaka46 Purple",
    "TWB64 125 - Ninja Turtle Green", "TWB64 126 - Slime Blue", "TWB64 127 - Lime Midori",
    "TWB64 128 - Ghostly Aoi", "TWB64 129 - Retro Bogeda", "TWB64 130 - Royal Blue",
    "TWB64 131 - Neon Purple", "TWB64 132 - Neon Orange", "TWB64 133 - Moonlight Vision",
    "TWB64 134 - Rising Sun Red", "TWB64 135 - Burger King Color Combo", "TWB64 136 - Grand Zeno Coat",
    "TWB64 137 - Pac-Man Yellow", "TWB64 138 - Irish Green", "TWB64 139 - Goku Gi",
    "TWB64 140 - Dragon Ball Orange", "TWB64 141 - Christmas Gold", "TWB64 142 - Pepsi Vision",
    "TWB64 143 - Bubblun Green", "TWB64 144 - Bobblun Blue", "TWB64 145 - Baja Blast Storm",
    "TWB64 146 - Olympic Gold", "TWB64 147 - LisAni Orange!", "TWB64 148 - Liella Purple!",
    "TWB64 149 - Olympic Silver", "TWB64 150 - Olympic Bronze", "TWB64 151 - ANA Flight Blue",
    "TWB64 152 - Nijigasaki Orange", "TWB64 153 - holoblue", "TWB64 154 - WWE White and Red",
    "TWB64 155 - Yoshi Egg Green", "TWB64 156 - Pokedex Red", "TWB64 157 - FamilyMart Vision",
    "TWB64 158 - Xbox Green", "TWB64 159 - Sonic Mega Blue", "TWB64 160 - Sprite Green",
    "TWB64 161 - Scarlett Green", "TWB64 162 - Glitchy Blue", "TWB64 163 - Classic LCD",
    "TWB64 164 - 3DS Virtual Console Ver.", "TWB64 165 - PocketStation Ver.", "TWB64 166 - Timeless Gold and Red",
    "TWB64 167 - Smurfy Blue", "TWB64 168 - Swampy Ogre Green", "TWB64 169 - Sailor Spinach Green",
    "TWB64 170 - Shenron Green", "TWB64 171 - Berserk Blood", "TWB64 172 - Super Star Pink",
    "TWB64 173 - Gamebuino Classic Ver.", "TWB64 174 - Barbie Pink", "TWB64 175 - YOASOBI AMARANTH",
    "TWB64 176 - Nokia 3310 Ver.", "TWB64 177 - Clover Green", "TWB64 178 - Goku GT Gi",
    "TWB64 179 - Famicom Disk Yellow", "TWB64 180 - Team Rocket Uniform", "TWB64 181 - SEIKO Timely Vision",
    "TWB64 182 - PASTEL109", "TWB64 183 - Doraemon Tricolor", "TWB64 184 - Fury Destroyer Yellow",
    "TWB64 185 - Optic Scoped Green", "TWB64 186 - Frog Coin Green", "TWB64 187 - Mario Chromatic Ver.",
    "TWB64 188 - Christmas Delight", "TWB64 189 - Pepsi Wild Cherry", "TWB64 190 - Gamebuino META Ver.",
    "TWB64 191 - Steam Dream Gray", "TWB64 192 - Easter Purple", "TWB64 193 - NEON SHERBET",
    "TWB64 194 - FRUITY ORANGE", "TWB64 195 - Legend of Mana Clair", "TWB64 196 - Cornflower Blue",
    "TWB64 197 - Potato Russet", "TWB64 198 - CRUNCHYROLL VISION", "TWB64 199 - Muse Aqua",
    "TWB64 200 - School Idol Pink"
];

// TWB64 Pack 3 Palettes (201-300)
var TWB64_PACK3_PALETTES = [
    "TWB64 201 - DMG-GOLD", "TWB64 202 - LCD Clock Green", "TWB64 203 - Famicom Frenzy",
    "TWB64 204 - DK Arcade Blue", "TWB64 205 - Advanced Indigo", "TWB64 206 - Ultra Black",
    "TWB64 207 - Chaos Emerald Green", "TWB64 208 - Blue Bomber Vision", "TWB64 209 - Krispy Kreme Vision",
    "TWB64 210 - Steam Gray", "TWB64 211 - Dream Land GB Ver.", "TWB64 212 - Pokemon Pinball Ver.",
    "TWB64 213 - Poketch Ver.", "TWB64 214 - COLLECTION of SaGa Ver.", "TWB64 215 - Rocky-Valley Holiday",
    "TWB64 216 - Giga Kiwi DMG", "TWB64 217 - DMG Pea Green", "TWB64 218 - Timing Hero Ver.",
    "TWB64 219 - Invincible Yellow and Blue", "TWB64 220 - Grinchy Green", "TWB64 221 - animate vision",
    "TWB64 222 - School Idol Mix", "TWB64 223 - Green Awakening", "TWB64 224 - Goomba Brown",
    "TWB64 225 - WarioWare MicroBlue", "TWB64 226 - KonoSuba Sherbet", "TWB64 227 - Spooky Purple",
    "TWB64 228 - Treasure Gold", "TWB64 229 - Cherry Blossom Pink", "TWB64 230 - Golden Trophy",
    "TWB64 231 - Glacial Winter Blue", "TWB64 232 - Leprechaun Green", "TWB64 233 - SAITAMA SUPER BLUE",
    "TWB64 234 - SAITAMA SUPER GREEN", "TWB64 235 - Duolingo Green", "TWB64 236 - Super Mushroom Vision",
    "TWB64 237 - Ancient Hisuian Brown", "TWB64 238 - Sky Pop Ivory", "TWB64 239 - LAWSON BLUE",
    "TWB64 240 - Anime Expo Red", "TWB64 241 - Brilliant Diamond Blue", "TWB64 242 - Shining Pearl Pink",
    "TWB64 243 - Funimation Melon", "TWB64 244 - Teyvat Brown", "TWB64 245 - Chozo Blue",
    "TWB64 246 - Spotify Green", "TWB64 247 - Dr Pepper Red", "TWB64 248 - NHK Silver Gray",
    "TWB64 249 - Dunkin' Vision", "TWB64 250 - Deku Gamma Palette", "TWB64 251 - Universal Studios Blue",
    "TWB64 252 - Hogwarts Goldius", "TWB64 253 - Kentucky Fried Red", "TWB64 254 - Cheeto Orange",
    "TWB64 255 - Namco Idol Pink", "TWB64 256 - Domino's Pizza Vision", "TWB64 257 - Pac-Man Vision",
    "TWB64 258 - Bill's PC Screen", "TWB64 259 - Sonic Mega Blue", "TWB64 260 - Fool's Gold and Silver",
    "TWB64 261 - UTA VISION", "TWB64 262 - Metallic Paldea Brass", "TWB64 263 - Classy Christmas",
    "TWB64 264 - Winter Christmas", "TWB64 265 - IDOL WORLD TRICOLOR!!!", "TWB64 266 - Inkling Tricolor",
    "TWB64 267 - 7-Eleven Color Combo", "TWB64 268 - PAC-PALETTE", "TWB64 269 - Vulnerable Blue",
    "TWB64 270 - Nightvision Green", "TWB64 271 - Bandai Namco Tricolor", "TWB64 272 - Gold, Silver, and Bronze",
    "TWB64 273 - Deku Vigilante Palette", "TWB64 274 - Super Famicom Supreme", "TWB64 275 - Absorbent and Yellow",
    "TWB64 276 - 765PRO TRICOLOR", "TWB64 277 - GameCube Glimmer", "TWB64 278 - 1st Vision Pastel",
    "TWB64 279 - Perfect Majin Emperor", "TWB64 280 - J-Pop Idol Sherbet", "TWB64 281 - Ryuuguu Sunset",
    "TWB64 282 - Tropical Starfall", "TWB64 283 - Colorful Horizons", "TWB64 284 - BLACKPINK BLINK PINK",
    "TWB64 285 - DMG-SWITCH", "TWB64 286 - POCKET SWITCH", "TWB64 287 - Sunny Passion Paradise",
    "TWB64 288 - Saiyan Beast Silver", "TWB64 289 - RADIANT SMILE RAMP", "TWB64 290 - A-RISE BLUE",
    "TWB64 291 - TROPICAL TWICE APRICOT", "TWB64 292 - Odyssey Boy", "TWB64 293 - Frog Coin Green",
    "TWB64 294 - Garfield Vision", "TWB64 295 - Bedrock Caveman Vision", "TWB64 296 - BANGTAN ARMY PURPLE",
    "TWB64 297 - LE SSERAFIM FEARLESS BLUE", "TWB64 298 - Baja Blast Beach", "TWB64 299 - 3DS Virtual Console Green",
    "TWB64 300 - Wonder Purple"
];

// Complete TWB64 and classic Game Boy palette color data extracted from gbcpalettes.h
var PALETTE_COLORS = {
    "TWB64 001 - Aqours Blue": [0x00A0E9, 0x0080BA, 0x005074, 0x003045],
    "TWB64 002 - Anime Expo Ver": [0xE5EAEB, 0x9BA3A6, 0x656E72, 0x242A2D],
    "TWB64 003 - Spongebob Yellow": [0xF7E948, 0xC5BA39, 0x7B7424, 0x4A4515],
    "TWB64 004 - Patrick Star Pink": [0xFF808B, 0xCC666F, 0x7F4045, 0x4C2629],
    "TWB64 005 - Neon Red": [0xFF3C28, 0xCC3020, 0x7F1E14, 0x4C120C],
    "TWB64 006 - Neon Blue": [0x0AB9E6, 0x0894B8, 0x055C73, 0x033745],
    "TWB64 007 - Neon Yellow": [0xE6FF00, 0xB8CC00, 0x737F00, 0x454C00],
    "TWB64 008 - Neon Green": [0x1EDC00, 0x18B000, 0x0F6E00, 0x094200],
    "TWB64 009 - Neon Pink": [0xFF3278, 0xCC2860, 0x7F193C, 0x4C0F24],
    "TWB64 010 - Mario Red": [0xE10F00, 0xB40C00, 0x700700, 0x430400],
    "TWB64 011 - Nick Orange": [0xFF6700, 0xCC5200, 0x7F3300, 0x4C1E00],
    "TWB64 012 - Virtual Vision": [0x4C0000, 0x7F0000, 0xCC0000, 0xFF0000],
    "TWB64 013 - Golden Wild": [0xB99F65, 0x947F50, 0x5C4F32, 0x372F1E],
    "TWB64 014 - DMG-099": [0x84B510, 0x6BAD19, 0x3F642F, 0x313231],
    "TWB64 015 - Classic Blurple": [0x7289DA, 0x5B6DAE, 0x38446D, 0x222941],
    "TWB64 016 - 765 Production Ver.": [0xBBC4E4, 0x959CB6, 0x5D6272, 0x383A44],
    "TWB64 017 - Superball Ivory": [0xEEF0BC, 0xBCBC8A, 0x828250, 0x646432],
    "TWB64 018 - Crunchyroll Orange": [0xF47522, 0xC35D1B, 0x7A3A11, 0x49230A],
    "TWB64 019 - Muse Pink": [0xE4007F, 0xB60065, 0x72003F, 0x440026],
    "TWB64 020 - School Idol Blue": [0xF9F9F8, 0x87ADF5, 0x3960D7, 0x283066],
    "TWB64 021 - Gamate Ver.": [0x6BA64A, 0x437A63, 0x255955, 0x12424C],
    "TWB64 022 - Greenscale Ver.": [0x9CBE0C, 0x6E870A, 0x2C6234, 0x0C360C],
    "TWB64 023 - Odyssey Gold": [0xC2A000, 0x9B8000, 0x615000, 0x3A3000],
    "TWB64 024 - Super Saiyan God": [0xD70362, 0xAC024E, 0x6B0131, 0x40001D],
    "TWB64 025 - Super Saiyan Blue": [0x05BCCC, 0x0496A3, 0x025D66, 0x01383D],
    "TWB64 026 - ANIMAX BLUE": [0x3499E8, 0x297AB9, 0x1A4C74, 0x0F2D45],
    "TWB64 027 - BMO Ver.": [0xC0FFCC, 0x99CCA3, 0x607F66, 0x394C3D],
    "TWB64 028 - Game.com Ver.": [0xA7BF6B, 0x6F8F4F, 0x0F4F2F, 0x000000],
    "TWB64 029 - Sanrio Pink": [0xF9C2D0, 0xF485A1, 0xE74B5A, 0x83534D],
    "TWB64 030 - Timmy Turner Pink": [0xBC486D, 0x963957, 0x5E2436, 0x381520],
    "TWB64 031 - Fairly OddPalette": [0x7BB850, 0xCE5A99, 0x7B365B, 0x3D1B2D],
    "TWB64 032 - Danny Phantom Silver": [0xABBBCC, 0x8895A3, 0x555D66, 0x33383D],
    "TWB64 033 - Link's Awakening DX Ver.": [0xF8F8B0, 0x78C078, 0x688840, 0x583820],
    "TWB64 034 - Travel Wood": [0xF8D8B0, 0xA08058, 0x705030, 0x482810],
    "TWB64 035 - Pokemon Ver.": [0xF8E8F8, 0xF0B088, 0x807098, 0x181010],
    "TWB64 036 - Game Grump Orange": [0xE9762F, 0xBA5E25, 0x743B17, 0x45230E],
    "TWB64 037 - Scooby-Doo Mystery Ver.": [0xC6DE31, 0xF79321, 0x8F59A5, 0x2A1A31],
    "TWB64 038 - Pokemon mini Ver.": [0xA5BEA5, 0x849884, 0x525F52, 0x313931],
    "TWB64 039 - Supervision Ver.": [0x7CC67C, 0x54A68C, 0x2C6264, 0x0C322C],
    "TWB64 040 - DMG Ver.": [0x7F860F, 0x577C44, 0x365D48, 0x2A453B],
    "TWB64 041 - Pocket Ver.": [0xC4CFA1, 0x8B956D, 0x4D533C, 0x1F1F1F],
    "TWB64 042 - Light Ver.": [0x00B581, 0x009A71, 0x00694A, 0x004F3B],
    "TWB64 043 - All Might Hero Palette": [0xEFF0F0, 0xF3DB43, 0xD12021, 0x212F79],
    "TWB64 044 - U.A. High School Uniform": [0xEDEDED, 0xA4AAAF, 0xA02929, 0x0C4856],
    "TWB64 045 - Pikachu Yellow": [0xFFDC00, 0xCCB000, 0x7F6E00, 0x4C4200],
    "TWB64 046 - Eevee Brown": [0xC88D32, 0xA07028, 0x644619, 0x3C2A0F],
    "TWB64 047 - Microvision Ver.": [0xA0A0A0, 0x808080, 0x505050, 0x303030],
    "TWB64 048 - TI-83 Ver.": [0x9CAA8C, 0x7C8870, 0x4E5546, 0x2E332A],
    "TWB64 049 - Aegis Cherry": [0xDD3B64, 0xB02F50, 0x6E1D32, 0x42111E],
    "TWB64 050 - Labo Fawn": [0xD7AA73, 0xAC885C, 0x6B5539, 0x403322],
    "TWB64 051 - MILLION LIVE GOLD!": [0xCDB261, 0xA48E4D, 0x665930, 0x3D351D],
    "TWB64 052 - Squidward Sea Foam Green": [0xB9D7CD, 0x94ACA4, 0x5C6B66, 0x37403D],
    "TWB64 053 - VMU Ver.": [0x88CCA8, 0x6CA386, 0x446654, 0x081480],
    "TWB64 054 - Game Master Ver.": [0x829FA6, 0x687F84, 0x414F53, 0x272F31],
    "TWB64 055 - Android Green": [0x3DDC84, 0x30B069, 0x1E6E42, 0x124227],
    "TWB64 056 - Amazon Vision": [0xFFFFFF, 0xFF9900, 0x008296, 0x252F3E],
    "TWB64 057 - Google Red": [0xEA4335, 0xBB352A, 0x75211A, 0x46140F],
    "TWB64 058 - Google Blue": [0x4285F4, 0x346AC3, 0x21427A, 0x132749],
    "TWB64 059 - Google Yellow": [0xFBBC05, 0xC89604, 0x7D5E02, 0x4B3801],
    "TWB64 060 - Google Green": [0x34A853, 0x298642, 0x1A5429, 0x0F3218],
    "TWB64 061 - WonderSwan Ver.": [0xFEFEFE, 0xC2C2C2, 0x686868, 0x1D1D1D],
    "TWB64 062 - Neo Geo Pocket Ver.": [0xF0F0F0, 0xB0B0B0, 0x707070, 0x101010],
    "TWB64 063 - Dew Green": [0x97D700, 0x78AC00, 0x4B6B00, 0x2D4000],
    "TWB64 064 - Coca-Cola Vision": [0xFFFFFF, 0xD7D7D7, 0xF40009, 0x000000],
    "TWB64 065 - GameKing Ver.": [0x8CCE94, 0x6B9C63, 0x405D3B, 0x184421],
    "TWB64 066 - Do The Dew Ver.": [0xFFFFFF, 0xA1D23F, 0xD82A34, 0x29673C],
    "TWB64 067 - Digivice Ver.": [0x8C8C73, 0x70705C, 0x464639, 0x2A2A22],
    "TWB64 068 - Bikini Bottom Ver.": [0xF8F880, 0x48F8E0, 0x2098F0, 0x606000],
    "TWB64 069 - Blossom Pink": [0xF59BB2, 0xC47C8E, 0x7A4D59, 0x492E35],
    "TWB64 070 - Bubbles Blue": [0x64C4E9, 0x509CBA, 0x326274, 0x1E3A45],
    "TWB64 071 - Buttercup Green": [0xBEDC8D, 0x98B070, 0x5F6E46, 0x39422A],
    "TWB64 072 - NASCAR Ver.": [0xFFD659, 0xE4002B, 0x007AC2, 0x000000],
    "TWB64 073 - Lemon-Lime Green": [0xF1C545, 0x51A631, 0x30631D, 0x18310E],
    "TWB64 074 - Mega Man V Ver.": [0xD0D0D0, 0x70A0E0, 0x406890, 0x082030],
    "TWB64 075 - Tamagotchi Ver.": [0xF1F0F9, 0xC0C0C7, 0x78787C, 0x3C3838],
    "TWB64 076 - Phantom Red": [0xFD2639, 0xCA1E2D, 0x7E131C, 0x4B0B11],
    "TWB64 077 - Halloween Ver.": [0xFFCC00, 0xF68C00, 0x9540A5, 0x2C1331],
    "TWB64 078 - Christmas Ver.": [0xCBB96A, 0x20A465, 0xA03232, 0x300F0F],
    "TWB64 079 - Cardcaptor Pink": [0xF2F4F7, 0xEAC3D6, 0xE10E82, 0x430427],
    "TWB64 080 - Pretty Guardian Gold": [0xB4AA82, 0x908868, 0x5A5541, 0x363327],
    "TWB64 081 - Camouflage Ver.": [0xBCAB90, 0xAC7E54, 0x79533D, 0x373538],
    "TWB64 082 - Legendary Super Saiyan": [0xA6DA5B, 0x84AE48, 0x536D2D, 0x31411B],
    "TWB64 083 - Super Saiyan Rose": [0xF7AFB3, 0xC58C8F, 0x7B5759, 0x4A3435],
    "TWB64 084 - Super Saiyan": [0xFEFCC1, 0xCBC99A, 0x7F7E60, 0x4C4B39],
    "TWB64 085 - Perfected Ultra Instinct": [0xC0C8D8, 0x99A0AC, 0x60646C, 0x393C40],
    "TWB64 086 - Saint Snow Red": [0xBF3936, 0x982D2B, 0x5F1C1B, 0x391110],
    "TWB64 087 - Yellow Banana": [0xFFDF08, 0xDE9E00, 0xAD6939, 0x734900],
    "TWB64 088 - Green Banana": [0x63DF08, 0x4A9E00, 0x396939, 0x214900],
    "TWB64 089 - Super Saiyan 3": [0xF8C838, 0xC6A02C, 0x7C641C, 0x4A3C10],
    "TWB64 090 - Super Saiyan Blue Evolved": [0x1B97D1, 0x1578A7, 0x0D4B68, 0x082D3E],
    "TWB64 091 - Pocket Tales Ver.": [0xD0D860, 0x88A000, 0x385000, 0x000000],
    "TWB64 092 - Investigation Yellow": [0xFFF919, 0xCCC714, 0x7F7C0C, 0x4C4A07],
    "TWB64 093 - S.E.E.S. Blue": [0x19D1FF, 0x14A7CC, 0x0C687F, 0x073E4C],
    "TWB64 094 - Ultra Instinct Sign": [0x5A686F, 0x485358, 0x2D3437, 0x1B1F21],
    "TWB64 095 - Hokage Orange": [0xEA8352, 0xBB6841, 0x754129, 0x462718],
    "TWB64 096 - Straw Hat Red": [0xF8523C, 0xC64130, 0x7C291E, 0x4A1812],
    "TWB64 097 - Sword Art Cyan": [0x59C3E2, 0x479CB4, 0x2C6171, 0x1A3A43],
    "TWB64 098 - Deku Alpha Emerald": [0x39AD9E, 0x2D8A7E, 0x1C564F, 0x11332F],
    "TWB64 099 - Blue Stripes Ver.": [0x8BD3E1, 0x999B9C, 0x5B5D5D, 0x2D2E2E],
    "TWB64 100 - Precure Marble Raspberry": [0xD6225C, 0xAB1B49, 0x6B112E, 0x400A1B],
    "TWB64 101 - 765PRO Pink": [0xF34F6D, 0xC23F57, 0x792736, 0x481720],
    "TWB64 102 - CINDERELLA Blue": [0x2681C8, 0x1E67A0, 0x134064, 0x0B263C],
    "TWB64 103 - MILLION Yellow!": [0xFFC30B, 0xCC9C08, 0x7F6105, 0x4C3A03],
    "TWB64 104 - SideM Green": [0x0FBE94, 0x0C9876, 0x075F4A, 0x04392C],
    "TWB64 105 - SHINY Sky Blue": [0x8DBBFF, 0x7095CC, 0x465D7F, 0x2A384C],
    "TWB64 106 - Angry Volcano Ver.": [0xF8B800, 0xF83800, 0xA81000, 0x1C0000],
    "TWB64 107 - NBA Vision": [0xFFFFFF, 0xC8102E, 0x253B73, 0x000000],
    "TWB64 108 - NFL Vision": [0xFFFFFF, 0xD50A0A, 0x013369, 0x000000],
    "TWB64 109 - MLB Vision": [0xFFFFFF, 0x057AFF, 0xBF0D3E, 0x041E42],
    "TWB64 110 - Anime Digivice Ver.": [0x5B7B63, 0x48624F, 0x2D3D31, 0x1B241D],
    "TWB64 111 - Aquatic Iro": [0xA0D8EF, 0x2CA9E1, 0x3E62AD, 0x192F60],
    "TWB64 112 - Tea Midori": [0xD6E9CA, 0x88CB7F, 0x028760, 0x333631],
    "TWB64 113 - Sakura Pink": [0xFDEFF2, 0xEEBBCB, 0xE7609E, 0xA25768],
    "TWB64 114 - Wisteria Murasaki": [0xDBD0E6, 0xA59ACA, 0x7058A3, 0x2E2930],
    "TWB64 115 - Oni Aka": [0xEC6D71, 0xD9333F, 0xA22041, 0x640125],
    "TWB64 116 - Golden Kiiro": [0xF8E58C, 0xDCCB18, 0xA69425, 0x6A5D21],
    "TWB64 117 - Silver Shiro": [0xDCDDDD, 0xAFAFB0, 0x727171, 0x383C3C],
    "TWB64 118 - Fruity Orange": [0xF3BF88, 0xF08300, 0x9F563A, 0x241A08],
    "TWB64 119 - AKB48 Pink": [0xF676A6, 0xC45E84, 0x7B3B53, 0x492331],
    "TWB64 120 - Miku Blue": [0x11ADD5, 0x0D8AAA, 0x08566A, 0x05333F],
    "TWB64 121 - Tri Digivice Ver.": [0x848F79, 0x697260, 0x42473C, 0x272A24],
    "TWB64 122 - Survey Corps Uniform": [0xACABA9, 0xAC7C59, 0x593D34, 0x321D1A],
    "TWB64 123 - Island Green": [0x009B7E, 0x007C64, 0x004D3F, 0x002E25],
    "TWB64 124 - Nogizaka46 Purple": [0x812990, 0x672073, 0x401448, 0x260C2B],
    "TWB64 125 - Ninja Turtle Green": [0x86BC25, 0x6B961D, 0x435E12, 0x28380B],
    "TWB64 126 - Slime Blue": [0x2F8CCC, 0x2570A3, 0x174666, 0x0E2A3D],
    "TWB64 127 - Lime Midori": [0xE0EBAF, 0xAACF53, 0x7B8D42, 0x475950],
    "TWB64 128 - Ghostly Aoi": [0x84A2D4, 0x5A79BA, 0x19448E, 0x0F2350],
    "TWB64 129 - Retro Bogeda": [0xFBFD1B, 0xFF6CFF, 0x6408FF, 0x000000],
    "TWB64 130 - Royal Blue": [0x4655F5, 0x3844C4, 0x232A7A, 0x151949],
    "TWB64 131 - Neon Purple": [0xB400E6, 0x9000B8, 0x5A0073, 0x360045],
    "TWB64 132 - Neon Orange": [0xFAA005, 0xC88004, 0x7D5002, 0x4B3001],
    "TWB64 133 - Moonlight Vision": [0xF8D868, 0x3890E8, 0x305078, 0x101010],
    "TWB64 134 - Rising Sun Red": [0xBC002D, 0x960024, 0x5D0016, 0x38000D],
    "TWB64 135 - Burger King Color Combo": [0xF5EBDC, 0xFF8732, 0xD62300, 0x502314],
    "TWB64 136 - Grand Zeno Coat": [0xFBFBFA, 0xFCE72D, 0xCE26A9, 0x3D0B32],
    "TWB64 137 - Pac-Man Yellow": [0xFFE300, 0xCCB500, 0x7F7100, 0x4C4400],
    "TWB64 138 - Irish Green": [0x45BE76, 0x37985E, 0x225F3B, 0x143923],
    "TWB64 139 - Goku Gi": [0xF9F0E1, 0xE7612C, 0x173F72, 0x061222],
    "TWB64 140 - Dragon Ball Orange": [0xF0831D, 0xC06817, 0x78410E, 0x482708],
    "TWB64 141 - Christmas Gold": [0xC0A94B, 0x99873C, 0x605425, 0x393216],
    "TWB64 142 - Pepsi Vision": [0xFFFFFF, 0xFF1400, 0x1414C8, 0x000000],
    "TWB64 143 - Bubblun Green": [0x6ADC31, 0x54B027, 0x356E18, 0x1F420E],
    "TWB64 144 - Bobblun Blue": [0x1FD1FD, 0x18A7CA, 0x0F687E, 0x093E4B],
    "TWB64 145 - Baja Blast Storm": [0x68C2A4, 0x539B83, 0x346152, 0x1F3A31],
    "TWB64 146 - Olympic Gold": [0xD5B624, 0xAA911C, 0x6A5B12, 0x3F360A],
    "TWB64 147 - LisAni Orange!": [0xEB5E01, 0xBC4B00, 0x752F00, 0x461C00],
    "TWB64 148 - Liella Purple!": [0xA5469B, 0x84387C, 0x52234D, 0x31152E],
    "TWB64 149 - Olympic Silver": [0x9EA59C, 0x7E847C, 0x4F524E, 0x2F312E],
    "TWB64 150 - Olympic Bronze": [0xCD8152, 0xA46741, 0x664029, 0x3D2618],
    "TWB64 151 - ANA Flight Blue": [0x00B3F0, 0x3B8BC0, 0x223F9A, 0x00146E],
    "TWB64 152 - Nijigasaki Orange": [0xF39800, 0xC27900, 0x794C00, 0x482D00],
    "TWB64 153 - holoblue": [0xB0EDFA, 0x49C4F2, 0x3368D3, 0x063F5C],
    "TWB64 154 - WWE White and Red": [0xFFFFFF, 0xD7182A, 0x810E19, 0x40070C],
    "TWB64 155 - Yoshi Egg Green": [0x66C430, 0x519C26, 0x336218, 0x1E3A0E],
    "TWB64 156 - Pokedex Red": [0xEA5450, 0xBB4340, 0x752A28, 0x461918],
    "TWB64 157 - FamilyMart Vision": [0x008CD6, 0x00A040, 0x006026, 0x003013],
    "TWB64 158 - Xbox Green": [0x92C83E, 0x74A031, 0x49641F, 0x2B3C12],
    "TWB64 159 - Sonic Mega Blue": [0x4084D9, 0x3369AD, 0x20426C, 0x132741],
    "TWB64 160 - Sprite Green": [0x009B4E, 0x007C3E, 0x004D27, 0x002E17],
    "TWB64 161 - Scarlett Green": [0x9BF00B, 0x7CC008, 0x4D7805, 0x2E4803],
    "TWB64 162 - Glitchy Blue": [0x337EFB, 0x2864C8, 0x193F7D, 0x0F254B],
    "TWB64 163 - Classic LCD": [0xC6CBAD, 0x9EA28A, 0x636556, 0x3B3C33],
    "TWB64 164 - 3DS Virtual Console Ver.": [0xCECEAD, 0xA5A58C, 0x6B6B52, 0x292918],
    "TWB64 165 - PocketStation Ver.": [0x969687, 0x78786C, 0x4B4B43, 0x2D2D28],
    "TWB64 166 - Timeless Gold and Red": [0xC8AA50, 0xB91E23, 0x6F1215, 0x37090A],
    "TWB64 167 - Smurfy Blue": [0x2CB9EF, 0x2394BF, 0x165C77, 0x0D3747],
    "TWB64 168 - Swampy Ogre Green": [0xC1D62E, 0x9AAB24, 0x606B17, 0x39400D],
    "TWB64 169 - Sailor Spinach Green": [0x7BB03C, 0x628C30, 0x3D581E, 0x243412],
    "TWB64 170 - Shenron Green": [0x5AC34A, 0x489C3B, 0x2D6125, 0x1B3A16],
    "TWB64 171 - Berserk Blood": [0xBB1414, 0x951010, 0x5D0A0A, 0x380606],
    "TWB64 172 - Super Star Pink": [0xF3A5AA, 0xC28488, 0x795255, 0x483133],
    "TWB64 173 - Gamebuino Classic Ver.": [0x81A17E, 0x678064, 0x40503F, 0x263025],
    "TWB64 174 - Barbie Pink": [0xF200A1, 0xC10080, 0x790050, 0x480030],
    "TWB64 175 - YOASOBI AMARANTH": [0xF2285A, 0xC12048, 0x79142D, 0x480C1B],
    "TWB64 176 - Nokia 3310 Ver.": [0x73A684, 0x5C8469, 0x395342, 0x223127],
    "TWB64 177 - Clover Green": [0x39B54A, 0x2D903B, 0x1C5A25, 0x113616],
    "TWB64 178 - Goku GT Gi": [0xDBE3E6, 0xF0AC18, 0x3D6EA5, 0x122131],
    "TWB64 179 - Famicom Disk Yellow": [0xF3C200, 0xC29B00, 0x796100, 0x483A00],
    "TWB64 180 - Team Rocket Uniform": [0xEEEFEB, 0xE94E60, 0x755E88, 0x474F4D],
    "TWB64 181 - SEIKO Timely Vision": [0xFFBF00, 0x4393E6, 0x0050A5, 0x202121],
    "TWB64 182 - PASTEL109": [0xF2D53F, 0xFD87B2, 0x3DACB8, 0x5503A6],
    "TWB64 183 - Doraemon Tricolor": [0xFFE800, 0x00A8F4, 0xE60000, 0x450000],
    "TWB64 184 - Fury Blue": [0x2B5F98, 0x224C79, 0x152F4C, 0x0C1C2D],
    "TWB64 185 - GOOD SMILE VISION": [0x9FA0A0, 0xEE7700, 0x8E4700, 0x472300],
    "TWB64 186 - Puyo Puyo Green": [0x48E236, 0x39B42B, 0x24771B, 0x154310],
    "TWB64 187 - Circle K Color Combo": [0xF99B2A, 0xEC2E24, 0x8D1B15, 0x460D0A],
    "TWB64 188 - Pizza Hut Red": [0xE3383E, 0xB52C31, 0x711C1F, 0x441012],
    "TWB64 189 - Emerald Green": [0x50C878, 0x40A060, 0x28643C, 0x183C24],
    "TWB64 190 - Grand Ivory": [0xD9D6BE, 0xADAB98, 0x6C6B5F, 0x414039],
    "TWB64 191 - Demon's Gold": [0xBAAF56, 0x948C44, 0x5D572B, 0x373419],
    "TWB64 192 - SEGA Tokyo Blue": [0x0082D4, 0x0068A9, 0x00416A, 0x00273F],
    "TWB64 193 - Champion's Tunic": [0xE2DCB1, 0x009EDD, 0x875B40, 0x281B13],
    "TWB64 194 - DK Barrel Brown": [0xC3742F, 0x9C5C25, 0x613A17, 0x3A220E],
    "TWB64 195 - EVA-01": [0x54CF54, 0xF99B22, 0x765898, 0x303345],
    "TWB64 196 - Wild West Vision": [0xD9D7C7, 0xC3976A, 0x924A36, 0x3A160E],
    "TWB64 197 - Optimus Prime Palette": [0xD3D3D3, 0xD92121, 0x0047AB, 0x001533],
    "TWB64 198 - niconico sea green": [0x19C3A4, 0x149C83, 0x0C6152, 0x073A31],
    "TWB64 199 - Duracell Copper": [0xC8895D, 0xA06D4A, 0x64442E, 0x3C291B],
    "TWB64 200 - TOKYO SKYTREE CLOUDY BLUE": [0x82B5C7, 0x68909F, 0x415A63, 0x27363B],
    "TWB64 201 - DMG-GOLD": [0xA1B560, 0x80904C, 0x505A30, 0x30361C],
    "TWB64 202 - LCD Clock Green": [0x50B580, 0x409066, 0x285A40, 0x183626],
    "TWB64 203 - Famicom Frenzy": [0xEFECDA, 0xD9BE72, 0xA32135, 0x231916],
    "TWB64 204 - DK Arcade Blue": [0x47A2DE, 0x3881B1, 0x23516F, 0x153042],
    "TWB64 205 - Advanced Indigo": [0x796ABA, 0x605494, 0x3C355D, 0x241F37],
    "TWB64 206 - Ultra Black": [0x4D5263, 0x3D414F, 0x262931, 0x17181D],
    "TWB64 207 - Chaos Emerald Green": [0xA0E000, 0x80C800, 0x409800, 0x208000],
    "TWB64 208 - Blue Bomber Vision": [0xE2CDA7, 0x639AFC, 0x0D4DC4, 0x000000],
    "TWB64 209 - Krispy Kreme Vision": [0xFFFFFF, 0xCF152D, 0x166938, 0x000000],
    "TWB64 210 - Steam Gray": [0xC5C3C0, 0x9D9C99, 0x626160, 0x3B3A39],
    "TWB64 211 - Dream Land GB Ver.": [0xF6FF70, 0xB9D03A, 0x788B1D, 0x48530E],
    "TWB64 212 - Pokemon Pinball Ver.": [0xE8F8B8, 0xA0B050, 0x786030, 0x181820],
    "TWB64 213 - Poketch Ver.": [0x70B070, 0x508050, 0x385030, 0x102818],
    "TWB64 214 - COLLECTION of SaGa Ver.": [0xB2C0A8, 0x769A67, 0x345D51, 0x041820],
    "TWB64 215 - Rocky-Valley Holiday": [0xC0F0F8, 0xD89078, 0x805850, 0x204008],
    "TWB64 216 - Giga Kiwi DMG": [0xD0E040, 0xA0A830, 0x607028, 0x384828],
    "TWB64 217 - DMG Pea Green": [0xD7E894, 0xAEC440, 0x527F39, 0x204631],
    "TWB64 218 - Timing Hero Ver.": [0xCCCC99, 0x8C994C, 0x4C6718, 0x202E00],
    "TWB64 219 - Invincible Yellow and Blue": [0xFEE566, 0x39C9EB, 0x22788D, 0x113C46],
    "TWB64 220 - Grinchy Green": [0xB7BE1C, 0x929816, 0x5B5F0E, 0x363908],
    "TWB64 221 - animate vision": [0xFFFFFF, 0xF9BE00, 0x385EAA, 0x231815],
    "TWB64 222 - School Idol Mix": [0xF39800, 0x00A0E9, 0xA5469B, 0x31152E],
    "TWB64 223 - Green Awakening": [0xF1FFDD, 0x98DB75, 0x367050, 0x000B16],
    "TWB64 224 - Goomba Brown": [0xAA593B, 0x88472F, 0x552C1D, 0x331A11],
    "TWB64 225 - WarioWare MicroBlue": [0x1189CA, 0x0D6DA1, 0x084465, 0x05293C],
    "TWB64 226 - KonoSuba Sherbet": [0xF08200, 0xE5006E, 0x890042, 0x440021],
    "TWB64 227 - Spooky Purple": [0x9E7CD2, 0x7E63A8, 0x4F3E69, 0x2F253F],
    "TWB64 228 - Treasure Gold": [0xCBB524, 0xA2901C, 0x655A12, 0x3C360A],
    "TWB64 229 - Cherry Blossom Pink": [0xF07EB0, 0xC0648C, 0x783F58, 0x482534],
    "TWB64 230 - Golden Trophy": [0xE8D018, 0xB9A613, 0x74680C, 0x453E07],
    "TWB64 231 - Glacial Winter Blue": [0x87C1E2, 0x6C9AB4, 0x436071, 0x283943],
    "TWB64 232 - Leprechaun Green": [0x378861, 0x2C6C4D, 0x1B4430, 0x10281D],
    "TWB64 233 - SAITAMA SUPER BLUE": [0x277ABC, 0x1F6196, 0x133D5E, 0x0B2438],
    "TWB64 234 - SAITAMA SUPER GREEN": [0x16AE85, 0x118B6A, 0x0B5742, 0x063427],
    "TWB64 235 - Duolingo Green": [0x58CC02, 0x46A301, 0x2C6601, 0x1A3D00],
    "TWB64 236 - Super Mushroom Vision": [0xF7CEC3, 0xCC9E22, 0x923404, 0x000000],
    "TWB64 237 - Ancient Hisuian Brown": [0xB39F90, 0x8F7F73, 0x594F48, 0x352F2B],
    "TWB64 238 - Sky Pop Ivory": [0xE5E0B8, 0xBEBB95, 0x86825A, 0x525025],
    "TWB64 239 - LAWSON BLUE": [0x0068B7, 0x005392, 0x00345B, 0x001F36],
    "TWB64 240 - Anime Expo Red": [0xEE3B33, 0xBE2F28, 0x771D19, 0x47110F],
    "TWB64 241 - Brilliant Diamond Blue": [0x7FBBE1, 0x6595B4, 0x3F5D70, 0x263843],
    "TWB64 242 - Shining Pearl Pink": [0xD28EA0, 0xA87180, 0x694750, 0x3F2A30],
    "TWB64 243 - Funimation Melon": [0x96FF00, 0xFF149F, 0x5B0BB5, 0x000000],
    "TWB64 244 - Teyvat Brown": [0xB89469, 0x937654, 0x5C4A34, 0x372C1F],
    "TWB64 245 - Chozo Blue": [0x4EB3E1, 0x3E8FB4, 0x275970, 0x173543],
    "TWB64 246 - Spotify Green": [0x1ED760, 0x18AC4C, 0x0F6B30, 0x09401C],
    "TWB64 247 - Dr Pepper Red": [0x8A2231, 0x6E1B27, 0x451118, 0x290A0E],
    "TWB64 248 - NHK Silver Gray": [0x808080, 0x666666, 0x404040, 0x262626],
    "TWB64 249 - Dunkin' Vision": [0xFF6E0C, 0xF20C90, 0x910756, 0x48032B],
    "TWB64 250 - Deku Gamma Palette": [0xF0E8D6, 0xB6BEC8, 0x166668, 0x24262B],
    "TWB64 251 - Universal Studios Blue": [0x036CE2, 0x0256B4, 0x013671, 0x002043],
    "TWB64 252 - Hogwarts Goldius": [0xB6A571, 0x91845A, 0x5B5238, 0x363121],
    "TWB64 253 - Kentucky Fried Red": [0xAB182F, 0x881325, 0x550C17, 0x33070E],
    "TWB64 254 - Cheeto Orange": [0xE57600, 0xB75E00, 0x723B00, 0x442300],
    "TWB64 255 - Namco Idol Pink": [0xFF74B8, 0xCC5C93, 0x7F3A5C, 0x4C2237],
    "TWB64 256 - Domino's Pizza Vision": [0xFFFFFF, 0xE31837, 0x006491, 0x000000],
    "TWB64 257 - Pac-Man Vision": [0xFFFF00, 0xFFB897, 0x3732FF, 0x000000],
    "TWB64 258 - Bill's PC Screen": [0xF87800, 0xB86000, 0x783800, 0x000000],
    "TWB64 259 - Sonic Mega Blue": [0xC08226, 0x854A1D, 0x4A290B, 0x2C1708],
    "TWB64 260 - Fool's Gold and Silver": [0xC5C66D, 0x97A1B0, 0x5A6069, 0x2D3034],
    "TWB64 261 - UTA VISION": [0xF4F4F4, 0xF1A7B5, 0xE24465, 0x262C48],
    "TWB64 262 - Metallic Paldea Brass": [0xA29834, 0x817929, 0x514C1A, 0x302D0F],
    "TWB64 263 - Classy Christmas": [0xE8E7DF, 0x8BAB95, 0x9E5C5E, 0x534D57],
    "TWB64 264 - Winter Christmas": [0xDDDDDD, 0x65B08F, 0xAE3B40, 0x341113],
    "TWB64 265 - IDOL WORLD TRICOLOR!!!": [0xFFC30B, 0xF34F6D, 0x2681C8, 0x0B263C],
    "TWB64 266 - Inkling Tricolor": [0xEAFF3D, 0xFF505E, 0x603BFF, 0x1C114C],
    "TWB64 267 - 7-Eleven Color Combo": [0xFF6C00, 0xEB0F2A, 0x147350, 0x062218],
    "TWB64 268 - PAC-PALETTE": [0xFFD800, 0xFF8C00, 0xDC0000, 0x420000],
    "TWB64 269 - Vulnerable Blue": [0x3732FF, 0x7F5C4B, 0xCC9378, 0xFFB897],
    "TWB64 270 - Nightvision Green": [0x1E390E, 0x335F17, 0x519825, 0x66BF2F],
    "TWB64 271 - Bandai Namco Tricolor": [0xF6B700, 0xDF4F61, 0x0069B1, 0x001F35],
    "TWB64 272 - Gold, Silver, and Bronze": [0xBEB049, 0x86949A, 0x996843, 0x2D1F14],
    "TWB64 273 - Deku Vigilante Palette": [0xADA89A, 0x878B92, 0x38534E, 0x131315],
    "TWB64 274 - Super Famicom Supreme": [0xFEDA5A, 0x44AC71, 0xD94040, 0x0846BA],
    "TWB64 275 - Absorbent and Yellow": [0xFFF752, 0xAEC600, 0x687600, 0x343B00],
    "TWB64 276 - 765PRO TRICOLOR": [0xB4E04B, 0xE22B30, 0x2743D2, 0x0B143F],
    "TWB64 277 - GameCube Glimmer": [0xB6BED3, 0x11A396, 0xCF4151, 0x3E1318],
    "TWB64 278 - 1st Vision Pastel": [0xEA7CB1, 0x7FAF5A, 0x385EAD, 0x101C33],
    "TWB64 279 - Perfect Majin Emperor": [0xFDC1BF, 0xA3B453, 0x8550A9, 0x271832],
    "TWB64 280 - J-Pop Idol Sherbet": [0xF19DB5, 0x5BBEE5, 0x812990, 0x260C2B],
    "TWB64 281 - Ryuuguu Sunset": [0xFFE43F, 0xFD99E1, 0x9238BE, 0x2B1039],
    "TWB64 282 - Tropical Starfall": [0x63FDFB, 0xEF58F7, 0x4344C1, 0x141439],
    "TWB64 283 - Colorful Horizons": [0xF6CF72, 0x60BDC7, 0xD15252, 0x373939],
    "TWB64 284 - BLACKPINK BLINK PINK": [0xF4A7BA, 0xC38594, 0x7A535D, 0x493237],
    "TWB64 285 - DMG-SWITCH": [0x8CAD28, 0x6C9421, 0x426B29, 0x214231],
    "TWB64 286 - POCKET SWITCH": [0xB5C69C, 0x8D9C7B, 0x637251, 0x303820],
    "TWB64 287 - Sunny Passion Paradise": [0xF0BA40, 0xE06846, 0x1E6CAE, 0x092034],
    "TWB64 288 - Saiyan Beast Silver": [0x969BAF, 0x787C8C, 0x4B4D57, 0x2D2E34],
    "TWB64 289 - RADIANT SMILE RAMP": [0xFFF89B, 0x01B3C4, 0xE6016B, 0x1B1C81],
    "TWB64 290 - A-RISE BLUE": [0x30559C, 0x26447C, 0x182A4E, 0x0E192E],
    "TWB64 291 - TROPICAL TWICE APRICOT": [0xFCC89B, 0xFF5FA2, 0x993961, 0x4C1C30],
    "TWB64 292 - Odyssey Boy": [0xACBE8C, 0x7E8E67, 0x505445, 0x222421],
    "TWB64 293 - Frog Coin Green": [0xFFF7DE, 0x00EF00, 0x398400, 0x003900],
    "TWB64 294 - Garfield Vision": [0xF5EA8B, 0xE59436, 0x964220, 0x2D1309],
    "TWB64 295 - Bedrock Caveman Vision": [0xFF7F00, 0x009EB8, 0x005E6E, 0x002F37],
    "TWB64 296 - BANGTAN ARMY PURPLE": [0x8048D8, 0x6639AC, 0x40246C, 0x261540],
    "TWB64 297 - LE SSERAFIM FEARLESS BLUE": [0x81A5F9, 0x6784C7, 0x40527C, 0x26314A],
    "TWB64 298 - Baja Blast Beach": [0xDBE441, 0x83CCC5, 0x4E7A76, 0x273D3B],
    "TWB64 299 - 3DS Virtual Console Green": [0xBDFF21, 0x9CEF29, 0x5A8C42, 0x4A4A4A],
    "TWB64 300 - Wonder Purple": [0xE658DF, 0xB846B2, 0x732C6F, 0x451A42],
    "GB - DMG": [0x578200, 0x317400, 0x005121, 0x00420C],
    "GB - Pocket": [0xA7B19A, 0x86927C, 0x535f49, 0x2A3325],
    "GB - Light": [0x01CBDF, 0x01B6D5, 0x269BAD, 0x00778D]
};

// Valid options for colorization (based on gambatte.opt)
var COLORIZATION_OPTIONS = [
    "disabled", "auto", "GBC", "SGB", "internal", "custom"
];

// Valid options for internal palette (based on gambatte.opt) 
var INTERNAL_PALETTE_OPTIONS = [
    "GB - DMG", "GB - Pocket", "GB - Light", "GBC - Blue", "GBC - Brown", 
    "GBC - Dark Blue", "GBC - Dark Brown", "GBC - Dark Green", "GBC - Grayscale",
    "GBC - Green", "GBC - Inverted", "GBC - Orange", "GBC - Pastel Mix",
    "GBC - Red", "GBC - Yellow", "SGB - 1A", "SGB - 1B", "SGB - 1C", "SGB - 1D",
    "SGB - 1E", "SGB - 1F", "SGB - 1G", "SGB - 1H", "SGB - 2A", "SGB - 2B",
    "SGB - 2C", "SGB - 2D", "SGB - 2E", "SGB - 2F", "SGB - 2G", "SGB - 2H",
    "SGB - 3A", "SGB - 3B", "SGB - 3C", "SGB - 3D", "SGB - 3E", "SGB - 3F",
    "SGB - 3G", "SGB - 3H", "SGB - 4A", "SGB - 4B", "SGB - 4C", "SGB - 4D",
    "SGB - 4E", "SGB - 4F", "SGB - 4G", "SGB - 4H", "Special 1", "Special 2",
    "Special 3", "TWB64 - Pack 1", "TWB64 - Pack 2", "TWB64 - Pack 3"
];

// State
var configEntries = [];
var selectedEntry = 0;
var showingPalette = false;
var selectedPalette = "";
var selectedPaletteIndex = 0;
var currentTWB64Pack = null;
var statusMessage = "";
var animFrame = 0;

function log(msg) {
    console.log('[Palette Picker] ' + msg);
    statusMessage = msg;
}

function loadConfigFile() {
    log('Loading gambatte config...');
    
    if (!FS.fileExists(CONFIG_FILE)) {
        log('Config file not found: ' + CONFIG_FILE);
        return false;
    }
    
    var text = FS.readTextFile(CONFIG_FILE);
    if (!text) {
        log('Could not read config file');
        return false;
    }
    
    configEntries = [];
    var lines = text.split('\n');
    var currentPack = getCurrentTWB64Pack(); // Get pack before processing entries
    
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line || line[0] === '#') continue;
        
        var eq = line.indexOf('=');
        if (eq > 0) {
            var key = line.substr(0, eq).trim();
            var value = line.substr(eq + 1).trim();
            
            // Show colorization and palette-related settings
            if (key.indexOf('colorization') >= 0 || key.indexOf('internal_palette') >= 0) {
                configEntries.push({
                    key: key,
                    value: value,
                    originalValue: value,
                    readOnly: false // Now all settings are editable
                });
            } else if (key.indexOf('palette') >= 0) {
                // Only show the palette setting that matches the current TWB64 pack
                var currentPack = getCurrentTWB64Pack();
                var shouldShow = false;
                
                if (currentPack === 1 && key.indexOf('palette_twb64_1') >= 0) shouldShow = true;
                if (currentPack === 2 && key.indexOf('palette_twb64_2') >= 0) shouldShow = true;
                if (currentPack === 3 && key.indexOf('palette_twb64_3') >= 0) shouldShow = true;
                
                if (shouldShow) {
                    configEntries.push({
                        key: key,
                        value: value,
                        originalValue: value,
                        readOnly: false // Now all settings are editable
                    });
                }
            }
        }
    }
    
    log('Loaded ' + configEntries.length + ' palette settings');
    return true;
}

function saveConfigFile() {
    log('Saving configuration...');
    
    var originalText = FS.readTextFile(CONFIG_FILE);
    if (!originalText) {
        log('Could not read original config');
        return false;
    }
    
    var lines = originalText.split('\n');
    var newLines = [];
    
    // Update lines with new values
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var eq = line.indexOf('=');
        
        if (eq > 0) {
            var key = line.substr(0, eq).trim();
            var updated = false;
            
            // Find if we have an update for this key
            for (var j = 0; j < configEntries.length; j++) {
                if (configEntries[j].key === key) {
                    var value = configEntries[j].value;
                    // Don't add quotes if value already has them
                    if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                        newLines.push(key + ' = ' + value);
                    } else {
                        newLines.push(key + ' = "' + value + '"');
                    }
                    updated = true;
                    break;
                }
            }
            
            if (!updated) {
                newLines.push(line);
            }
        } else {
            newLines.push(line);
        }
    }
    
    var newText = newLines.join('\n');
    if (FS.writeTextFile(CONFIG_FILE, newText)) {
        log('Configuration saved successfully!');
        return true;
    } else {
        log('Failed to save configuration');
        return false;
    }
}

function findPaletteColors(paletteName) {
    // Try exact match first
    if (PALETTE_COLORS[paletteName]) {
        return PALETTE_COLORS[paletteName];
    }
    
    // Try with different variations for common mismatches
    var variations = [
        paletteName.replace("Ver.", "Ver"),
        paletteName.replace("Ver", "Ver."),
        paletteName.replace("SpongeBob", "Spongebob"),
        paletteName.replace("Spongebob", "SpongeBob")
    ];
    
    for (var i = 0; i < variations.length; i++) {
        if (PALETTE_COLORS[variations[i]]) {
            return PALETTE_COLORS[variations[i]];
        }
    }
    
    return null;
}

function drawPaletteSquares(x, y, palette, size) {
    // Draw 4 color squares representing the Game Boy palette
    var colors = findPaletteColors(palette);
    if (!colors) {
        // Default colors if palette not found
        colors = [0x578200, 0x317400, 0x005121, 0x00420C];
    }
    
    // Draw very compact color squares - just single characters with spacing
    for (var i = 0; i < 4; i++) {
        var squareX = x + (i * 8); // Tight spacing
        var color = 0xFF000000 | colors[i]; // Add alpha channel
        
        // Just one character per color for maximum performance
        drawText5x8(squareX, y, '#', color);
    }
}

function drawBorder() {
    // Simple border
    for (var x = 0; x < 320; x += 10) {
        drawText5x8(x, 5, '~', COLORS.border);
        drawText5x8(x, 235, '~', COLORS.border);
    }
    
    for (var y = 10; y < 240; y += 10) {
        drawText5x8(5, y, '|', COLORS.border);
        drawText5x8(315, y, '|', COLORS.border);
    }
}

function getCurrentTWB64Pack() {
    // Read the opt file directly to get the current internal_palette setting
    if (!FS.fileExists(CONFIG_FILE)) {
        return 1; // Default to Pack 1
    }
    
    var text = FS.readTextFile(CONFIG_FILE);
    if (!text) {
        return 1; // Default to Pack 1
    }
    
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line || line[0] === '#') continue;
        
        var eq = line.indexOf('=');
        if (eq > 0) {
            var key = line.substr(0, eq).trim();
            var value = line.substr(eq + 1).trim();
            
            if (key === 'gambatte_gb_internal_palette') {
                // Remove quotes and check value
                value = value.replace(/"/g, '');
                if (value === "TWB64 - Pack 1") return 1;
                if (value === "TWB64 - Pack 2") return 2;
                if (value === "TWB64 - Pack 3") return 3;
                break;
            }
        }
    }
    
    return 1; // Default to Pack 1
}

function getOptionsForSetting(key) {
    if (key.indexOf('colorization') >= 0) {
        return COLORIZATION_OPTIONS;
    } else if (key.indexOf('internal_palette') >= 0) {
        return INTERNAL_PALETTE_OPTIONS;
    } else if (key.indexOf('palette_twb64_1') >= 0) {
        return TWB64_PACK1_PALETTES;
    } else if (key.indexOf('palette_twb64_2') >= 0) {
        return TWB64_PACK2_PALETTES;
    } else if (key.indexOf('palette_twb64_3') >= 0) {
        return TWB64_PACK3_PALETTES;
    } else if (key.indexOf('palette') >= 0) {
        // For generic palette settings, always use the current TWB64 pack
        var currentPack = getCurrentTWB64Pack();
        if (currentPack === 1) return TWB64_PACK1_PALETTES;
        if (currentPack === 2) return TWB64_PACK2_PALETTES;
        if (currentPack === 3) return TWB64_PACK3_PALETTES;
        return TWB64_PACK1_PALETTES; // fallback
    } else {
        // Default to current pack for other settings
        var currentPack = getCurrentTWB64Pack();
        if (currentPack === 1) return TWB64_PACK1_PALETTES;
        if (currentPack === 2) return TWB64_PACK2_PALETTES;
        if (currentPack === 3) return TWB64_PACK3_PALETTES;
        return TWB64_PACK1_PALETTES;
    }
}

function draw() {
    clearScreen(COLORS.bg_main);
    drawBorder();
    
    // Title
    drawText8x8(50, 15, 'Gambatte/Gameboy Palette Picker', COLORS.text_title);
    
    var y = 35;
    
    if (showingPalette) {
        // Palette/option selection mode
        var currentSetting = configEntries[selectedEntry];
        drawText5x8(20, y, 'Select option for: ' + currentSetting.key, COLORS.text_main);
        y += 10;
        
        // Show pack info for TWB64 palette settings
        if (currentSetting.key.indexOf('palette') >= 0) {
            var currentPack = getCurrentTWB64Pack();
            var packRange = currentPack === 1 ? '001-100' : currentPack === 2 ? '101-200' : '201-300';
            var availableOptions = getOptionsForSetting(currentSetting.key);
            drawText5x8(20, y, 'Showing TWB64 Pack ' + currentPack + ' (Palettes ' + packRange + ') - ' + availableOptions.length + ' options', COLORS.text_title);
            y += 10;
        }
        y += 5;
        
        var availableOptions = getOptionsForSetting(currentSetting.key);
        var startIdx = Math.max(0, selectedPaletteIndex - 8);
        var endIdx = Math.min(availableOptions.length, startIdx + 16);
        
        for (var i = startIdx; i < endIdx; i++) {
            var optionName = availableOptions[i];
            var isSelected = (i === selectedPaletteIndex);
            var textColor = isSelected ? COLORS.selected : COLORS.text_main;
            
            // Option name (shorter to make room for color squares)
            var displayName = optionName;
            if (displayName.length > 28) {
                displayName = displayName.substring(0, 25) + '...';
            }
            
            drawText5x8(20, y, (isSelected ? '> ' : '  ') + displayName, textColor);
            
            // Show compact palette preview for all visible palettes
            if (findPaletteColors(optionName)) {
                drawPaletteSquares(240, y + 2, optionName, 4);
            }
            
            y += 12;
        }
        
        // Controls
        drawText5x8(20, 220, 'Up/Down: Navigate  A: Select  B: Cancel', COLORS.text_white);
        
    } else {
        // Main config mode
        drawText5x8(20, y, 'Gambatte/Gameboy Palette Configuration', COLORS.text_info);
        y += 15;
        
        // Show current TWB64 pack info with debug details
        var currentPack = getCurrentTWB64Pack();
        var packInfo = 'Current TWB64 Pack: ' + currentPack + ' (Palettes ' + 
                      (currentPack === 1 ? '001-100' : currentPack === 2 ? '101-200' : '201-300') + ')';
        drawText5x8(20, y, packInfo, COLORS.text_title);
        y += 10;
        
        // Debug: Show which internal_palette value is set
        for (var i = 0; i < configEntries.length; i++) {
            if (configEntries[i].key.indexOf('internal_palette') >= 0) {
                var debugValue = configEntries[i].value.replace(/"/g, '');
                drawText5x8(20, y, 'Debug: internal_palette = "' + debugValue + '"', COLORS.text_info);
                break;
            }
        }
        y += 10;
        
        // Show palette settings
        for (var i = 0; i < configEntries.length && y < 200; i++) {
            var entry = configEntries[i];
            var isSelected = (i === selectedEntry);
            var textColor = isSelected ? COLORS.selected : COLORS.text_main;
            
            // Setting name
            var keyName = entry.key.replace('gambatte_gb_', '').replace('_', ' ');
            drawText5x8(20, y, (isSelected ? '> ' : '  ') + keyName, textColor);
            y += 10;
            
            // Current value
            var valueName = entry.value.replace(/"/g, ''); // Remove quotes
            if (valueName.length > 40) {
                valueName = valueName.substring(0, 37) + '...';
            }
            
            drawText5x8(25, y, 'Value: ' + valueName, COLORS.text_main);
            
            // Show explanation for important settings
            if (entry.key.indexOf('colorization') >= 0) {
                y += 10;
                drawText5x8(25, y, 'Controls which palettes are available', COLORS.text_info);
            } else if (entry.key.indexOf('internal_palette') >= 0) {
                y += 10;
                drawText5x8(25, y, 'Active when colorization = "internal"', COLORS.text_info);
            } else if (entry.key.indexOf('palette_twb64') >= 0) {
                y += 10;
                var packNum = entry.key.indexOf('palette_twb64_1') >= 0 ? 1 : 
                             entry.key.indexOf('palette_twb64_2') >= 0 ? 2 : 3;
                var isActive = getCurrentTWB64Pack() === packNum;
                var statusText = isActive ? 'ACTIVE for current pack' : 'Inactive (Pack ' + packNum + ')';
                var statusColor = isActive ? COLORS.text_success : COLORS.text_info;
                drawText5x8(25, y, statusText, statusColor);
            }
            
            // Show palette preview if it's a known palette
            if (findPaletteColors(valueName)) {
                drawPaletteSquares(25, y + 10, valueName, 6);
                y += 20;
            }
            
            y += 15;
        }
        
        // Controls
        drawText5x8(20, 220, 'Up/Down: Navigate  A: Change  Start: Save', COLORS.text_white);
    }
    
    // Status
    if (statusMessage) {
        var msgColor = statusMessage.indexOf('ERROR') >= 0 ? COLORS.text_warning : COLORS.text_success;
        drawText5x8(20, 230, statusMessage, msgColor);
    }
    
    animFrame++;
}

function handleInput() {
    var input = getInputState();
    
    if (handleInput.debounce > 0) {
        handleInput.debounce--;
        return;
    }
    
    if (showingPalette) {
        // Palette selection mode
        var availableOptions = getOptionsForSetting(configEntries[selectedEntry].key);
        
        if (input & (1 << 4)) { // Up
            selectedPaletteIndex = Math.max(0, selectedPaletteIndex - 1);
            handleInput.debounce = 3; // Faster scrolling
        } else if (input & (1 << 5)) { // Down
            selectedPaletteIndex = Math.min(availableOptions.length - 1, selectedPaletteIndex + 1);
            handleInput.debounce = 3; // Faster scrolling
        } else if (input & (1 << 8)) { // A - Select option
            var selectedOption = availableOptions[selectedPaletteIndex];
            // Preserve quote format from original value
            var originalValue = configEntries[selectedEntry].originalValue;
            if (originalValue.charAt(0) === '"' && originalValue.charAt(originalValue.length - 1) === '"') {
                configEntries[selectedEntry].value = '"' + selectedOption + '"';
            } else {
                configEntries[selectedEntry].value = selectedOption;
            }
            log('Selected: ' + selectedOption);
            
            // If we changed the internal_palette, reload config to show correct palette setting
            if (configEntries[selectedEntry].key.indexOf('internal_palette') >= 0) {
                log('Internal palette changed, reloading config...');
                // Save the change first, then reload
                saveConfigFile();
                loadConfigFile();
                selectedEntry = 0; // Reset selection
            }
            
            showingPalette = false;
            handleInput.debounce = 15;
        } else if (input & (1 << 0)) { // B - Cancel
            showingPalette = false;
            handleInput.debounce = 15;
        }
        
    } else {
        // Main config mode
        if (input & (1 << 4)) { // Up
            selectedEntry = Math.max(0, selectedEntry - 1);
            handleInput.debounce = 8;
        } else if (input & (1 << 5)) { // Down
            selectedEntry = Math.min(configEntries.length - 1, selectedEntry + 1);
            handleInput.debounce = 8;
        } else if (input & (1 << 8)) { // A - Change palette
            var currentEntry = configEntries[selectedEntry];
            
            // All settings are now editable
            showingPalette = true;
            selectedPaletteIndex = 0;
            
            // Try to find current value in appropriate options list
            var currentValue = currentEntry.value.replace(/"/g, '');
            var availableOptions = getOptionsForSetting(currentEntry.key);
            for (var i = 0; i < availableOptions.length; i++) {
                if (availableOptions[i] === currentValue) {
                    selectedPaletteIndex = i;
                    break;
                }
            }
            
            handleInput.debounce = 15;
        } else if (input & (1 << 3)) { // Start - Save
            saveConfigFile();
            handleInput.debounce = 30;
        }
    }
}
handleInput.debounce = 0;

// Initialize
log('Gambatte/Gameboy Palette Picker ready!');
if (loadConfigFile()) {
    log('Press A to change palettes, Start to save');
} else {
    log('Could not load config file');
}

setMainLoop(function() {
    handleInput();
    draw();
});