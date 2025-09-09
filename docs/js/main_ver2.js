$(function () {
    /* 화면 초기화 (새로고침 했을 때) */
    // $('html, body').scrollTop(0); // 스크롤 맨 위로
    reset();
    /* functions */
    function reset() {
        writeGallery();
        writeBackground();
    }
    function writeGallery() {
        // gallery 생성
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
    function writeBackground() {
        // gallery 생성
        for (let i = 1; i <= 5; i++) {
            // 51 // 갤러리 사진 출력
            let object = $('<div>').attr('class', `object0${i}`);
            object.appendTo($('.episode-common-bg'));
        }
    }
    /* gsap */
    gsap.registerPlugin(SplitText, ScrollTrigger, ScrollSmoother);
    console.clear();
    ScrollTrigger.defaults({
        toggleActions: 'restart none resume reverse',
        scrub: 1,
        markers: true,
    });
    let smoother = ScrollSmoother.create({
        wrapper: '.smooth-wrapper',
        content: '.smooth-content',
        smooth: 1, // how long (in seconds) it takes to "catch up" to the native scroll position
        effects: true, // data-speed and data-lag attributes on elements
        smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
    });
    // 프롤로그 메인 로고 확대되면서 나타나기
    gsap.fromTo('.prologue-box>.logo', { opacity: 0, scale: 0 }, { opacity: 1, duration: 1, scale: 1 });
    gsap.set('.prologue-box>.logo', { opacity: 1, scale: 1 });
    gsap.to('.prologue-box>.logo', {
        scrollTrigger: {
            trigger: '.prologue-container',
            start: 'top top',
            end: '+=1000',
            pin: true,
        },
        scale: 1.3,
    });
    // 프롤로그 배경 자동 회전하기
    gsap.to('.prologue-bg', {
        rotation: 10,
        scale: 1.1,
        duration: 50,
        repeat: -1,
        yoyo: true,
    });
    document.fonts.ready.then(() => {
        // 프롤로그 텍스트 나타내기
        gsap.set('.prologue-box>p', { opacity: 1 });
        SplitText.create('.prologue-box>p', {
            type: 'words,lines',
            linesClass: 'line',
            autoSplit: true,
            mask: 'lines',
            onSplit: (self) => {
                return gsap.from(self.lines, {
                    duration: 1,
                    yPercent: 120,
                    opacity: 0,
                    stagger: 0.1,
                    ease: 'expo.out',
                });
            },
        });

        $('.episode-box').each(function () {
            let title = $(this).find('.description>h2');
            let description = $(this).find('.description>p');
            let box = $(this);
            SplitText.create(title, {
                type: 'words,lines',
                linesClass: 'line',
                autoSplit: true,
                mask: 'lines',
                onSplit: (self) => {
                    return gsap.from(self.lines, {
                        yPercent: 120,
                        stagger: 0.1,
                        scrollTrigger: {
                            trigger: box,
                            start: 'top center',
                            end: '+=300',
                        },
                    });
                },
            });
            SplitText.create(description, {
                type: 'words,lines',
                linesClass: 'line',
                autoSplit: true,
                mask: 'lines',
                onSplit: (self) => {
                    return gsap.from(self.lines, {
                        yPercent: 120,
                        stagger: 0.1,
                        scrollTrigger: {
                            trigger: box,
                            start: 'top center',
                            end: '+=300',
                        },
                    });
                },
            });
        });
    });
    // 에피소드 오브젝트 옮기기
    gsap.utils.toArray('.episode-box').forEach((box) => {
        let timeline = gsap.timeline({
            scrollTrigger: {
                trigger: box,
                start: 'top top',
                end: 'bottom top',
                pin: true,
                scrub: true,
            },
        });
        timeline.fromTo(box.querySelector('.object03'), { y: -100, opacity: 0 }, { y: 0, opacity: 1 }).fromTo(box.querySelector('.object01'), { y: -100, opacity: 0 }, { y: 0, opacity: 1 }).fromTo(box.querySelector('.object02'), { y: -100, opacity: 0 }, { y: 0, opacity: 1 });
    });
    gsap.utils.toArray('.episode-common-bg>div').forEach((object) => {
        gsap.to(object, {
            scrollTrigger: {
                trigger: '.episode-container',
                start: 'top top',
                end: 'bottom top',
            },
            startAt: { y: -100 },
            y: 500,
        });
    });
    // 캐릭터 스크롤 텀 부여
    gsap.to('.characters-container', {
        scrollTrigger: {
            trigger: '.characters-container',
            start: 'top top',
            end: '+=1000',
            pin: true,
        },
    });

    /* 갤러리 가로 스크롤 */
    let sections = gsap.utils.toArray('.gallery-img');
    gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: 'none',
        scrollTrigger: {
            trigger: '.gallery-container',
            pin: true,
            snap: 1 / (sections.length - 1),
            end: '+=3500',
        },
    });
    gsap.to('.pacman', {
        x: 100 * (sections.length - 1),
        ease: 'none',
        scrollTrigger: {
            trigger: '.gallery-box',
            start: 'top top',
            end: 'bottom top',
        },
    });
    // gsap.set('.pacman', {x: 0});

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
        $('.character-info').show().stop().animate({ height: '550px' }, 'slow');
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
    /* 메뉴 버튼 토글 이벤트 - (메뉴 나타나기, 사라지기) */
    let $gnb = $('#gnb');
    $('#menu-btn').click(function (event) {
        event.preventDefault();
        let target = $(this);
        if (!target.hasClass('active')) {
            target.find('a').text('BACK');
            $gnb.show().stop().animate({ height: '100vh', opacity: 1 }, 200);
        } else {
            target.find('a').text('MENU');
            $gnb.css({ height: 0, opacity: 0 }).hide();
        }
        $(this).toggleClass('active');
    });
    $gnb.find('a').click(function (e) {
        $gnb.css({ height: 0, opacity: 0 }).hide();
        let target = $('#menu-btn');
        if (!target.hasClass('active')) {
            target.find('a').text('BACK');
            $gnb.show().stop().animate({ height: '100vh', opacity: 1 }, 200);
        } else {
            target.find('a').text('MENU');
            $gnb.css({ height: 0, opacity: 0 }).hide();
        }
        target.toggleClass('active');
        // 해당 내용으로 스크롤
        var id = e.target.getAttribute('href');
        // smoother.scrollTo(id, true, 'top top');
        e.preventDefault();
    });
});
