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
const timeouts = [];
const bubbleGap = 600;
const insertionGap = 600;
const mergeGap = 1000;
const selectionGap = 800;
let inputNumbers = [];
let argorithm = '';
let timer = 1;
let running = false;

numberInput.addEventListener('keydown', addInputNumber);
argorithmParent.addEventListener('click', selectArgorithm);
startButton.addEventListener('click', startVisualize);
refreshButton.addEventListener('click', refreshAll);

function refreshAll(ev) {
  inputNumbers = [];
  timer = [];
  argorithm = '';
  playFrame.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  running = false;

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

  for (let i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }
}

function addInputNumber(ev) {
  const keyId = ev.keyCode;

  if ((keyId >= 48 && keyId <= 57) || (keyId >= 96 && keyId <= 105)
    || keyId === 8 || keyId === 46 || keyId === 37 || keyId === 39
    || keyId === 9 || keyId === 13 || keyId === 91) {
    if (ev.code === 'Enter') {
      if (inputNumbers.length < 10) {
        if ((ev.currentTarget.value !== '') && (ev.currentTarget.value !== undefined)) {
          inputNumbers.push(Number(ev.currentTarget.value));
          addNumberToList(ev.currentTarget.value);
          numberInput.value = '';
        }
      } else {
        return alert('10개 이하의 숫자까지만 가능합니다');
      }
    }
  } else {
    ev.returnValue = false;

    return alert('숫자를 입력해 주세요');
  }
}

function addNumberToList(inputNumber) {
  const list = document.createElement('li');

  list.textContent = inputNumber;
  list.className = 'input_value';
  selectedNumber.appendChild(list);
}

function selectArgorithm(ev) {
  const eventTarget = ev.target.classList;

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
    if (running === false) {
      const numberArray = inputNumbers.slice();

      playFrame.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
      makeBars();

      if (argorithm === 'Bubble Sort') {
        bubbleSort(numberArray);
      } else if (argorithm === 'Insertion Sort') {
        insertionSort(numberArray);
      } else if (argorithm === 'Merge Sort') {
        mergeSort(numberArray);
      } else if (argorithm === 'Selection Sort') {
        selectionSort(numberArray);
      }

      running = true;
    } else {
      timer = [];
      running = false;

      for (let i = playFrame.children.length - 1; i > -1; i--) {
        playFrame.children[i].remove();
      }

      for (let i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
      }

      startVisualize(inputNumbers);
    }
  } else {
    return alert('입력한 숫자가 5개 미만이거나, 알고리즘이 선택되지 않았습니다.');
  }

  function makeBars() {
    const max = Math.max(...inputNumbers);

    for (let i = 0; i < inputNumbers.length; i++) {
      const bar = document.createElement('li');

      bar.classList.add('bars');
      bar.textContent = inputNumbers[i];
      bar.style.height = inputNumbers[i] * 170 / max + 'px';
      playFrame.appendChild(bar);
    }
  }
}

function bubbleSort(numberArray) {
  for (let i = 0; i < numberArray.length; i++) {
    for (let j = 0; j < numberArray.length - 1 - i; j++) {
      timeouts.push(setTimeout(() => {
        bubbleSelectTimeout(j, i);
      }, bubbleGap * timer));
      timer++;

      if (numberArray[j] > numberArray[j + 1]) {
        timeouts.push(setTimeout(() => {
          bubbleChangeTimeout(j, i);
        }, bubbleGap * timer));
        timer += 1.2;
        swap(numberArray, j, j + 1);
      }
    }
  }

  timeouts.push(setTimeout(() => {
    finalPhase();
  }, bubbleGap * timer));
}

function bubbleSelectTimeout(index, iterationIndex) {
  const bars = document.getElementsByClassName('bars');

  if (index === 0) {
    bars[bars.length - 1 - iterationIndex].style.backgroundColor = '';
  } else {
    bars[index - 1].style.backgroundColor = '';
  }

  bars[index].style.backgroundColor = 'paleturquoise';
}

function bubbleChangeTimeout(index, iterationIndex) {
  const bars = document.getElementsByClassName('bars');

  bars[index + 1].style.backgroundColor = 'rgba(175, 238, 238, 0.4)';
  timeouts.push(setTimeout(() => {
    changeBars(bars, index, iterationIndex);
  }, 400));

  function changeBars (bars, index, iterationIndex) {
    bars[index].parentNode.insertBefore(bars[index + 1], bars[index]);

    if (bars.length - 1 - iterationIndex === index + 1) {
      timeouts.push(setTimeout((bars, index) => {
        bars[index + 1].style.backgroundColor = '';
        bars[index].style.backgroundColor = '';
      }, 200, bars, index));
    }
  }
}

function insertionSort(numberArray) {
  for (let i = 1; i < numberArray.length; i++) {
    const saveData = numberArray.slice();
    const currentValue = numberArray[i];
    let saveIndex;

    timeouts.push(setTimeout(() => {
      insertionSaveValueTimeout(i, saveData, currentValue);
    }, insertionGap * timer));
    timer += 1.5;

    for (let j = i - 1; j > -1 && numberArray[j] > currentValue; j--) {
      timeouts.push(setTimeout(() => {
        insertionChangeSeqTimeout(j);
      }, insertionGap * timer));
      timer++;
      numberArray[j + 1] = numberArray[j];
      saveIndex = j;
    }

    timeouts.push(setTimeout(() => {
      insertionChangeValueTimeout(saveIndex);
    }, insertionGap * timer));
    timer++;
    numberArray[saveIndex] = currentValue;
  }

  timeouts.push(setTimeout(() => {
    finalPhase();
  }, insertionGap * timer));
}

function insertionSaveValueTimeout(iterationIndex, data, currentValue) {
  const bars = document.getElementsByClassName('bars');
  const max = Math.max(...data);
  const barHeight = (data[iterationIndex] * 170 / max) + 65 + 'px';

  bars[iterationIndex].style.backgroundColor = 'paleturquoise';
  timeouts.push(setTimeout(() => {
    bars[iterationIndex].style.top = barHeight;
  }, 300));

  if (!(data[iterationIndex - 1] > currentValue)) {
    timeouts.push(setTimeout(() => {
      bars[iterationIndex].style.top = '60px';
      bars[iterationIndex].style.backgroundColor = '';
    }, 1000));
  }
}

function insertionChangeSeqTimeout(index) {
  const bars = document.getElementsByClassName('bars');

  bars[index].style.backgroundColor = 'rgba(175, 238, 238, 0.4)';
  bars[index].parentNode.insertBefore(bars[index + 1], bars[index]);
  timeouts.push(setTimeout(() => {
    bars[index + 1].style.backgroundColor = '';
  }, 600));
}

function insertionChangeValueTimeout(index) {
  const bars = document.getElementsByClassName('bars');

  bars[index + 1].style.backgroundColor = '';
  timeouts.push(setTimeout(() => {
    bars[index].style.backgroundColor = '';
  }, 600));
  bars[index].style.top = '60px';
}

function mergeSort(numberArray) {
  const saveLength = numberArray.length;

  if (saveLength === 1) {
    return numberArray;
  }

  const midNum = Math.floor(saveLength / 2);
  const left = numberArray.slice(0, midNum);
  const right = numberArray.slice(midNum);

  timeouts.push(setTimeout(() => {
    mergeDivideTimeout(left, right);
  }, mergeGap * timer));
  timer++;

  return mergeArray(mergeSort(left), mergeSort(right));
}

function mergeArray(left, right) {
  const bars = document.getElementsByClassName('bars');
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    let saveResult;

    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }

    saveResult = result.slice();
    timeouts.push(setTimeout(() => {
      mergeTimeout(saveResult, left[0]);
    }, mergeGap * timer));
    timer++;
  }

  while (leftIndex < left.length) {
    let saveResult;

    result.push(left[leftIndex]);
    leftIndex++;
    saveResult = result.slice();
    timeouts.push(setTimeout(() => {
      mergeTimeout(saveResult);
    }, mergeGap * timer));
    timer++;
  }

  while (rightIndex < right.length) {
    let saveResult;

    result.push(right[rightIndex]);
    rightIndex++;
    saveResult = result.slice();
    timeouts.push(setTimeout(() => {
      mergeTimeout(saveResult);
    }, mergeGap * timer));
    timer++;
  }

  timeouts.push(setTimeout(() => {
    mergeRollBackTimeout();
  }, mergeGap * timer));
  timer++;

  if (result.length === bars.length) {
    timeouts.push(setTimeout(() => {
      finalPhase();
    }, mergeGap * timer));
  }

  return result;
}

function mergeDivideTimeout(left, right) {
  const bars = document.getElementsByClassName('bars');

  for (let i = 0; i < bars.length; i++) {
    if (left[left.length - 1] === Number(bars[i].textContent)) {
      bars[i].style.marginRight = '20px';
      bars[i + 1].style.marginLeft = '20px';
    }

    for (let j = 0; j < left.length; j++) {
      if (left[j] === Number(bars[i].textContent)) {
        bars[i].style.backgroundColor = 'rgba(175, 238, 238, 0.4)';
        timeouts.push(setTimeout(() => {
          bars[i].style.backgroundColor = '';
        }, 900));
      }
    }

    for (let j = 0; j < right.length; j++) {
      if (right[j] === Number(bars[i].textContent)) {
        bars[i].style.backgroundColor = 'rgba(175, 238, 238, 0.4)';
        timeouts.push(setTimeout(() => {
          bars[i].style.backgroundColor = '';
        }, 900));
      }
    }
  }
}

function mergeTimeout(resultArray, leftFirst) {
  const bars = document.getElementsByClassName('bars');
  let target;

  if (resultArray.length === 1) {
    for (let i = 0; i < bars.length; i++) {
      if (leftFirst === Number(bars[i].textContent)) {
        target = bars[i];
      }
    }
  } else {
    for (let i = 0; i < bars.length; i++) {
      if (resultArray[resultArray.length - 2] === Number(bars[i].textContent)) {
        target = bars[i + 1];
      }
    }
  }

  for (let i = 0; i < bars.length; i++) {
    if (resultArray[resultArray.length - 1] === Number(bars[i].textContent)) {
      bars[i].style.backgroundColor = 'paleturquoise';
      bars[i].style.marginRight = '5px';
      bars[i].style.marginLeft = '5px';
      bars[i].style.top = '250px';

      if (target !== undefined) {
        timeouts.push(setTimeout(() => {
          bars[i].parentNode.insertBefore(bars[i], target);
        }, 500));
      }
    }
  }
}

function mergeRollBackTimeout() {
  const bars = document.getElementsByClassName('bars');

  for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = '';
    bars[i].style.top = '60px';
  }
}

function selectionSort(numberArray) {
  for (let i = 0; i < numberArray.length - 1; i++) {
    let minimumNum = i;
    const saveMinimum = minimumNum;

    timeouts.push(setTimeout(() => {
      selectionSelectMinimumTimeout(saveMinimum);
    }, selectionGap * timer));
    timer++;

    for (let j = i + 1; j < numberArray.length; j++) {
      const saveData = numberArray.slice();
      const saveMinimum = minimumNum;

      timeouts.push(setTimeout(() => {
        selectionChangeMinimumTimeout(saveData, saveMinimum, j);
      }, selectionGap * timer));
      timer++;

      if (numberArray[minimumNum] > numberArray[j]) {
        minimumNum = j;
      }
    }

    timer += 0.7;
    timeouts.push(setTimeout(() => {
      selectionChangePositionTimeout(minimumNum, i);
    }, selectionGap * timer));
    timer++;

    if (minimumNum !== i) {
      swap(numberArray, minimumNum, i);
    }
  }

  timeouts.push(setTimeout(() => {
    finalPhase();
  }, selectionGap * timer));
}

function selectionSelectMinimumTimeout(minimumNum) {
  const bars = document.getElementsByClassName('bars');

  bars[minimumNum].style.backgroundColor = 'paleturquoise';
  bars[minimumNum].style.border = '2px solid red';
}

function selectionChangeMinimumTimeout(data, minimumNum, index) {
  const bars = document.getElementsByClassName('bars');

  bars[index].style.backgroundColor = 'rgba(175, 238, 238, 0.4)';
  timeouts.push(setTimeout(() => {
    if (data[minimumNum] > data[index]) {
      bars[minimumNum].style.border = '';
      bars[index].style.border = '2px solid red';
    }

    bars[index].style.backgroundColor = '';
  }, 450));
}


function selectionChangePositionTimeout(minimumNum, iterationIndex) {
  const bars = document.getElementsByClassName('bars');

  if (minimumNum !== iterationIndex) {
    bars[iterationIndex].parentNode.insertBefore(bars[minimumNum], bars[iterationIndex]);
    bars[iterationIndex].parentNode.insertBefore(bars[iterationIndex + 1], bars[minimumNum + 1]);
    timeouts.push(setTimeout(() => {
      bars[iterationIndex].style.border = '';
      bars[minimumNum].style.backgroundColor = '';
    }, 450));
  } else {
    bars[iterationIndex].style.backgroundColor = '';
    bars[iterationIndex].style.border = '';
  }
}

function finalPhase() {
  const bars = document.getElementsByClassName('bars');
  let timer = 1;

  for (let i = 0; i < bars.length; i++) {
    timeouts.push(setTimeout(() => {
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
    timeouts.push(setTimeout(() => {
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
    }, 400));
  }
}

function swap(numberArray, index1, index2) {
  const temp = numberArray[index1];

  numberArray[index1] = numberArray[index2];
  numberArray[index2] = temp;
}
