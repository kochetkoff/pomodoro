$(function() {
    "use strict";
    var MS_IN_MIN = 60000;
    var MS_IN_SEC = 1000;

    // Make circle round and position inner in the center of outer
    function positionCircle(){
        var inner = document.getElementById('inner');
        var outer = document.getElementById('outer');
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
    workMinus.onclick = function () {
        if(!isValidInput(workInput.value)) return;
        var newVal = (+workInput.value - 1);
        if (newVal >= MIN_INPUT_VAL) workInput.value = newVal;
    };
    workPlus.onclick = function () {
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
    function renderTime(timeLeftSec) {
        var d = new Date(timeLeftSec*1000);
        var m = d.getMinutes();
        var s = d.getSeconds();
        document.getElementById('timer__min').innerHTML =String(m);
        document.getElementById('timer__sec').innerHTML = s < 10 ? "0" + s : String(s);
    }



    // starts session after setup finished and start clicked
    function startSession() {
        var workPeriod = parseInt(document.getElementById('work__input').value)*MS_IN_MIN;
        var breakPeriod = parseInt(document.getElementById('break__input').value)*MS_IN_MIN;

        // starts work timer
        function startWorkTimer() {
            renderTime(workPeriod/1000);
            var timeLeftSec = workPeriod/1000;
            var workTimer = setInterval(function(){
                if (timeLeftSec > 0) {
                    renderTime(timeLeftSec--)
                } else {
                    clearInterval(workTimer);
                    startBreakTimer();
                }
            }, 1000);
            document.body.setAttribute('data-session', 'work');
        }

        // starts break timer
        function startBreakTimer() {
            renderTime(breakPeriod/1000);
            var timeLeftSec = breakPeriod/1000;
            var breakTimer = setInterval(function(){
                if (timeLeftSec > 0) {
                    renderTime(timeLeftSec--)
                } else {
                    clearInterval(breakTimer);
                    startWorkTimer();
                }
            }, 1000);
            document.body.setAttribute('data-session', 'break');
        }

        // session always starts with work period
        startWorkTimer();
    }

    // stops timer, work or break session and returns to setup
    function stopSession() {
        document.body.setAttribute('data-session', 'setup');
    }
    // starts or stops session on click
    inner.onclick = function () {
        if(whatSession() === "setup"){
            startSession();
        } else {
            stopSession();
        }
    };

});