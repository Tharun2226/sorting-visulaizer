const arrayContainer = document.getElementById("arrayContainer");
const arraySizeSlider = document.getElementById("arraySize");
const speedSlider = document.getElementById("speed");
const resetArrayBtn = document.getElementById("resetArray");
const sortBtn = document.getElementById("sort");
const pauseBtn = document.getElementById("pause");
const algorithmSelect = document.getElementById("algorithm");
const operationCount = document.getElementById("operationCount");
const sizeValue = document.getElementById("sizeValue");
const speedValue = document.getElementById("speedValue");

let array = [];
let delay = 51; // Initial delay for speed 50 (101 - 50 = 51)
let operations = 0;
let isSorting = false;
let isPaused = false;

function updateSliderBackground(slider) {
  const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background = `linear-gradient(to right, #3498db 0%, #3498db ${value}%, #ecf0f1 ${value}%, #ecf0f1 100%)`;
}

arraySizeSlider.addEventListener("input", () => {
  resetArray();
  sizeValue.textContent = arraySizeSlider.value;
  updateSliderBackground(arraySizeSlider);
});
speedSlider.addEventListener("input", () => {
  delay = 101 - speedSlider.value; // Inverted: 1 = 100ms (slow), 100 = 1ms (fast)
  speedValue.textContent = speedSlider.value;
  updateSliderBackground(speedSlider);
});
algorithmSelect.addEventListener("change", updateSortButtonText);
resetArrayBtn.addEventListener("click", () => {
  // Stop sorting immediately
  isSorting = false;
  isPaused = false;

  // Reset operations counter first
  operations = 0;
  updateOperationCount();

  sortBtn.style.display = "block";
  sortBtn.disabled = false;
  pauseBtn.style.display = "none";
  pauseBtn.textContent = "Pause";

  // Enable all controls
  arraySizeSlider.disabled = false;
  speedSlider.disabled = false;
  algorithmSelect.disabled = false;
  resetArrayBtn.disabled = false;

  // Reset sliders to 50
  arraySizeSlider.value = 50;
  speedSlider.value = 50;
  delay = 51; // 101 - 50 = 51

  sizeValue.textContent = "50";
  speedValue.textContent = "50";

  updateSliderBackground(arraySizeSlider);
  updateSliderBackground(speedSlider);

  // Reset array (which also resets operations, but we already did it above)
  arrayContainer.innerHTML = "";
  array = Array.from({ length: 50 }, () => Math.floor(Math.random() * 400) + 1);
  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    arrayContainer.appendChild(bar);
  });
});
sortBtn.addEventListener("click", startSorting);
pauseBtn.addEventListener("click", pauseSorting);

function updateSortButtonText() {
  sortBtn.textContent = "START";
}

function resetArray() {
  arrayContainer.innerHTML = "";
  operations = 0;
  updateOperationCount();
  array = Array.from(
    { length: arraySizeSlider.value },
    () => Math.floor(Math.random() * 400) + 1
  );

  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    arrayContainer.appendChild(bar);
  });
}

// Initialize slider backgrounds on page load
window.addEventListener("DOMContentLoaded", () => {
  updateSliderBackground(arraySizeSlider);
  updateSliderBackground(speedSlider);
  resetArray();
});

async function startSorting() {
  if (isSorting) return;
  isSorting = true;
  isPaused = false;
  disableControls();
  sortBtn.style.display = "none";
  pauseBtn.style.display = "block";
  pauseBtn.disabled = false;
  const algorithm = algorithmSelect.value;
  if (algorithm === "bubbleSort") await bubbleSort();
  else if (algorithm === "insertionSort") await insertionSort();
  else if (algorithm === "selectionSort") await selectionSort();
  else if (algorithm === "quickSort") await quickSort();
  else if (algorithm === "mergeSort") await mergeSort();
  else if (algorithm === "heapSort") await heapSort();
  isSorting = false;
  enableControls();
}

function pauseSorting() {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";
}

function disableControls() {
  arraySizeSlider.disabled = true;
  speedSlider.disabled = true;
  algorithmSelect.disabled = true;
  resetArrayBtn.disabled = false;
  sortBtn.disabled = true;
}

function enableControls() {
  arraySizeSlider.disabled = false;
  speedSlider.disabled = false;
  resetArrayBtn.disabled = false;
  sortBtn.disabled = false;
  algorithmSelect.disabled = false;
  sortBtn.style.display = "block";
  pauseBtn.style.display = "none";
  pauseBtn.textContent = "Pause";
}

function updateOperationCount() {
  operationCount.textContent = `Operations: ${operations}`;
}

async function pause() {
  await new Promise((resolve) => setTimeout(resolve, delay));
  while (isPaused) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// Bubble Sort
async function bubbleSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < array.length - 1; i++) {
    if (!isSorting) break;
    for (let j = 0; j < array.length - i - 1; j++) {
      if (!isSorting) break;
      bars[j].style.backgroundColor = "red";
      bars[j + 1].style.backgroundColor = "red";
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = `${array[j]}px`;
        bars[j + 1].style.height = `${array[j + 1]}px`;
        operations++;
        updateOperationCount();
        await pause();
      }
      bars[j].style.backgroundColor = "teal";
      bars[j + 1].style.backgroundColor = "teal";
    }
  }
}

// Insertion Sort
async function insertionSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    bars[i].style.backgroundColor = "red";
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      bars[j + 1].style.height = `${array[j + 1]}px`;
      bars[j + 1].style.backgroundColor = "red";
      operations++;
      updateOperationCount();
      await pause();
      bars[j + 1].style.backgroundColor = "teal";
      j--;
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${key}px`;
    bars[i].style.backgroundColor = "teal";
  }
}

// Selection Sort
async function selectionSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < array.length - 1; i++) {
    let minIdx = i;
    bars[i].style.backgroundColor = "red";
    for (let j = i + 1; j < array.length; j++) {
      bars[j].style.backgroundColor = "yellow";
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
      await pause();
      bars[j].style.backgroundColor = "teal";
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      bars[i].style.height = `${array[i]}px`;
      bars[minIdx].style.height = `${array[minIdx]}px`;
      operations++;
      updateOperationCount();
    }
    bars[i].style.backgroundColor = "teal";
  }
}

// Quick Sort
async function quickSort(low = 0, high = array.length - 1) {
  if (low < high) {
    const pivotIdx = await partition(low, high);
    await quickSort(low, pivotIdx - 1);
    await quickSort(pivotIdx + 1, high);
  }
}

async function partition(low, high) {
  const bars = document.querySelectorAll(".bar");
  let pivot = array[high];
  let i = low - 1;
  bars[high].style.backgroundColor = "red";
  for (let j = low; j < high; j++) {
    bars[j].style.backgroundColor = "yellow";
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      bars[i].style.height = `${array[i]}px`;
      bars[j].style.height = `${array[j]}px`;
      operations++;
      updateOperationCount();
      await pause();
    }
    bars[j].style.backgroundColor = "teal";
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  bars[i + 1].style.height = `${array[i + 1]}px`;
  bars[high].style.height = `${array[high]}px`;
  bars[high].style.backgroundColor = "teal";
  return i + 1;
}

// Merge Sort
async function mergeSort(low = 0, high = array.length - 1) {
  if (low < high) {
    const mid = Math.floor((low + high) / 2);
    await mergeSort(low, mid);
    await mergeSort(mid + 1, high);
    await merge(low, mid, high);
  }
}

async function merge(low, mid, high) {
  const bars = document.querySelectorAll(".bar");
  const leftArray = array.slice(low, mid + 1);
  const rightArray = array.slice(mid + 1, high + 1);

  let i = 0,
    j = 0,
    k = low;
  while (i < leftArray.length && j < rightArray.length) {
    if (leftArray[i] <= rightArray[j]) {
      array[k] = leftArray[i];
      i++;
    } else {
      array[k] = rightArray[j];
      j++;
    }
    bars[k].style.height = `${array[k]}px`;
    operations++;
    updateOperationCount();
    await pause();
    k++;
  }
  while (i < leftArray.length) {
    array[k] = leftArray[i];
    bars[k].style.height = `${array[k]}px`;
    i++;
    k++;
    operations++;
    updateOperationCount();
    await pause();
  }
  while (j < rightArray.length) {
    array[k] = rightArray[j];
    bars[k].style.height = `${array[k]}px`;
    j++;
    k++;
    operations++;
    updateOperationCount();
    await pause();
  }
}

// Heap Sort
async function heapSort() {
  const n = array.length;
  const bars = document.querySelectorAll(".bar");
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    bars[0].style.height = `${array[0]}px`;
    bars[i].style.height = `${array[i]}px`;
    operations++;
    updateOperationCount();
    await pause();
    await heapify(i, 0);
  }
}

async function heapify(n, i) {
  const bars = document.querySelectorAll(".bar");
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < n && array[left] > array[largest]) {
    largest = left;
  }
  if (right < n && array[right] > array[largest]) {
    largest = right;
  }
  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    bars[i].style.height = `${array[i]}px`;
    bars[largest].style.height = `${array[largest]}px`;
    operations++;
    updateOperationCount();
    await pause();
    await heapify(n, largest);
  }
}

// Initial array setup
resetArray();
