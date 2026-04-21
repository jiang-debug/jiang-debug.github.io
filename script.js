// ==============================================
// 姓名：姜璟媛   学号：24215220201
// 最终完整版：全部img图片100%全部调用 + 4MP3+4MP4双媒体完整播放
// 所有素材路径完全适配你本地文件夹，所有历史BUG全部修复
// ==============================================

// 1. 获取所有页面DOM元素
const audioPlayer = document.getElementById('audioPlayer');
const videoPlayer = document.getElementById('videoPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeBtn = document.getElementById('volumeBtn');
const muteBtn = document.getElementById('muteBtn');
const listBtn = document.getElementById('listBtn');
const mvBtn = document.getElementById('mvBtn');

// 模式背景按钮
const mode1 = document.getElementById('mode1');
const mode2 = document.getElementById('mode2');
const mode3 = document.getElementById('mode3');

const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const currentTimeText = document.getElementById('currentTime');
const totalTimeText = document.getElementById('totalTime');
const mediaTitle = document.getElementById('mediaTitle');
const mediaList = document.getElementById('mediaList');
const coverImg = document.getElementById('coverImg');
const bgBox = document.getElementById('bgBox');
const playlistBox = document.getElementById('playlistBox');

// 2. 【全部素材一一对应】完整媒体库 4MP3+4MP4
// 严格对应你本地文件名、封面、背景图绑定
const playlist = [
    // 4首MP3 音乐：绑定对应record封面、bg背景图
    { name: "音乐01", type: "mp3", path: "mp3/music0.mp3", cover: "img/record0.jpg", bg: "img/bg0.png" },
    { name: "音乐02", type: "mp3", path: "mp3/music1.mp3", cover: "img/record1.jpg", bg: "img/bg1.png" },
    { name: "音乐03", type: "mp3", path: "mp3/music2.mp3", cover: "img/record2.jpg", bg: "img/bg2.png" },
    { name: "音乐04", type: "mp3", path: "mp3/music3.mp3", cover: "img/record3.jpg", bg: "img/bg3.png" },
    // 4个MP4 视频
    { name: "视频01", type: "mp4", path: "mp4/video0.mp4" },
    { name: "视频02", type: "mp4", path: "mp4/video1.mp4" },
    { name: "视频03", type: "mp4", path: "mp4/video2.mp4" },
    { name: "视频04", type: "mp4", path: "mp4/video3.mp4" }
];

// 背景图素材库（对应你的bg0~bg3）
const bgList = [
    "img/bg0.png",
    "img/bg1.png",
    "img/bg2.png",
    "img/bg3.png"
];

// 3. 全局状态变量
let currentIndex = 0;
let currentPlayer = null;
let isMute = false; // 静音状态

// 4. 时间格式化函数（彻底解决NaN报错）
function formatTime(second) {
    if (isNaN(second) || second === undefined || second === null) {
        return "00:00";
    }
    let min = Math.floor(second / 60);
    let sec = Math.floor(second % 60);
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    return min + ":" + sec;
}

// 5. 渲染完整播放列表
function renderList() {
    mediaList.innerHTML = "";
    playlist.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerText = `${index+1}. ${item.name} (${item.type})`;
        li.onclick = () => switchMedia(index);
        if (index === currentIndex) li.classList.add("active");
        mediaList.appendChild(li);
    });
}

// 6. 核心函数：切换媒体资源（音频/视频+封面+背景全部联动）
function switchMedia(index) {
    currentIndex = index;
    const item = playlist[index];

    // 全部暂停、清空旧资源
    audioPlayer.pause();
    videoPlayer.pause();
    audioPlayer.src = "";
    videoPlayer.src = "";

    // 根据媒体类型切换显示逻辑
    if (item.type === "mp3") {
        // ========== 播放MP3：显示封面、隐藏视频画面 ==========
        currentPlayer = audioPlayer;
        videoPlayer.style.display = "none";
        coverImg.style.display = "block";
        // 自动切换对应歌曲封面、对应背景图
        coverImg.src = item.cover;
        bgBox.style.backgroundImage = `url(${item.bg})`;
        currentPlayer.src = item.path;
    } else {
        // ========== 播放MP4：显示视频画面、隐藏封面 ==========
        currentPlayer = videoPlayer;
        coverImg.style.display = "none";
        videoPlayer.style.display = "block";
        currentPlayer.src = item.path;
        currentPlayer.muted = false; // 视频声音正常开启
    }

    // 更新播放标题
    mediaTitle.innerText = item.name;
    renderList();
    currentPlayer.load();

    // 资源加载完成：更新时长+自动播放+按钮图标切换
    currentPlayer.onloadedmetadata = () => {
        totalTimeText.innerText = formatTime(currentPlayer.duration);
        currentPlayer.play();
        playBtn.src = "img/暂停.png";
    };
}

// 7. 播放/暂停切换（原图按钮图标切换）
function togglePlay() {
    if (!currentPlayer) return;
    if (currentPlayer.paused) {
        currentPlayer.play();
        playBtn.src = "img/暂停.png";
    } else {
        currentPlayer.pause();
        playBtn.src = "img/继续播放.png";
    }
}

// 8. 上一曲切换
function prevMedia() {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = playlist.length - 1;
    switchMedia(newIndex);
}

// 9. 下一曲切换（8个资源无限循环）
function nextMedia() {
    let newIndex = (currentIndex + 1) % playlist.length;
    switchMedia(newIndex);
}

// 10. 进度条实时更新+点击跳转
function updateProgress() {
    if (!currentPlayer || isNaN(currentPlayer.duration)) return;
    const percent = (currentPlayer.currentTime / currentPlayer.duration) * 100;
    progress.style.width = percent + "%";
    currentTimeText.innerText = formatTime(currentPlayer.currentTime);
}
progressBar.onclick = (e) => {
    if (!currentPlayer || isNaN(currentPlayer.duration)) return;
    const rate = e.offsetX / progressBar.offsetWidth;
    currentPlayer.currentTime = rate * currentPlayer.duration;
};

// 11. 音量&静音功能（你的音量、静音图片按钮）
volumeBtn.onclick = () => {
    currentPlayer.volume = 1;
    isMute = false;
    audioPlayer.muted = false;
    videoPlayer.muted = false;
};
muteBtn.onclick = () => {
    isMute = !isMute;
    audioPlayer.muted = isMute;
    videoPlayer.muted = isMute;
};

// 12. mode1/mode2/mode3 背景图切换按钮（对应你的4张背景bg0~bg3）
mode1.onclick = () => { bgBox.style.backgroundImage = `url(${bgList[0]})`; };
mode2.onclick = () => { bgBox.style.backgroundImage = `url(${bgList[1]})`; };
mode3.onclick = () => { bgBox.style.backgroundImage = `url(${bgList[2]})`; };

// 13. MV按钮功能：一键切换到视频播放模式
mvBtn.onclick = () => {
    // 切换到第5个视频资源（第一个视频video0）
    switchMedia(4);
};

// 14. 播放列表显示隐藏按钮
let listShow = true;
listBtn.onclick = () => {
    listShow = !listShow;
    playlistBox.style.display = listShow ? "block" : "none";
};

// 15. 全部按钮绑定点击事件
playBtn.onclick = togglePlay;
prevBtn.onclick = prevMedia;
nextBtn.onclick = nextMedia;

// 16. 播放结束自动下一曲
audioPlayer.onended = nextMedia;
videoPlayer.onended = nextMedia;

// 17. 时间进度实时监听
audioPlayer.ontimeupdate = updateProgress;
videoPlayer.ontimeupdate = updateProgress;

// 18. 页面初始化加载
window.onload = () => {
    renderList();
    switchMedia(0); // 默认打开第一个音乐music0.mp3
};