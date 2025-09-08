$(function(){
    /* 메뉴 버튼 토글 이벤트 - (메뉴 나타나기, 사라지기) */
    let $gnb = $('#gnb');
    $('#menu-btn').click(function(event){
        event.preventDefault();
        let target = $(this);
        if(!target.hasClass('active')){
            target.find('a').text('BACK');
            $gnb.show().stop().animate({height: '100vh', opacity: 1}, 200);
        }else{
            target.find('a').text('MENU');
            $gnb.css({height: 0, opacity: 0}).hide();
        }
        $(this).toggleClass('active');
    });
    $gnb.find('a').click(function(){
        $gnb.css({height: 0, opacity: 0}).hide();
    });
});