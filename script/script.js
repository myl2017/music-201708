/**
 * Created by myl17 on 2017/8/24.
 */
$('.tabs-nav').on('click','li',function (e) {
    var $li = $(e.currentTarget)
    var index = $li.index()
    $li.addClass('active').siblings().removeClass('active')
    $('.tab-pannel').children().eq(index).addClass('active').siblings().removeClass('active')
})


