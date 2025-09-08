$(function(){
    let video = $('video');
    /* video-container - (영상 스킵 또는 영상 끝나면 페이지 자동으로 넘어가기) */
    $('.skip-btn').click(function(){
        let skip = confirm('영상을 스킵하시겠습니까?');
        if(skip){
            location.href = 'main.html';
        }
    });
    let videoTimer = setInterval(function(){
        if(video.prop("ended")){
            //영상종료 후 진행할 함수 입력부분
            location.href = 'main.html';
            clearInterval(videoTimer);
        }
    },200);
    // 영상 일시정지, 소리 켜기 버튼 만들기
    $('.stop-btn').click(function(){
        if($(this).hasClass('active')){ // 영상이 켜져있으면 끄기
            video.get(0).play();
        }else{ // 꺼져있으면 켜기
            video.get(0).pause();
        }
        $(this).toggleClass('active');
    });
    $('.sound-btn').click(function(){
        if($(this).hasClass('active')){ // 소리가 켜져있으면 끄기
            video.prop('muted', true);
        }else{ // 꺼져있으면 켜기
            video.prop('muted', false);
        }
        $(this).toggleClass('active');
    });
});