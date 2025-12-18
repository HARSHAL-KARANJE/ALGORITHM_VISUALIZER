const container = document.getElementById("array-container");
const goBtn = document.getElementById("goBtn");
const newArrayBtn = document.getElementById("newArray");

const selectionBtn = document.getElementById("selectionBtn");
const quickSort = document.getElementById("quickSort");

const sizeSlider = document.getElementById("sizeSlider");
const sizeValue = document.getElementById("sizeValue");

const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");

let speed = parseInt(speedSlider.value);
let delay = calculateDelay(speed);
let array = [];
let size = parseInt(sizeSlider.value);


/*sizeSlider.value is always a string in HTML, even if the slider shows a number
    e.g., "20"
    parseInt converts it to a number 20
    This is important because arithmetic operations or loops need numbers, not strings*/

function calculateDelay(speed) {
  return 1000 / speed;
}

sizeSlider.addEventListener("input", function () {
  size = parseInt(this.value);
  sizeValue.innerText = size;
  generateArray();
});

speedSlider.addEventListener("input", function () {
  speed = parseInt(this.value);
  speedValue.innerHTML = speed;
  delay = calculateDelay(speed);
});

/*Math.random() → random decimal 0–1
* 300 → scale to 0–299
Math.floor() → round down to integer
+ 20 → make sure minimum height = 20px*/

function generateArray() {
  container.innerHTML = ""; // remove previous array
  array = [];

  for (let i = 0; i < size; i++) {
    let value = Math.floor(Math.random() * 300) + 20;
    array.push(value);

    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    bar.style.width = `${Math.floor(600 / size) - 2}px`; // 600px container width
                                                         // Dynamic width so all bars fit in container
    let barWidth = Math.floor(600 / size) - 2;           // 600 = container width, 2px margin
    bar.style.width = `${barWidth}px`;
    container.appendChild(bar);
  }
}


// Delay function for animation
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


// Bubble Sort Visualization
async function bubbleSort() {
  const bars = document.querySelectorAll(".bar");

  selectionBtn.disabled = true;
  newArrayBtn.disabled = true;
  goBtn.disabled = true;
  quickSort.disabled = true;

  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      // Highlight bars being compared
      bars[j].classList.add("compare");
      bars[j + 1].classList.add("compare");

      await sleep(delay + 50);

      if (array[j] > array[j + 1]) {
        // Swap values in array
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;

        // Swap bar heights
        bars[j].style.height = `${array[j]}px`;
        bars[j + 1].style.height = `${array[j + 1]}px`;
      }

      // Reset colors
      bars[j].classList.remove("compare");
      bars[j + 1].classList.remove("compare");
    }

    // Mark last sorted element
    bars[array.length - i - 1].classList.add("sorted");
  }

  // Mark first element sorted
  bars[0].classList.add("sorted");

  // enable buttons after sorting
  selectionBtn.disabled = false;
  newArrayBtn.disabled = false;
  goBtn.disabled = false;
  quickSort.disabled = false;
}

// selection sort algorithm
async function selectionSort() {
  const bars = document.querySelectorAll(".bar");

  // disable buttons during sorting
  selectionBtn.disabled = true;
  newArrayBtn.disabled = true;
  goBtn.disabled = true;
  quickSort.disabled = true;

  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    bars[minIdx].classList.add("min");

    for (let j = i + 1; j < array.length; j++) {
      bars[j].classList.add("compare");
      await sleep(delay);

      if (array[j] < array[minIdx]) {
        // remove previous min highlight
        if (minIdx !== i) bars[minIdx].classList.remove("min");
        minIdx = j;
        bars[minIdx].classList.add("min");
      }

      bars[j].classList.remove("compare");
    }

    // Small delay before swap for smoothness
    await sleep(delay);

    // Swap if needed
    if (i !== minIdx) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      bars[i].style.height = `${array[i]}px`;
      bars[minIdx].style.height = `${array[minIdx]}px`;

      // Small delay after swap to render visually
      await sleep(delay);
    }

    // Remove min highlight (both i and minIdx to be safe)
    bars[minIdx].classList.remove("min");
    bars[i].classList.remove("min");

    // Mark the bar as sorted
    bars[i].classList.add("sorted");
  }

  // enable buttons after sorting
  selectionBtn.disabled = false;
  newArrayBtn.disabled = false;
  goBtn.disabled = false;
  quickSort.disabled = false;
}

//quick sort algorithm
async function QuickSort(low, high) {
  const bars = document.querySelectorAll(".bar");

  // base case
  if (low > high) return;

  if (low === high) {
    bars[low].classList.add("sorted");
    return;
  }

  // choose pivot
  let pivot = array[low];
  let p = low + 1;
  let q = high;

  bars[low].classList.add("min"); // pivot

  // initial pointer colors
  if (p <= high) bars[p].classList.add("p-pointer");
  bars[q].classList.add("q-pointer");

  await sleep(delay);

  while (p <= q) {
    // move p to right
    while (p <= high && array[p] <= pivot) {
      bars[p].classList.add("compare");
      await sleep(delay);
      bars[p].classList.remove("compare");

      bars[p].classList.remove("p-pointer");
      p++;

      if (p <= high) bars[p].classList.add("p-pointer");
    }

    // move q to left
    while (array[q] > pivot) {
      bars[q].classList.add("compare");
      await sleep(delay);
      bars[q].classList.remove("compare");

      bars[q].classList.remove("q-pointer");
      q--;

      bars[q].classList.add("q-pointer");
    }

    // swap p and q
    if (p < q) {
      [array[p], array[q]] = [array[q], array[p]];
      bars[p].style.height = `${array[p]}px`;
      bars[q].style.height = `${array[q]}px`;
      await sleep(delay);
    }
  }

  // cleanup pointers
  if (p <= high) bars[p]?.classList.remove("p-pointer");
  bars[q]?.classList.remove("q-pointer");

  // pivot swap
  [array[low], array[q]] = [array[q], array[low]];
  bars[low].style.height = `${array[low]}px`;
  bars[q].style.height = `${array[q]}px`;

  bars[low].classList.remove("min");
  bars[q].classList.add("sorted");

  await sleep(delay);

  // recursive calls
  await QuickSort(low, q - 1);
  await QuickSort(q + 1, high);
}

// Event listeners for buttons
goBtn.addEventListener("click", bubbleSort);
newArrayBtn.addEventListener("click", generateArray);
selectionBtn.addEventListener("click", selectionSort);

quickSort.addEventListener("click", async () => {
  selectionBtn.disabled = true;
  newArrayBtn.disabled = true;
  goBtn.disabled = true;
  quickSort.disabled = true;

  await QuickSort(0, array.length - 1);

  selectionBtn.disabled = false;
  newArrayBtn.disabled = false;
  goBtn.disabled = false;
  quickSort.disabled = false;
});

// Generate initial array
generateArray();
