/**
 * Created by myl17 on 2017/8/24.
 */
$(function () {
    $.get('./database.json').then(function (reponse) {
        let playList = reponse
        playList.forEach((i)=>{
            if(i.id <= 6){
                let $li = $(`
                    <li>
                        <a href="./playlist.html?id=${i.id}">
                            <div class="cover">
                                <img src="${i.cover}" alt="推荐歌曲1"/>
                                <span class="listener"><svg class="icon-headset"><use xlink:href="#icon-erjiicon"></use></svg>170万</span>
                            </div>
                            <p class="remd-summary">${i.description}</p>
                        </a>
                    </li>
                `)
                $('.recommendList .recommendSongs').append($li)
            }else{
                return
            }
        })
        $('.recommendList .loading').remove()
    })
    $.get('./database.json').then(function (response) {
        let songs = response
        songs.forEach((i)=>{
            if(i.id >= 7 && i.id <= 16){
                let $li = $(`
                    <li>
                        <a href="./song.html?id=${i.id}">
                            <div class="songInfo">
                                <h3>${i.name}</h3>
                                <div class="songIntroduce"><i class="icon-sq"> </i><span>${i.singer} - ${i.name}</span></div>
                            </div>
                            <div class="playButton"><span></span></div>
                        </a>
                    </li>
                `)
                $('.newestList .newestSongs').append($li)
            }
        })
        $('.newestList .loading').remove()
    },function (error) {
        alert('error!!!')
    })
    $.get('./database.json').then(function (response) {
        let hotSongs = response
        let index = 0
        hotSongs.forEach((i)=>{
            let $li
            let $li2
            if(i.isHot === 1){
                $li= $(`
                    <li>
                        <a href="./song.html?id=${i.id}">
                            <div class="order song-hot">0${index += 1}</div>
                            <div class="songInfo">
                                <h3>${i.name}<span></span></h3>
                                <div class="songIntroduce"><i class="icon-sq"> </i><span>${i.singer} - ${i.name}</span></div>
                            </div>
                            <div class="playButton"><span></span></div>
                        </a>
                    </li>
                `)
                $('.hotSongList .hotSongs').append($li)
            }else{
                 $li2= $(`
                    <li>
                        <a href="./song.html?id=${i.id}">
                            <div class="order">${i.id>=10 ? i.id + '' : '0' + i.id}</div>
                            <div class="songInfo">
                                <h3>${i.name}<span></span></h3>
                                <div class="songIntroduce"><i class="icon-sq"> </i><span>${i.singer} - ${i.name}</span></div>
                            </div>
                            <div class="playButton"><span></span></div>
                        </a>
                    </li>
                 `)
                 $('.hotSongList .hotSongs').append($li2)
            }
        })
        $('.hotSongList .loading').remove()
        let $viewAll = `               
                        <div class="viewAll">
                              <a class="hotViewLink" href="#">查看完整榜单 <span class="greaterThan">&gt;</span></a>
                        </div>
                        `
        $('.hotsonglist .hotSongs').next($viewAll)
    },function (error) {
        alert('error!!!')
    })
})

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
        let $input = $(e.currentTarget)
        let value = $input.val().trim()
        if(value===''){return}
        let request= new XMLHttpRequest()
        request.open('GET','./database.json')
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = function () {
            let data = JSON.parse(request.responseText)
            $('.searchResult').empty()
            if(data === undefined){
               $('.searchResult').append(`<p class="empty">没有找到结果</p>`)
               return
            }
            for(let i=0; i<data.length;i++){
                if(data[i].name.includes(value)||data[i].singer.includes(value)||data[i].album.includes(value)){
                    let $li = `
                    <li>
                        <a  href="./song.html?id=${data[i].id}">
                            <div class="songInfo">
                                <h3 class="highlight">${data[i].name}</h3>
                                <div class="songIntroduce"><span>${data[i].singer} - ${data[i].name}</span></div>
                            </div>
                            <div class="playButton"><span></span></div>
                        </a>
                    </li>
                `
                    let $records = `
                        <li data-id="${data[i].id}">
                            <svg class="icon-lishi"><use xlink:href="#icon-lishi"></use></svg>
                            <div class="lishiInfo">
                                <div class="lishiName"><a href="./song.html?id=${data[i].id}">${data[i].name}</a></div>
                            </div>
                            <svg class="icon-clear" onclick="clearRecords(${data[i].id})">
                                 <use xlink:href="#icon-guanbixiao"></use>
                             </svg>
                        </li>
                `
                   $('.searchResult').append($li)
                   $('.records .history .history-Info').addClass('active').append($records)
                }
            }
             $('.searchResult').prepend(`<h3 class="matchTitle">最佳匹配</h3>`);
        }
        request.send()
    },400)
})

function  clearRecords(id) {
    let li = "li[data-id='"+ id +"']"
    $(li).remove()
}
$('.clearInput').on('click',function(e){
    $('input#search').val('')
})
$('input#search').on('focus',function (e) {
    $('.holder').empty()
})
