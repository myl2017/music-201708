/**
 * Created by myl17 on 2017/8/24.
 */
$(function () {
    $.get('./playlist.json').then(function (reponse) {
        reponse.forEach((i)=>{
            if(i.id <= 6){
                let $li = recommendTemplate(i)
                $('.recommendList .recommendSongs').append($li)
            }else{
                return
            }
        })
        $('.recommendList .loading').remove()
    },function (error) {
        alert(error)
    })
    $.get('./database.json').then(function (response) {
        response.forEach((i)=>{
            if(i.id >= 7 && i.id <= 16){
                let $li = newestTemplate(i)
                $('.newestList .newestSongs').append($li)
            }
        })
        $('.newestList .loading').remove()
    },function (error) {
        alert(error)
    })
    $.get('./database.json').then(function (response) {
        let index = 0
        response.forEach((i)=>{
            let $li,$li2
            if(i.isHot === 1){
                index += 1
                $li= hotSongsTemplate(i,index)
                $('.hotSongList .hotSongs').append($li)
            }else{
                $li2= hotSongsTemplate2(i)
                $('.hotSongList .hotSongs').append($li2)
            }
        })
        $('.hotSongList .loading').remove()
    },function (error) {
        alert(error)
    })
    $.get('./database.json').then(function (response) {
        response.forEach((i)=>{
            if(i.isHot === 2){
                let $li = $(`<li><a class="link" href="./song.html?id=${i.id}">${i.hotSearch}</a></li>`)
                $('.records .hotList .hotSearch').append($li)
            }
        })
    },function (error) {
        alert(error)
    })
})

function recommendTemplate(i) {
    return  $(`<li>
                    <a href="./playlist.html?id=${i.id}">
                         <div class="cover">
                             <img src="${i.cover}" alt="推荐歌曲1"/>
                             <span class="listener"><svg class="icon-headset"><use xlink:href="#icon-erjiicon"></use></svg>${i.listener}万</span>
                         </div>
                         <p class="remd-summary">${i.title}</p>
                    </a>
                </li>`)
}
function  newestTemplate(i) {
    return $(`<li>
                   <a href="./song.html?id=${i.id}">
                        <div class="songInfo">
                            <h3>${i.name}</h3>
                            <div class="songIntroduce"><i class="icon-sq"> </i><span>${i.singer} - ${i.name}</span></div>
                        </div>
                        <div class="playButton"><span></span></div>
                   </a>
               </li>`)
}
function hotSongsTemplate(i,index) {
    return $(`<li>
                   <a href="./song.html?id=${i.id}">
                        <div class="order song-hot">0${index}</div>
                            <div class="songInfo">
                                <h3>${i.name}<span></span></h3>
                                <div class="songIntroduce"><i class="icon-sq"> </i><span>${i.singer} - ${i.name}</span></div>
                            </div>
                        <div class="playButton"><span></span></div>
                   </a>
                </li>`)
}
function hotSongsTemplate2(i) {
    return $(`<li>
                   <a href="./song.html?id=${i.id}">
                        <div class="order">${i.id>=10 ? i.id : '0' + i.id}</div>
                            <div class="songInfo">
                                <h3>${i.name}<span></span></h3>
                                <div class="songIntroduce"><i class="icon-sq"> </i><span>${i.singer} - ${i.name}</span></div>
                            </div>
                        <div class="playButton"><span></span></div>
                    </a>
              </li>`)
}

//tab
$('.tabs-nav').on('click','li',function (e) {
    let $li = $(e.currentTarget)
    let index = $li.index()
    $li.addClass('active').siblings().removeClass('active')
    $('.tab-pannel').children().eq(index).addClass('active').siblings().removeClass('active')
})

//search
let timer = null
$('input#search').on('input',function(e){
    if(timer){
        window.clearTimeout(timer)
    }
    timer = setTimeout(function () {
        timer = null
        $('.records .hotList').removeClass('active')
        let value = $(e.currentTarget).val().trim()
        if(value === ''){
            return
        }else{
            searchPrepare(value)
            ajax(value)
        }
    },400)
})
$('.clearInput').on('click',function(e){
    $('input#search').val('')
    $('.matchList').removeClass('active')
    $('.records').removeClass('active')
})
$('input#search').on('focus',function (e) {
    $('.holder').empty()
})

//search prepare
function searchPrepare(value) {
    $('.records').addClass('active')
    $('.matchTitle').remove()
    $('.searchResult').empty()
    $('.matchList').addClass('active')
    $('.matchList').prepend(`<h3 class="matchTitle">搜索“${value}”</h3>`);
}
function  ajax(value) {
    let request = initAjax()
    request.onload = function () {
        let data = parse(request)
        loadingSearch(data,value)
    }
    request.send()
}
function loadingSearch(data,value) {
    for(let i=0; i<data.length;i++){
        if(data[i].name.includes(value)||data[i].singer === value||data[i].album.includes(value)){
            $('.searchResult').append(searchTemplate(data[i]))
            $('.records .history .history-Info').addClass('active').append(recordsTemplate(data[i]))
        }
    }
}
function searchTemplate(song) {
    return $(`<li data-id="${song.id}" onclick="chooseAjax(${song.id})">
                <a  href="javascript:void(0);">
                    <svg class="icon-search"><use xlink:href="#icon-btnserach"></use></svg>
                    <div class="matchItem"><div class="matchSongName">${song.name}</div></div>
                </a>
             </li>`)
}
function chooseAjax(id) {
    let request = initAjax()
    request.onload = function () {
        let data = parse(request)
        for(let i=0; i<data.length;i++){
            if(data[i].id === id){
                $('.matchTitle').remove()
                $('.searchResult').empty()
                $('.searchResult').append(resultTemplate(data[i]))
            }
        }
    }
    request.send()
}
function resultTemplate(song) {
    return  $(`<li>
                 <a  href="./song.html?id=${song.id}">
                     <div class="songInfo">
                          <h3 class="highlight">${song.name}</h3>
                              <div class="songIntroduce"><span>${song.singer} - ${song.name}</span></div>
                     </div>
                     <div class="playButton"><span></span></div>
                 </a>
              </li>`)
}
function recordsTemplate(song) {
    return  $(`<li data-id="${song.id}">
                 <svg class="icon-lishi"><use xlink:href="#icon-lishi"></use></svg>
                 <div class="lishiInfo"><div class="lishiName"><a href="./song.html?id=${song.id}">${song.name}</a></div></div>
                 <svg class="icon-clear" onclick="clearRecords(${song.id})"><use xlink:href="#icon-guanbixiao"></use></svg>
             </li>`)
}
function  clearRecords(id) {
    let li = "li[data-id='"+ id +"']"
    $(li).remove()
}
function initAjax() {
    let request= new XMLHttpRequest()
    request.open('GET','./database.json')
    request.setRequestHeader("Content-Type", "application/json");
    return request
}
function parse(request) {
    let data = JSON.parse(request.responseText)
    if(data === undefined){
        $('.searchResult').append(`<p class="empty">没有找到结果</p>`)
        return
    }
    return data
}

