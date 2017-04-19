$(function() {
    "use strict";
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
    // Check if input in controls is an integer between 1 and 120
    var MIN_INPUT_VAL = 1;
    var MAX_INPUT_VAL = 120;
    function isValidInput(inpValue){
        return !isNaN(parseInt(inpValue))&&(inpValue >= MIN_INPUT_VAL)&&(inpValue <= MAX_INPUT_VAL)&&(Math.floor(inpValue) === +inpValue);
    }
    // Validate input on input event
    /* old function
    function validateOnInput(event) {
        var el = event.target;
        isValidInput(el.value) ? el.classList.remove('input-error') : el.classList.add('input-error');
    }
    */
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
/*
    // debugging and testing sessions

    setTimeout(function() {
        document.body.setAttribute('data-session', 'work');
    }, 2000);
    setTimeout(function() {
        document.body.setAttribute('data-session', 'break');
    }, 3000);
    setTimeout(function() {
       document.body.setAttribute('data-session', 'setup');
    }, 7000);
*/
    function whatSession() {
        return document.body.getAttribute('data-session');
    }
    function startSession() {
        document.body.setAttribute('data-session', 'work');
    }
    function stopSession() {
        document.body.setAttribute('data-session', 'setup');
    }
    inner.onclick = function (e) {
        if(whatSession() === "setup"){
            startSession();
        } else {
            stopSession();
        }
    };


});