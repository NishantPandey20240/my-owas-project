
// Import all necessary modules
import { initTabs, initProcessView, initCoderView, initAnalyzerView } from './ui-manager.js';
import { initAiAnalyzer } from './ai-analyzer.js';
import { initReporterView } from './report-generator.js';

// This is the main entry point for the application.
document.addEventListener('DOMContentLoaded', () => {
    // A simple state object to share data between modules
    const appState = {
        selectedPosture: {
            back: null,
            arms: null,
            legs: null,
            load: null
        },
        aiGeneratedResults: null,
        currentVideoFile: null
    };

    // Initialize all modules with individual error handling.
    // This prevents an error in one module from crashing the entire application.
    
    try {
        // Initialize core UI functionalities
        initTabs();
        initProcessView();
        initCoderView(appState);
        initAnalyzerView();
    } catch (error) {
        console.error("Critical Error: Core UI failed to initialize.", error);
        alert("A part of the UI could not load correctly. Please refresh the page.");
    }

    try {
        // Initialize the AI video analysis module
        initAiAnalyzer(appState);
    } catch (error) {
        console.error("Error initializing AI Analyzer. This feature might not work.", error);
    }

    try {
        // Initialize the report generation module
        // This must be called for the report buttons to become clickable.
        initReporterView(appState);
    } catch (error) {
        console.error("Error initializing Report Generator. Report buttons may not be clickable.", error);
    }
});

