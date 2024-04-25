//키 값 받기
//API 가져오기 url
//url 데이터 호출하기 response 리소스 값 가져오기
//데이터를 텍스트화 시켜서 받기 data
//텍스트화 시킨 데이터에서 기사 부분 빼오기 newsList
//newsHTML에 출력
//, 없애기
/*내용이 200 글자가 넘으면 나머지는 ...으로 표시, 사진이 없다면 noImage 사진으로 대체,
내용이 없다면 "내용없음", 출저가 없다면 no source */
//버튼들을 눌렀을때 카테고리 별로 보여주기(정보 받아 올때 앞 글자 소문자로 바꿔주기)
//검색 했을 시 키워드 별로 보여주기
//코드 리펙토링 하기기
//에러 탐색
//에러 메세지 보내주기
//검색 결과가 없을때 No result for this search
//오류가 났을대 data.message
//페이지네이션 만들기
//클릭하는곳으로 이동, 원하는 만큼 보여주기, pagesize보다 작으면 그 만큼만 pagesize 생성
//groupSize - lastNumber 가 1보다 작으면 0이 나오지 않고 1부터 시작하게 하기
//클릭시 파란색으로 변경
//처음과 끝 화살표 없애기
//페이지 수가 5 이하일 경우 3개페이지만 보여주기
//마지막이 5개로 안떨어지는 경우 마지막 페이지 숫자에 맞춰서 5개 보여주기

let API_KEY = `95875f78dbc4490da6b29cc4990e51b6`
let url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`)
let newsList = []
let totalResults = 0 // 총 받는 데이터 수
let page = 1 // 현재 페이지
let pageSize = 10 // 1페이당 보여 줄 기사
let groupSize = 5// 5씩 한 그룹
let search_button = false

document.querySelectorAll('.menus button').forEach(x => x.addEventListener('click', (event) => categoryMethod(event)))
document.querySelectorAll('.side-menu-list>button').forEach(x => x.addEventListener('click', (event) => categoryMethod(event)))

const search_icon = () => {
    if(search_button === false){
        document.querySelector('.search').style.display = 'inline'
        document.querySelector('.go_button').style.display = 'inline'
        search_button = true
    }else{
        document.querySelector('.search').style.display = 'none'
        document.querySelector('.go_button').style.display = 'none'
        search_button = false
    }
}

const x_button = () => {document.querySelector('.side-menu').style.width = 0;}
const sideMenus = () => {document.querySelector('.side-menu').style.width = '250px';}

const errorMethod = (errorMessage) => {
    let errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
  </div>`
    document.querySelector('.news_border').innerHTML = errorHTML
}

const moveToPage = (pageNum) => {page = pageNum; firstMethod()}

//페이지네이션 < (1개씩 이동) << (1, lastNum 으로 이동)
const paginationMethod = () => {
    let totalPages = Math.ceil(totalResults / pageSize)
    let groupPage = Math.ceil(page / groupSize)
    let lastNum = groupPage * groupSize > totalPages ? totalPages : groupPage * groupSize
    console.log('lastNum', lastNum)
    let firstNum = lastNum - (groupSize - 1) < 1 ? 1 : lastNum - (groupSize - 1)

    let paginationHTML = `<li class="page-item" onclick="moveToPage(${1})" ${page === 1 ? 'style="display:none"' : ''}>
    <a class="page-link"><<</a></li>`
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page-1})" ${page == 1 ? 'style="display:none"' : ''}>
    <a class="page-link"><</a></li>`
    for(let i = firstNum; i <= lastNum; i++){
        paginationHTML += `<li class="page-item ${page === i ? 'active' : ''}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page+1})" ${page == totalPages ? 'style="display:none"' : ''}>
    <a class="page-link">></a></li>`
    paginationHTML += `<li class="page-item" onclick="moveToPage(${totalPages})" ${page == totalPages ? 'style="display:none"' : ''}>
    <a class="page-link">>></a>
  </li>`

    document.querySelector('.pagination').innerHTML = paginationHTML
}

//버튼 클릭 시 카테고리에 맞는 기사 보여주기
const categoryMethod = (event) => {
    let category = event.target.textContent.toLowerCase();
    console.log('category', category)
    url = new URL(`https://newsapi.org/v2/top-headlines?category=${category}&country=kr&apiKey=${API_KEY}`)
    firstMethod()
}

//검색 결과에 맞는 기사 나오게 하기
const keywordMethod = () => {
    let keyword = document.querySelector('.search').value
    console.log('keyword', keyword)
    page = 1
    url = new URL(`https://newsapi.org/v2/top-headlines?q=${keyword}&country=kr&apiKey=${API_KEY}`)
    firstMethod()
}

//리소스값 받아와서 에러 검사 후 문제 없으면 render()
const firstMethod = async () => {
    try{
        url.searchParams.set('page', page)
        console.log('page', page)
        url.searchParams.set('pageSize', pageSize)
        let response = await fetch(url)
        console.log('response', response)
        let data = await response.json()
        console.log('data', data)
        newsList = data.articles
        console.log('newsList', newsList)
        if(response.status === 200){
            totalResults = data.totalResults
            console.log('totalResults', totalResults)
            if(data.articles.length === 0){
                throw new Error('No result for this search')
            }
            render()
            paginationMethod()
        }else{
            throw new Error(data.message)
        }
    }catch(error){
        error(errorMethod(error.message))
    }
}

//render
function render(){
    let newsHTML = newsList.map((news)=> `<div class="row news">
    <div class="col-lg-4">
        <img class="news-img" src="${news.urlToImage || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}">
    </div>
    <div class="col-lg-8">
        <h2><a href="${news.url}">${news.title}</a></h2>
        <p>${news.description == null || news.description == ""
                ? '내용 없음'
                : news.description.length > 200
                ? news.description.substring(0, 200) + "..."
                : news.description
        }</p>
        <div>${news.source.name || "no source"} * ${moment(news.published_date).fromNow()}</div>
    </div>
</div>`).join('')
        document.querySelector('.news_border').innerHTML = newsHTML
}

firstMethod()