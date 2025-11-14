// import { getOwasCodesFromLandmarks } from './owas-logic.js';
// import { displayAiResults, activateTab } from './ui-manager.js';

// export function initAiAnalyzer(appState) {
//     const videoUpload = document.getElementById('video-upload');
//     const analyzeBtn = document.getElementById('analyze-video-btn');
//     const videoElement = document.getElementById('input-video');
//     const canvasElement = document.getElementById('output-canvas');
//     const videoContainer = document.getElementById('video-container');
//     const statusEl = document.getElementById('ai-status');
//     const loadSelect = document.getElementById('ai-load-select');
//     let postureLog = [];

//     videoUpload.addEventListener('change', (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             appState.currentVideoFile = file;
//             const url = URL.createObjectURL(file);
//             videoElement.src = url;
//             videoContainer.classList.remove('hidden');
//             analyzeBtn.disabled = false;
//         }
//     });

//     const pose = new Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}` });
//     pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.7, minTrackingConfidence: 0.7 });

//     const observer = new ResizeObserver(entries => {
//         for (let entry of entries) {
//             const { width, height } = entry.contentRect;
//             canvasElement.width = width;
//             canvasElement.height = height;
//         }
//     });
//     observer.observe(videoContainer);

//     async function processVideo() {
//         postureLog = [];
//         analyzeBtn.disabled = true;
//         videoUpload.disabled = true;
//         statusEl.innerHTML = `<div class="flex items-center justify-center"><div class="loader mr-2"></div><span>Preparing Analysis...</span></div>`;

//         const seekedPromise = () => new Promise(resolve => videoElement.onseeked = resolve);

//         videoElement.pause();
//         videoElement.currentTime = 0;
//         await seekedPromise();

//         const duration = videoElement.duration;
//         const sampleRate = 0.1; // Sample ~10 frames per second

//         for (let time = 0; time < duration; time += sampleRate) {
//             videoElement.currentTime = time;
//             await seekedPromise();

//             // Await the results from the asynchronous pose.send() call
//             const results = await new Promise(resolve => {
//                 pose.onResults(r => resolve(r));
//                 pose.send({ image: videoElement });
//             });

//             if (results && results.poseLandmarks) {
//                 const owasCodes = getOwasCodesFromLandmarks(results.poseLandmarks);
//                 postureLog.push(owasCodes);
//             } else {
//                 postureLog.push(null);
//             }

//             const progress = (time / duration) * 100;
//             statusEl.innerHTML = `<div class="flex items-center justify-center"><div class="loader mr-2"></div><span>Analyzing... ${Math.round(progress)}% Complete</span></div>`;
//         }

//         // --- Finalize and Display Results ---
//         const postureCounts = {};
//         postureLog.forEach(codes => {
//             if (!codes) return;
//             const key = `${codes.back}${codes.arms}${codes.legs}`;
//             postureCounts[key] = (postureCounts[key] || 0) + 1;
//         });

//         appState.aiGeneratedResults = {
//             results: Object.entries(postureCounts).sort((a, b) => b[1] - a[1]),
//             totalFrames: postureLog.length,
//             loadCode: loadSelect.value
//         };
        
//         displayAiResults(appState.aiGeneratedResults, appState.currentVideoFile);
        
//         analyzeBtn.disabled = false;
//         videoUpload.disabled = false;

//         if (appState.currentVideoFile) {
//             document.getElementById('task-name').value = appState.currentVideoFile.name;
//         }
//         activateTab('reporter');
//     }

//     analyzeBtn.addEventListener('click', processVideo);
// }















// import { getOwasCodesFromLandmarks } from './owas-logic.js';
// import { displayAiResults, activateTab } from './ui-manager.js';

// export function initAiAnalyzer(appState) {
//     const videoUpload = document.getElementById('video-upload');
//     const analyzeBtn = document.getElementById('analyze-video-btn');
//     const videoElement = document.getElementById('input-video');
//     const canvasElement = document.getElementById('output-canvas');
//     const videoContainer = document.getElementById('video-container');
//     const statusEl = document.getElementById('ai-status');
//     const loadSelect = document.getElementById('ai-load-select');
    
//     // MODIFIED: postureLog will now store more detailed info for dynamic reporting
//     let postureLog = [];

//     videoUpload.addEventListener('change', (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             appState.currentVideoFile = file;
//             const url = URL.createObjectURL(file);
//             videoElement.src = url;
//             videoContainer.classList.remove('hidden');
//             analyzeBtn.disabled = false;
//         }
//     });

//     const pose = new Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}` });
//     pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.7, minTrackingConfidence: 0.7 });

//     const observer = new ResizeObserver(entries => {
//         for (let entry of entries) {
//             const { width, height } = entry.contentRect;
//             canvasElement.width = width;
//             canvasElement.height = height;
//         }
//     });
//     observer.observe(videoContainer);

//     async function processVideo() {
//         postureLog = []; // Reset log for each analysis
//         analyzeBtn.disabled = true;
//         videoUpload.disabled = true;
//         statusEl.innerHTML = `<div class="flex items-center justify-center"><div class="loader mr-2"></div><span>Preparing Analysis...</span></div>`;

//         // Use a promise-based approach for video seeking
//         const seekedPromise = () => new Promise(resolve => {
//             const onSeeked = () => {
//                 videoElement.removeEventListener('seeked', onSeeked);
//                 resolve();
//             };
//             videoElement.addEventListener('seeked', onSeeked);
//         });

//         videoElement.pause();
//         videoElement.currentTime = 0;
//         await seekedPromise();

//         const duration = videoElement.duration;
//         const sampleRate = 0.2; // Sample ~5 frames per second to speed up analysis

//         const posePromise = (time) => new Promise(resolve => {
//             pose.onResults(results => {
//                 pose.onResults(null); // Detach listener to avoid memory leaks
//                 resolve(results);
//             });
//             pose.send({ image: videoElement });
//         });

//         for (let time = 0; time < duration; time += sampleRate) {
//             videoElement.currentTime = time;
//             await seekedPromise();
            
//             const results = await posePromise(time);

//             if (results && results.poseLandmarks) {
//                 const owasCodes = getOwasCodesFromLandmarks(results.poseLandmarks);
//                 const key = `${owasCodes.back}${owasCodes.arms}${owasCodes.legs}`;
//                 // NEW: Storing the key and the exact timestamp for snapshot feature
//                 postureLog.push({ key, timestamp: time });
//             } else {
//                 postureLog.push(null);
//             }

//             const progress = (time / duration) * 100;
//             statusEl.innerHTML = `<div class="flex items-center justify-center"><div class="loader mr-2"></div><span>Analyzing... ${Math.round(progress)}% Complete</span></div>`;
//         }

//         // --- Finalize and Display Results ---
//         const postureCounts = {};
//         postureLog.forEach(log => {
//             if (!log) return;
//             postureCounts[log.key] = (postureCounts[log.key] || 0) + 1;
//         });

//         // Pass the new, detailed postureLog to the app state
//         appState.aiGeneratedResults = {
//             results: Object.entries(postureCounts).sort((a, b) => b[1] - a[1]),
//             totalFrames: postureLog.filter(p => p !== null).length,
//             loadCode: loadSelect.value,
//             postureLog: postureLog.filter(p => p !== null) // Store the detailed log
//         };
        
//         displayAiResults(appState.aiGeneratedResults, appState.currentVideoFile);
        
//         analyzeBtn.disabled = false;
//         videoUpload.disabled = false;

//         if (appState.currentVideoFile) {
//             document.getElementById('task-name').value = appState.currentVideoFile.name;
//         }
//         activateTab('reporter');
//     }

//     analyzeBtn.addEventListener('click', processVideo);
// }















import { getOwasCodesFromLandmarks } from './owas-logic.js';
import { displayAiResults, activateTab } from './ui-manager.js';

// NEW: A class to smooth the OWAS code detection over several frames to prevent flickering.
class TemporalSmoother {
    constructor(windowSize = 5) {
        this.windowSize = windowSize;
        this.backHistory = [];
        this.armsHistory = [];
        this.legsHistory = [];
    }

    // Adds the latest raw codes to the history.
    add(rawCodes) {
        this.backHistory.push(rawCodes.back);
        this.armsHistory.push(rawCodes.arms);
        this.legsHistory.push(rawCodes.legs);

        // Keep the history at the defined window size.
        if (this.backHistory.length > this.windowSize) this.backHistory.shift();
        if (this.armsHistory.length > this.windowSize) this.armsHistory.shift();
        if (this.legsHistory.length > this.windowSize) this.legsHistory.shift();
    }

    // Calculates the most frequent code in a history array (the "mode").
    _getMode(history) {
        if (history.length === 0) return null;
        const counts = {};
        let maxCount = 0;
        let mode = history[0];

        for (const code of history) {
            counts[code] = (counts[code] || 0) + 1;
            if (counts[code] > maxCount) {
                maxCount = counts[code];
                mode = code;
            }
        }
        return mode;
    }

    // Returns the smoothed OWAS codes based on the history.
    getSmoothedCodes() {
        return {
            back: this._getMode(this.backHistory),
            arms: this._getMode(this.armsHistory),
            legs: this._getMode(this.legsHistory),
        };
    }

    // Clears the history for a new analysis.
    clear() {
        this.backHistory = [];
        this.armsHistory = [];
        this.legsHistory = [];
    }
}


export function initAiAnalyzer(appState) {
    const videoUpload = document.getElementById('video-upload');
    const analyzeBtn = document.getElementById('analyze-video-btn');
    const videoElement = document.getElementById('input-video');
    const canvasElement = document.getElementById('output-canvas');
    const videoContainer = document.getElementById('video-container');
    const statusEl = document.getElementById('ai-status');
    const loadSelect = document.getElementById('ai-load-select');
    
    let postureLog = [];
    // NEW: Create an instance of the smoother. A window of 5 frames is a good start.
    const smoother = new TemporalSmoother(5);

    videoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            appState.currentVideoFile = file;
            const url = URL.createObjectURL(file);
            videoElement.src = url;
            videoContainer.classList.remove('hidden');
            analyzeBtn.disabled = false;
        }
    });

    const pose = new Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}` });
    pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.7, minTrackingConfidence: 0.7 });

    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            canvasElement.width = width;
            canvasElement.height = height;
        }
    });
    observer.observe(videoContainer);

    async function processVideo() {
        postureLog = []; // Reset log for each analysis
        // NEW: Clear the smoother's history for the new analysis.
        smoother.clear();

        analyzeBtn.disabled = true;
        videoUpload.disabled = true;
        statusEl.innerHTML = `<div class="flex items-center justify-center"><div class="loader mr-2"></div><span>Preparing Analysis...</span></div>`;

        const seekedPromise = () => new Promise(resolve => {
            videoElement.addEventListener('seeked', resolve, { once: true });
        });

        videoElement.pause();
        videoElement.currentTime = 0;
        await seekedPromise();

        const duration = videoElement.duration;
        const sampleRate = 0.2; // Sample ~5 frames per second

        for (let time = 0; time < duration; time += sampleRate) {
            videoElement.currentTime = time;
            await seekedPromise();
            
            const results = await new Promise(resolve => {
                pose.onResults(res => resolve(res));
                pose.send({ image: videoElement });
            });

            if (results && results.poseLandmarks) {
                // IMPROVEMENT: Get raw codes, add to smoother, then use the smoothed result.
                const rawOwasCodes = getOwasCodesFromLandmarks(results.poseLandmarks);
                if (rawOwasCodes) {
                    smoother.add(rawOwasCodes);
                    const smoothedOwasCodes = smoother.getSmoothedCodes();
                    const key = `${smoothedOwasCodes.back}${smoothedOwasCodes.arms}${smoothedOwasCodes.legs}`;
                    postureLog.push({ key, timestamp: time });
                } else {
                    postureLog.push(null); // Keep null if detection fails
                }
            } else {
                postureLog.push(null);
            }

            const progress = (time / duration) * 100;
            statusEl.innerHTML = `<div class="flex items-center justify-center"><div class="loader mr-2"></div><span>Analyzing... ${Math.round(progress)}% Complete</span></div>`;
        }
        
        statusEl.innerHTML = `<div class="flex items-center justify-center"><div class="loader mr-2"></div><span>Generating Snapshots...</span></div>`;
        const snapshots = await generateSnapshots(postureLog, videoElement, canvasElement);

        const postureCounts = {};
        postureLog.forEach(log => {
            if (!log) return;
            postureCounts[log.key] = (postureCounts[log.key] || 0) + 1;
        });

        appState.aiGeneratedResults = {
            results: Object.entries(postureCounts).sort((a, b) => b[1] - a[1]),
            totalFrames: postureLog.filter(p => p !== null).length,
            loadCode: loadSelect.value,
            snapshots: snapshots
        };
        
        displayAiResults(appState.aiGeneratedResults, appState.currentVideoFile);
        
        analyzeBtn.disabled = false;
        videoUpload.disabled = false;

        if (appState.currentVideoFile) {
            document.getElementById('task-name').value = appState.currentVideoFile.name;
        }
        activateTab('reporter');
    }

    analyzeBtn.addEventListener('click', processVideo);
}

async function generateSnapshots(postureLog, videoElement, canvasElement) {
    const snapshots = {};
    const uniquePostures = [...new Map(postureLog.filter(p => p).map(p => [p.key, p])).values()];
    
    const seekedPromise = () => new Promise(resolve => {
        videoElement.addEventListener('seeked', resolve, { once: true });
    });

    for (const posture of uniquePostures) {
        videoElement.currentTime = posture.timestamp;
        await seekedPromise();
        
        const ctx = canvasElement.getContext('2d');
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        
        snapshots[posture.key] = canvasElement.toDataURL('image/jpeg', 0.8);
    }
    
    videoElement.currentTime = 0;
    await seekedPromise();
    
    return snapshots;
}