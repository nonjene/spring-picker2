const reqAF = require('./reqAF');

const easeInOut =  function (t, b, c, d) { return c*((t=t/d-1)*t*t + 1) + b; }


const translate = function(from, to, time = 500, frameCallback, done) {
    let num = from;
    //var speed = Math.abs( to - from)/time * (1000/60);
    //console.log(speed)
    // t: 当前时间； b: 初始值；c: 变化量； d: 持续时间
    const frame = 1000 / 60;
    const b = from,
        c = to - from,
        d = time;
    let t = 0;

    let chkDone;
    if(Math.abs(from) > Math.abs(to)){
        chkDone = ()=> Math.abs(num) > Math.abs(to);
    }else{
        chkDone = () => Math.abs(num) < Math.abs(to);
    }

    const run = () => {
        num = easeInOut(t, b, c, d);
        t += frame;
        reqAF(() => {
          if(frameCallback(num) === false) return;

          if (chkDone()) {
            return run();
          } else {
              done && done();
          }
            
        });
    };
    run();
};

module.exports = {
  translate,
};