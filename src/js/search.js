const inpSearch = document.querySelector('.inp_search');
const listUser = document.querySelector('.list_searchUser')
const url = `http://146.56.183.55:5050`;
const token = JSON.parse(localStorage.getItem('token'));

// 일치하는 유저 데이터
async function fetchsearchData() {
  const res = await fetch(`${url}/user/searchuser/?keyword=${inpSearch.value}`, {
    method: "GET",
    headers: {
      "Authorization" : `Bearer ${token}`,
      "Content-type" : 'application/json'
    }
  });
  const json = await res.json();
  console.log(res);
  console.log(json);
  [...json].map((data) => {
    listUser.innerHTML += `
      <li class="item_searchUser">
        <a href="userProfile.html" class="btn_searchUser">
          <img src="${data.image}" alt="" class="img_searchUser">
          <div class="wrap_txtUser">
            <strong class="txt_userName">${data.username}</strong>
            <small class="txt_userId">@ ${data.accountname}</small>
          </div>
        </a>
      </li>
    `
  })
  listUser.addEventListener('click', (e) => {
    if (e.target !== e.currentTarget) {
      const accountname = e.target.parentNode.querySelector('.txt_userId').textContent.substr(2);
      localStorage.setItem('accountname', accountname);
    }
  })
}
inpSearch.addEventListener('keyup', () => {
  listUser.innerHTML = '';
  if (inpSearch.value !== '') {
    fetchsearchData();
  };
});

// 적절하지 않은 프로필 이미지 경로 검사
// 검색 프로세스 개선(즉시 반응 x 타이핑 시간 고려 o)