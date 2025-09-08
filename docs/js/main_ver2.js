$(function () {
    /* 변수 선언 */
    let device_width = $(window).width(); // 화면 너비
    let device_height = $(window).height(); // 화면 높이
    let scrollTop = $(this).scrollTop(); // 스크롤 위치

    const $prologue = $('.prologue-container'); // 프롤로그 섹션

    const $episode = $('.episode-container'); // 에피소드 섹션

    const $gallery = $('.gallery-container'); // 갤러리 섹션
    const $gallery_track = $gallery.find('.gallery-box'); // 갤러리 가로 스크롤 해야하는 영역

    /* 화면 초기화 (새로고침 했을 때) */
    $('html, body').scrollTop(0); // 스크롤 맨 위로
    reset();

    /* scroll event */
    $(window).on('scroll', function () {
        scrollTop = $(this).scrollTop();
        /* prologue-container */
        onScrollPrologue();
        /* episode-container */
        onScrollEpisode();
        /* gallery-container */
        onScrollGallery();
    });

    /* click event */
    /* characters-container */
    $('.characters>div>div').click(function () {
        // 마우스 클릭하면 캐릭터 상세 설명 나타나기(캐릭터 목록 아래로 배치)
        let ch_num = $(this).attr('class').split(' ')[0];
        $('.characters>div>div').removeClass('active'); // 활성 초기화
        $('.character-info>div').css({ display: 'none' }); // 활성 초기화
        $(this).addClass('active'); // 활성화
        $('.character-info').addClass('active'); // 활성화
        $('.characters>div>div').css({ height: '100px', width: '100%' }); // 캐릭터 크기 변경
        $(`.character-info>.${ch_num}`).css({ display: 'flex' });
        $('.character-info').show().stop().animate({ height: '600px' }, 'slow');
    });
    $('#close-btn').click(function (event) {
        // 뒤로가기 버튼 클릭 시 캐릭터 설명창 사라지기
        event.preventDefault();
        $('.characters>div>div').removeClass('active'); // 활성 초기화
        $(`.character-info>div`).css({ display: 'none' }); // 활성 초기화
        $('.character-info').removeClass('active'); // 비활성화

        $('.characters>div>div').css({ height: '', width: '' }); // 캐릭터 크기 변경
        $('.character-info')
            .stop()
            .animate({ height: '0' }, 'slow', function () {
                $(this).hide();
            });
    });
    /* gallery-container */
    $('.progress>.star').click(function () {
        // 갤러리 별 클릭
        const secTop = Math.floor($gallery.offset().top);
        const secH = $gallery.outerHeight();
        const inView = scrollTop >= secTop && scrollTop <= secTop + secH;
        if (!inView) return; // 스크롤 범위 밖이면
        let nextScroll = ($gallery.data('galleryTrackWidth') / 10) * ($(this).index() - 1);
        $('body, html').animate({ scrollTop: secTop + nextScroll }, 'slow');
    });

    /* functions */
    function reset() {
        writeGallery();
        // $('html, body').css('overflow', 'hidden');
        // 프롤로그 내용 크기 커지면서 나타나기
        $('.prologue-box>.logo').css({ transform: 'translate(-50%, -50%)' });
        $('.prologue-box>.logo, .prologue-box>p').css({ transform: `scale(1)`, opacity: 1 });
        updateSectionMetrics();
        // onScrollEpisode();
        // onScrollGallery();
    }

    function updateSectionMetrics() {
        /* gallery */
        const galleryTrackWidth = $gallery_track.get(0).scrollWidth; // 트랙의 실제 가로 총길이
        // 섹션 높이 = (가로총길이 - 뷰포트너비) + 뷰포트높이
        // 이렇게 해야 사용자가 세로로 스크롤할 때, 그 구간 동안 가로 이동이 완주됨
        const gallerySectionHeight = galleryTrackWidth - device_width + device_height;
        $gallery.height(gallerySectionHeight);

        // 스크롤 시 사용할 값 저장
        $gallery.data('galleryTrackWidth', galleryTrackWidth);
        $gallery.data('maxX', Math.max(0, galleryTrackWidth - device_width));
    }

    function getSectionInfo(section) {
        // const secTop = $episode.offset().top;
        // const secH = $episode.outerHeight();

        let info = {};
        info['secTop'] = section.offset().top;
        info['secH'] = section.outerHeight();
        return info;
    }

    function checkScroll(section_info) {
        // const inView = scrollTop >= secTop && scrollTop <= secTop + secH;
        // if (!inView) return; // 스크롤 범위 밖이면
        const inView = scrollTop >= section_info.secTop && scrollTop <= section_info.secTop + section_info.secH;
        return inView;
    }

    function onScrollPrologue() {
        /* prologue scroll */ const $prologue_info = getSectionInfo($prologue);
        if (!checkScroll($prologue_info)) return; // 스크롤 범위 밖이면

        let progress = ($prologue_info.secTop + $prologue_info.secH - scrollTop) / $prologue_info.secH; // 진행도(1 > 0)
        progress = Math.min(Math.max(progress, 0), 1);
        const scrolledIn = scrollTop - $prologue_info.secTop; // 섹션 진입 후 진행된 세로 스크롤량
        $('.prologue-box').css({
            // 프롤로그 내용 중앙에 배치 & 사라지기
            transform: `translate(-50%, calc(-50% + ${scrolledIn}px))`,
            opacity: progress,
        });

        $('.prologue-box>.logo').css({
            // 프롤로그 로고 작아지기
            transform: `scale(${progress})`,
        });

        $('.prologue-bg>div').each(function (index) {
            // 스크롤하면 에피소드에 오브젝트 움직이기
            if (index <= 4) {
                $(this).css({
                    transform: `translateY(${scrolledIn}px) rotateY(${30 * progress}deg)`,
                    opacity: progress,
                });
            } else {
                $(this).css({
                    transform: `translateY(${scrolledIn}px)`,
                    opacity: progress,
                });
            }
        });
    }

    function onScrollEpisode() {
        /* episode scroll */
        const $episode_info = getSectionInfo($episode);
        if (!checkScroll($episode_info)) return; // 스크롤 범위 밖이면

        const viewportH = $(window).height();
        const scrolledIn = scrollTop - $episode_info.secTop; // 섹션 진입 후 진행된 세로 스크롤량
        const progress = Math.min(Math.max(scrolledIn / ($episode_info.secH - viewportH), 0), 1); // 진행도(0 > 1)
        $episode.find('.object01').each(function (index) {
            // 스크롤하면 사진 회전하기
            let move = Math.min(Math.max((scrolledIn - device_height * index) / (device_height / 2), 0), 1); // 진행도(0 > 1), 그에 따른 가로 이동량
            console.log(move);
            $(this).css('transform', `rotateY(${180 * move}deg)`);
        });
    }

    function onScrollGallery() {
        /* gallery scroll */ const $gallery_info = getSectionInfo($gallery);
        if (!checkScroll($gallery_info)) return; // 스크롤 범위 밖이면
        const viewportH = $(window).height();
        const maxX = $gallery.data('maxX') || 0;
        const scrolledIn = scrollTop - $gallery_info.secTop; // 섹션 진입 후 진행된 세로 스크롤량

        const translateX = -Math.min(maxX, scrolledIn);
        $gallery_track.css('transform', `translateX(${translateX}px)`); // 가로 이동 적용
        const movePacman = (translateX / device_width) * -100;
        $('.progress>.pacman').css('left', `${movePacman}px`);
        // if(Math.floor(movePacman%100) == 0){
        //     $('.progress>.pacman').css({'background': 'url(images/bg/pacman1.png) no-repeat 0 0', 'background-size': 'cover'});
        // }else{
        //     $('.progress>.pacman').css({'background': 'url(images/bg/pacman2.png) no-repeat 0 0', 'background-size': 'cover'});
        // }
        $('.progress>.star').each(function (index) {
            if (index <= movePacman / 100) {
                $(this).css('opacity', 0.5);
            } else {
                $(this).css('opacity', 1);
            }
        });
    }

    /* gallery 생성 */
    function writeGallery() {
        for (let i = 1; i <= 10; i++) {
            // 51 // 갤러리 사진 출력
            let img = $('<img>').attr('src', `images/gallery/${i}.jpg`).attr('alt', `현장 포토 ${i}`);
            let li = $('<li>').attr('class', 'gallery-img');
            img.appendTo(li);
            li.appendTo($('.gallery-box'));
        }
        for (let i = 0; i < 10; i++) {
            // 51 // 갤러리 별 출력
            let div = $('<div>').attr('class', 'star');
            div.css('left', `${100 * i}px`);
            div.appendTo($('.progress-bar>.progress'));
        }
    }
});
