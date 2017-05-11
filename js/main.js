$(function() {
    "use strict";
    var SEC_IN_MIN = 60;
    var inner = document.getElementById('inner');
    var outer = document.getElementById('outer');
    var audioSwitch = document.getElementById('audio__switch');

    // Make circle round and position inner in the center of outer
    function positionCircle(){
        var pointer = document.getElementsByTagName('img')[0];
        //Make inner and outer width equal to height
        inner.style.height = inner.offsetWidth + "px";
        outer.style.height = outer.offsetWidth + "px";
        //position inner in the center of outer
        pointer.style.height = inner.style.top = (outer.offsetWidth - inner.offsetWidth)/2 + "px";
    }
    positionCircle();

    // Reposition elements on window resize
    window.onresize = function() {
        positionCircle();
    };

    // Check if input in controls is an integer between 1 and 60
    var MIN_INPUT_VAL = 1;
    var MAX_INPUT_VAL = 60;
    function isValidInput(inpValue){
        return !isNaN(parseInt(inpValue))&&(inpValue >= MIN_INPUT_VAL)&&(inpValue <= MAX_INPUT_VAL)&&(Math.floor(inpValue) === +inpValue);
    }

    // Validate input on input event
    function validateOnInput() {
        isValidInput(this.value) ? this.classList.remove('input-error') : this.classList.add('input-error');
    }

    // Validate input on blur event
    function validateOnBlur() {
        var alertWarning = document.querySelector('.alert-warning');
        if(this.classList.contains('input-error')){
            alertWarning.style.display = "block";
            this.focus();
            return;
        }
        alertWarning.style.display = "none";
    }
    var workInput = document.getElementById('work__input');
    var breakInput = document.getElementById('break__input');
    workInput.oninput = breakInput.oninput = validateOnInput;
    workInput.onblur = breakInput.onblur = validateOnBlur;

    // Increment and decrement session and break time
    var workMinus = document.querySelector('#settings__work .decrement');
    var workPlus = document.querySelector('#settings__work .increment');
    var breakMinus = document.querySelector('#settings__break .decrement');
    var breakPlus = document.querySelector('#settings__break .increment');

    // Increment and decrement inputs on click
    workMinus.onclick = function() {
        if(!isValidInput(workInput.value)) return;
        var newVal = (+workInput.value - 1);
        if (newVal >= MIN_INPUT_VAL) workInput.value = newVal;
    };
    workPlus.onclick = function() {
        if(!isValidInput(workInput.value)) return;
        var newVal = (+workInput.value + 1);
        if (newVal <= MAX_INPUT_VAL) workInput.value = newVal;
    };
    breakMinus.onclick = function () {
        if(!isValidInput(breakInput.value)) return;
        var newVal = (+breakInput.value - 1);
        if (newVal >= MIN_INPUT_VAL) breakInput.value = newVal;
    };
    breakPlus.onclick = function () {
        if(!isValidInput(breakInput.value)) return;
        var newVal = (+breakInput.value + 1);
        if (newVal <= MAX_INPUT_VAL) breakInput.value = newVal;
    };

    // returns session name
    function whatSession() {
        return document.body.getAttribute('data-session');
    }

    // renders time in circle
    function renderTime(timeLeft){
        var s = timeLeft%60;
        var m = (timeLeft - s)/60;
        document.getElementById('timer__min').innerHTML = m < 10 ? "0" + m : String(m);
        document.getElementById('timer__sec').innerHTML = s < 10 ? "0" + s : String(s);
    }

    // rotates el anticlockwise on deg degrees
    function rotate(el, deg){
        deg = deg || 0;
        el.style.transform = "rotate(-" + deg + "deg)";
    }

    // Audio variables and functions
    var alarm = document.getElementById('audio__alarm');
    var tick =  document.getElementById('audio__tick');
    function startTick() {
        try {
            tick.play();
        }
        catch (e) {
            console.log("Error:" + e);
        }
    }
    function stopTick() {
        try {
            tick.pause();
            tick.currentTime = 0;
        }
        catch (e) {
            console.log("Error:" + e);
        }
    }
    function startAlarm() {
        try {
            alarm.play();
        }
        catch (e) {
            console.log("Error:" + e);
        }
    }
    function stopAlarm() {
        try {
            alarm.pause();
            alarm.currentTime = 0;
        }
        catch (e) {
            console.log("Error:" + e);
        }
     }
    function isAudioOn() {
        return audioSwitch.getAttribute('data-audio') === "on";
    }
    // starts session after setup finished and start clicked
    function startSession() {
        var workPeriod = parseInt(document.getElementById('work__input').value)*SEC_IN_MIN;
        var breakPeriod = parseInt(document.getElementById('break__input').value)*SEC_IN_MIN;
        // starts work timer
        function startWorkTimer() {
            renderTime(workPeriod);
            var timeLeft = workPeriod;
            var deg = 0;
            var inc = 360/workPeriod;
            startSession.timer = setInterval(function(){
                if (timeLeft > 0) {
                    renderTime(timeLeft--);
                    rotate(outer, deg);
                    deg += inc;
                } else {
                    clearInterval(startSession.timer);
                    rotate(outer, 0);
                    stopTick();
                    if(isAudioOn()) startAlarm();
                    startBreakTimer();
                }
            }, 1000);
            document.body.setAttribute('data-session', 'work');
            if(isAudioOn()) startTick();
        }
        // starts break timer
        function startBreakTimer() {
            renderTime(breakPeriod);
            var timeLeft = breakPeriod;
            var deg = 0;
            var inc = 360/breakPeriod;
            startSession.timer = setInterval(function(){
                if (timeLeft > 0) {
                    renderTime(timeLeft--);
                    rotate(outer, deg);
                    deg += inc;
                } else {
                    clearInterval(startSession.timer);
                    rotate(outer, 0);
                    stopTick();
                    if(isAudioOn()) startAlarm();
                    startWorkTimer();
                }
            }, 1000);
            document.body.setAttribute('data-session', 'break');
            if(isAudioOn()) startTick();
        }
        // session always starts with work period
        startWorkTimer();
    }

    // stops timer, work or break session and returns to setup
    function stopSession() {
        stopAlarm();
        stopTick();
        rotate(outer, 0);
        document.body.setAttribute('data-session', 'setup');
        if(startSession.timer) clearInterval(startSession.timer);
    }

    // starts or stops session on click
    inner.onclick = function() {
        // Prevent clicking if inputs are invalid
        var workInputVal = document.querySelector('#work__input').value;
        var breakInputVal = document.querySelector('#break__input').value;
        if (!(isValidInput(workInputVal) && isValidInput(breakInputVal))) return false;

        if(whatSession() === "setup"){
            startSession();
        } else {
            stopSession();
        }
    };

    audioSwitch.onclick = function() {
        if (isAudioOn()) {
            this.setAttribute('data-audio', "off");
            stopTick();
            stopAlarm();
        } else {
            this.setAttribute('data-audio', "on");
            if(!(whatSession() === "setup")) startTick();
        }
    };
});