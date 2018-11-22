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

let typedCharacter = '';
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
      if ((ev.currentTarget.value !== "") && (ev.currentTarget.value !== undefined)) {
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
  timer = 1;
  for (let i = 0; i < numberArray.length - 1; i++) {
    let minimumNum = i;

    for (let j = i; j < numberArray.length; j++) {
      let saveData = numberArray.slice();
      let saveMinimum = minimumNum;
      
      timeOuts.push(setTimeout(() => selectionTimeOut(saveData, j, i, saveMinimum), 1000 * timer));

      if (numberArray[minimumNum] > numberArray[j]) {
        minimumNum = j;
      }

      timer++;
    }

    if (minimumNum !== i) {
      swap(numberArray, minimumNum, i);
    }
  }
}

function selectionTimeOut(saveData, index, iterationIndex, minimumNum) {
  debugger;
  let bars = document.getElementsByClassName('bars');
  let saveIterationIndex = iterationIndex;
  let saveIndex = index;
  let saveMinimum = minimumNum;
  let lastMinimum = false;

  if (iterationIndex !== index - 1 && index !== 0) {
    bars[index - 1].style.backgroundColor = '';
  }

  for (let i = 0; i < bars.length; i++) {
    if (iterationIndex === index) {
      bars[i].style.backgroundColor = '';
      bars[i].style.borderColor = 'black';
    }
  }
  
  if (saveIndex === iterationIndex) {
    bars[iterationIndex].style.backgroundColor = 'paleturquoise';
    bars[iterationIndex].style.borderColor = 'red';
  } else {
    bars[index].style.backgroundColor = 'rgba(175, 238, 238, 0.3)';
  }

  if (saveData[minimumNum] > saveData[index]) {
    debugger;
    timeOuts.push(setTimeout(() => changeMinimum(bars, saveIndex, saveMinimum), 400));
    if (index === saveData.length - 1) {
      lastMinimum = true;
    }
  }

  function changeMinimum(bars, index, minimumNum) {
    bars[minimumNum].style.borderColor = 'black';
    bars[index].style.borderColor = 'red';
  }

  if (index === saveData.length-1) {
    debugger;
    if (minimumNum !== iterationIndex) {
      timeOuts.push(setTimeout(() => changeBars(bars, saveIterationIndex, saveMinimum, lastMinimum), 600));
    } else {
      bars[minimumNum].style.borderColor = 'black';
      bars[iterationIndex].style.backgroundColor = '';
    }
  }

  function changeBars (bars, iterationIndex, minimumNum, lastMinimum) {
    if (lastMinimum) {
      minimumNum++;
    }

    bars[bars.length - 1].style.backgroundColor = '';
    bars[iterationIndex].style.backgroundColor = '';
    bars[minimumNum].parentNode.insertBefore(bars[minimumNum], bars[iterationIndex]);
    bars[minimumNum].parentNode.insertBefore(bars[iterationIndex + 1], bars[minimumNum+1]);
  }

  if (iterationIndex === saveData.length - 2 && index === saveData.length - 1) {
    finalPhase(bars);
  }
}

function mergeSort(numberArray) {
  if (numberArray.length === 1) {
    return numberArray;
  }

  let midNum = Math.floor(numberArray.length / 2);

  let left = numberArray.slice(0, midNum);
  let right = numberArray.slice(minNum, numberArray.length);

  return mergeArray(mergeSort(left), mergeSort(right));
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
    timeOuts.push(setTimeout((() => { finalPhase(bars); }), 1000));
  }
}

function bubbleSort(numberArray) {
  timer = 1;
  for (let i = 0; i < numberArray.length; i++) {
    for (let j = 0; j < numberArray.length - 1; j++) {
      let saveData = numberArray.slice();

      timeOuts.push(setTimeout(() =>  bubbleTimeOut(saveData, j, i), 1000 * timer));
      timer++;

      if (numberArray[j] > numberArray[j + 1]) {
        swap(numberArray, j, j + 1);
      }
    }
  }
}

function bubbleTimeOut(saveData, index, iterationIndex) {
  let bars = document.getElementsByClassName('bars');
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
    timeOuts.push(setTimeout(() => changeBars(bars, saveIndex), 600));
  }

  function changeBars (bars, index) {
    bars[index].parentNode.insertBefore(bars[index + 1], bars[index]);
  }

  if (iterationIndex === bars.length - 1 && index === bars.length - 2) {
    finalPhase(bars);
  }
}

function finalPhase(elements) {
  let timer = 1;

  for (let i = 0; i < elements.length; i++) {
    timeOuts.push(setTimeout(() => {
      if (i !== 0) {
        elements[i - 1].style.backgroundColor = '';
        elements[i].style.backgroundColor = 'paleturquoise';
      } else {
        elements[elements.length - 1].style.backgroundColor = '';
        elements[elements.length - 2].style.backgroundColor = '';
        elements[i].style.backgroundColor = 'paleturquoise';
      }

      if (i === elements.length - 1) {
        lastBlink(true, elements);
      }
    }, 100 * timer));

    timer++;
  }

  function lastBlink(final, elements) {
    timeOuts.push(setTimeout(() => {
      if (final) {
        for (let j = 0; j < elements.length; j++) {
          elements[j].style.backgroundColor = '';
          lastBlink(false, elements);
        }
      } else {
        for (let j = 0; j < elements.length; j++) {
          elements[j].style.backgroundColor = 'paleturquoise';
        }
      }
    }, 500));
  }
}

function swap(numberArray, index1, index2) {
  const temp = numberArray[index1];

  numberArray[index1] = numberArray[index2];
  numberArray[index2] = temp;
}