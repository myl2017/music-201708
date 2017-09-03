/**
 * Created by myl17 on 2017/9/1.
 */
$(function () {
    $.get('./database.json').then(function (reponse) {
        var playList = reponse
        playList.forEach((i)=>{
            if(i.id <= 6){
                let $li = $(`
                    <li>
                        <a href="./song.html?&id=${i.id}">
                            <div class="order song-hot">${i.id}</div>
                            <div class="songInfo">
                                <h3>${i.name}<span>(${i.album})</span></h3>
                                <div class="songIntroduce"><span>${i.singer} - ${i.description}</span></div>
                            </div>
                            <div class="playButton"><span></span></div>
                        </a>
                    </li>
                `)
                $('.lists .list').append($li)
                $('.lists .loading').remove()
            }
        })
    })
})
