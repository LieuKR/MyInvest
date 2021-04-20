// 특수문자 정규식 변수(공백 미포함, 숫자 제외)
var replaceChar_can_num = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;

// 특수문자 정규식 변수(공백 포함)
var replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>0-9\/.\`:\"\\,\[\]?|{}\s]/gi;

// 완성형 아닌 한글 정규식
var replaceNotFullKorean = /[ㄱ-ㅎㅏ-ㅣ]/gi;

// 숫자가 아닌 정규식
var replaceNotInt = /[^0-9]/gi;

$(document).ready(function(){
    $(".name_input").on("focusout", function() {
        var x = $(this).val();
        if (x.length > 0) {
            if (x.match(replaceChar_can_num) || x.match(replaceNotFullKorean)) {
                x = x.replace(replaceChar_can_num, "").replace(replaceNotFullKorean, "");
            }
            $(this).val(x);
        }
        }).on("keyup", function() {
            $(this).val($(this).val().replace(replaceChar_can_num, ""));
    });
});       

$(document).ready(function(){
    $(".unit_input").on("focusout", function() {
        var x = $(this).val();
        if (x.length > 0) {
            if (x.match(replaceChar) || x.match(replaceNotFullKorean)) {
                x = x.replace(replaceChar, "").replace(replaceNotFullKorean, "");
            }
            $(this).val(x);
        }
        }).on("keyup", function() {
            $(this).val($(this).val().replace(replaceChar, ""));
    });
});       

$(document).ready(function(){
    $(".price_input").on("focusout", function() {
        var x = $(this).val();
        if (x.length > 0) {
            if (x.match(replaceNotInt)) {
                x = x.replace(replaceNotInt, "");
            }
            $(this).val(x);
        }
    }).on("keyup", function() {
        $(this).val($(this).val().replace(replaceNotInt, ""));
    });
});

$(document).ready(function(){
    $(".count_input").on("focusout", function() {
        var x = $(this).val();
        if (x.length > 0) {
            if (x.match(replaceNotInt)) {
            x = x.replace(replaceNotInt, "");
            }
            $(this).val(x);
        }
    }).on("keyup", function() {
        $(this).val($(this).val().replace(replaceNotInt, ""));
    });
});
