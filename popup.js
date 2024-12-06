chrome.tabs.query(
    {
        active: true,
        currentWindow: true
    },
    (tabs) => {
        if (chrome.runtime.lastError) {
            showTip()
            return;
        }
        const message = {
            method: 'getTimeList',
        }
        chrome.tabs.sendMessage(tabs[0].id, message, response => {
            if (chrome.runtime.lastError) {
                showTip()
                return;
            }
            const timeListElement = document.getElementById('timeList');
            if (response === null) {
                showTip()
                return;
            }
            for (let key in response) {
                const tr = document.createElement('tr');

                const td1 = document.createElement('td');
                td1.textContent = key;

                const td2 = document.createElement('td');
                td2.textContent = response[key];

                const td3 = document.createElement('td');
                const button = document.createElement('button');
                button.textContent = '删除';

                button.addEventListener('click', () => {
                    const message = {
                        method: 'deleteTime',
                        key: key
                    }
                    chrome.tabs.sendMessage(tabs[0].id, message, response => {

                    })
                    tr.remove();  // 移除当前行
                });

                td3.appendChild(button);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);

                // 将tr添加到table
                timeListElement.appendChild(tr);
            }
        })
    }
)

function showTip() {
    const body = document.querySelector('body');
    const p = document.createElement('p');
    p.textContent = '请在本地mp4/mp3文件标签页中打开本窗口或刷新页面'
    body.appendChild(p)
}