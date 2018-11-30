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
const quickGap = 800;
let inputNumbers = [];
let argorithmName = '';
let timer = 1;
let isRunning = false;

numberInput.addEventListener('keydown', addInputNumber);
argorithmParent.addEventListener('click', selectArgorithm);
startButton.addEventListener('click', startVisualize);
refreshButton.addEventListener('click', refreshAll);

function refreshAll(ev) {
  inputNumbers = [];
  timer = [];
  argorithmName = '';
  playFrame.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  isRunning = false;

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
  const classList = ev.target.classList;

  if (classList.contains('select_argorithm')) {
    return false;
  }

  for (let i = 0; i < argorithmButtons.length; i++) {
    if (argorithmButtons[i].classList.contains('active')) {
      argorithmButtons[i].classList.remove('active');
    }
  }

  classList.add('active');
  argorithmName = ev.target.textContent;
}

function startVisualize(ev) {
  if (!(inputNumbers.length < 5) && argorithmName !== '') {
    if (isRunning === false) {
      const numberArray = inputNumbers.slice();

      playFrame.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
      makeBars();

      if (argorithmName === 'Bubble Sort') {
        bubbleSort(numberArray);
      } else if (argorithmName === 'Insertion Sort') {
        insertionSort(numberArray);
      } else if (argorithmName === 'Merge Sort') {
        mergeSort(numberArray);
      } else if (argorithmName === 'Selection Sort') {
        selectionSort(numberArray);
      } else if (argorithmName === 'Quick Sort') {
        quickSort(numberArray);
      }

      isRunning = true;
    } else {
      timer = [];
      isRunning = false;

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
        bubbleSetColorTimeout(j, i);
      }, bubbleGap * timer));
      timer++;

      if (numberArray[j] > numberArray[j + 1]) {
        timeouts.push(setTimeout(() => {
          bubbleSwapPositionTimeout(j, i);
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

function bubbleSetColorTimeout(index, iterationIndex) {
  const bars = document.getElementsByClassName('bars');

  if (index === 0) {
    bars[bars.length - 1 - iterationIndex].style.backgroundColor = '';
  } else {
    bars[index - 1].style.backgroundColor = '';
  }

  bars[index].style.backgroundColor = 'paleturquoise';
}

function bubbleSwapPositionTimeout(index, iterationIndex) {
  const bars = document.getElementsByClassName('bars');

  bars[index + 1].style.backgroundColor = 'rgba(175, 238, 238, 0.4)';
  timeouts.push(setTimeout(() => {
    swapBars(bars, index, iterationIndex);
  }, 400));

  function swapBars (bars, index, iterationIndex) {
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
      insertionSetColorTimeout(i, saveData, currentValue);
    }, insertionGap * timer));
    timer += 1.5;

    for (let j = i - 1; j > -1 && numberArray[j] > currentValue; j--) {
      timeouts.push(setTimeout(() => {
        insertionSwapPositionTimeout(j);
      }, insertionGap * timer));
      timer++;
      numberArray[j + 1] = numberArray[j];
      saveIndex = j;
    }

    timeouts.push(setTimeout(() => {
      insertionRollBackTimeout(saveIndex);
    }, insertionGap * timer));
    timer++;
    numberArray[saveIndex] = currentValue;
  }

  timeouts.push(setTimeout(() => {
    finalPhase();
  }, insertionGap * timer));
}

function insertionSetColorTimeout(iterationIndex, data, currentValue) {
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

function insertionSwapPositionTimeout(index) {
  const bars = document.getElementsByClassName('bars');

  bars[index].style.backgroundColor = 'rgba(175, 238, 238, 0.4)';
  bars[index].parentNode.insertBefore(bars[index + 1], bars[index]);
  timeouts.push(setTimeout(() => {
    bars[index + 1].style.backgroundColor = '';
  }, 600));
}

function insertionRollBackTimeout(index) {
  const bars = document.getElementsByClassName('bars');

  bars[index + 1].style.backgroundColor = '';
  timeouts.push(setTimeout(() => {
    bars[index].style.backgroundColor = '';
  }, 600));
  bars[index].style.top = '60px';
}

function mergeSort(numberArray, bars) {
  const saveLength = numberArray.length;

  if (bars === undefined) {
    bars = document.getElementsByClassName('bars');
  }

  if (saveLength === 1) {
    return [numberArray, bars];
  }

  const midNum = Math.floor(saveLength / 2);
  const left = numberArray.slice(0, midNum);
  const right = numberArray.slice(midNum);
  const barsLeft = Array.prototype.slice.call(bars, 0, midNum);
  const barsRight = Array.prototype.slice.call(bars, midNum);

  timeouts.push(setTimeout(() => {
    mergeDivideTimeout(barsLeft, barsRight);
  }, mergeGap * timer));
  timer++;

  return mergeArray(mergeSort(left, barsLeft), mergeSort(right, barsRight));
}

function mergeArray(left, right) {
  const bars = document.getElementsByClassName('bars');
  const result = [[],[]];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left[0].length && rightIndex < right[0].length) {
    let saveResult;

    if (left[0][leftIndex] <= right[0][rightIndex]) {
      result[0].push(left[0][leftIndex]);
      result[1].push(left[1][leftIndex]);
      leftIndex++;
    } else {
      result[0].push(right[0][rightIndex]);
      result[1].push(right[1][rightIndex]);
      rightIndex++;
    }

    saveResult = result[1].slice();
    timeouts.push(setTimeout(() => {
      mergeTimeout(saveResult, left[1][0]);
    }, mergeGap * timer));
    timer++;
  }

  while (leftIndex < left[0].length) {
    let saveResult;

    result[0].push(left[0][leftIndex]);
    result[1].push(left[1][leftIndex]);
    leftIndex++;
    saveResult = result[1].slice();
    timeouts.push(setTimeout(() => {
      mergeTimeout(saveResult);
    }, mergeGap * timer));
    timer++;
  }

  while (rightIndex < right[0].length) {
    let saveResult;

    result[0].push(right[0][rightIndex]);
    result[1].push(right[1][rightIndex]);
    rightIndex++;
    saveResult = result[1].slice();
    timeouts.push(setTimeout(() => {
      mergeTimeout(saveResult);
    }, mergeGap * timer));
    timer++;
  }

  timeouts.push(setTimeout(() => {
    mergeRollBackTimeout();
  }, mergeGap * timer));
  timer++;

  if (result[0].length === bars.length) {
    timeouts.push(setTimeout(() => {
      finalPhase();
    }, mergeGap * timer));
  }

  return result;
}

function mergeDivideTimeout(barsLeft, barsRight) {
  barsLeft[barsLeft.length - 1].style.marginRight = '20px';
  barsRight[0].style.marginLeft = '20px';

  for (let i = 0; i < barsLeft.length; i++) {
    barsLeft[i].style.backgroundColor = 'rgba(175, 238, 238, 0.4)';
    timeouts.push(setTimeout(() => {
      barsLeft[i].style.backgroundColor = '';
    }, 900));
  }

  for (let i = 0; i < barsRight.length; i++) {
    barsRight[i].style.backgroundColor = 'rgba(175, 238, 238, 0.4)';
    timeouts.push(setTimeout(() => {
      barsRight[i].style.backgroundColor = '';
    }, 900));
  }
}

function mergeTimeout(result, leftFirst) {
  let target;

  if (result.length === 1) {
    target = leftFirst;
  } else {
    target = result[result.length - 2].nextSibling;
  }

  result[result.length - 1].style.backgroundColor = 'paleturquoise';
  result[result.length - 1].style.marginRight = '5px';
  result[result.length - 1].style.marginLeft = '5px';
  result[result.length - 1].style.top = '250px';

  if (target !== undefined) {
    timeouts.push(setTimeout(() => {
      result[result.length - 1].parentNode.insertBefore(result[result.length - 1], target);
    }, 500));
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
      selectionSetColorTimeout(saveMinimum);
    }, selectionGap * timer));
    timer++;

    for (let j = i + 1; j < numberArray.length; j++) {
      const saveData = numberArray.slice();
      const saveMinimum = minimumNum;

      timeouts.push(setTimeout(() => {
        selectionChangeMinimumColorTimeout(saveData, saveMinimum, j);
      }, selectionGap * timer));
      timer++;

      if (numberArray[minimumNum] > numberArray[j]) {
        minimumNum = j;
      }
    }

    timer += 0.7;
    timeouts.push(setTimeout(() => {
      selectionSwapPositionTimeout(minimumNum, i);
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

function selectionSetColorTimeout(minimumNum) {
  const bars = document.getElementsByClassName('bars');

  bars[minimumNum].style.backgroundColor = 'paleturquoise';
  bars[minimumNum].style.border = '2px solid red';
}

function selectionChangeMinimumColorTimeout(data, minimumNum, index) {
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

function selectionSwapPositionTimeout(minimumNum, iterationIndex) {
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

function quickSort(numberArray) {
  quickSortIteration(numberArray, 0, numberArray.length - 1);
  timeouts.push(setTimeout(() => {
    finalPhase();
  }, quickGap * timer));
}

function quickSortIteration(numberArray, left, right) {
  let index;

  if (numberArray.length > 1) {
    index = quickSortPartition(numberArray, left, right);

    if (index - 1 > left) {
      quickSortIteration(numberArray, left, index - 1);
    }

    if (index < right) {
      quickSortIteration(numberArray, index, right);
    }
  }
}

function quickSortPartition(numberArray, left, right) {
  const pivot = Math.floor((left + right) / 2);
  const numberArrayPivot = numberArray[pivot];

  timeouts.push(setTimeout(() => {
    quickSetPivotColorTimeout(pivot);
  }, quickGap * timer));
  timer += 0.2;

  while (left <= right) {
    const saveLeft = left;
    const saveRight = right;

    timeouts.push(setTimeout(() => {
      quickSetIndexColorTimeout(saveLeft, saveRight);
    }, quickGap * timer));
    timer++;

    while (numberArrayPivot > numberArray[left]) {
      const saveLeft = left;

      timeouts.push(setTimeout(() => {
        quickChangeColorTimeout(saveLeft, 'left');
      }, quickGap * timer));
      timer++;
      left++;
    }

    while (numberArrayPivot < numberArray[right]) {
      const saveRight = right;

      timeouts.push(setTimeout(() => {
        quickChangeColorTimeout(saveRight, 'right');
      }, quickGap * timer));
      timer++;
      right--;
    }

    if (left <= right) {
      const saveLeft = left;
      const saveRight = right;

      timeouts.push(setTimeout(() => {
        quickSwapPositionTimeout(saveLeft, saveRight);
      }, quickGap * timer));
      timer++;
      swap(numberArray,left,right);
      left++;
      right--;
    }
  }

  timeouts.push(setTimeout(() => {
    quickRollBackTimeout();
  }, quickGap * timer));
  timer++;

  return left;
}

function quickSetPivotColorTimeout(pivot) {
  const bars = document.getElementsByClassName('bars');

  bars[pivot].style.backgroundColor = 'paleturquoise';
}

function quickSetIndexColorTimeout(left, right) {
  const bars = document.getElementsByClassName('bars');

  bars[left].style.borderBottom = '10px solid rgba(255, 42, 42, 0.5)';
  bars[right].style.borderTop = '10px solid rgba(59, 59, 255, 0.5)';
}

function quickChangeColorTimeout(index, directionString) {
  const bars = document.getElementsByClassName('bars');

  if (directionString === 'left') {
    bars[index].style.borderBottom = '';
    bars[index + 1].style.borderBottom = '10px solid rgba(255, 42, 42, 0.5)';
  } else {
    bars[index].style.borderTop = '';
    bars[index - 1].style.borderTop = '10px solid rgba(59, 59, 255, 0.5)';
  }
}

function quickSwapPositionTimeout(left, right) {
  const bars = document.getElementsByClassName('bars');

  bars[left].parentNode.insertBefore(bars[left], bars[right]);
  bars[left].parentNode.insertBefore(bars[right], bars[left]);

  bars[left].style.borderTop = '';
  bars[left].style.borderBottom = '10px solid rgba(255, 42, 42, 0.5)';
  bars[right].style.borderBottom = '';
  bars[right].style.borderTop = '10px solid rgba(59, 59, 255, 0.5';

  timeouts.push(setTimeout(() => {
    bars[left].style.borderBottom = '';
    bars[right].style.borderTop = '';
  }, 500));
}

function quickRollBackTimeout() {
  const bars = document.getElementsByClassName('bars');

  for (let i = 0; i < bars.length; i++) {
    bars[i].style.border = '';
    bars[i].style.backgroundColor = '';
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
