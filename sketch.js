// Game main screen variables
let game_name, game_name_played
let main_mode, main_background, main_song

// Game singleplayer variables
let singleplayer_mode, singleplayer_background
let paddle, UVIC, bouncer
let ball, ball_r, ball_s, ball_d, ball_v, ball_sprites
let topbar
let left_wall
let right_wall
let json, blocks, block_counter, collisions, reposition_blocks
let pause, paused, paddle_ball, reset, degrees, pause_velocity, game_over, win
let ball_bounce, block_destroyed, game_over_sound, game_over_sound_played, lose_life, win_sound, win_sound_played

// Game multiplayer variables
let multiplayer_mode, multiplayer_song, multiplayer_results_audio, multiplayer_results_audio_played
let multiplayer_ball, multiplayer_ball_r
let multiplayer_reposition_blocks, wall
let player_1_background, player_1_blocks, player_1_collisions, player_1_block_counter, player_1_finished
let player_1_paddle, player_1_bouncer
let player_1_ball, player_1_ball_s, player_1_ball_d, player_1_ball_v
let player_2_background, player_2_blocks, player_2_collisions, player_2_block_counter, player_2_finished
let player_2_paddle, player_2_bouncer
let player_2_ball, player_2_ball_s, player_2_ball_d, player_2_ball_v
let player_1_done, player_2_done
let multiplayer_player_finished, first_player_finished
let results, winner

// Game UI variables
let font
let lives_number_1, lives_1, lives_number_2, lives_2
let minutes_1, seconds_1, counter_1, time_1, minutes_2, seconds_2, counter_2, time_2
let score_1, score_2
let main_singleplayer_button, main_multiplayer_button, menu_button, retry_button, again_button
let music, button_clicked

// Game classes
class Blocks {
  constructor (mode, id, x, y, w, h) {
    this.mode = mode
    this.id = id
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.r = int (random (255))
    this.g = int (random (255))
    this.b = int (random (255))
    this.visible = true
  }

  create () {
    if (this.mode == "singleplayer") {
      collisions[this.id] = createSprite (this.x, this.y, this.w, this.h)
      collisions[this.id].immovable = true
      collisions[this.id].setCollider ("rectangle", 0, 0, this.w, this.h)
    }
    else if (this.mode == "player_1") {
      player_1_collisions[this.id] = createSprite (this.x, this.y, this.w, this.h)
      player_1_collisions[this.id].immovable = true
      player_1_collisions[this.id].setCollider ("rectangle", 0, 0, this.w, this.h)
    }
    else {
      player_2_collisions[this.id] = createSprite (this.x, this.y, this.w, this.h)
      player_2_collisions[this.id].immovable = true
      player_2_collisions[this.id].setCollider ("rectangle", 0, 0, this.w, this.h)
    }
  }

  show () {
    fill (this.r, this.g, this.b)
    rect (this.x, this.y, this.w, this.h)
  }

  destroy () {
    this.visible = false
    if (this.mode == "singleplayer") collisions[this.id].setCollider ("rectangle", 0, -height, this.w, this.h)
    else if (this.mode == "player_1") player_1_collisions[this.id].setCollider ("rectangle", 0, -height, this.w, this.h)
    else player_2_collisions[this.id].setCollider ("rectangle", 0, -height, this.w, this.h)
  }

  reposition () {
    this.visible = true
    if (this.mode == "singleplayer") collisions[this.id].setCollider ("rectangle", 0, 0, this.w, this.h)
    else if (this.mode == "player_1") player_1_collisions[this.id].setCollider ("rectangle", 0, 0, this.w, this.h)
    else player_2_collisions[this.id].setCollider ("rectangle", 0, 0, this.w, this.h)
  }

  get_visible () {
    return this.visible
  }
}

class Paddle {
  constructor (id, x, y, w, h) {
    this.id = id
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  create () {
    if (this.id == "singleplayer") {
      bouncer = createSprite (this.x, this.y, this.w, this.h)
      bouncer.immovable = true
    }
    else if (this.id == "player_1") {
      player_1_bouncer = createSprite (this.x, this.y, this.w, this.h)
      player_1_bouncer.immovable = true
    }
    else {
      player_2_bouncer = createSprite (this.x, this.y, this.w, this.h)
      player_2_bouncer.immovable = true
    }
  }

  show () {
    fill ("#EE0031")
    rect (this.x, this.y, this.w, this.h, 100)
    image (UVIC, this.x, this.y, width / 15, height / 30)
  }

  get_x () {
    return this.x
  }

  get_y () {
    return this.y
  }

  get_w () {
    return this.w
  }

  get_h () {
    return this.h
  }

  set_x (value) {
    if (this.id == "singleplayer") {
      this.x = constrain (value, this.w / 2, width - this.w / 2)
      bouncer.position.x = this.x
    }
    else if (this.id == "player_1") {
      this.x = constrain (value, this.w / 2, width / 2 - wall.width / 2 - this.w / 2)
      player_1_bouncer.position.x = this.x
    }
    else {
      this.x = constrain (value, width / 2 + wall.width / 2 + this.w / 2, width - this.w / 2)
      player_2_bouncer.position.x = this.x
    }
  }
}

function preload () {
  font = loadFont ("fonts/Minecraftia-Regular.ttf")
  json = loadJSON ("position.json")
  UVIC = loadImage ("assets/UVIC.svg")
  singleplayer_background = loadImage ("images/Singleplayer.png")
  ball_sprites = loadAnimation ("assets/Adobe After Effects.png", "assets/Adobe Audition.png", "assets/Adobe Illustrator.png", "assets/Adobe Photoshop.png", "assets/Adobe Premiere.png", "assets/Android Studio.png", "assets/Android.png", "assets/Apple.png", "assets/Arduino.png", "assets/Blender.png", "assets/C++.png", "assets/CSS.png", "assets/Figma.png", "assets/Firebase.png", "assets/Google Chrome.png", "assets/Google.png", "assets/HTML.png", "assets/Invision.png", "assets/JavaScript.png", "assets/Linux.png", "assets/Maya.png", "assets/MySQL.png", "assets/Processing.png", "assets/Python.png", "assets/Qt.png", "assets/Steam.png", "assets/Unity.png", "assets/Unreal Engine 4.png", "assets/Windows.png", "assets/YouTube.png", )
  ball_sprites.playing = false
  main_song = loadSound ("audios/Menu.mp3")
  main_song.playMode ("untilDone")
  multiplayer_song = loadSound ("audios/Multiplayer.mp3")
  multiplayer_song.playMode ("untilDone")
  ball_bounce = loadSound ("sounds/Ball bounce.mp3")
  block_destroyed = loadSound ("sounds/Block destroyed.mp3")
  game_over_sound = loadSound ("sounds/Game over.mp3")
  lose_life = loadSound ("sounds/Lose life.mp3")
  game_name = loadSound ("sounds/UVIC Crasher.mp3")
  win_sound = loadSound ("sounds/You win.mp3")
  multiplayer_player_finished = loadSound ("sounds/Finish.mp3")
  player_1_background = loadImage ("images/Player 1.png")
  player_2_background = loadImage ("images/Player 2.png")
  main_background = loadImage ("images/Main.png")
  main_singleplayer_button = loadImage ("images/Play.png")
  main_multiplayer_button = loadImage ("images/Play.png")
  menu_button = loadImage ("images/Menu.png")
  retry_button = loadImage ("images/Retry.png")
  again_button = loadImage ("images/Again.png")
  button_clicked = loadSound ("sounds/Button clicked.mp3")
  multiplayer_ball = loadImage ("assets/Multiplayer ball.png")
  multiplayer_results_audio = loadSound ("audios/Results.mp3")
}

function setup () {
  createCanvas (800, 500)
  frameRate (60)
  masterVolume (1.0)
  soundFormats ("mp3")
  imageMode (CENTER)
  rectMode (CENTER)
  textAlign (CENTER, CENTER)
  textFont (font)
  noStroke ()
  paddle = new Paddle ("singleplayer", width / 2, height / 1.025, width / 5, height / 25)
  paddle.create ()
  ball_r = height / 20
  ball = createSprite (paddle.get_x (), paddle.get_y () - paddle.get_h () / 2 - ball_r / 2, ball_r, ball_r)
  ball.addAnimation ("hit", ball_sprites)
  ball.animation.changeFrame (int (random (0, 30)))
  topbar = createSprite (width / 2, 25, width, height / 10)
  topbar.immovable = true
  topbar.shapeColor = color (2, 14, 66)
  left_wall = createSprite (0, height / 2, 1, height)
  left_wall.immovable = true
  right_wall = createSprite (width, height / 2, 1, height)
  right_wall.immovable = true
  wall = createSprite (width / 2, height / 2, 40, height)
  wall.immovable = true
  wall.shapeColor = color (0, 0, 0)
  wall.setCollider ("rectangle", 0, 0, wall.width, wall.height)
  player_1_paddle = new Paddle ("player_1", 190, height / 1.025, width / 10, height / 25)
  player_1_paddle.create ()
  player_2_paddle = new Paddle ("player_2", 610, height / 1.025, width / 10, height / 25)
  player_2_paddle.create ()
  multiplayer_ball_r = height / 25
  player_1_ball = createSprite (player_1_paddle.get_x (), player_1_paddle.get_y () - player_1_paddle.get_h () / 2 - multiplayer_ball_r / 2, multiplayer_ball_r, multiplayer_ball_r)
  player_1_ball.addImage (multiplayer_ball);
  player_2_ball = createSprite (player_2_paddle.get_x (), player_2_paddle.get_y () - player_2_paddle.get_h () / 2 - multiplayer_ball_r / 2, multiplayer_ball_r, multiplayer_ball_r)
  player_2_ball.addImage (multiplayer_ball);
  for (let i = 0; i < json.singleplayer.length; i++) {
    let data = json.singleplayer[i]
    blocks[i] = new Blocks ("singleplayer", data.id, data.x, data.y, data.w, data.h)
    blocks[i].create ()
    let data_player_1 = json.player_1[i]
    player_1_blocks[i] = new Blocks ("player_1", data_player_1.id, data_player_1.x, data_player_1.y, data_player_1.w, data_player_1.h)
    player_1_blocks[i].create ()
    let data_player_2 = json.player_2[i]
    player_2_blocks[i] = new Blocks ("player_2", data_player_2.id, data_player_2.x, data_player_2.y, data_player_2.w, data_player_2.h)
    player_2_blocks[i].create ()
  }

  // This practice is enforced by Google Chrome's autoplay policy as of r70, iOS Safari, and other browsers.
  userStartAudio().then(function() {
    music = true
  });
}

function draw () {
  if (main_mode) main ()
  else if (singleplayer_mode) singleplayer ()
  else if (multiplayer_mode) multiplayer ()
}

function main () {
  if (music && !game_name_played) {
    game_name_played = true
    game_name.play ()
  }
  else if (music && !game_name.isPlaying ()) main_song.play ()
  image (main_background, 0, 0)
  image (main_singleplayer_button, 250, height / 2, 150, 50)
  image (main_multiplayer_button, 550, height / 2, 150, 50)
  if (overRect (175, height / 2 - 25, 150, 50)) {
    image (main_singleplayer_button, 250, height / 2, 180, 80)
    textSize (20)
    fill (249, 215, 29)
    text ("SINGLEPLAYER", 250, 200)
  }
  if (overRect (475, height / 2 - 25, 650, 50)) {
    image (main_multiplayer_button, 550, height / 2, 180, 80)
    textSize (20)
    fill (249, 215, 29)
    text ("MULTIPLAYER", 550, 200)
  }
}

function multiplayer () {
  if (multiplayer_reposition_blocks) {
    for (let i = 0; i < player_1_blocks.length; i++) {
      player_1_blocks[i].reposition ()
      player_2_blocks[i].reposition ()
    }
    multiplayer_reposition_blocks = false
  }
  if (!player_1_done || !player_2_done) {
    multiplayer_song.play ()
    image (player_1_background, 200, height / 2, 400, height)
    image (player_2_background, 600, height / 2, 400, height)
    drawSprite (topbar)
    fill (255)
    textSize (25)
    text (lives_1, 200 + 25 / 2 - wall.width / 2, 30)
    text (lives_2, 600 - 25 / 2 + wall.width / 2, 30)
    drawSprite (wall)
    for (let i = 0; i < player_1_blocks.length; i++) {
      if (player_1_blocks[i].get_visible ()) player_1_blocks[i].show ()
      if (player_2_blocks[i].get_visible ()) player_2_blocks[i].show ()
    }
    player_1_paddle.show ()
    player_2_paddle.show ()
    drawSprite (player_1_ball)
    drawSprite (player_2_ball)
    player_1 ()
    player_2 ()
  }
  else if (player_1_done && player_2_done) results_screen ()
}

function player_1 () {
  if (player_1_done) {
    if (!first_player_finished) {
      first_player_finished = true
      multiplayer_player_finished.play ()
    }
    fill ("#000000")
    rect (0, height / 2, width, height)
  }
  else {
    ++counter_1
    if (counter_1 == 60) {
      ++seconds_1
      counter_1 = 0
      if (seconds_1 == 60) {
        ++minutes_1
        seconds_1 = 0
      }
    }
    let timer_1 = minutes_1 + ":"
    if (seconds_1 <= 9) timer_1 += "0" + seconds_1
    else timer_1 += seconds_1
    timer_1 += "."
    if (counter_1 <= 9) timer_1 += "0" + counter_1
    else timer_1 += counter_1
    time_1.elt.innerHTML = timer_1
    if (player_1_reset) {
      player_1_reset = false
      player_1_paddle_ball = true
      player_1_degrees = true
      --lives_number_1
      lives_1 = "Lives " + lives_number_1
      if (lives_number_1 == 0) player_1_done = true
      player_1_ball.setSpeed (0, 0)
      player_1_ball_s = 5
      player_1_ball_d = -1
      player_1_ball.position.x = player_1_paddle.get_x ()
      player_1_ball.position.y = player_1_paddle.get_y () - player_1_paddle.get_h () / 2 - multiplayer_ball_r / 2
    }
    if (keyWentDown ("W")) player_1_paddle_ball = false
    if (keyDown ("A")) {
      player_1_paddle.set_x (player_1_paddle.get_x () - 10)
      if (player_1_paddle_ball) player_1_ball.position.x -= 10
    }
    if (keyDown ("D")) {
      player_1_paddle.set_x (player_1_paddle.get_x () + 10)
      if (player_1_paddle_ball) player_1_ball.position.x += 10
    }
    if (player_1_paddle_ball) player_1_ball.position.x = constrain (player_1_ball.position.x, player_1_paddle.get_w () / 2, width / 2 - wall.width / 2 - player_1_paddle.get_w () / 2)
    else {
      if (player_1_degrees) {
        player_1_degrees = false
        let rng = int (random (0, 2))
        if (rng == 1) player_1_ball_v [0] = random (0.25, 0.75)
        else player_1_ball_v[0] = random (-0.25, -0.75)
        player_1_ball_v[1] = random (-0.25, -0.75)
        player_1_ball.setVelocity (player_1_ball_v[0], player_1_ball_v[1])
        player_1_ball.setSpeed (player_1_ball_s)
      }
      if (player_1_ball.bounce (topbar) || player_1_ball.bounce (left_wall) || player_1_ball.bounce (wall) || player_1_ball.bounce (player_1_bouncer)) {
        player_1_ball_s += 0.5
        player_1_ball.setSpeed (player_1_ball_s)
      }
      else {
        for (let i = 0; i < player_1_blocks.length; i++) {
          if (player_1_blocks[i].get_visible) {
            if (player_1_ball.bounce (player_1_collisions[i])) {
              let actual_score = parseInt (score_1.elt.innerHTML)
              actual_score += 500
              let digits = actual_score.toString().length
              let new_score = ""
              for (let i = digits; i < 5; ++i) {
                new_score += "0"
              }
              new_score += actual_score
              score_1.elt.innerHTML = new_score
              player_1_ball_s += 0.5
              player_1_ball.setSpeed (player_1_ball_s)
              player_1_blocks[i].destroy ()
              ++player_1_block_counter
              if (player_1_block_counter == 16) {
                player_1_done = true
                let actual_score = parseInt (score_1.elt.innerHTML)
                if (lives_number_1 == 3) actual_score += 2000
                else if (lives_number_1 == 2) actual_score += 1000
                let digits = actual_score.toString().length
                let new_score = ""
                for (let i = digits; i < 5; ++i) {
                  new_score += "0"
                }
                new_score += actual_score
                score_1.elt.innerHTML = new_score
              }
            }
          }
        }
      }
      if (player_1_ball.position.y >= player_1_paddle.get_y () + player_1_paddle.get_h ()) player_1_reset = true
      player_1_ball_d = player_1_ball.getDirection ()
    }
  }
}

function player_2 () {
  if (player_2_done) {
    if (!first_player_finished) {
      first_player_finished = true
      multiplayer_player_finished.play ()
    }
    fill ("#000000")
    rect (width, height / 2, width, height)
  }
  else {
    ++counter_2
    if (counter_2 == 60) {
      ++seconds_2
      counter_2 = 0
      if (seconds_2 == 60) {
        ++minutes_2
        seconds_2 = 0
      }
    }
    let timer_2 = minutes_2 + ":"
    if (seconds_2 <= 9) timer_2 += "0" + seconds_2
    else timer_2 += seconds_2
    timer_2 += "."
    if (counter_2 <= 9) timer_2 += "0" + counter_2
    else timer_2 += counter_2
    time_2.elt.innerHTML = timer_2
    if (player_2_reset) {
      player_2_reset = false
      player_2_paddle_ball = true
      player_2_degrees = true
      --lives_number_2
      lives_2 = "Lives " + lives_number_2
      if (lives_number_2 == 0) player_2_done = true
      player_2_ball.setSpeed (0, 0)
      player_2_ball_s = 5
      player_2_ball_d = -1
      player_2_ball.position.x = player_2_paddle.get_x ()
      player_2_ball.position.y = player_2_paddle.get_y () - player_2_paddle.get_h () / 2 - multiplayer_ball_r / 2
    }
    if (keyWentDown (UP_ARROW)) player_2_paddle_ball = false
    if (keyDown (LEFT_ARROW)) { 
      player_2_paddle.set_x (player_2_paddle.get_x () - 10)
      if (player_2_paddle_ball) player_2_ball.position.x -= 10
    }
    if (keyDown (RIGHT_ARROW)) {
      player_2_paddle.set_x (player_2_paddle.get_x () + 10)
      if (player_2_paddle_ball) player_2_ball.position.x += 10
    }
    if (player_2_paddle_ball) player_2_ball.position.x = constrain (player_2_ball.position.x, player_2_paddle.get_w () / 2 + width / 2 + wall.width / 2, width - player_2_paddle.get_w () / 2)
    else {
      if (player_2_degrees) {
        player_2_degrees = false
        let rng = int (random (0, 2))
        if (rng == 1) player_2_ball_v [0] = random (0.25, 0.75)
        else player_2_ball_v[0] = random (-0.25, -0.75)
        player_2_ball_v[1] = random (-0.25, -0.75)
        player_2_ball.setVelocity (player_2_ball_v[0], player_2_ball_v[1])
        player_2_ball.setSpeed (player_2_ball_s)
      }
      if (player_2_ball.bounce (topbar) || player_2_ball.bounce (wall) || player_2_ball.bounce (right_wall) || player_2_ball.bounce (player_2_bouncer)) {
        player_2_ball_s += 0.5
        player_2_ball.setSpeed (player_2_ball_s)
      }
      else {
        for (let i = 0; i < player_2_blocks.length; i++) {
          if (player_2_blocks[i].get_visible) {
            if (player_2_ball.bounce (player_2_collisions[i])) {
              let actual_score = parseInt (score_2.elt.innerHTML)
              actual_score += 500
              let digits = actual_score.toString().length
              let new_score = ""
              for (let i = digits; i < 5; ++i) {
                new_score += "0"
              }
              new_score += actual_score
              score_2.elt.innerHTML = new_score
              player_2_ball_s += 0.5
              player_2_ball.setSpeed (player_2_ball_s)
              player_2_blocks[i].destroy ()
              ++player_2_block_counter
              if (player_2_block_counter == 16) {
                player_2_done = true
                let actual_score = parseInt (score_2.elt.innerHTML)
                if (lives_number_2 == 3) actual_score += 2000
                else if (lives_number_2 == 2) actual_score += 1000
                let digits = actual_score.toString().length
                let new_score = ""
                for (let i = digits; i < 5; ++i) {
                  new_score += "0"
                }
                new_score += actual_score
                score_2.elt.innerHTML = new_score
              }
            }
          }
        }
      }
      if (player_2_ball.position.y >= player_2_paddle.get_y () + player_2_paddle.get_h ()) player_2_reset = true
      player_2_ball_d = player_2_ball.getDirection ()
    }
  }
}

function singleplayer () {
  if (reposition_blocks) {
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].reposition ()
    }
    reposition_blocks = false
  }
  else if (!game_over && !win) {
    image (singleplayer_background, width / 2, height / 2, width, height)
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].get_visible ()) blocks[i].show ()
    }
    paddle.show ()
    drawSprite (ball)
    drawSprite (topbar)
    fill (255)
    textSize (25)
    text (lives_1, width / 2, 30)
    if (!pause) unpaused ()
    else stop ()
  }
  else if (game_over) game_over_screen ()
  else if (win) win_screen ()
}

function unpaused () {
  ++counter_1
  if (counter_1 == 60) {
    ++seconds_1
    counter_1 = 0
    if (seconds_1 == 60) {
      ++minutes_1
      seconds_1 = 0
    }
  }
  let timer_1 = minutes_1 + ":"
  if (seconds_1 <= 9) timer_1 += "0" + seconds_1
  else timer_1 += seconds_1
  timer_1 += "."
  if (counter_1 <= 9) timer_1 += "0" + counter_1
  else timer_1 += counter_1
  time_1.elt.innerHTML = timer_1
  if (reset) {
    lose_life.play ()
    reset = false
    paddle_ball = true
    degrees = true
    --lives_number_1
    if (lives_number_1 == 0) game_over = true
    lives_1 = "Lives " + lives_number_1
    ball.animation.changeFrame (int (random (0, 30)))
    ball.setSpeed (0, 0)
    ball_s = 5
    ball_d = -1
    ball.position.x = paddle.get_x ()
    ball.position.y = paddle.get_y () - paddle.get_h () / 2 - ball_r / 2
  }
  if (keyWentDown ("W")) paddle_ball = false
  if (keyDown ("A")) { 
    paddle.set_x (paddle.get_x () - 25)
    if (paddle_ball) ball.position.x -= 25
  }
  if (keyDown ("D")) {
    paddle.set_x (paddle.get_x () + 25)
    if (paddle_ball) ball.position.x += 25
  }
  if (paddle_ball) ball.position.x = constrain (ball.position.x, paddle.get_w () / 2, width - paddle.get_w () / 2)
  else {
    if (pause_velocity) {
      pause_velocity = false
      ball.setVelocity (ball_v[0], ball_v[1])
      ball.setSpeed (ball_s, ball_d)
    }
    if (degrees) {
      degrees = false
      let rng = int (random (0, 2))
      if (rng == 1) ball_v [0] = random (0.25, 0.75)
      else ball_v[0] = random (-0.25, -0.75)
      ball_v[1] = random (-0.25, -0.75)
      ball.setVelocity (ball_v[0], ball_v[1])
      ball.setSpeed (ball_s)
    }
    if (ball.bounce (topbar) || ball.bounce (left_wall) || ball.bounce (right_wall) || ball.bounce (bouncer)) {
      ball_s += 0.5
      ball.setSpeed (ball_s)
      ball.animation.changeFrame (int (random (0, 30)))
      ball_bounce.play ()
    }
    else {
      for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].get_visible) {
          if (ball.bounce (collisions[i])) {
            let actual_score = parseInt (score_1.elt.innerHTML)
            actual_score += 500
            let digits = actual_score.toString().length
            let new_score = ""
            for (let i = digits; i < 5; ++i) {
              new_score += "0"
            }
            new_score += actual_score
            score_1.elt.innerHTML = new_score
            ball_s += 0.5
            ball.setSpeed (ball_s)
            ball.animation.changeFrame (int (random (0, 30)))
            ball_bounce.play ()
            blocks[i].destroy ()
            block_destroyed.play ()
            ++blocks_counter
            if (blocks_counter == 16) {
              win = true
              let actual_score = parseInt (score_1.elt.innerHTML)
              if (lives_number_1 == 3) actual_score += 2000
              else if (lives_number_1 == 2) actual_score += 1000
              let digits = actual_score.toString().length
              let new_score = ""
              for (let i = digits; i < 5; ++i) {
                new_score += "0"
              }
              new_score += actual_score
              score_1.elt.innerHTML = new_score
            }
          }
        }
      }
    }
    if (ball.position.y >= paddle.get_y () + paddle.get_h ()) reset = true
    ball_d = ball.getDirection ()
  }
}

function results_screen () {
  if (!multiplayer_results_audio_played) {
    results = true
    multiplayer_results_audio_played = true
    multiplayer_song.stop ()
    multiplayer_player_finished.stop ()
    multiplayer_results_audio.play ()
    let score_player_1 = parseInt (score_1.elt.innerHTML)
    let score_player_2 = parseInt (score_2.elt.innerHTML)
    if (score_player_1 > score_player_2) winner = "PLAYER 1 WINS"
    else if (score_player_1 < score_player_2) winner = "PLAYER 2 WINS"
    else if (minutes_1 < minutes_2) winner = "PLAYER 1 WINS"
    else if (minutes_1 > minutes_2) winner = "PLAYER 2 WINS"
    else if (seconds_1 < seconds_2) winner = "PLAYER 1 WINS"
    else if (seconds_1 > seconds_2) winner = "PLAYER 2 WINS"
    else if (counter_1 < counter_2) winner = "PLAYER 1 WINS"
    else if (counter_1 > counter_2) winner = "PLAYER 2 WINS"
    else winner = "TIE"
  }
  background (0, 0, 0)
  fill (255)
  textSize (50)
  text (winner, width / 2, height / 3)
  image (again_button, width * 0.2, height / 1.5, 150, 50);
  image (menu_button, width / 1.25, height / 1.5, 150, 50);
}

function stop () {
  paused = true
  ball.setVelocity (0, 0)
  fill (255)
  textSize (50)
  text ("PAUSE", width / 2, height / 2)
}

function game_over_screen () {
  if (!game_over_sound_played) {
    game_over_sound_played = true
    game_over_sound.play ()
  }
  background (0, 0, 0)
  fill (255)
  textSize (50)
  text ("GAME OVER", width / 2, height / 5)
  textSize (20)
  text ("Check your score and time on the top left corner", width / 2, height / 2.5)
  text ("The higher the score and the lower the time the better", width / 2, height / 2.5 + 25)
  image (retry_button, width * 0.2, height / 1.25, 150, 50);
  image (menu_button, width / 1.25, height / 1.25, 150, 50);
}

function win_screen () {
  if (!win_sound_played) {
    win_sound_played = true
    win_sound.play ()
  }
  background (0, 0, 0)
  fill (255)
  textSize (50)
  text ("YOU WIN!", width / 2, height / 5)
  textSize (20)
  text ("Check your score and time on the top left corner", width / 2, height / 2.5)
  text ("The higher the score and the lower the time the better", width / 2, height / 2.5 + 25)
  image (menu_singleplayer_button, width / 2, height / 1.25, 150, 50);
}

function overRect (x, y, w, h) {
  if ((mouseX > x) && (mouseX < x + w) && (mouseY > y) && (mouseY < y + h)) return true
  else return false
}

function mousePressed () {
  if (main_mode) {
    if (overRect (175, height / 2 - 25, 150, 50)) {
      button_clicked.play ()
      singleplayer_mode = true
      main_mode = false
      main_song.stop ()
      game_name.stop ()
    }
    if (overRect (475, height / 2 - 25, 150, 50)) {
      button_clicked.play ()
      multiplayer_mode = true
      main_mode = false
      main_song.stop ()
      game_name.stop ()
    }
  }
  else if (singleplayer_mode) {
    if (game_over) {
      if (overRect (width * 0.2 - 75, height / 1.25 - 25, 150, 50)) {
        game_over = false
        game_over_sound.stop ()
        game_over_sound_played = false
        reset_singleplayer ()
      }
      if (overRect (width / 1.25 - 75, height / 1.25 - 25, 150, 50)) {
        singleplayer_mode = false
        main_mode = true
        game_over = false
        game_over_sound.stop ()
        game_over_sound_played = false
        reset_singleplayer ()
      }
    }
    else if (win) {
      if (overRect (width / 2 - 75, height / 1.25 - 25, 150, 50)) {
        singleplayer_mode = false
        main_mode = true
        win = false
        win_sound.stop ()
        win_sound_played = false
        reset_singleplayer ()
      }
    }
  }
  else if (multiplayer_mode) {
    if (results) {
      if (overRect (width * 0.2 - 75, height / 1.5 - 25, 150, 50)) reset_multiplayer ()
      if (overRect (width / 1.25 - 75, height / 1.5 - 25, 150, 50)) {
        multiplayer_mode = false
        main_mode = true
        reset_multiplayer ()
      }
    }
  }
}

function reset_multiplayer () {
  button_clicked.play ()
  for (let i = 0; i < player_1_blocks.length; i++) {
    player_1_blocks[i].destroy ()
    player_2_blocks[i].destroy ()
  }
  multiplayer_results_audio.stop ()
  multiplayer_results_audio_played = false
  score_1.elt.innerHTML = "00000"
  time_1.elt.innerHTML = "0:00.00"
  counter_1 = 0
  seconds_1 = 0
  minutes_1 = 0
  lives_number_1 = 3
  lives_1 = "Lives " + lives_number_1
  player_1_paddle.set_x (190)
  player_1_paddle_ball = true
  player_1_degrees = true
  player_1_ball.setSpeed (0, 0)
  player_1_ball_s = 5
  player_1_ball_d = -1
  player_1_ball.position.x = player_1_paddle.get_x ()
  player_1_ball.position.y = player_1_paddle.get_y () - player_1_paddle.get_h () / 2 - multiplayer_ball_r / 2
  player_1_block_counter = 0
  score_2.elt.innerHTML = "00000"
  time_2.elt.innerHTML = "0:00.00"
  counter_2 = 0
  seconds_2 = 0
  minutes_2 = 0
  lives_number_2 = 3
  lives_2 = "Lives " + lives_number_1
  player_2_paddle.set_x (610)
  player_2_paddle_ball = true
  player_2_degrees = true
  player_2_ball.setSpeed (0, 0)
  player_2_ball_s = 5
  player_2_ball_d = -1
  player_2_ball.position.x = player_2_paddle.get_x ()
  player_2_ball.position.y = player_2_paddle.get_y () - player_2_paddle.get_h () / 2 - multiplayer_ball_r / 2
  player_2_block_counter = 0
  multiplayer_reposition_blocks = true
  player_1_done = false
  player_2_done = false
  first_player_finished = false
  results = false
}

function reset_singleplayer () {
  button_clicked.play ()
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].destroy ()
  }
  score_1.elt.innerHTML = "00000"
  time_1.elt.innerHTML = "0:00.00"
  counter_1 = 0
  seconds_1 = 0
  minutes_1 = 0
  lives_number_1 = 3
  lives_1 = "Lives " + lives_number_1
  paddle.set_x (width / 2)
  paddle_ball = true
  degrees = true
  ball.animation.changeFrame (int (random (0, 30)))
  ball.setSpeed (0, 0)
  ball_s = 5
  ball_d = -1
  ball.position.x = paddle.get_x ()
  ball.position.y = paddle.get_y () - paddle.get_h () / 2 - ball_r / 2
  block_counter = 0
  reposition_blocks = true
}

function keyPressed () {
  if (key == "p" || key == "P") {
    if (pause) {
      pause = false
      pause_velocity = true
    }
    else pause = true
  }
  return false
}

window.onload = function () {
  ball_s = 5
  ball_v = []
  blocks = []
  blocks_counter = 0
  collisions = []
  reposition_blocks = false
  pause = false
  paused = false
  paddle_ball = true
  reset = false
  degrees = true
  pause_velocity = false
  lose = false
  game_over_sound_played = false
  win_sound_played = false
  multiplayer_reposition_blocks = false
  music = false
  game_name_played = false
  main_mode = true
  singleplayer_mode = false
  multiplayer_mode = false
  first_player_finished = false
  multiplayer_results_audio_played = false
  results = false
  lives_number_1 = 3
  lives_1 = "Lives " + lives_number_1
  lives_number_2 = 3
  lives_2 = "Lives " + lives_number_2
  minutes_1 = 0
  seconds_1 = 0
  counter_1 = 0
  minutes_2 = 0
  seconds_2 = 0
  counter_2 = 0
  time_1 = select ("#time1")
  time_2 = select ("#time2")
  score_1 = select ("#score1")
  score_2 = select ("#score2")
  player_1_blocks = []
  player_1_block_counter = 0
  player_1_collisions = []
  player_1_done = false
  player_1_reset = false
  player_1_paddle_ball = true
  player_1_degrees = true
  player_1_ball_s = 5
  player_1_ball_v = []
  player_2_blocks = []
  player_2_block_counter = 0
  player_2_collisions = []
  player_2_done = false
  player_2_reset = false
  player_2_paddle_ball = true
  player_2_degrees = true
  player_2_ball_s = 5
  player_2_ball_v = []
}