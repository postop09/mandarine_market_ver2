const $secProfile = document.querySelector('.sec_profile');
const $secProducts = document.querySelector('.sec_products');
const $secPost = document.querySelector('.sec_userFeed');
const $secFeed = $secPost.querySelector('.sec_feed');
const $followers = $secProfile.querySelector('.txt_followrs');
const $btnFollow = $secProfile.querySelector('.btn_follow');
const $wrapFollow = $secProfile.querySelectorAll('.wrap_follow');
const $btnMyProfile = document.querySelector('.btn_myProfile');
const url = `http://146.56.183.55:5050`;
const token = JSON.parse(localStorage.getItem('token'));
const myAccountname = localStorage.getItem('myAccountname');

// 뒤로가기
const $btnBack = document.querySelector('.btn_backPage');
$btnBack.addEventListener('click', () => {
  window.history.back();
})

// 프로필 정보
async function fetchProfileData() {
  const res = await fetch(`${url}/profile/${myAccountname}`, {
    method: 'GET',
    headers: {
      "Authorization" : `Bearer ${token}`,
      "Content-type" : 'application/json'
    }
  });
  const json = await res.json();
  // console.log(json);
  console.log(json.profile);
  const image = json.profile.image;
  const username = json.profile.username;
  const userId = json.profile.accountname;
  const intro = json.profile.intro;
  const followers = json.profile.followerCount;
  const following = json.profile.followingCount;
  const isfollow = json.profile.isfollow;
  localStorage.setItem('searchData', JSON.stringify(json.profile));
  userProfile(image, username, userId, intro, followers, following, isfollow);
}
fetchProfileData();

function userProfile(image, username, userId, intro, followers, following, isfollow) {
  const $imgProfile = $secProfile.querySelector('.img_profile');
  const $userName = $secProfile.querySelector('.txt_userName');
  const $userId = $secProfile.querySelector('.txt_userId');
  const $overview = $secProfile.querySelector('.txt_overview');
  const $following = $secProfile.querySelector('.txt_following');
  
  $imgProfile.src = image;
  $userName.textContent = username;
  $userId.textContent = userId;
  $overview.textContent = intro;
  $followers.textContent = followers;
  $following.textContent = following;
}
// 팔로워/팔로잉 정보
$wrapFollow[0].addEventListener('click', () => {
  localStorage.setItem('clickData', 'Followers');
})
$wrapFollow[1].addEventListener('click', () => {
  localStorage.setItem('clickData', 'Followings');
})

// 상품 목록
async function fetchProduct() {
  const res = await fetch(`${url}/product/${myAccountname}`, {
    method: 'GET',
    headers: {
      "Authorization" : `Bearer ${token}`,
      "Content-type" : 'application/json'
    }
  });
  const json = await res.json();
  const $listProducts = $secProducts.querySelector('.list_products');
  
  if (json.data === 0) {
    $secProducts.classList.remove('on');
  } else {
    $secProducts.classList.add('on');
    json.product.map((item) => {
      const price = +item.price;
      // console.log(item);
      $listProducts.innerHTML += `
        <li class="item_product">
          <button type="button">
            <img src="${item.itemImage}" alt="" class="img_product">
          </button>
          <p class="txt_name">${item.itemName}</p>
          <strong class="txt_price">${price.toLocaleString()}원</strong>
        </li>
      `

    })
  }
}
fetchProduct();

// 게시글 목록
async function fetchPost() {
  const res = await fetch(`${url}/post/${myAccountname}/userpost`, {
    method: 'GET',
    headers: {
      "Authorization" : `Bearer ${token}`,
      "Content-type" : 'application/json'
    }
  });
  const json = await res.json();
  const $listPosts = $secPost.querySelector('.sec_feed');

  if (json.post.length === 0) {
    $secPost.classList.remove('on');
  } else {
    $secPost.classList.add('on');
    json.post.map((postItem) => {
      console.log(postItem);
      const authorImg = postItem.author.image;
      const authorName = postItem.author.username;
      const authorId = postItem.author.accountname;
      const postItemId = postItem.id;
      const postContent = postItem.content;
      const postImg = postItem.image;
      const postImgs = postImg.split(',');
      const postHeartCount = postItem.heartCount;
      const postCommentCount = postItem.commentCount;
      const postCreatedAt = postItem.createdAt;
      const postHearted = postItem.hearted;
      const createYear = postCreatedAt.substr(0, 4);
      const createMonth = postCreatedAt.substr(5, 2);
      const createDay = postCreatedAt.substr(8, 2);

      $listPosts.innerHTML += `
        <article class="artic_feed" key="${postItemId}">
          <h3 class="txt_hide">게시글</h3>
          <img src="${authorImg}" alt="" class="img_profile">
          <div class="wrap_contents">
            <div class="wrap_profile">
              <a href="" class="txt_profile">
                <strong class="txt_profileName">${authorName}</strong>
                <small class="txt_profileId">@ ${authorId}</small>
              </a>
              <button type="button" class="btn_profileMore"><img src="../img/icon/s-icon-more-vertical.png" alt="" class="img_profileMore"></button>
            </div>
            <p class="txt_feedText">${postContent}</p>
            ${postImgs=='' ? '' : `
              <ul>
              <li><img src="${postImgs[0]}" alt="" class="img_feedImg"></li>
              </ul>
            `}
            <dl class="list_likeComment">
              <div class="wrap_likeComment">
                <dt><button type="button"><img src="${postHearted ? '../img/icon/icon-heart-active.png' : '../img/icon/icon-heart.png'}" alt="좋아요" class="${postHearted ? 'img_icon img_like on' : 'img_icon img_like'}"></button></dt>
                <dd>${postHeartCount}</dd>
              </div>
              <div class="wrap_likeComment">
                <dt><button type="button"><img src="../img/icon/icon-message-circle.png" alt="댓글 개수 및 댓글 보러가기" class="img_icon img_chat"></button></dt>
                <dd>${postCommentCount}</dd>
              </div>
            </dl>
            <small class="txt_postDate">${createYear}년 ${createMonth}월 ${createDay}일</small>
          </div>
        </article>
      `
    })
  }
}
fetchPost();

// 좋아요
async function fetchLikeData(postId) {
  const res = await fetch(`${url}/post/${postId}/heart`, {
    method: 'POST',
    headers: {
      "Authorization" : `Bearer ${token}`,
      "Content-type" : "application/json"
    }
  });
  const json = await res.json();
  // console.log(json);
}
// 좋아요 취소
async function fetchUnLikeData(postId) {
  const res = await fetch(`${url}/post/${postId}/unheart`, {
    method: 'DELETE',
    headers: {
      "Authorization" : `Bearer ${token}`,
      "Content-type" : "application/json"
    }
  });
  const json = await res.json();
  // console.log(json);
}
$secFeed.addEventListener('click', (e) => {
  if (e.target.className === 'img_icon img_like') {
    const postId = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('key');
    const heartCount = e.target.parentNode.parentNode.parentNode.querySelector('dd')
    fetchLikeData(postId);
    e.target.classList.add('on');
    e.target.src = '../img/icon/icon-heart-active.png';
    heartCount.textContent = Number(heartCount.textContent) + 1;
  } else if (e.target.className === 'img_icon img_like on') {
    const postId = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('key');
    const heartCount = e.target.parentNode.parentNode.parentNode.querySelector('dd')
    fetchUnLikeData(postId);
    e.target.classList.remove('on');
    e.target.src = '../img/icon/icon-heart.png';
    heartCount.textContent = Number(heartCount.textContent) - 1;
  } else if (e.target.parentNode.className === 'txt_profile') {
    const accountname = e.target.parentNode.querySelector('.txt_profileId').textContent.substr(2);
    console.log(accountname);
    localStorage.setItem('accountname', accountname);
  } else if (e.target.className === 'img_icon img_chat') {
    const postId = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('key');
    localStorage.setItem('postId', postId);
    location.href = 'post.html';
  }
})

// 나의 프로필
$btnMyProfile.addEventListener('click', () => {
  location.reload();
})