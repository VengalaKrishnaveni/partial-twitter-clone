import { tweetsData } from "./data.js";   
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


const feed = document.getElementById('feed')


//click event listener
document.addEventListener('click',function(e){
    if(e.target.id === 'reply-btn'){
        console.log(e.target.dataset.reply)
        handleTweetReplyBtn(e.target.dataset.reply)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }
    
})


function getFeedHtml(){
    let feedHtml = ``
    tweetsData.forEach(function(tweet){

        //like state
        let likeState = tweet.isLiked ? 'liked':''
        let likeClass = tweet.isLiked? 'fa-solid':'fa-regular'
  

        //retweet State
        let retweetState = tweet.isRetweeted?'retweeted':''


        //replies
        let repliesHtml = ''
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml +=`
                <div class = "tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic"></img>
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
                </div>
                `
            })
        }


        //feed

        if(`${tweet.handle}` === "@Krishnaveni"){
            feedHtml +=`
        <div class="tweet">
            <div class="tweet-inner">
                <img src= "${tweet.profilePic}" class="profile-pic">
                <div>
                    
                    <div class = "handle-settings">
                        <p class="handle">${tweet.handle}</p>
                        <i class="fa-solid fa-trash fa-xs" data-delete="${tweet.uuid}"></i>
                    </div>
                    
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots" data-reply = "${tweet.uuid}"></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="${likeClass} fa-heart ${likeState}" data-like = "${tweet.uuid}"></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetState}" data-retweet = "${tweet.uuid}"></i>
                            ${tweet.retweets}
                        </span>
                    </div>
                </div>
            </div>

            <div class="hidden" id="replies-${tweet.uuid}">
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="images/scrimbalogo.png" class="profile-pic"></img>
                        <textarea placeholder="post your reply" id="reply-input"></textarea>
                    </div>
                    <button id="reply-btn" data-reply="${tweet.uuid}">Reply</button>
                </div>
                ${repliesHtml}
            </div>
        </div>
        `
        }

        else{
            feedHtml +=`
        <div class="tweet">
            <div class="tweet-inner">
                <img src= "${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p> 
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots" data-reply = "${tweet.uuid}"></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="${likeClass} fa-heart ${likeState}" data-like = "${tweet.uuid}"></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetState}" data-retweet = "${tweet.uuid}"></i>
                            ${tweet.retweets}
                        </span>
                    </div>
                </div>
            </div>

            <div class="hidden" id="replies-${tweet.uuid}">
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="images/scrimbalogo.png" class="profile-pic"></img>
                        <textarea placeholder="post your reply" id="reply-input"></textarea>
                    </div>
                    <button id="reply-btn" data-reply="${tweet.uuid}">Reply</button>
                </div>
                ${repliesHtml}
            </div>
        </div>
        `
        }
        
    })
    return feedHtml
}

//rendering feed to the html page
function renderFeed(){
    feed.innerHTML = getFeedHtml()
}

renderFeed()



//replies handling funtion
function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    
}


//likes handling function
function  handleLikeClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    if(targetTweetObj.isLiked){
        targetTweetObj.likes -= 1  
    }
    else{
        targetTweetObj.likes += 1
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked 
    renderFeed() 
}

//retweets hanlding function
function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets -= 1       
    }
    else{
        targetTweetObj.retweets += 1
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted 
    renderFeed()
}

//tweet btn handling function
function handleTweetBtnClick(){
    const tweetInput = document.getElementById('text-area-input')
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Krishnaveni`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        renderFeed()
     tweetInput.value = ''
    }
    
}


//tweet reply btn handling function
function handleTweetReplyBtn(tweetId){
    let replyInput = document.querySelector(`#replies-${tweetId} #reply-input`).value;
    if(replyInput != ''){
        const targetTweetObj = tweetsData.filter(function(tweet){
            return tweet.uuid === tweetId
        })[0]
        targetTweetObj.replies.unshift({
            handle: `@Krishnaveni`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput
        })
        console.log(targetTweetObj.replies)
    }
    renderFeed()
    replyInput = ''
}

function handleDeleteClick(tweetId){
    console.log(tweetsData)
    const targetIndex = tweetsData.findIndex(function(tweet){
        return tweet.uuid === tweetId
    })
    if (targetIndex != -1){
        tweetsData.splice(targetIndex,1);
        renderFeed()
    }
}

