
console.log('YouTubeChromeExt');

var videosData = {};

setTimeout(function() {
	getAllVideosData();
}, 5000);

function getAllVideosData() {
	let elms = document.querySelectorAll('div#items.ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer');
	for (let i = 0; i < elms.length; i++) {
		let videoId = elms[i].querySelector('a#thumbnail').getAttribute('href').substring(9);
		videosData[videoId] = {
			id: videoId,
			parentDomElm: elms[i]
		};
		getVideoData(videoId);	
	}		
}

function getVideoData(id) {
	let url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&key=AIzaSyDC3ZkKLUZ4rhoJbyTGxiD3YKmokimspXU&id=${id}`;
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			let data = JSON.parse(xhr.response);
			handleVideoData(data);			
		}
	};
	xhr.onerror = function() {console.log(`error on httpGet() - ${err}`);};
	xhr.open('GET', url, true);
	xhr.send('');	
}

function handleVideoData(data) {
	let id = data.items[0].id;
	let stats = data.items[0].statistics;
	let videoData = videosData[id];
	videoData.viewCount = stats.viewCount;
	videoData.likeCount = stats.likeCount;
	videoData.dislikeCount = stats.dislikeCount;
	videoData.favoriteCount = stats.favoriteCount;
	videoData.commentCount = stats.commentCount;
	updateDom(videoData);
}

function updateDom(videoData) {
	let dataElm = document.createElement('div');
	dataElm.classList.add('youtube-chrome-ext--data');

	let likeDislikeElm = document.createElement('div');
	likeDislikeElm.classList.add('youtube-chrome-ext--like-dislike');

	let likeElm = document.createElement('div');
	likeElm.classList.add('youtube-chrome-ext--like');
	likeElm.style['flex'] = `${videoData.likeCount} 0 0px`;
	
	let dislikeElm = document.createElement('div');
	dislikeElm.classList.add('youtube-chrome-ext--dislike');
	dislikeElm.style['flex'] = `${videoData.dislikeCount} 0 0px`;

	likeDislikeElm.appendChild(likeElm);
	likeDislikeElm.appendChild(dislikeElm);

	let commentsElm = document.createElement('div');
	commentsElm.textContent = `${videoData.commentCount} comments`;
	commentsElm.classList.add('youtube-chrome-ext--comment-count');

	dataElm.appendChild(likeDislikeElm);
	dataElm.appendChild(commentsElm);

	let infoElm = videoData.parentDomElm.querySelector('ytd-thumbnail + div > a.yt-simple-endpoint');
	infoElm.appendChild(dataElm);
}
