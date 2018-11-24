// Load application styles
import 'styles/index.less';
import { list } from 'postcss';

// ================================
// START YOUR APP HERE
// ================================

const numberInput = document.getElementById('number_input');
const selectedNumber = document.getElementsByClassName('selected_number')[0];
const argorithmButtons = document.getElementsByClassName('argorithm');
const argorithmParent = document.getElementsByClassName('select_argorithm')[0];
const startButton = document.getElementById('start_sorting');
const refreshButton = document.getElementById('refresh_sorting');
const playFrame = document.getElementsByClassName('play_frame')[0];

let inputNumbers = [];
let argorithm = '';
let timeOuts = [];
let timer = 1;

numberInput.addEventListener('keydown', addInputNumber);
argorithmParent.addEventListener('click', selectArgorithm);
startButton.addEventListener('click', startVisualize);
refreshButton.addEventListener('click', refreshAll);

function refreshAll(ev) {
  inputNumbers = [];
  argorithm = '';
  timer = [];

  for (let i = 0; i < argorithmButtons.length; i++) {
    if (argorithmButtons[i].classList.contains('active')) {
      argorithmButtons[i].classList.remove('active');
    }
  }

  for (let i = selectedNumber.children.length - 1; i > -1; i--) {
    selectedNumber.children[i].remove();
  }

  for (let i = playFrame.children.length - 1; i > -1; i--) {
    playFrame.children[i].remove();
  }

  for (let i = 0; i < timeOuts.length; i++) {
    clearTimeout(timeOuts[i]);
  }

  timeOuts = [];
}

function addInputNumber(ev) {
  if (ev.code === 'Enter') {
    if (inputNumbers.length < 10) {
      if ((ev.currentTarget.value !== '') && (ev.currentTarget.value !== undefined)) {
        inputNumbers.push(Number(ev.currentTarget.value));
        addNumberList(ev.currentTarget.value);
        numberInput.value = '';
      }
    } else {
      window.alert('10개 이하의 숫자까지만 가능합니다');
    }
  }
}

function addNumberList(inputNum) {
  let list = document.createElement('li');
  list.textContent = inputNum;
  list.className = 'input_value';
  selectedNumber.appendChild(list);
}

function selectArgorithm(ev) {
  const eventTarget =  ev.target.classList;

  if (eventTarget.contains('select_argorithm')) {
    return false;
  }

  for (let i = 0; i < argorithmButtons.length; i++) {
    if (argorithmButtons[i].classList.contains('active')) {
      argorithmButtons[i].classList.remove('active');
    }
  }

  eventTarget.add('active');
  argorithm = ev.target.textContent;
}


function startVisualize(ev) {
  if (!(inputNumbers.length < 5) && argorithm !== '') {
    makeBars();

    if (argorithm === 'Bubble Sort') {
      bubbleSort(inputNumbers);
    } else if (argorithm === 'Insertion Sort') {
      insertionSort(inputNumbers);
    } else if (argorithm === 'Merge Sort') {
      mergeSort(inputNumbers);
    } else if (argorithm === 'Selection Sort') {
      selectionSort(inputNumbers);
    }
  } else {
    window.alert('입력한 숫자가 5개 미만이거나, 알고리즘이 선택되지 않았습니다.');
  }

  function makeBars() {
    let max = Math.max(...inputNumbers);

    for (let i = 0; i < inputNumbers.length; i++) {
      let bar = document.createElement('li');

      bar.classList.add('bars');
      bar.textContent = inputNumbers[i];
      bar.style.height = inputNumbers[i] * 170 / max + 'px';
      playFrame.appendChild(bar);
    }
  }
}

function selectionSort(numberArray) {
  for (let i = 0; i < numberArray.length - 1; i++) {
    let minimumNum = i;
    let saveMinimum = minimumNum

    timeOuts.push(setTimeout(() => selectMinimumTimeOut(saveMinimum), 1000 * timer));
    timer++;

    for (let j = i + 1; j < numberArray.length; j++) {
      let saveData = numberArray.slice();
      let saveMinimum = minimumNum;

      timeOuts.push(setTimeout(() => changeMinimumTimeOut(saveData, saveMinimum, j), 1000 * timer));
      timer++;

      if (numberArray[minimumNum] > numberArray[j]) {
        minimumNum = j;
      }
    }

    timeOuts.push(setTimeout(() => changePositionTimeOut(minimumNum, i), 1000 * timer));
    timer++;

    if (minimumNum !== i) {
      swap(numberArray, minimumNum, i);
    }
  }

  timeOuts.push(setTimeout(() => finalPhase(), 1000 * timer));
}

function selectMinimumTimeOut(minimumNum) {
  const bars = document.getElementsByClassName('bars');

  bars[minimumNum].style.backgroundColor = 'paleturquoise';
  bars[minimumNum].style.borderColor = 'red';
}

function changeMinimumTimeOut(data, minimumNum, index) {
  const bars = document.getElementsByClassName('bars');

  bars[index].style.backgroundColor = 'rgba(175, 238, 238, 0.3)';

  timeOuts.push(setTimeout(() => {
    if (data[minimumNum] > data[index]) {
      bars[minimumNum].style.borderColor = '';
      bars[index].style.borderColor = 'red';
    }

    bars[index].style.backgroundColor = '';
  }, 500));
}


function changePositionTimeOut(minimumNum, iterationIndex) {
  const bars = document.getElementsByClassName('bars');

  if (minimumNum !== iterationIndex) {
    bars[iterationIndex].parentNode.insertBefore(bars[minimumNum], bars[iterationIndex]);
    bars[iterationIndex].parentNode.insertBefore(bars[iterationIndex + 1], bars[minimumNum + 1]);

    timeOuts.push(setTimeout(() => {
      bars[iterationIndex].style.borderColor = '';
      bars[minimumNum].style.backgroundColor = '';
    }, 500));
  } else {
    bars[iterationIndex].style.backgroundColor = '';
    bars[iterationIndex].style.borderColor = '';
  }
}

function mergeSort(numberArray) {
  const saveLength = numberArray.length;
  if (saveLength === 1) {
    return numberArray;
  }

  // const saveData = numberArray.slice();
  const midNum = Math.floor(saveLength / 2);
  const left = numberArray.slice(0, midNum);
  const right = numberArray.slice(midNum);
  timeOuts.push(setTimeout((() => divideTimeOut(left, saveLength, midNum)), 1000 * timer));
  timer++;

  return mergeArray(mergeSort(left), mergeSort(right));
}

function mergeArray(left, right) {
  const bars = document.getElementsByClassName('bars');
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  let saveLeft = left.slice();
  let saveRight = right.slice();

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      let saveIndex = leftIndex;
      let saveOppsite = rightIndex;
      timeOuts.push(setTimeout((() => mergeTimeOut(saveLeft[saveIndex], saveRight, saveOppsite)), 1000 * timer));
      timer++;
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      let saveIndex = rightIndex;
      let saveOppsite = leftIndex;
      timeOuts.push(setTimeout((() => mergeTimeOut(saveRight[saveIndex], saveLeft, saveOppsite)), 1000 * timer));
      timer++;
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  while (leftIndex < left.length) {
    let saveIndex = leftIndex;
    let saveOppsite = rightIndex;
    timeOuts.push(setTimeout((() => mergeTimeOut(saveLeft[saveIndex], saveRight, saveOppsite)), 1000 * timer));
    timer++;
    result.push(left[leftIndex]);
    leftIndex++;
  }

  while (rightIndex < right.length) {
    let saveIndex = rightIndex;
    let saveOppsite = leftIndex;
    timeOuts.push(setTimeout((() => mergeTimeOut(saveRight[saveIndex], saveLeft, saveOppsite)), 1000 * timer));
    timer++;
    result.push(right[rightIndex]);
    rightIndex++;
  }

  timeOuts.push(setTimeout((() => rollBackTimeOut()), 1000 * timer));
  timer++;

  if (result.length === bars.length) {
    timeOuts.push(setTimeout((() => { finalPhase(); }), 1000 * timer));
  }

  return result;
}

function rollBackTimeOut() {
  const bars = document.getElementsByClassName('bars');

  for (let i = 0; i < bars.length; i++) {
    bars[i].style.top = '60px';
  }
}

function mergeTimeOut(value, opposite, oppositeIndex) {
  debugger;
  const bars = document.getElementsByClassName('bars');
  let target;

  if (opposite[oppositeIndex] !== undefined) {
    for (let i = 0; i < bars.length; i++) {
      if (opposite[oppositeIndex] === Number(bars[i].textContent)) {
        target = bars[i];
      }
    }
  }

  for (let i = 0; i < bars.length; i++) {
    if (value === Number(bars[i].textContent)) {
      bars[i].style.marginRight = '5px';
      bars[i].style.marginLeft = '5px';
      bars[i].style.top = '250px';
      if (target !== undefined) {
        bars[i].parentNode.insertBefore(bars[i], target);
      }
    }
  }
}

function divideTimeOut(left, length, mid) {
  const bars = document.getElementsByClassName('bars');

  for (let i = 0; i < bars.length; i++) {
    if (left[left.length-1] === Number(bars[i].textContent)) {
      bars[i].style.marginRight = '20px';
      bars[i + 1].style.marginLeft = '20px';
    }
  }
}

function insertionSort(numberArray) {
  for (let i = 1; i < numberArray.length; i++) {
    let saveData = numberArray.slice();
    let currentValue = numberArray[i];
    let saveIndex;

    timeOuts.push(setTimeout((() => saveValueTimeOut(i, saveData)), 800 * timer));
    timer++;

    for (let j = i - 1; j > -1 && numberArray[j] > currentValue; j--) {
      timeOuts.push(setTimeout((() => changeSeqTimeOut(i,j)), 800 * timer));
      timer++;
      numberArray[j + 1] = numberArray[j];
      saveIndex = j;
    }

    timeOuts.push(setTimeout((() => changeValueTimeOut(i,saveIndex)), 800 * timer));
    timer++;
    numberArray[saveIndex] = currentValue;
  }
}

function saveValueTimeOut(iterationIndex, saveData) {
  debugger;
  let bars = document.getElementsByClassName('bars');
  let max = Math.max(...saveData);
  let barHeight = (saveData[iterationIndex] * 170 / max) + 65 + 'px';

  bars[iterationIndex].style.backgroundColor = 'paleturquoise';
  timeOuts.push(setTimeout((() => { bars[iterationIndex].style.top = barHeight; }), 300));
}

function changeSeqTimeOut(iterationIndex, index) {
  debugger;
  let bars = document.getElementsByClassName('bars');

  bars[index].style.backgroundColor = 'rgba(175, 238, 238, 0.3)';
  bars[index].parentNode.insertBefore(bars[index + 1], bars[index]);
  timeOuts.push(setTimeout((() => { bars[index + 1].style.backgroundColor = ''; }), 600));
}

function changeValueTimeOut(iterationIndex, index) {
  debugger;
  let bars = document.getElementsByClassName('bars');

  bars[index + 1].style.backgroundColor = '';
  timeOuts.push(setTimeout((() => { bars[index].style.backgroundColor = ''; }), 600));
  bars[index].style.top = '60px';

  if (iterationIndex === bars.length - 1) {
    timeOuts.push(setTimeout((() => { finalPhase(); }), 1000));
  }
}

function bubbleSort(numberArray) {
  timer = 1;
  for (let i = 0; i < numberArray.length; i++) {
    for (let j = 0; j < numberArray.length - 1; j++) {
      let saveData = numberArray.slice();

      timeOuts.push(setTimeout(() =>  bubbleTimeOut(saveData, j, i), 800 * timer));
      timer++;

      if (numberArray[j] > numberArray[j + 1]) {
        swap(numberArray, j, j + 1);
      }
    }
  }
}

function bubbleTimeOut(saveData, index, iterationIndex) {
  const bars = document.getElementsByClassName('bars');
  let saveIndex = index;

  if (index !== 0) {
    bars[index-1].style.backgroundColor = '';
  } else {
    bars[bars.length-1].style.backgroundColor = '';
    bars[bars.length-2].style.backgroundColor = '';
  }

  bars[index].style.backgroundColor = 'paleturquoise';
  bars[index + 1].style.backgroundColor = 'rgba(175, 238, 238, 0.3)';

  if (saveData[index] > saveData[index + 1]) {
    timeOuts.push(setTimeout(() => changeBars(bars, saveIndex), 500));
  }

  function changeBars (bars, index) {
    bars[index].parentNode.insertBefore(bars[index + 1], bars[index]);
  }

  if (iterationIndex === bars.length - 1 && index === bars.length - 2) {
    timeOuts.push(setTimeout(() => finalPhase(), 1000));
  }
}

function finalPhase() {
  const bars = document.getElementsByClassName('bars');
  let timer = 1;

  for (let i = 0; i < bars.length; i++) {
    timeOuts.push(setTimeout(() => {
      if (i !== 0) {
        bars[i - 1].style.backgroundColor = '';
        bars[i].style.backgroundColor = 'paleturquoise';
      } else {
        bars[bars.length - 1].style.backgroundColor = '';
        bars[bars.length - 2].style.backgroundColor = '';
        bars[i].style.backgroundColor = 'paleturquoise';
      }

      if (i === bars.length - 1) {
        lastBlink(true, bars);
      }
    }, 150 * timer));

    timer++;
  }

  function lastBlink(final, bars) {
    timeOuts.push(setTimeout(() => {
      if (final) {
        for (let j = 0; j < bars.length; j++) {
          bars[j].style.backgroundColor = '';
          lastBlink(false, bars);
        }
      } else {
        for (let j = 0; j < bars.length; j++) {
          bars[j].style.backgroundColor = 'paleturquoise';
        }
      }
    }, 300));
  }
}

function swap(numberArray, index1, index2) {
  const temp = numberArray[index1];

  numberArray[index1] = numberArray[index2];
  numberArray[index2] = temp;
}
