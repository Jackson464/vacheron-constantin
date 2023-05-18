//jQuery
$(document).ready(function(){
    const section = $('.main > section')
    const footer = $('.footer')
    
    let sectionSpeed = 500;
    // 각각의 섹션의 위치값 저장
    let sectionPos = [];
    let sectionIndex = 0;
    
    // 연속 휠 막기
    let scrolling = false;

    // 화면 사이즈 체크
    // 화면 너비 1000px 이하에서는 휠 작동 시켜도 fullpage식 섹션전환이
    // 되지 않게 막아주는 변수
    // true -> fullpage식 섹션전환이 작동 됨
    // fales -> fullpage식 섹션전환이 작동 안됨
    // fullpage mode on <= true
    // fullpage mode off <= false
    let wheeling = true;

    // const sectionMenu = $('.section-menu')

    // 화면 너비가 1000px 이하면 fullpage off 시키고
    // sectionMenu 를 hide 시킨다
    // 화면 너비가 1000px 초과면 fullpage on 시키고
    // sectionMenu 를 show 시킨다
    function wheelCheckFn(){
        let windowWidth = window.innerWidth;
        console.log(windowWidth)
        if(windowWidth <= 1000){
            wheeling = false;
            // sectionMenu.hide();
        }else{
            wheeling = true;
            // sectionMenu.show();
        };
    }
    wheelCheckFn();
    // $(window).resize(function(){
    //     wheelCheckFn();
    //     // resetSection();
    // })

    // 위치파악(Y스크롤 이동 px)
    // 화면리사이징이 일어날때마다 호출됨

    // 화면리사이징시 변경되는 section위치를 다시 sectionPos 배열안에 저장함
    function resetSection(){
        sectionPos = [];
        $.each(section,function(index,item){
            let tempY = $(this).offset().top;
            // console.log(index + ":" + tempY)
            tempY = Math.ceil(tempY);
            sectionPos[index] = tempY;
        })
        sectionPos[sectionPos.length] = Math.ceil(footer.offset().top)
        console.log(sectionPos);
    }
    //최초에 새로고침 또는 실행시 위치값파악 => sectionPos배열에 저장
    resetSection();

    let sectionTotal = sectionPos.length;
    console.log("sectionTotal : " + sectionTotal)

    let resizeTimer;

    $(window).bind('resize', function(){
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resizeFunction , 500);
    })
    function resizeFunction(){
        // 리사이즈시 실행할 코드
        wheelCheckFn();
        resetSection();
        if(wheeling){
            // gsap.to($(요소명),durationTime,{설정})
            gsap.to($('html'),sectionSpeed/1000,{
                // 리사이즈 될때 scroll top을 섹션 위치로 이동해라
                scrollTop : sectionPos[sectionIndex],
                onComplete: function(){
                    scrolling = false;
                }
            })
        }
    }

        // 리사이즈
    // $(window).resize(function(){
    //     wheelCheckFn();
    //     resetSection();
    //     if(wheeling){
    //         // gsap.to($(요소명),durationTime,{설정})
    //         gsap.to($('html'),sectionSpeed/1000,{
    //             // 리사이즈 될때 scroll top을 섹션 위치로 이동해라
    //             scrollTop : sectionPos[sectionIndex],
    //             onComplete: function(){
    //                 scrolling = false;
    //             }
    //         })
    //     }
    // })

    // 스크롤바의 위쪽 위치값을 파악한다

    $(window).scroll(function(){
        if(wheeling){
            return;
        }
        let tempY = $(window).scrollTop();
        tempY = Math.ceil(tempY);
        
        for(let i = sectionTotal - 1; i >= 0; i--){
            let tempMax = sectionPos[i];
            // 섹션인덱스번호와 스크롤양을 비교해서 해당하는 섹션인덱스
            // 값을 찾아줌 - 현재 위치에 해당하는 section번호를 넘겨줌
            if(tempY >= tempMax){
                sectionIndex = i;
                break;
            }
        }
    })

    
    // $(window).bind('mosewheel', function(event){
    //     if(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0){
    //         // scroll up
    //         console.log("스크롤 위로");
    //     }else{
    //         // scroll down
    //         console.log("스크롤 아래로");
    //     }
    // })

    //마우스 휠체크 및 섹션 이동
    $(window).bind('mousewheel DOMMousescroll',function(event){
        let distance = event.originalEvent.wheelDelta;
        // 화면 사이즈에 따른 작동여부
        if (distance == null) {
            distance = event.originalEvent.detail * -1;
        }
        console.log(distance)
        if (wheeling != true) {
        return;
        }
        // wheeling이 트루일때 연속휠 막아준다
        if (scrolling) {
        return;
        }
        
        // 마우스 휠 작동 막기
        // scrolling = false;
        scrolling = true;
        if(distance < 0){
            sectionIndex++;
            if(sectionIndex >= sectionTotal){
                sectionIndex = sectionTotal - 1;
            }
            console.log(sectionIndex)
        }else {
            sectionIndex--;
            if(sectionIndex <= 0){
                sectionIndex = 0;
            }
            console.log(sectionIndex)
        }
        gsap.to($('html'), sectionSpeed / 1000, {
            scrollTop : sectionPos[sectionIndex],
            onComplete : function(){
                scrolling = false;
            }
        })
    })
    // const video = $('#vacheron-video')
    // if(sectionIndex = 1){
    //     video.addClass('play');
    //     video.get(0).play();
    // }else{
    //     video.get(0).pause();
    //     video.removeClass('play');
    // }
    // go top 클릭시 섹션 이동
    // const goTopLink = $('.go-top a')

    // $.each(goTopLink, function(index, item){
    //     $(this).click(function(e){
    //         e.preventDefault();
    //         moveSection(index);
    //         sectionColor();
    //     })
    // })

    // go top 클릭시 섹션 이동
    const goTopLink = $('.go-top a')

    $.each(goTopLink, function(index, item){
        $(this).click(function(e){
            e.preventDefault();
            moveSection(index);
            sectionColor();
        })
    })
        
    function moveSection(_index){
        sectionIndex = _index;
        gsap.to($('html'), sectionSpeed / 1000, {
            scrollTo : sectionPos[sectionIndex],
            onComplete : function(){
                scrolling = false;
            }
        })
    }
    // function sectionColor(){
    //     // 포커스 표현
    //     sectionLink.removeClass('section-menu-active')
    //     sectionLink.eq(sectionIndex).addClass('section-menu-active')
    //     // 색상 표현
    //     sectionLink.removeClass('section-menu-blue')
    //     sectionLink.eq(sectionIndex).addClass('section-menu-blue')
    //     sectionLink.eq(sectionIndex + 2).removeClass('section-menu-blue')
    // }
    // 최초 또는 새로고침 시 색상 셋팅
    // sectionColor();


    // header tab-menu
    const gnbTabAnchor = $('.tab-nav1 li'),
          gnbTabPanel = $('.depth2 .submenu'),
          closeBtn1 = $('.header-close-btn');

    gnbTabAnchor.click(function(e){
        e.preventDefault();

        gnbTabAnchor.removeClass('on');
        $(this).addClass('on');
        subTabAnchor1.find('a').removeClass('on');
        subTabAnchor2.find('a').removeClass('on');
        subTabAnchor3.find('a').removeClass('on');

        gnbTabPanel.hide();
        gnbTabPanel.eq($(this).index()).fadeIn();
        subTabPanel1.hide();
        $('.watch').hide();
        subTabPanel2.hide();
        $('.maison').hide();
        subTabPanel3.hide();
        $('.service').hide();
        $('.depth3').hide();
    })
    $('.header').mouseleave(function(){
        gnbTabPanel.fadeOut();
        gnbTabAnchor.removeClass('on');
    });

    const subTabAnchor1 = $('.tab-nav2 li'),
          subTabPanel1 = $('.watch .submenu');
    
    subTabAnchor1.click(function(e){
        e.preventDefault();

        subTabAnchor1.find('a').removeClass('on');
        $(this).find('a').addClass('on');

        $('.depth3').show();
        $('.watch').show();
        subTabPanel1.hide();
        subTabPanel1.eq($(this).index()).fadeIn();
    });

    const subTabAnchor2 = $('.tab-nav3 li'),
          subTabPanel2 = $('.maison .submenu');

    subTabAnchor2.click(function(e){
        e.preventDefault();

        subTabAnchor2.find('a').removeClass('on');
        $(this).find('a').addClass('on');

        $('.depth3').show();
        $('.maison').show();
        subTabPanel2.hide();
        subTabPanel2.eq($(this).index()).fadeIn();
    });

    const subTabAnchor3 = $('.tab-nav4 li'),
          subTabPanel3 = $('.service .submenu');

    subTabAnchor3.click(function(e){
        e.preventDefault();

        subTabAnchor3.find('a').removeClass('on');
        $(this).find('a').addClass('on');

        $('.depth3').show();
        $('.service').show();
        subTabPanel3.hide();
        subTabPanel3.eq($(this).index()).fadeIn();
    });

    $('.header').mouseleave(function(){
        gnbTabPanel.hide();
        subTabPanel1.hide();
        $('.watch').hide();
        subTabPanel2.hide();
        $('.maison').hide();
        subTabPanel3.hide();
        $('.service').hide();
        $('.depth3').hide();
    })

    closeBtn1.click(function(e){
        e.preventDefault();
        gnbTabPanel.hide();
        subTabPanel1.hide();
        $('.watch').hide();
        subTabPanel2.hide();
        $('.maison').hide();
        subTabPanel3.hide();
        $('.service').hide();
        $('.depth3').hide();
    });

        gnbTabPanel.hide();
        subTabPanel1.hide();
        $('.watch').hide();
        subTabPanel2.hide();
        $('.maison').hide();
        subTabPanel3.hide();
        $('.service').hide();
        $('.depth3').hide();


    var swiper = new Swiper(".main-swiper", {
        spaceBetween: 30,
        effect: "fade",
        navigation: {
          nextEl: ".swiper-button-bottom",
          prevEl: ".swiper-button-top",
        },
        autoplay :{
            delay: 8000, // 시간 설정
            disableOnInteraction: false, // false-스와이프 후 자동 재생
        },
        touchRatio: 0,
        loop: true,
        on: {
            slideChangeTransitionStart : function(){
                $('.animate__animated').hide(0)
            },
            slideChangeTransitionEnd : function(){
                $('.animate__animated').show(0)
            }
        }
    });
    $('.swiper-button-bottom').mouseenter(function(){
        $(this).find('img').attr('src', 'images/icons/banner-icon/bottom-arrow-b-001.png')
    })
    $('.swiper-button-bottom').mouseleave(function(){
        $(this).find('img').attr('src', 'images/icons/banner-icon/bottom-arrow-w-001.png')
    })
    $('.swiper-button-top').mouseenter(function(){
        $(this).find('img').attr('src', 'images/icons/banner-icon/top-arrow-b-001.png')
    })
    $('.swiper-button-top').mouseleave(function(){
        $(this).find('img').attr('src', 'images/icons/banner-icon/top-arrow-w-001.png')
    })

    // $('.half-left').mouseenter(function(){
    //     $(this).css('width', '65%')
    // })
    // $('.half-right').mouseenter(function(){
    //     $(this).css('width', '65%')
    // })
    const halfLeft = $('.half-left'),
          halfRight = $('.half-right');

    $('.half-left .half-left-inner').mouseenter(function(){
        halfLeft.addClass('width');
        $('.left-watch').hide();
        $('.right-bottom').stop().slideUp();
        $('.right-button').addClass('move');

        if(halfLeft.hasClass('width') === true ){
            $('.half-left .left-img').fadeIn();
        };
    });


    $('.half-left .half-left-inner').mouseleave(function(){
        halfLeft.removeClass('width');
        $('.left-watch').show();
        $('.right-bottom').stop().slideDown();
        $('.right-button').removeClass('move');

        if(halfLeft.hasClass('width') === false ){
            $('.half-left .left-img').fadeOut();
        };
    });

    

    $('.half-right .half-right-inner').mouseenter(function(){
        halfRight.addClass('width');
        $('.right-watch').hide();
        $('.left-bottom').stop().slideUp();
        $('.left-button').addClass('move');

        if(halfRight.hasClass('width') === true ){
            $('.half-right .right-img').fadeIn();
        };
    });
    $('.half-right .half-right-inner').mouseleave(function(){
        halfRight.removeClass('width');
        $('.right-watch').show();
        $('.left-bottom').stop().slideDown();
        $('.left-button').removeClass('move');

        if(halfRight.hasClass('width') === false ){
            $('.half-right .right-img').fadeOut();
        };
    });


    $('.bs-tab-nav').click(function(){
        $(this).toggleClass('on').siblings().removeClass('on')
    });

    // $('.patrimony').click(function(){
    //     $('.best-seller .inner').addClass('pat');
    //     $('.best-seller .inner').removeClass('ege');
    //     $('.best-seller .inner').removeClass('trad');
    //     $('.best-seller .inner').removeClass('over');
    // });
    // $('.egerie').click(function(){
    //     $('.best-seller .inner').addClass('ege');
    //     $('.best-seller .inner').removeClass('pat');
    //     $('.best-seller .inner').removeClass('trad');
    //     $('.best-seller .inner').removeClass('over');
    // });
    // $('.traditionnelle').click(function(){
    //     $('.best-seller .inner').addClass('trad');
    //     $('.best-seller .inner').removeClass('pat');
    //     $('.best-seller .inner').removeClass('ege');
    //     $('.best-seller .inner').removeClass('over');
    // })
    // $('.overseas').click(function(){
    //     $('.best-seller .inner').addClass('over');
    //     $('.best-seller .inner').removeClass('pat');
    //     $('.best-seller .inner').removeClass('ege');
    //     $('.best-seller .inner').removeClass('trad');
    // })

    var swiper = new Swiper(".patrimony-slide", {
        navigation: {
          nextEl: ".pat-swiper-button-right",
          prevEl: ".pat-swiper-button-left",
        },
        loop: true,
    });
    var swiper = new Swiper(".egerie-slide", {
        navigation: {
          nextEl: ".ege-swiper-button-right",
          prevEl: ".ege-swiper-button-left",
        },
        loop: true,
    });
    var swiper = new Swiper(".traditionnelle-slide", {
        navigation: {
          nextEl: ".trad-swiper-button-right",
          prevEl: ".trad-swiper-button-left",
        },
        loop: true,
    });
    var swiper = new Swiper(".overseas-slide", {
        navigation: {
          nextEl: ".over-swiper-button-right",
          prevEl: ".over-swiper-button-left",
        },
        loop: true,
    });
    var swiper = new Swiper(".sns-swiper", {
        spaceBetween: 30,
        effect: "fade",
        loop: true,
        grabCursor: true,
        autoplay :{
            delay: 2500, // 시간 설정
            disableOnInteraction: false, // false-스와이프 후 자동 재생
        },
     });
    var swiper = new Swiper(".mb-swiper", {
        spaceBetween: 30,
        effect: "fade",
        autoplay: {
            delay: 8500,
            disableOnInteraction: false,
        },
        loop: true,
        on: {
            slideChangeTransitionStart : function(){
                $('.animate__animated').hide(0)
            },
            slideChangeTransitionEnd : function(){
                $('.animate__animated').show(0)
            }
        }
    });


    $('.mb-bt').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('mb-bt-open')
        if($('.mb-bt').hasClass('mb-bt-open') === true ){
            $('.header').addClass('open')
        }else{
            $('.header').removeClass('open')
        }
        $('.header-close-btn').css('display', 'block')
        $('html, body').toggleClass('hidden')
        $('.mb-menu-mask').toggleClass('mb-menu-mask-active')
    })
    $(window).resize(function () {
        let temp = $(window).width();
        // console.log(temp);
        if (temp > 580) {
            $('.mb-bt').removeClass('mb-bt-open')
            $('html, body').removeClass('hidden')
            $('.mb-menu-mask').removeClass('mb-menu-mask-active')
        } else {
            $('.all-menu-wrapper').removeClass('all-menu-wrapper-active')
            $('.all-menu-mask').removeClass('all-menu-mask-active')
        };
    })
});

$(document).ready(function(){
    const BsTabAnchor = $('.bs-tab-navs li'),
    BsTabPanel = $('.bs-tab-panels .bs-tab-panel'),
    DefaultPanel = $('.default-slide');

    $('.bs-tab-panel').hide();
    DefaultPanel.show();

    BsTabAnchor.click(function(e){
        e.preventDefault();

        DefaultPanel.hide();
        BsTabPanel.hide();
        BsTabPanel.eq($(this).index()).fadeIn();
    })
})


// vanilla JavaScript
window.onload = function(){
    const header = $('.header'),
          gnb = $('.gnb'),
          closeBtn = $('.header-close-btn');

    let gnbWidth = gnb.width();
    console.log(gnbWidth);
    gnb.click(function(){
        header.addClass('open')
        closeBtn.css('display', 'block')
    });
    header.mouseleave(function(){
        header.removeClass('open')
        closeBtn.css('display', 'none')
        $('.mainmenu li').removeClass('on')
        $('.mb-bt').removeClass('mb-bt-open')
        $('html, body').removeClass('hidden')
        $('.mb-menu-mask').removeClass('mb-menu-mask-active')
    });
    closeBtn.click(function(){
        header.removeClass('open')
        closeBtn.css('display', 'none')
        $('.mainmenu li').removeClass('on')
        $('.mb-bt').removeClass('mb-bt-open')
        $('html, body').removeClass('hidden')
        $('.mb-menu-mask').removeClass('mb-menu-mask-active')
    });
}