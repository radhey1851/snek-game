import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { setScore, incrementLevel } from '../redux/actions/score';
import { connect } from 'react-redux';

const PlayArea = ({ score: { score, level }, setScore, incrementLevel }) => {
  const [gameover, setgameover] = useState(false);
  let lvl = level;
  let curr_score = score;

  let myRef = React.createRef();
  let canvas;
  const BOX = 20;

  const UP = 38;
  const DOWN = 40;
  const LEFT = 37;
  const RIGHT = 39;

  let hangTime = false;
  const speed = 1;
  let curr_direction = RIGHT;

  let apple = {
    x: null,
    y: null
  };

  let snek = {
    x: 3 * BOX,
    y: 3 * BOX,
    vel_x: speed,
    vel_y: 0,
    tail: []
  };
  snek.tail.push([snek.x, snek.y]);

  let rows, cols, ctx;

  function appleIsEaten() {
    if (snek.x === apple.x && snek.y === apple.y) {
      return true;
    }
    return false;
  }

  function bindArrowKeys() {
    window.onkeydown = e => {
      if (hangTime) return;
      let hang = 80;
      switch (e.keyCode) {
        case UP:
          if (curr_direction !== DOWN) {
            snek.vel_y = -speed;
            snek.vel_x = 0;
            curr_direction = UP;
            hangTime = true;
            setTimeout(() => {
              hangTime = false;
            }, hang);
          }
          break;
        case DOWN:
          if (curr_direction !== UP) {
            snek.vel_x = 0;
            snek.vel_y = speed;
            curr_direction = DOWN;
            hangTime = true;

            setTimeout(() => {
              hangTime = false;
            }, hang);
          }
          break;
        case LEFT:
          if (curr_direction !== RIGHT) {
            snek.vel_x = -speed;
            snek.vel_y = 0;
            hangTime = true;
            curr_direction = LEFT;
            setTimeout(() => {
              hangTime = false;
            }, hang);
          }
          break;
        case RIGHT:
          if (curr_direction !== LEFT) {
            snek.vel_x = speed;
            snek.vel_y = 0;
            hangTime = true;
            curr_direction = RIGHT;
            setTimeout(() => {
              hangTime = false;
            }, hang);
          }
          break;

        default:
          break;
      }
    };
  }

  function death() {
    let dead = false;

    if (
      snek.x > canvas.width - 2 * BOX ||
      snek.x < 20 ||
      snek.y > canvas.height - 2 * BOX ||
      snek.y < 20
    )
      dead = true;
    snek.tail.slice(1).forEach(node => {
      if (snek.x === node[0] && snek.y === node[1]) dead = true;
    });
    return dead;
  }

  function draw() {
    let gameOver = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //move snek head
    snek.x += snek.vel_x * BOX;
    snek.y += snek.vel_y * BOX;
    let head = JSON.parse(JSON.stringify([snek.x, snek.y]));

    if (appleIsEaten()) {
      // Increase Size
      snek.tail = [head, ...snek.tail];
      setScore();
      curr_score += 5;
      if (curr_score % 10 === 0) {
        lvl++;
        incrementLevel();
      }

      spawnApple();
    } else {
      snek.tail = [head, ...snek.tail.slice(0, -1)];
    }

    snek.tail.forEach((part, index) => {
      ctx.fillStyle = 'white';
      ctx.fillRect(part[0], part[1], BOX, BOX);
      ctx.fillStyle = 'gray';
      ctx.strokeRect(part[0], part[1], BOX, BOX);
    });

    //Draw apple
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, BOX, BOX);

    //Check for crash
    if (death()) {
      gameOver = true;
      setgameover(true);
      gameOverScreen();
    }

    if (!gameOver) {
      setTimeout(() => requestAnimationFrame(draw), 1000 / (9 + lvl)); // to increase speed
    }
  }

  function gameOverScreen() {
    console.log('gameOver');
    ctx.fillStyle = 'red';

    ctx.font = '48px arcade';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', (rows * BOX) / 2, (rows * BOX) / 2);
  }

  function init() {
    ctx.fillRect(snek.x, snek.y, BOX, BOX);
    bindArrowKeys();
    spawnApple();
    draw();
  }

  // To see if apple spawned over something existing
  function isLegalSpawn(x, y) {
    let flag = true;
    snek.tail.forEach(node => {
      if (node[0] === x * BOX && node[1] === y * BOX) flag = false;
    });
    return flag;
  }

  function spawnApple() {
    let x, y;
    do {
      // (max-min+1)+min so as to not spawn on edge
      x = Math.floor(Math.random() * (cols - 2 - 2 + 1) + 2);
      y = Math.floor(Math.random() * (rows - 2 - 2 + 1) + 2);
    } while (!isLegalSpawn(x, y));

    apple.x = x * BOX;
    apple.y = y * BOX;
  }

  useEffect(() => {
    canvas = myRef.current;
    ctx = canvas.getContext('2d');

    rows = Math.floor(canvas.height / BOX);
    cols = Math.floor(canvas.width / BOX);

    init();
  }, []);

  return (
    <div className='Console DisplayArea'>
      <h1>~Snek game~</h1>

      <canvas ref={myRef} id='canvas' width='500' height='500' />
      <a
        id='replay'
        onClick={() => window.location.reload()}
        className={gameover ? 'gameover' : ''}
        href='/'
      >
        Play{'   '}Again?
      </a>
    </div>
  );
};

PlayArea.propTypes = {
  setScore: PropTypes.func.isRequired,
  score: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  score: state.score
});

export default connect(
  mapStateToProps,
  { setScore, incrementLevel }
)(PlayArea);
