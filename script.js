const container = document.getElementById("array-container");
const goBtn = document.getElementById("goBtn");
const newArrayBtn = document.getElementById("newArray");

const selectionBtn = document.getElementById("selectionBtn");
const quickSortBtn = document.getElementById("quickSort");

const sizeSlider = document.getElementById("sizeSlider");
const sizeValue = document.getElementById("sizeValue");

const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");

const timeComplexityDisplay = document.getElementById("timeComplexity");
const algoNameDisplay = document.getElementById("algoName");
const swapCountDisplay = document.getElementById("swapCount");
const comparisonCountDisplay = document.getElementById("comparisonCount");
const progressDisplay = document.getElementById("progress");

// initial values
let speed = parseInt(speedSlider.value); // convert string to number
let delay = calculateDelay(speed);       // calculate delay for animation
let array = [];
let size = parseInt(sizeSlider.value);   // convert string to number
let swapCount = 0;                       // to count swaps
let comparisonCount = 0;                 // to count comparisons

// store time complexitie
//   for display
const complexities = {// this is a nested javascript object ...each property such as buble asct like a struct and have a key valu pair 
  bubble: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
  selection: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
  quick: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" }
};

/* sizeSlider.value is always a string in HTML, even if the slider shows a number
    e.g., "20"
    parseInt converts it to a number 20
    This is important because arithmetic operations or loops need numbers, not strings*/

//HELPER FUNCTIONS( matlab to see the animation properly dealy and all)

// calculate delay for animation
function calculateDelay(speed) {
  return 1000 / speed; // Higher speed = smaller delay
}

// sleep function for animation
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// update swap and comparison count in HTML
function updateDisplays() {
  swapCountDisplay.innerText = swapCount;
  comparisonCountDisplay.innerText = comparisonCount;
}

// EVENT LISTENERS 
sizeSlider.addEventListener("input", function () {
  size = parseInt(this.value);   // update size from slider
  sizeValue.innerText = size;
  generateArray();               // regenerate array with new size
});

speedSlider.addEventListener("input", function () {
  speed = parseInt(this.value);  // update speed from slider
  speedValue.innerHTML = speed;
  delay = calculateDelay(speed); // recalculate delay
});

// ARRAY GENERATION 
function generateArray() {
  container.innerHTML = ""; // remove previous array
  array = [];
  swapCount = 0;            // reset swaps
  comparisonCount = 0;      // reset comparisons

  // reset UI.. when the page reload or algorithm is changed 
  timeComplexityDisplay.innerText = "N/A";
  algoNameDisplay.innerText = "N/A";
  swapCountDisplay.innerText = "0";
  comparisonCountDisplay.innerText = "0";
  progressDisplay.innerText = "0%";

  /* Math.random() → random decimal 0–1
     300 → scale to 0–299
     Math.floor() → round down to integer
     + 20 → make sure minimum height = 20px */
  for (let i = 0; i < size; i++) {
    let value = Math.floor(Math.random() * 300) + 20;
    array.push(value);

    const bar = document.createElement("div"); // create html element in memory
    bar.classList.add("bar");                  // attach CSS style .bar
    bar.style.height = `${value}px`;           // set height
   
    let barWidth = Math.floor(600 / size) - 2; // dynamic width so all bars fit
    bar.style.width = `${barWidth}px`;         // set width
    container.appendChild(bar);                // add bar to container
  }
}

// BUBBLE SORT 
async function bubbleSort() {
  const bars = document.querySelectorAll(".bar");

  // disable buttons during sorting....to avoid the restart 
  selectionBtn.disabled = true;
  newArrayBtn.disabled = true;
  goBtn.disabled = true;
  quickSortBtn.disabled = true;

  swapCount = 0;       // reset swap count
  comparisonCount = 0; // reset comparison count
  algoNameDisplay.innerText = "Bubble Sort"; 
  timeComplexityDisplay.innerText = `Best: ${complexities.bubble.best}, Avg: ${complexities.bubble.average}, Worst: ${complexities.bubble.worst}`;

  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      // Highlight bars being compared
      bars[j].classList.add("compare");
      bars[j + 1].classList.add("compare");

      comparisonCount++;    // increment comparison counter
      updateDisplays();     // update HTML

      await sleep(delay + 50); // wait for animation

      if (array[j] > array[j + 1]) {
        // Swap values in array.. bas array ki value change hue
        [array[j], array[j + 1]] = [array[j + 1], array[j]];

        // Swap bar heights .. bars ki height aur baki hai
        bars[j].style.height = `${array[j]}px`;
        bars[j + 1].style.height = `${array[j + 1]}px`;

        swapCount++;        // increment swap counter
        updateDisplays();   // update HTML
      }

      // Reset colors
      bars[j].classList.remove("compare");
      bars[j + 1].classList.remove("compare");
    }

    // Mark last sorted element
    bars[array.length - i - 1].classList.add("sorted");
    progressDisplay.innerText = `${Math.floor(((i + 1) / array.length) * 100)}%`; // update progress
  }

  // Mark first element sorted
  bars[0].classList.add("sorted");

  // enable buttons after sorting
  selectionBtn.disabled = false;
  newArrayBtn.disabled = false;
  goBtn.disabled = false;
  quickSortBtn.disabled = false;
  progressDisplay.innerText = "100%";
}

//SELECTION SORT 
async function selectionSort() {
  const bars = document.querySelectorAll(".bar");

  selectionBtn.disabled = true;
  newArrayBtn.disabled = true;
  goBtn.disabled = true;
  quickSortBtn.disabled = true;

  swapCount = 0;
  comparisonCount = 0;
  algoNameDisplay.innerText = "Selection Sort";
  timeComplexityDisplay.innerText = `Best: ${complexities.selection.best}, Avg: ${complexities.selection.average}, Worst: ${complexities.selection.worst}`;

  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    bars[minIdx].classList.add("min"); // highlight current min

    for (let j = i + 1; j < array.length; j++) {
      bars[j].classList.add("compare");

      comparisonCount++; // increment comparison
      updateDisplays();
      await sleep(delay);
      bars[j].classList.remove("compare");

      if (array[j] < array[minIdx]) {
        // remove previous min highlight
        if (minIdx !== i) bars[minIdx].classList.remove("min");
        minIdx = j;
        bars[minIdx].classList.add("min");
      }
    }

    await sleep(delay); // small delay before swap

    // Swap if needed
    if (i !== minIdx) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      bars[i].style.height = `${array[i]}px`;
      bars[minIdx].style.height = `${array[minIdx]}px`;

      swapCount++;
      updateDisplays(); // update swap count in HTML
      await sleep(delay); // small delay after swap
    }

    // Remove min highlight (both i and minIdx to be safe)
    bars[minIdx].classList.remove("min");
    bars[i].classList.remove("min");

    // Mark the bar as sorted
    bars[i].classList.add("sorted");
    progressDisplay.innerText = `${Math.floor(((i + 1) / array.length) * 100)}%`; // update progress
  }

  // enable buttons after sorting
  selectionBtn.disabled = false;
  newArrayBtn.disabled = false;
  goBtn.disabled = false;
  quickSortBtn.disabled = false;
  progressDisplay.innerText = "100%";
}

// QUICK SORT
async function QuickSort(low, high) {
  const bars = document.querySelectorAll(".bar");

  // base case
  if (low > high) return;

  if (low === high) {
    bars[low].classList.add("sorted"); // single element is sorted
    return;
  }

  // choose pivot
  let pivot = array[low];
  let p = low + 1;
  let q = high;

  bars[low].classList.add("min"); // highlight pivot

  // initial pointer colors
  if (p <= high) bars[p].classList.add("p-pointer");
  bars[q].classList.add("q-pointer");

  await sleep(delay);

  while (p <= q) {
    // move p to right
    while (p <= high && array[p] <= pivot) {
      bars[p].classList.add("compare");
      comparisonCount++;
      updateDisplays();
      await sleep(delay);
      bars[p].classList.remove("compare");

      bars[p].classList.remove("p-pointer");
      p++;

      if (p <= high) bars[p].classList.add("p-pointer");
    }

    // move q to left
    while (array[q] > pivot) {
      bars[q].classList.add("compare");
      comparisonCount++;
      updateDisplays();
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
      swapCount++;
      updateDisplays();
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

  swapCount++;
  updateDisplays();

  bars[low].classList.remove("min");
  bars[q].classList.add("sorted");

  await sleep(delay);

  // recursive calls
  await QuickSort(low, q - 1);
  await QuickSort(q + 1, high);
}

// BUTTON EVENT LISTENERS .....
goBtn.addEventListener("click", bubbleSort);
newArrayBtn.addEventListener("click", generateArray);
selectionBtn.addEventListener("click", selectionSort);

quickSortBtn.addEventListener("click", async () => {
  selectionBtn.disabled = true;
  newArrayBtn.disabled = true;
  goBtn.disabled = true;
  quickSortBtn.disabled = true;

  swapCount = 0;
  comparisonCount = 0;
  algoNameDisplay.innerText = "Quick Sort";
  timeComplexityDisplay.innerText = `Best: ${complexities.quick.best}, Avg: ${complexities.quick.average}, Worst: ${complexities.quick.worst}`;
  updateDisplays();

  await QuickSort(0, array.length - 1);

  selectionBtn.disabled = false;
  newArrayBtn.disabled = false;
  goBtn.disabled = false;
  quickSortBtn.disabled = false;
  progressDisplay.innerText = "100%";
});

// Generate initial array
generateArray(); // initial array for visualizer
