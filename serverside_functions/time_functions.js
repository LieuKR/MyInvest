// 게시판 글 목록 날짜 형식 변환 함수
exports.Make_time = function (){
  let curr = new Date()
  const utc = curr.getTime();
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000; // 표준시간에 더해주는 시간. GMT+0900 : 대한민국 표준시 이므로 9시간을 더해줌
  const kr_curr = new Date(utc + KR_TIME_DIFF).toISOString().replace(/T/, ' ').replace(/\..+/, '');
  return(kr_curr);
};


exports.dateform_dateORtime = function (array) {
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
    if(today.getFullYear() !== year){
      array.time = year + "." + month + "." + day;
    } else if(today.getFullYear() == year && today.getMonth()+1 == month && today.getDate() == day){
        array.time = hour+":"+min;
    } else {
        array.time = month+"-"+day;
    }
  };

// YYYY-MM-DD HH-MM으로 배열 내 time값 변환하는 함수
exports.dateform_time = function (array) {
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