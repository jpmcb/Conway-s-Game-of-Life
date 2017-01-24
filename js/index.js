'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// CONWAYS GAME OF LIFE //

// -- Rules for reference --//
// 1. Any live cell with fewer than 2 neighbors will die
// 2. Any live cell with 2 or 3 neighbors lives on
// 3. Any live cell with 4 or more nieghbors will die
// 4. Any 'dead' cell with exactly 3 neights becomes live

//game board variables and numbers to be used through code
var boardSize = 9216; // the constant between columns is 128
var boardStatus = [];
var nextBoard = [];
var generations = 0;

// create JSX for React App class
function createBoard() {
  var boardArr = [];

  for (var i = 0; i < boardSize; i++) {
    var random = Math.random(); //random board generation on start
    if (random > 0.5) {
      boardArr.push(React.createElement('div', { id: i, className: 'cell alive', onClick: GameOfLife.cellClick }));
      boardStatus[i] = 'alive';
    } else if (random < 0.5) {
      boardArr.push(React.createElement('div', { id: i, className: 'cell dead', onClick: GameOfLife.cellClick }));
      boardStatus[i] = 'dead';
    }
  }

  return React.createElement(
    'div',
    { id: 'game-board' },
    boardArr
  );
}

// -- GAME OBJECT & METHODS --//
var GameOfLife = {
  game: 'running', //is the game pause or running?

  cellClick: function cellClick(event) {
    //console.log('you clicked ' + event.target.id);
    if (boardStatus[event.target.id] == 'dead') {
      boardStatus[event.target.id] = 'alive';
      document.getElementById(event.target.id).className = 'cell alive';
    } else if (boardStatus[event.target.id] == 'alive') {
      boardStatus[event.target.id] = 'dead';
      document.getElementById(event.target.id).className = 'cell dead';
    } else if (boardStatus[event.target.id] == 'born') {
      boardStatus[event.target.id] = 'alive';
      document.getElementById(event.target.id).className = 'cell alive';
    }
  },

  generation: function generation() {
    //first step in evaluating current array
    for (var i = 0; i < boardStatus.length; i++) {
      switch (boardStatus[i]) {
        case 'dead':
          GameOfLife.dead(i);
          break;
        case 'alive':
          GameOfLife.alive(i);
          break;
        case 'born':
          boardStatus[i] = 'alive';
          GameOfLife.alive(i);
          break;
      }
    }

    GameOfLife.evaluate();
  },

  evaluate: function evaluate() {
    //second step to add / remove classes from array
    for (var i = 0; i < nextBoard.length; i++) {
      switch (nextBoard[i]) {
        case 'dead':
          document.getElementById(i).className = 'cell dead';
          break;
        case 'alive':
          document.getElementById(i).className = 'cell alive';
          break;
        case 'born':
          document.getElementById(i).className = 'cell born';
          break;
      }
    }

    document.getElementById('gen-count').innerHTML = generations;
    generations++;
    boardStatus = nextBoard; //make the current generation equal the evaluation and ...
    nextBoard = []; // clear out the evaluation array
  },

  alive: function alive(index) {
    //object method to check if a live cell will die the next generation
    var count = 0;

    function checkAdd(x) {
      switch (boardStatus[index + x]) {
        case 'alive':
          count++;
          break;
        case 'born':
          count++;
          break;
        case 'dead':
          break;
      }
    }

    // check all eight blocks around current evaluation
    checkAdd(1);
    checkAdd(-1);
    checkAdd(128);
    checkAdd(-128);
    checkAdd(128 + 1);
    checkAdd(128 - 1);
    checkAdd(-128 - 1);
    checkAdd(-128 + 1);

    // fufill the rules of the game
    if (count >= 4) {
      nextBoard[index] = 'dead';
    } else if (count == 2 || count == 3) {
      nextBoard[index] = 'alive';
    } else if (count < 2) {
      nextBoard[index] = 'dead';
    }
  },

  dead: function dead(index) {
    var count = 0;
    function checkAdd(x) {
      switch (boardStatus[index + x]) {
        case 'alive':
          count++;
          break;
        case 'born':
          count++;
          break;
        case 'dead':
          break;
      }
    }

    //check the eight blocks around current evaluation
    checkAdd(1);
    checkAdd(-1);
    checkAdd(128);
    checkAdd(-128);
    checkAdd(128 + 1);
    checkAdd(128 - 1);
    checkAdd(-128 - 1);
    checkAdd(-128 + 1);

    //fufill the rules of the game
    if (count == 3) {
      nextBoard[index] = 'born';
    } else {
      nextBoard[index] = 'dead';
    }
  }
};

// -- React code to generate board --//

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  App.prototype.render = function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        null,
        'CONWAY\'S GAME OF LIFE'
      ),
      createBoard()
    );
  };

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));

// start the game onload and declare functions for buttons
window.onload = function () {
  var timeoutID = window.setInterval(GameOfLife.generation, 250);
  var pauseButton = document.getElementById('pause');

  function pause() {
    GameOfLife.game == 'pause' ? GameOfLife.game = 'running' : GameOfLife.game = 'pause';
    GameOfLife.game == 'pause' ? clearInterval(timeoutID) : timeoutID = window.setInterval(GameOfLife.generation, 250);

    pauseButton.innerHTML == 'Pause' ? pauseButton.innerHTML = 'Start' : pauseButton.innerHTML = 'Pause';
  }

  pauseButton.onclick = pause;

  document.getElementById('clear').onclick = function () {
    for (var i = 0; i < boardStatus.length; i++) {
      nextBoard[i] = 'dead';
    }

    GameOfLife.game = 'pause';
    pauseButton.innerHTML = 'Start';
    clearInterval(timeoutID);
    generations = 0;
    GameOfLife.evaluate();
  };
};