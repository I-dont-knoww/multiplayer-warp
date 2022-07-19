const FRAME_RATE = 60;

const BG_COLOR = '#ffffff';
const RED = '#ff3131';
const BLUE = '#0096ff';

const BLOCK_SIZE = 30;
const BORDER_WIDTH = 4;

const PLAYER_MAX_HEALTH = 100;
const MOVE_SPEED = 4;
const FRICTION = 0.9;
const GRAVITY = 0.7;
const JUMP_VEL = -10;

const REACH_DIST = 10;
const PICK_REACH_DIST = 15;
const HIT_DIST = 1; // like how far u click away from some1

const TOOL_ALPHA = 0.5;

const DARKEN = 0.1;
const LIGHTEN = 0.4;

const CORRECTION = 0.1;

const RAIL_ACC = 10;

const BRONZE_ACTIVATION_TIME = 1000;
const GOLD_ACTIVATION_TIME = 5000;
const QUARTZ_ACTIVATION_TIME = 10000;

const ROOM_SIZE = 5040/BLOCK_SIZE; // divisible by 60; 5040
const GEM_BLOCK_BUFFER = 5;

const BRONZE_GENERATOR_NUM = 30;
const BRONZE_DIST_FROM_CENTER = 5;
const BRONZE_STARTER_DIST = 10;

const GOLD_GENERATOR_NUM = 20;
const GOLD_DIST_FROM_CENTER = 10;

const BRONZE_COL = '#cd7f32';
const BRONZE_CENTER_COL = '#e7994c';

const GOLD_COL = '#ffd700';
const GOLD_CENTER_COL = '#fff11a';

const QUARTZ_COL = '#f9c9d7';
const QUARTZ_CENTER_COL = '#ffe2f0';

module.exports = {
    FRAME_RATE: FRAME_RATE,
    BG_COLOR: BG_COLOR,
    RED: RED,
    BLUE: BLUE,
    BLOCK_SIZE: BLOCK_SIZE,
    BORDER_WIDTH: BORDER_WIDTH,
    PLAYER_MAX_HEALTH: PLAYER_MAX_HEALTH,
    MOVE_SPEED: MOVE_SPEED,
    FRICTION: FRICTION,
    GRAVITY: GRAVITY,
    JUMP_VEL: JUMP_VEL,
    REACH_DIST: REACH_DIST,
    PICK_REACH_DIST: PICK_REACH_DIST,
    HIT_DIST: HIT_DIST,
    TOOL_ALPHA: TOOL_ALPHA,
    DARKEN: DARKEN,
    LIGHTEN: LIGHTEN,
    CORRECTION: CORRECTION,
    RAIL_ACC: RAIL_ACC,
    BRONZE_ACTIVATION_TIME: BRONZE_ACTIVATION_TIME,
    GOLD_ACTIVATION_TIME: GOLD_ACTIVATION_TIME,
    QUARTZ_ACTIVATION_TIME: QUARTZ_ACTIVATION_TIME,
    ROOM_SIZE: ROOM_SIZE,
    GEM_BLOCK_BUFFER: GEM_BLOCK_BUFFER,
    BRONZE_GENERATOR_NUM: BRONZE_GENERATOR_NUM,
    BRONZE_DIST_FROM_CENTER: BRONZE_DIST_FROM_CENTER,
    BRONZE_STARTER_DIST: BRONZE_STARTER_DIST,
    GOLD_GENERATOR_NUM: GOLD_GENERATOR_NUM,
    GOLD_DIST_FROM_CENTER: GOLD_DIST_FROM_CENTER,
    BRONZE_COL: BRONZE_COL,
    BRONZE_CENTER_COL: BRONZE_CENTER_COL,
    GOLD_COL: GOLD_COL,
    GOLD_CENTER_COL: GOLD_CENTER_COL,
    QUARTZ_COL: QUARTZ_COL,
    QUARTZ_CENTER_COL: QUARTZ_CENTER_COL
};