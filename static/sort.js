console.log("start!")

const SORTED_COLOR = '#404040'
const SWAP_COLOR = 'green'
const BASIC_COLOR = 'grey'
const COMPARE_COLOR = 'yellow'

const config = {
  nums: 10,
  speed: 100,  // 1-VERYFAST, 10-FAST, 100-MIDDLE, 1000-SLOW
  isAscending: true, // true: 오름차순, flase: 내림차순
}
let arrNums = []
let isStopped = true

const boxDiv = document.querySelector('.graph-box')
const numSelect = document.getElementById('numSelect')
const speedSelect = document.getElementById('speedSelect')
const isAscendingSelect = document.getElementById('isAscendingSelect')

const randomCreateBtn = document.getElementById('randomCreate')
const bubbleSortBtn = document.getElementById('bubbleSort')
const insertionSortBtn = document.getElementById('insertionSort')
const selectionSortBtn = document.getElementById('selectionSort')

randomCreateBtn.addEventListener('click', arrayGraph)
bubbleSortBtn.addEventListener('click', bubbleSort)
insertionSortBtn.addEventListener('click', insertionSort)
selectionSortBtn.addEventListener('click', selectionSort)
speedSelect.addEventListener('change', () => { config.speed = speedSelect.value })


function updateConfig() {
  config.nums = Number(numSelect.value)
  config.speed = Number(speedSelect.value)

  if (isAscendingSelect.value === "0")
    config.isAscending = true
  else
    config.isAscending = false

  console.log(config)
}

function shuffle(array) {
  // 인자로 받은 배열을 섞어서 반환

  let currentIndex = array.length
  let temporaryValue, randomIndex

  while (currentIndex-- !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)

    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

function arrayGraph() {
  // 배열을 랜덤하게 셔플하고 그래프로 나타내는 함수 
  updateConfig()

  const numbers = Array(config.nums).fill().map((item, idx) => idx + 1)
  // 1 ~ numGraph 까지의 리스트를 만들고 랜덤하게 셔플
  arrNums = shuffle(numbers)
  console.log('shuffled arrs: ', arrNums)

  boxDiv.innerHTML = ''
  // boxDiv 내부 html 요소 초기화

  for (const idx in arrNums) {
    // 새로운 div.graph-bar 만들어서 graph-box에 추가
    const newGraph = document.createElement('div')
    newGraph.classList.add('graph-bar')
    newGraph.id = `graph-bar-${Number(idx) + 1}`
    newGraph.style.width = 100 / config.nums + "%"
    newGraph.style.height = arrNums[idx] / config.nums * 100 + "%"
    newGraph.textContent = arrNums[idx]
    boxDiv.appendChild(newGraph)
  }
}

function compare(num1, num2) {
  // compareFlg 값에 따라 오름차순이나 내림차순 정렬 결정
  if (config.isAscending) // 오름차순 정렬 
    return num1 < num2
  else  // 내림차순 정렬
    return num1 > num2
}


function initGraph() {
  const allGraphBars = document.querySelectorAll('.graph-bar')
  
  allGraphBars.forEach((graphBar) => {
    graphBar.style.background = BASIC_COLOR
  })

  btnDisabled(true)
}

function btnDisabled(flag) {
  const btns = document.querySelectorAll('button')

  if (flag) {
    updateConfig()
    btns.forEach((btn) => {
      btn.disabled = true
    })
  }
  else {
    btns.forEach((btn) => {
      btn.disabled = false
    })
  }
}

function swapAnimation(index1, index2) {
  // Bubble 정렬 애니메이션 비동기 함수
  return new Promise((resolve) => {

    const graphBar1 = document.getElementById(`graph-bar-${index1 + 1}`)
    const graphBar2 = document.getElementById(`graph-bar-${index2 + 1}`)

    // 첫 번째 그래프 바를 초록색으로 변경
    graphBar1.style.background = SWAP_COLOR

    setTimeout(() => {
      graphBar2.style.background = SWAP_COLOR
      
      // Swap Graph Shape
      let temp = graphBar1.style.height
      graphBar1.style.height = graphBar2.style.height
      graphBar2.style.height = temp
      
      temp = graphBar1.textContent
      graphBar1.textContent = graphBar2.textContent
      graphBar2.textContent = temp
      
      setTimeout(() => {
        // 애니메이션 완료 후 resolve 호출
        graphBar1.style.background = BASIC_COLOR
        graphBar2.style.background = BASIC_COLOR
        resolve()
      }, config.speed)
    }, config.speed)
  })
}

function changeGraphBarColor(index, color) {
  // 두 그래프 바 색깔 변경
  return new Promise((resolve) => {
    const graphBar = document.getElementById(`graph-bar-${index + 1}`)
    
    setTimeout(() => {
      graphBar.style.background = color

      resolve()
    }, config.speed)
  })
}

function change2GraphBarColor(index1, index2, color) {
  // 두 그래프 바 색깔 변경
  return new Promise((resolve) => {
    const graphBar1 = document.getElementById(`graph-bar-${index1 + 1}`)
    const graphBar2 = document.getElementById(`graph-bar-${index2 + 1}`)

    graphBar1.style.background = color
    graphBar2.style.background = color

    setTimeout(() => {
      resolve()
    }, config.speed)
  })
}

async function changeAllGraphBarColor(color) {
  const allGraphBars = document.querySelectorAll('.graph-bar')
  const changeColor = (graphBar) => new Promise((resolve) => setTimeout(() => {
    graphBar.style.background = color
    resolve()
  }, config.speed))
  
  for (let i = 0; i < allGraphBars.length; i++) {
    await changeColor(allGraphBars[i])
  }
}

// Bubble 정렬
async function bubbleSort() {
  // Animation을 위한 Bubble 정렬 비동기 함수
  console.log("===Bubble Sort Start!===")
  
  
  // 랜덤 생성 버튼 비활성화
  initGraph()

  for (let i = 0; i < arrNums.length; i++) {
    for (let j = 0; j < arrNums.length - i - 1; j++) {
      await change2GraphBarColor(j, j+1, COMPARE_COLOR)
      if (compare(arrNums[j+1], arrNums[j])) {
        await change2GraphBarColor(j+1, j, BASIC_COLOR)
        await swapAnimation(j+1, j)
        
        const temp = arrNums[j+1]
        arrNums[j+1] = arrNums[j]
        arrNums[j] = temp
      }
      
      await change2GraphBarColor(j, j+1, BASIC_COLOR)
    }
    await changeGraphBarColor(arrNums.length - i - 1, SORTED_COLOR)
  }

  console.log(arrNums)
  btnDisabled(false)
}

// Insertion Sort
async function insertionSort() {
  console.log("===Insertion Sort Start!===")

  initGraph()

  for (let i = 0; i < arrNums.length; i++) {
    for (let j = i; j > 0; j--) {
      await change2GraphBarColor(j, j-1, COMPARE_COLOR)
      if (compare(arrNums[j], arrNums[j - 1])) {
        // Insertion Sort Animation
        await change2GraphBarColor(j, j-1, BASIC_COLOR)
        await swapAnimation(j, j - 1)
        
        const temp = arrNums[j]
        arrNums[j] = arrNums[j - 1]
        arrNums[j - 1] = temp
      } else {
        await change2GraphBarColor(j, j-1, BASIC_COLOR)
        break
      }
    }
  }

  await changeAllGraphBarColor(SORTED_COLOR)

  console.log(arrNums)
  btnDisabled(false)
}

// Selection Sort
async function selectionSort() {
  console.log("===Selection Sort Start!===")

  initGraph()

  for (let i = 0; i < arrNums.length; i++) {
    let minIdx = i
    for (let j = i + 1; j < arrNums.length; j++) {
      // index animation
      await change2GraphBarColor(j, minIdx, COMPARE_COLOR)
      await change2GraphBarColor(j, minIdx, BASIC_COLOR)
      
      if (compare(arrNums[j], arrNums[minIdx])) {
        minIdx = j
      }
    }
    if (minIdx !== i) {
      await swapAnimation(minIdx, i)

      const temp = arrNums[i]
      arrNums[i] = arrNums[minIdx]
      arrNums[minIdx] = temp
    }
    await changeGraphBarColor(i, SORTED_COLOR)
  }

  console.log(arrNums)
  btnDisabled(false)
}