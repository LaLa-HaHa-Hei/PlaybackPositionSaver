const url = decodeURIComponent(window.location.href)
const videoElement = document.querySelector('video');
// console.log(`${url}`)

if (url.endsWith('.mp4') || url.endsWith('.mp3')) {
    let timeList = {}
    // const fileName = url.split('/').pop()
    // console.log(`${fileName}`)
    let timeListStr = localStorage.getItem('timeList')
    if (timeListStr !== null) {
        timeList = JSON.parse(timeListStr)
        if (url in timeList && timeList[url] < videoElement.duration) {
            videoElement.currentTime = timeList[url];
        }
    }

    videoElement.addEventListener('pause', saveTime)
    window.addEventListener('unload', saveTime)
}

function saveTime() {
    let timeList = {}
    let timeListStr = localStorage.getItem('timeList')
    if (timeListStr !== null) {
        timeList = JSON.parse(timeListStr)
    }
    timeList[url] = videoElement.currentTime
    localStorage.setItem('timeList', JSON.stringify(timeList))
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.method === 'getTimeList') {
        if (!url.endsWith('.mp4') && !url.endsWith('.mp3')) {
            sendResponse(null)
        }
        let timeList = {}
        let timeListStr = localStorage.getItem('timeList')
        if (timeListStr !== null) {
            timeList = JSON.parse(timeListStr)
        }
        sendResponse(timeList)
    }
    else if (request.method === 'deleteTime') {
        let timeList = {}
        let timeListStr = localStorage.getItem('timeList')
        if (timeListStr !== null) {
            timeList = JSON.parse(timeListStr)
            delete timeList[request.key]
            localStorage.setItem('timeList', JSON.stringify(timeList))
        }
        sendResponse(true)
    }
})
