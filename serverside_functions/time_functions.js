// 게시판 글 목록 날짜 형식 변환 함수
exports.dateform_list_time = function (array) {
    let year = array.time.getFullYear();
    let month = array.time.getMonth()+1;
    let day = array.time.getDate();
    let hour = array.time.getHours();
    let min = array.time.getMinutes();
    if(month < 10){
        month = "0"+month;
      }
    if(hour < 10){
        hour = "0"+hour;
      }
    if(day < 10){
      day = "0"+day;
    }
    if(min < 10){
        min = "0"+min;
      }
    let today = new Date();
    if(today.getFullYear() == year && today.getMonth()+1 == month && today.getDate() == day){
        array.time = hour+":"+min;
    } else {
        array.time = month+"-"+day;
    }
  };

// YYYY-MM-DD HH-MM으로 time_update값 변환하는 함수
exports.dateform_time_update = function (array) {
    let year = array.time_update.getFullYear();
    let month = array.time_update.getMonth()+1;
    let day = array.time_update.getDate();
    let hour = array.time_update.getHours();
    let min = array.time_update.getMinutes();
    if(month < 10){
      month = "0"+month;
    }
    if(day < 10){
      day = "0"+day;
    }
    if(hour < 10){
        hour = "0"+hour;
      }
    if(min < 10){
        min = "0"+min;
      }
    array.time_update = year+"-"+month+"-"+day+" "+hour+":"+min;
  };

// YYYY-MM-DD HH-MM으로 댓글 시간 출력형식 변환하는 함수
exports.dateform_time_comment = function (array) {
    let year = array.time.getFullYear();
    let month = array.time.getMonth()+1;
    let day = array.time.getDate();
    let hour = array.time.getHours();
    let min = array.time.getMinutes();
    if(month < 10){
      month = "0"+month;
    }
    if(day < 10){
      day = "0"+day;
    }
    if(hour < 10){
        hour = "0"+hour;
      }
    if(min < 10){
        min = "0"+min;
      }
    array.time = year+"-"+month+"-"+day+" "+hour+":"+min;
  };