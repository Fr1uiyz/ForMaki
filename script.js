const puzzleContainer = document.getElementById('puzzle-container');
const shuffleButton = document.getElementById('shuffle-button');
const loadButton = document.getElementById('load-button');
const imageSelect = document.getElementById('image-select');
const gridSize = 6; // 4x4 grid
let pieces = [];
let currentImage = imageSelect.value;

// Create jigsaw pieces
function createPieces(image) {
  puzzleContainer.innerHTML = '';
  pieces = [];
  const pieceSize = puzzleContainer.clientWidth / gridSize;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const piece = document.createElement('div');
      piece.classList.add('puzzle-piece');
      piece.style.width = `${pieceSize}px`;
      piece.style.height = `${pieceSize}px`;
      piece.style.backgroundImage = `url('${image}')`;
      piece.style.backgroundSize = `${puzzleContainer.clientWidth}px ${puzzleContainer.clientHeight}px`;
      piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;

      piece.dataset.row = row;
      piece.dataset.col = col;
      piece.style.left = `${col * pieceSize}px`;
      piece.style.top = `${row * pieceSize}px`;

      piece.addEventListener('mousedown', startDrag);
      piece.addEventListener('touchstart', startDrag);

      puzzleContainer.appendChild(piece);
      pieces.push(piece);
    }
  }
}

// Shuffle pieces
function shufflePieces() {
  pieces.forEach(piece => {
    const maxX = puzzleContainer.clientWidth - piece.clientWidth;
    const maxY = puzzleContainer.clientHeight - piece.clientHeight;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    piece.style.left = `${randomX}px`;
    piece.style.top = `${randomY}px`;
  });
}

// Dragging functionality for both mouse and touch
let selectedPiece = null;
let offsetX, offsetY;

function startDrag(e) {
  e.preventDefault();
  selectedPiece = e.target;

  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;

  offsetX = clientX - selectedPiece.offsetLeft;
  offsetY = clientY - selectedPiece.offsetTop;

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', onDrag);
  document.addEventListener('touchend', stopDrag);
}

function onDrag(e) {
  if (selectedPiece) {
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    selectedPiece.style.left = `${clientX - offsetX}px`;
    selectedPiece.style.top = `${clientY - offsetY}px`;
  }
}

function stopDrag() {
  if (selectedPiece) {
    snapToGrid(selectedPiece); // Snap the piece only if it's inside the frame
  }
  selectedPiece = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', stopDrag);
}

// Snap the piece to the grid if it's inside the frame
function snapToGrid(piece) {
  const pieceSize = puzzleContainer.clientWidth / gridSize;
  const left = parseFloat(piece.style.left);
  const top = parseFloat(piece.style.top);

  const snappedLeft = Math.round(left / pieceSize) * pieceSize;
  const snappedTop = Math.round(top / pieceSize) * pieceSize;

  // Ensure the snapped piece stays within the puzzle container's bounds
  const maxX = puzzleContainer.clientWidth - piece.clientWidth;
  const maxY = puzzleContainer.clientHeight - piece.clientHeight;

  // Snap only if the piece is inside the puzzle container
  if (left >= 0 && left <= maxX && top >= 0 && top <= maxY) {
    piece.style.left = Math.max(0, Math.min(snappedLeft, maxX)) + 'px';
    piece.style.top = Math.max(0, Math.min(snappedTop, maxY)) + 'px';
  }
}

// Check for win condition
function checkWin() {
  const pieceSize = puzzleContainer.clientWidth / gridSize;
  let allCorrect = pieces.every(piece => {
    const row = parseInt(piece.dataset.row);
    const col = parseInt(piece.dataset.col);

    // Check if the piece's current position matches the correct position
    const pieceLeft = parseFloat(piece.style.left);
    const pieceTop = parseFloat(piece.style.top);
    const correctLeft = col * pieceSize;
    const correctTop = row * pieceSize;

    return (
      Math.abs(pieceLeft - correctLeft) < 5 && // Tolerance for small pixel differences
      Math.abs(pieceTop - correctTop) < 5
    );
  });

  if (allCorrect) {
    // alert('You Win!'); // Display an alert when the player wins
  }
}

// Load the selected image
function loadImage() {
  currentImage = imageSelect.value;
  createPieces(currentImage);
  shufflePieces();
}

// Reset the game
function resetGame() {
  loadImage();
}

// Event listeners
loadButton.addEventListener('click', loadImage);
shuffleButton.addEventListener('click', shufflePieces);
window.addEventListener('load', loadImage);
puzzleContainer.addEventListener('mouseup', checkWin); // Check win when the user finishes the drag
