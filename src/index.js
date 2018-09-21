import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import "./index.css";

let frameCount = function _fc(timeStart){

    let now = performance.now();
    let duration = now - timeStart;

    if(duration < 1000){

        _fc.counter++;

    } else {

        _fc.fps = _fc.counter;
        _fc.counter = 0;
        timeStart = now;
        console.log(_fc.fps);

    }
    requestAnimationFrame(() => frameCount(timeStart));
}

frameCount.counter = 0;
frameCount.fps = 0;

frameCount(performance.now())
console.log(frameCount.fps)



ReactDOM.render(

    <div className='wrap'>
        <App />
    </div>

    ,
    document.getElementById('root'));
registerServiceWorker();
