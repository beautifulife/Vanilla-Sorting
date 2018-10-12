# Vanilla Sorting

4가지 정렬 알고리즘의 구동 방식을 웹으로 표현해내는 과제입니다. 상세 내용은 아래 TODO 부분을 참고해주세요.

## Setup

Install dependencies

```sh
$ yarn install (or npm install)
```

## Development

```sh
$ yarn dev (or npm run dev)
# visit http://localhost:8080
```

HTML 수정: `index.ejs`를 수정하시면 됩니다.
JS 수정: `/app/index.js`를 수정하시면 됩니다.
CSS 수정: `/assets/styles/index.scss`를 수정하시면 됩니다.

## TODO

4가지 정렬 알고리즘의 구동 방식을 시각적으로 확인할 수 있도록 표현해야 합니다. 그리고 아래의 조건이 충족되어야 합니다.

* 사용자가 "숫자"들을 최소 5개에서 최대 10개까지 선택할 수 있는 UI가 있어야 합니다.
* 숫자들을 입력한 후, 사용자가 원하는 정렬 방식을 선택할 수 있어야 합니다.
* 정렬 방식을 선택한 후, 실행할 수 있는 "실행" 버튼이 있어야 합니다.
* 실행시킬 경우, 시각적으로 해당 정렬 로직이 어떤 식으로 작동되는지 보여주어야 합니다. (`/videos` 디렉토리 내부 영상 참고)
* 숫자의 갯수가 충족되지 않았거나, 정렬 방식이 선택되지 않은 상황에서는 "실행"을 시킬 수 없어야 합니다.
* 숫자가 아닌 값은 받을 수 없어야 합니다.

### 정렬 알고리즘 종류

아래 4가지의 정렬 방식이 모두 구현되어야 합니다. 각 알고리즘의 시간 복잡도에 대해 반드시 이해하셔야 합니다. (시간 복잡도 참고 링크: [Big-O Cheatsheet](http://bigocheatsheet.com/))

1. [Bubble Sort](https://en.wikipedia.org/wiki/Bubble_sort)
2. [Insertion Sort](https://en.wikipedia.org/wiki/Insertion_sort)
3. [Merge Sort](https://en.wikipedia.org/wiki/Merge_sort)
4. [Selection Sort](https://en.wikipedia.org/wiki/Selection_sort)

## [webpack](https://webpack.js.org/)
If you're not familiar with webpack, the [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) will serve the static files in your build folder and watch your source files for changes.
When changes are made the bundle will be recompiled. This modified bundle is served from memory at the relative path specified in publicPath.
