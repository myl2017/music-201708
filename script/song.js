/**
 * Created by myl17 on 2017/8/30.
 */
/**
 * Created by myl17 on 2017/8/30.
 */
$(function(){
    var id = parseInt(location.search.match(/\bid=([^&]*)/)[1],10)
    $.get('./database.json').then(function (response) {
        let songs = response
        let song = songs.filter(s=>s.id === id)[0]
        let {url,name,singer,lyric,pagebg,cover} = song

        play(url)
        initImg(pagebg,cover)
        initSongInfo(name,singer,lyric)
    },function () {
        console.log('error')
    })

    function play(url){
        var audio = document.createElement('audio')
        audio.src= url
        document.body.appendChild(audio)
        $('.icon-play').on('click',function(){
            audio.play()
            add()
        })
        $('.icon-pause').on('click',function(){
            audio.pause()
            remove()
        })
        audio.onended =function(){
            remove()
        }
        setInterval(()=>{
            let seconds = audio.currentTime
            let munites = ~~(seconds / 60)
            let left = seconds - munites * 60
            let time = `${full(munites)}:${full(left)}`
            let $lines = $('.lines > p')
            let $highlight
            for(let i=0;i<$lines.length;i++){
                let currentLineTime = $lines.eq(i).attr('data-time')
                let nextLineTime = $lines.eq(i+1).attr('data-time')
                if($lines.eq(i+1).length !== 0 && currentLineTime < time && nextLineTime > time){
                     $highlight = $lines.eq(i)
                    break
                }
            }
            if($highlight){
                $highlight.addClass('active').prev().removeClass('active')
                let top = $highlight.offset().top
                let linesTop = $('.lines').offset().top
                let delta = top - linesTop - $('.lyric').height() /3
                $('.lines').css('transform',`translateY(-${delta}px)`)
            }
            //console.log($highlight)
        },300)
        function full(time) {
            return time>=10 ? time + '' : '0' + time
        }
    }
    function initSongInfo(name,singer,lyric){
        $('.song-description h1 .songName').text(name)
        $('.song-description h1 .author').text(singer)
        parseLyric.call(undefined,lyric)
    }
    function initImg(pagebg,cover) {
        $('.page').css('background-image',`url(${pagebg})`)
        $('.disc > .cover').removeAttr('src')
        $('.disc > .cover').attr('src',`${cover}`)
    }
    function parseLyric(lyric) {
        let array = lyric.split('\n')
        let regex = /^\[(.+)\](.*)$/
        array = array.map(function (string,index) {
            let matche = string.match(regex)
            if(matche){
                return {time:matche[1],words:matche[2]}
            }
        })
        let $lines = $('.lines')
        array.map(function (object) {
            if(!object){ return}
            let $p = $('<p/>')
            $p.attr('data-time',object.time).text(object.words)
            $p.appendTo($lines)
        })
    }
})

function remove() {
    $('.disc .light').removeClass('playing')
    $('.disc .cover').removeClass('playing')
    $('.icon-wrap').removeClass('playing')
}
function add() {
    $('.disc .light').addClass('playing')
    $('.disc .cover').addClass('playing')
    $('.icon-wrap').addClass('playing')
}
