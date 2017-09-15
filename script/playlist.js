/**
 * Created by myl17 on 2017/9/1.
 */
$(function () {
    $.get('./playlist.json').then(function (reponse) {
        let id = parseInt(location.search.match(/\bid=([^&]*)/)[1],10)
        reponse.forEach((i)=>{
            if(i.id === id){
                $('.head .head-inner').append(headTemplate(i))
                $('.head .head-bg').css('background-image',`url(${i.cover})`)
                let detail = detailTemplate(i)
                detail.length<=1 ? $('.intro > div:nth-child(2)').addClass('active') : $('.intro > div:nth-child(2)').removeClass('active')
            }else{
                return
            }
        })
    },function (error) {
        alert(error)
    })
    $.get('./database.json').then(function (reponse) {
        reponse.forEach((i)=>{
            if(i.id <= 30){
                $('.lists .list').append(playListTemplate(i))
                $('.lists .loading').remove()
            }
        })
    },function (error) {
        alert(error)
    })
})

function headTemplate(i) {
    return  $(`<div class="cover">
                     <img src="${i.cover}" alt=""/>
                     <div class="song-menu">歌单</div>
                     <div class="listen">
                          <svg class="icon-headset"><use xlink:href="#icon-erjiicon"></use></svg><small class="listen-num">${i.listener}</small>
                     </div>
                </div>
                <div class="text">
                     <h1>${i.title}</h1>
                     <a class="avatar-link" href="#">
                           <div class="avatar">
                             <img src="${i.cover}" alt=""/>
                           </div>
                           <span>${i.author}</span>
                     </a>
                </div>`)
}
function playListTemplate(i) {
    return $(`<li>
                <a href="./song.html?&id=${i.id}">
                     <div class="order song-hot">${i.id}</div>
                            <div class="songInfo">
                                <h3>${i.name}<span></span></h3>
                                <div class="songIntroduce"><span>${i.singer} - ${i.description}</span></div>
                            </div>
                     <div class="playButton"><span></span></div>
                </a>
              </li>`)
}
function detailTemplate(i) {
    let $intro = i.intro.split('<br/>')
    for(let j=0; j<$intro.length;j++){
        let $span = $(`<span>${$intro[j]}<br/></span>`)
        $('.intro > div.detail').append($span)
    }
    return $intro
}
$('.arrowdown').on('click',function (e) {
    $('.arrowup').addClass('active')
    $('.arrowdown').addClass('active')
    $('.intro > div:first-child').removeClass('active')
})
$('.arrowup').on('click',function (e) {
    $('.arrowup').removeClass('active')
    $('.arrowdown').removeClass('active')
    $('.intro > div:first-child').addClass('active')
})
