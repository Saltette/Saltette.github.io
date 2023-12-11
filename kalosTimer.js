
const warningBreath = 10;
const warningDive = 5;
const warningFMA = 30;
const warningSystemFail = 30;
const warningUFO = 5;
const warningLasers = 5;
const warningArrows = 5;

const maxSystems = 4;
const minSystems = 0;
const maxPhase = 4;
const minPhase = 1;

const systemCooldown = 60;
const diveCooldown = 20;
const fmaCooldown = 150;
const breath1Cooldown = 60;
const breath2Cooldown = 45;
const breath3Cooldown = 30;
const ufoCooldown = 28;
const lasersCooldown = 15;
const arrowsCooldown = 15;

const groggyDuration = 20;
const testDuration = 50;
const bind10Sec = 10;
const bind15Sec = 15;
const editDisplaySec = 1;
const bindClickLockout = 1;

var phase = minPhase;

var breathCountdown;
var diveCountdown;
var fmaCountdown;
var systemFailCountdown;
var ufoCountdown;
var lasersCountdown;
var arrowsCountdown;
var fmaEditCountdown;
var systemEditCountdown;

var breathSec;
var diveSec;
var fmaSec = fmaCooldown;
var systemFailSec = systemCooldown;
var ufoSec;
var lasersSec;
var arrowsSec;
var fmaEditSec;
var systemEditSec;

var numSystemsOnline = 0;

var phaseCountdown;
var phaseSec = 0;

var bindCountdown;
var bindSec = 0;

var fmaTimerEdit = '';
var systemTimerEdit = '';

var visibleInfo = false;

var fmaTimerOn = false;

var bindClickLockoutSec;
var bindClickLockoutCountdown;



function toggleInfo() {
    if (visibleInfo == false) {
        document.getElementById('infoText').style.display = 'block';
        visibleInfo = true;
    } else {
        document.getElementById('infoText').style.display = 'none';
        visibleInfo = false;
    }
}






function changePhase(num) {
    phase = num;
    if (phase == 1) {
        document.getElementById('phase1Button').style.background='#bbb';
    } else {
        document.getElementById('phase1Button').style.background='white';
    }
    if (phase == 2) {
        document.getElementById('phase2Button').style.background='#bbb';
    } else {
        document.getElementById('phase2Button').style.background='white';
    }
    if (phase == 3) {
        document.getElementById('phase3Button').style.background='#bbb';
    } else {
        document.getElementById('phase3Button').style.background='white';
    }
    if (phase == 4) {
        document.getElementById('phase4Button').style.background='#bbb';
    } else {
        document.getElementById('phase4Button').style.background='white';
    }
    
}

function startPhase() {
    fmaTimerEdit = '';
    systemTimerEdit = '';
    fmaEditSec = 0;
    clearInterval(fmaEditCountdown);
    document.getElementById('fma-edit').style.opacity = '0%';
    systemEditSec = 0;
    clearInterval(systemEditCountdown);
    document.getElementById('system-edit').style.opacity = '0%';
    bindClickLockoutSec = 0;
    clearInterval(bindClickLockoutCountdown);
    fmaTimerOn = true;
    numSystemsOnline = 0;
    phaseSec = 0;
    clearInterval(phaseCountdown);
    bindSec = 0;
    clearInterval(bindCountdown);
    changePhase(1);
    clearInterval(breathCountdown);
    breathSec = 0;
    document.getElementById('breathTimer').innerHTML = breathSec;
    clearInterval(diveCountdown);
    diveSec = 0;
    document.getElementById('diveTimer').innerHTML = diveSec;
    fmaTimer(fmaCooldown);
    systemFailTimer(systemCooldown);
    numSystemsOnline = minSystems;
    document.getElementById('systemsOnline').innerHTML = numSystemsOnline;
    
    

    checkWarningBreath();
    checkWarningDive();
    checkWarningFMA();
    checkWarningNumSystems();
    checkWarningSystemFail();
    kalosIndicator();
    systemIndicator();
}

function incSystems () {
    if (numSystemsOnline != maxSystems) {
        numSystemsOnline += 1;
    }
    document.getElementById('systemsOnline').innerHTML = numSystemsOnline;
    checkWarningNumSystems();
    checkWarningSystemFail();
    systemIndicator();
}

function decSystems () {
    if (numSystemsOnline >= 1) {
        numSystemsOnline -= 1;
    }
    document.getElementById('systemsOnline').innerHTML = numSystemsOnline;
    checkWarningNumSystems();
    checkWarningSystemFail();
    systemIndicator();
}

function checkWarningNumSystems () {
    if (numSystemsOnline == maxSystems) {
        //document.getElementById("systemsOnline").style.color = 'red';
        document.getElementById("systemFailTimer").style.color = 'red';
    } else {
        //document.getElementById("systemsOnline").style.color = 'black';
    }
}

function phaseTest(){
    if (phaseSec <= groggyDuration) {
        // if phased during groggy, fma and system time will be reduced by the timing delay lost from not using all of the last groggy
        // i have no confirmed video of this mechanic and am assuming this is how it works for now
        var lostGroggyTime = phaseSec;
        

        if (bindSec > 0) {
            clearInterval(bindCountdown);
            bindSec = 0;
            kalosIndicator();
        }
        phaseSec = testDuration;

        kalosIndicator();
        clearInterval(phaseCountdown);
        phaseCountdown = setInterval(function(){
            phaseSec--;
            if (phaseSec <= 0) {
                clearInterval(phaseCountdown);
            }
            kalosIndicator();
        }, 1000);
            
        if (fmaTimerOn == true) {
            fmaTimerEdit = '+' + phaseSec;
            document.getElementById('fma-edit').style.borderLeft = '3px solid yellow';
            document.getElementById('fma-edit').style.opacity = '75%';
            fmaEditTimer();

            clearInterval(fmaCountdown);
            fmaSec = fmaSec + testDuration - lostGroggyTime;
            fmaTimer(fmaSec);
            checkWarningFMA();
        }

        if (numSystemsOnline != maxSystems) {
            systemTimerEdit = '+' + phaseSec;
            document.getElementById('system-edit').style.borderLeft = '3px solid yellow';
            document.getElementById('system-edit').style.opacity = '75%';
            systemEditTimer();

            clearInterval(systemFailCountdown);
            systemFailSec = systemFailSec + testDuration - lostGroggyTime;
            systemFailTimer(systemFailSec);
            checkWarningSystemFail();
        }

        if (phase < maxPhase){
            changePhase(phase+1);
        }
    }
}

function failTest() {
    if (phaseSec > groggyDuration-5) {
        if (fmaTimerOn == true) {
            clearInterval(fmaCountdown);

            fmaTimerEdit = '-' + phaseSec;
            document.getElementById('fma-edit').style.borderLeft = '3px solid yellow';
            document.getElementById('fma-edit').style.opacity = '75%';
            fmaEditTimer();
            
            if (fmaSec-phaseSec <= 1) {
                fmaSec = 0;
                document.getElementById('fmaTimer').innerHTML = fmaSec;
            } else {
                fmaTimer(fmaSec-phaseSec-1);
            }
            checkWarningFMA();
        }

        if (numSystemsOnline != maxSystems) {
            
            systemTimerEdit = '-' + phaseSec;
            document.getElementById('system-edit').style.borderLeft = '3px solid yellow';
            document.getElementById('system-edit').style.opacity = '75%';
            systemEditTimer();

            clearInterval(systemFailCountdown);
            if (systemFailSec-phaseSec <= 1) {
                incSystems();
                systemFailTimer(systemCooldown);
            } else {
                systemFailTimer(systemFailSec-phaseSec-1);
            }
            checkWarningSystemFail();
        }

        if (phase > minPhase){
            changePhase(phase-1);
        }
        clearInterval(phaseCountdown);
        phaseSec = 0;
        kalosIndicator();
    }
}

function systemEditTimer() {
    clearInterval(systemEditCountdown);
    document.getElementById('system-edit').innerHTML = systemTimerEdit;
    systemEditSec = editDisplaySec;
    systemEditCountdown = setInterval(function(){
        systemEditSec--;
        if (systemEditSec <= 0) {
            clearInterval(systemEditCountdown);
            document.getElementById('system-edit').style.opacity = '25%';
        }
    }, 1000);
}

function kalosIndicator() {
    if (phaseSec > groggyDuration && bindClickLockoutSec > 0) {
        document.getElementById('phase').style.backgroundImage = " url('images/kalosbind.png'), url('images/kaloshimself.png'), url('images/kalosplatforms.png'), url('images/kalostest.png')";
        document.getElementById('testBox').style.color = 'yellow';
        document.getElementById('bindBox').style.color = '#62d7ff';
    }
    if (phaseSec > groggyDuration && bindClickLockoutSec == 0) {
        document.getElementById('phase').style.backgroundImage = "url('images/kaloshimself.png'), url('images/kalosplatforms.png'), url('images/kalostest.png')";
        document.getElementById('testBox').style.color = 'yellow';
        document.getElementById('bindBox').style.color = 'black';
    }
    if (groggyDuration > phaseSec > 0 && bindClickLockoutSec > 0) {
        document.getElementById('phase').style.backgroundImage = "url('images/kalosbind.png'), url('images/kalosxeyes.png'), url('images/kaloshimself.png'), url('images/kalosplatforms.png')";
        document.getElementById('testBox').style.color = 'yellow';
        document.getElementById('bindBox').style.color = '#62d7ff';
    }
    if (groggyDuration > phaseSec > 0 && bindClickLockoutSec == 0) {
        document.getElementById('phase').style.backgroundImage = "url('images/kalosxeyes.png'), url('images/kaloshimself.png'), url('images/kalosplatforms.png')";
        document.getElementById('testBox').style.color = 'yellow';
        document.getElementById('bindBox').style.color = 'black';
    }
    if (phaseSec == 0 && bindClickLockoutSec > 0) {
        document.getElementById('phase').style.backgroundImage = " url('images/kalosbind.png'), url('images/kaloshimself.png')";
        document.getElementById('testBox').style.color = 'black';
        document.getElementById('bindBox').style.color = '#62d7ff';
    }
    if (phaseSec == 0 && bindClickLockoutSec == 0) {
        document.getElementById('phase').style.backgroundImage = "url('images/kaloshimself.png')";
        document.getElementById('testBox').style.color = 'black';
        document.getElementById('bindBox').style.color = 'black';
    }
}

function bind(sec){
    if (bindClickLockoutSec <= 0) {
        bindClickLockoutTimer();
        extraBindTime = bindSec; //this is in case bind is used during a previous bind duration
        bindSec = sec + extraBindTime;
        kalosIndicator();
        clearInterval(bindCountdown);
        bindCountdown = setInterval(function(){
            bindSec--;
            if (bindSec <= 0) {
                clearInterval(bindCountdown);
            }
            kalosIndicator();
        }, 1000);
        if (fmaTimerOn == true) {
            fmaTimerEdit = '+' + sec;
            document.getElementById('fma-edit').style.borderLeft = '3px solid #62d7ff';
            document.getElementById('fma-edit').style.opacity = '75%';
            fmaEditTimer();

            clearInterval(fmaCountdown);
            fmaSec += sec;
            fmaTimer(fmaSec);
            checkWarningFMA();
        }
    }
}

function fmaEditTimer() {
    clearInterval(fmaEditCountdown);
    document.getElementById('fma-edit').innerHTML = fmaTimerEdit;
    fmaEditSec = editDisplaySec;
    fmaEditCountdown = setInterval(function(){
        fmaEditSec--;
        if (fmaEditSec <= 0) {
            clearInterval(fmaEditCountdown);
            document.getElementById('fma-edit').style.opacity = '25%';
        }
    }, 1000);
}

function bindClickLockoutTimer() {
    clearInterval(bindClickLockoutCountdown);
    bindClickLockoutSec = bindClickLockout;
    bindClickLockoutCountdown = setInterval(function(){
        bindClickLockoutSec--;
        if (bindClickLockoutSec <= 0) {
            clearInterval(bindClickLockoutCountdown);
        }
    }, 1000);
}



function systemIndicator() {
    if (numSystemsOnline >= 1) {
        document.getElementById('system1').style.background = 'red';
    } else {
        document.getElementById('system1').style.background = 'black';
    }
    if (numSystemsOnline >= 2) {
        document.getElementById('system2').style.background = 'red';
    } else {
        document.getElementById('system2').style.background = 'black';
    }
    if (numSystemsOnline >= 3) {
        document.getElementById('system3').style.background = 'red';
    } else {
        document.getElementById('system3').style.background = 'black';
    }
    if (numSystemsOnline >= 4) {
        document.getElementById('system4').style.background = 'red';
    } else {
        document.getElementById('system4').style.background = 'black';
    }
}
















function checkWarningBreath() {
    if (breathSec <= warningBreath) {
        document.getElementById("breathTimer").style.color = 'red';
        document.getElementById("breathBox").style.border = '3px solid red';
    }
    else {
        document.getElementById("breathTimer").style.color = 'black';
        document.getElementById("breathBox").style.border = '3px solid transparent';
    }
}
function breathTimer(){
    if (phase == 1) {
        breathSec = breath1Cooldown;
    }
    if (phase == 2) {
        breathSec = breath2Cooldown;
    }
    if (phase >= 3) {
        breathSec = breath3Cooldown;
    }
    document.getElementById('breathTimer').innerHTML = breathSec;
    checkWarningBreath();
    clearInterval(breathCountdown);
    breathCountdown = setInterval(function(){
        breathSec--;
        document.getElementById('breathTimer').innerHTML = breathSec;
        checkWarningBreath();
        if (breathSec <= 0) {
            clearInterval(breathCountdown);
        }
    }, 1000);
}
function breathCancel() {
    breathSec = breath1Cooldown;
    document.getElementById('breathTimer').innerHTML = "--";
    checkWarningBreath();
    clearInterval(breathCountdown);
}











function checkWarningDive() {
    if (diveSec <= warningDive) {
        document.getElementById("diveTimer").style.color = 'red';
        document.getElementById("diveBox").style.border = '3px solid red';
    } else {
        document.getElementById("diveTimer").style.color = 'black';
        document.getElementById("diveBox").style.border = '3px solid transparent';
    }
}
function diveTimer() {
    diveSec = diveCooldown;
    document.getElementById('diveTimer').innerHTML = diveSec;
    checkWarningDive();
    clearInterval(diveCountdown);
    diveCountdown = setInterval(function(){
        diveSec--;
        document.getElementById('diveTimer').innerHTML = diveSec;
        checkWarningDive();
        if (diveSec <= 0) {
            clearInterval(diveCountdown);
        }
    }, 1000);
    }
    function diveCancel(){
    diveSec = diveCooldown;
    document.getElementById('diveTimer').innerHTML = "--";
    checkWarningDive();
    clearInterval(diveCountdown);
    }
    











function checkWarningFMA() {
    if (fmaSec <= warningFMA) {
        document.getElementById("fmaTimer").style.color = 'red';
        document.getElementById("fmaBox").style.border = '3px solid red';
        document.getElementById("fmaBox").style.background = '#F9C3C3';
    }
    else {
        document.getElementById("fmaTimer").style.color = 'black';
        document.getElementById("fmaBox").style.border = '3px solid transparent';
        document.getElementById("fmaBox").style.background = '#ccc';
    }
}
function fmaTimer(sec) {
    fmaTimerOn = true;
    fmaSec = sec;
    document.getElementById('fmaTimer').innerHTML = fmaSec;
    checkWarningFMA();
    clearInterval(fmaCountdown);
    fmaCountdown = setInterval(function(){
        fmaSec--;
        document.getElementById('fmaTimer').innerHTML = fmaSec;
        checkWarningFMA();
        if (fmaSec <= 0) {
            clearInterval(fmaCountdown);
        }
    }, 1000);
}
function fmaCancel() {
    fmaTimerOn = false;
    fmaSec = fmaCooldown;
    document.getElementById('fmaTimer').innerHTML = "--";
    checkWarningFMA();
    clearInterval(fmaCountdown);
}
function fmaAttack() {
    if (numSystemsOnline == maxSystems-1) {
        systemFailTimer(systemCooldown);
    }
    fmaTimer(fmaCooldown);
    incSystems();
}






function checkWarningSystemFail() {
    
    if (numSystemsOnline == maxSystems) {
    document.getElementById("systemFailTimer").style.color = 'red';
        if (systemFailSec <= warningSystemFail) {
            document.getElementById("systemFailBox").style.border = '3px solid red';
            document.getElementById("systemFailBox").style.background = '#F9C3C3';
        }
        else {
            document.getElementById("systemFailBox").style.border = '3px solid transparent';
            document.getElementById("systemFailBox").style.background = '#ccc';
        }
    } else {
        document.getElementById("systemFailTimer").style.color = 'black';
        document.getElementById("systemFailBox").style.border = '3px solid transparent';
        document.getElementById("systemFailBox").style.background = '#ccc';
    }
}

function systemFailTimer(sec){
    systemFailSec = sec;
    checkWarningSystemFail();
    document.getElementById('systemFailTimer').innerHTML = systemFailSec;
    
    clearInterval(systemFailCountdown);
    systemFailCountdown = setInterval(function(){
        systemFailSec--;
        document.getElementById('systemFailTimer').innerHTML = systemFailSec;
        checkWarningSystemFail();
        if (systemFailSec <= 0) {
            incSystems();
            clearInterval(systemFailCountdown);
            systemFailTimer(systemCooldown);
        }
    }, 1000);
}
function systemFailCancel(){
    systemFailSec = systemCooldown;
    document.getElementById('systemFailTimer').innerHTML = "--";
    checkWarningSystemFail();
    clearInterval(systemFailCountdown);
}
function systemCleanse() {
    if (numSystemsOnline == maxSystems) {

        systemFailTimer(systemCooldown + phaseSec);
    }
    decSystems();
    checkWarningSystemFail();
    document.getElementById('systemsOnline').innerHTML = numSystemsOnline;
}






function checkWarningLasers() {
    if (lasersSec <= warningLasers) {
        document.getElementById("lasersTimer").style.color = 'red';
        //document.getElementById("lasersBox").style.border = '3px solid red';
    }
    else {
        document.getElementById("lasersTimer").style.color = 'black';
        //document.getElementById("lasersBox").style.border = '3px solid transparent';
    }
}
function lasersTimer(){
    lasersSec = lasersCooldown;
    document.getElementById('lasersTimer').innerHTML = lasersSec;
    checkWarningLasers();
    clearInterval(lasersCountdown);
    lasersCountdown = setInterval(function(){
        lasersSec--;
        document.getElementById('lasersTimer').innerHTML = lasersSec;
        checkWarningLasers();
        if (lasersSec <= 0) {
            lasersSec = lasersCooldown;
        }
    }, 1000);
}
function lasersCancel(){
    lasersSec = lasersCooldown;
    document.getElementById('lasersTimer').innerHTML = "--";
    checkWarningLasers();
    clearInterval(lasersCountdown);
}

function checkWarningArrows() {
    if (arrowsSec <= warningArrows) {
        document.getElementById("arrowsTimer").style.color = 'red';
        //document.getElementById("arrowsBox").style.border = '3px solid red';
    }
    else {
        document.getElementById("arrowsTimer").style.color = 'black';
        //document.getElementById("arrowsBox").style.border = '3px solid transparent';
    }
}
function arrowsTimer(){
    arrowsSec = arrowsCooldown;         
    document.getElementById('arrowsTimer').innerHTML = arrowsSec;
    checkWarningArrows();
    clearInterval(arrowsCountdown);
    arrowsCountdown = setInterval(function(){
        arrowsSec--;
        document.getElementById('arrowsTimer').innerHTML = arrowsSec;
        checkWarningArrows();
        if (arrowsSec <= 0) {
            arrowsSec = arrowsCooldown;
        }
    }, 1000);
}
function arrowsCancel(){
    arrowsSec = arrowsCooldown;
    document.getElementById('arrowsTimer').innerHTML = "--";
    checkWarningArrows();
    clearInterval(arrowsCountdown);
}