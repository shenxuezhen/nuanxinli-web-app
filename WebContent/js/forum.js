var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset, generatedCount = 0;
var wid = document.documentElement.clientWidth;// 屏幕宽
var hei = document.documentElement.clientHeight;// 屏幕高
var wrapper = document.getElementById('wrapper');
wrapper.style.height = hei + 'px';

var count = 10;
var item = '<a id="forumA"><div id="title" class="title"></div><div id="type" class="type"></div><div id="content" class="content_div"></div><div class="operate_div"><div class="operate"><div class="view_img"></div><div id="hotrank" class="view_reply_text"></div><div class="reply_img"></div><div id="reply_count" class="view_reply_text"></div></div></div></div></a>';
var afterId;//最后一条id
if(getParam('sid')){
	/*alert(getParam('sid'));*/
	setCookie('sid',getParam('sid'));
}
/*请求数据*/
var url = '';
var jsonStr = '';
url = '/agent/bbs/posts?afterId=0&count='+count;
var httpRequest;
if (window.XMLHttpRequest) {
	httpRequest = new XMLHttpRequest();
} else if (window.ActiveXObject) {
	try {
		httpRequest = new ActiveXObject('Msxml2.XMLHTTP');
	} catch (e) {
		try {
			httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
		} catch (e) {
		}
	}
}
if (!httpRequest) {
	alert('Giving up L Cannot create an XMLHTTP instance');
} else {
	httpRequest.open('GET', url, false);
	httpRequest.send();
	/*alert(httpRequest.status+'----'+httpRequest.responseText);*/
	if (httpRequest.readyState == 4) {
		if (httpRequest.status == 200) {
			jsonStr = httpRequest.responseText;
		} else {
			alert('There was a problem with the request.');
		}
	}
}
var itemDiv = document.getElementById('thelist');
var json = eval(jsonStr);
afterId = json[json.length-1].id;
showForumList();
function showForumList(){
	for(var i=0;i<json.length;i++){
		var div = document.createElement('div');
		div.className = 'item_div';
		div.innerHTML = item;
		var lineDiv = document.createElement('div');
		lineDiv.className = 'line';
		itemDiv.appendChild(div);
		itemDiv.appendChild(lineDiv);
		var forumA = document.getElementById('forumA');
		var title = document.getElementById('title');
		var type = document.getElementById('type');
		var content = document.getElementById('content');
		var hotrank = document.getElementById('hotrank');
		var replyCount = document.getElementById('reply_count');
		if(getParam('sid')){
			if(getParam('versionName')){
				forumA.href = '/warm/forum_detail.html?postId='+json[i].id+'&sid='+getParam('sid')+'&puburl='+getParam('puburl')+'&user='+getParam('user')+'&versionName='+getParam('versionName');
			}else{
				forumA.href = '/warm/forum_detail.html?postId='+json[i].id+'&sid='+getParam('sid')+'&puburl='+getParam('puburl')+'&user='+getParam('user');
			}
		}else{
			if(getParam('versionName')){
				forumA.href = '/warm/forum_detail.html?postId='+json[i].id+'&versionName='+getParam('versionName');
			}else{
				forumA.href = '/warm/forum_detail.html?postId='+json[i].id;
			}
		}
		title.innerHTML = json[i].title;
		type.innerHTML = json[i].partName;
		content.innerHTML = json[i].content;
		textCountLimit(65, content);
		hotrank.innerHTML = json[i].hotrank;
		replyCount.innerHTML = json[i].replyCount;
		title.id = 'title'+json[i].id;
		type.id = 'type'+json[i].id;
		content.id = 'content'+json[i].id;
		hotrank.id = 'hotrank'+json[i].id;
		replyCount.id = 'reply_count'+json[i].id;
		forumA.id = 'forumA'+json[i].id;
	}
}
function pullDownAction() {
	itemDiv.innerHTML = '';
	url = '/agent/bbs/posts?afterId=0&count='+count;
	httpRequest.open('GET', url, false);
	httpRequest.send();
	if (httpRequest.readyState == 4) {
		if (httpRequest.status == 200) {
			jsonStr = httpRequest.responseText;
			/*alert(jsonStr);*/
		} else {
			alert('There was a problem with the request.');
		}
	}
	json = eval(jsonStr);
	afterId = json[json.length-1].id;
	showForumList();
	myScroll.refresh();
}

function pullUpAction() {
	url = '/agent/bbs/posts?afterId='+afterId+'&count='+count;
	httpRequest.open('GET', url, false);
	httpRequest.send();
	if (httpRequest.readyState == 4) {
		if (httpRequest.status == 200) {
			jsonStr = httpRequest.responseText;
			/*alert(jsonStr);*/
		} else {
			alert('There was a problem with the request.');
		}
	}
	json = eval(jsonStr);
	if(json.length != 0){
		afterId = json[json.length-1].id;
		showForumList();
	}
	pullUpEl.style.display = 'none';
	myScroll.refresh(); 
}

function loaded() {
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = document.getElementById('pullUp');
	pullUpOffset = pullUpEl.offsetHeight;

	myScroll = new iScroll(
			'wrapper',
			{
				useTransition : true,
				topOffset : pullDownOffset,
				onRefresh : function() {
					if (pullDownEl.className.match('loading')) {
						pullDownEl.className = '';
						pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
					} else if (pullUpEl.className.match('loading')) {
						pullUpEl.className = '';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
					}
				},
				onScrollMove : function() {
					if (this.y > 5 && !pullDownEl.className.match('flip') ) {
						pullDownEl.className = 'flip';
						pullDownEl.querySelector('.pullDownLabel').innerHTML = '松开加载';
						this.minScrollY = 0;
						this.maxScrollY = -pullDownOffset;
					} else if (this.y < 5 && pullDownEl.className.match('flip')) {
						pullDownEl.className = '';
						pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
						this.minScrollY = -pullDownOffset;
						this.maxScrollY = -pullDownOffset;
					} else if (this.y < (this.maxScrollY - 50)
							&& !pullUpEl.className.match('flip') && this.y<-pullDownOffset) {
						pullUpEl.className = 'flip';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开加载';
						pullUpEl.style.display = 'block';
					} else if (this.y > (this.maxScrollY + 50)
							&& pullUpEl.className.match('flip')) {
						pullUpEl.className = '';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
						pullUpEl.style.display = 'block';
					}
				},
				onScrollEnd : function() {
					if (pullDownEl.className.match('flip')) {
						pullDownEl.className = 'loading';
						pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
						pullDownAction(); // Execute custom function (ajax
											// call?)
					} else if (pullUpEl.className.match('flip')) {
						pullUpEl.style.display = 'block';
						pullUpEl.style.position = 'fixed';
						pullUpEl.style.bottom = 0;
						pullUpEl.className = 'loading';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
						pullUpAction(); // Execute custom function (ajax call?)
					}
				}
			});

	/*setTimeout(function() {
		document.getElementById('wrapper').style.left = '0';
	}, 800);*/
}

document.addEventListener('touchmove', function(e) {
	e.preventDefault();
}, false);

document.addEventListener('DOMContentLoaded', function() {
	setTimeout(loaded, 200);
}, false);

//textCountLimit(70);
    

