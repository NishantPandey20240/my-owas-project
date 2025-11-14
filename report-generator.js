// // Import all necessary modules
// import { riskCategories, riskLookupTable } from './owas-data.js';

// /**
//  * Initializes the report generation view, including event listeners for the PDF buttons.
//  * It now includes robust checks to see if the required PDF libraries have loaded and if the buttons exist in the HTML.
//  * @param {object} appState - The global state of the application.
//  */
// export function initReporterView(appState) {
//     const aiReportBtn = document.getElementById('generate-ai-report');
//     const manualReportBtn = document.getElementById('generate-manual-report');
    
//     // Robustness Check 1: Ensure buttons exist in the DOM.
//     if (!aiReportBtn || !manualReportBtn) {
//         console.error("Report generator buttons not found in the HTML. Make sure your index.html is up to date with 'generate-ai-report' and 'generate-manual-report' IDs.");
//         return; // Exit if buttons don't exist to prevent further errors.
//     }

//     const reportButtonsContainer = aiReportBtn.parentElement.parentElement.parentElement; // A more stable way to get the main container

//     // Robustness Check 2: Check if PDF libraries have loaded from the internet.
//    const pdfLibrariesLoaded = typeof window.jspdf !== 'undefined' && typeof window.jspdf.jsPDF !== 'undefined' && typeof window.jspdf.jsPDF.API.autoTable !== 'undefined';

//     if (!pdfLibrariesLoaded) {
//         // If libraries are not loaded, disable buttons and show a user-friendly error message.
//         console.error("Critical Error: jsPDF or jspdf-autotable library failed to load.");
//         aiReportBtn.disabled = true;
//         manualReportBtn.disabled = true;

//         // Add a visual indicator to the user on the page itself.
//         const errorMessage = document.createElement('p');
//         errorMessage.className = 'text-center text-red-600 font-semibold bg-red-100 p-3 rounded-lg mt-4';
//         errorMessage.textContent = 'PDF generation is unavailable. Could not load required libraries. Please check your internet connection/ad-blocker and refresh.';
//         reportButtonsContainer.appendChild(errorMessage);
//         return; // Stop the initialization process for this module.
//     }

//     // If everything is fine, attach the click event listeners.
//     aiReportBtn.addEventListener('click', () => generatePdf(appState, true));
//     manualReportBtn.addEventListener('click', () => generatePdf(appState, false));
// }

// /**
//  * The main function to generate the PDF report based on the selected data source.
//  * @param {object} appState - The global state of the application.
//  * @param {boolean} includeAiReport - True to generate the AI report, False for the manual report.
//  */
// function generatePdf(appState, includeAiReport) {
//     try {
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
//         let y = 20; // Initial y position

//         const taskName = document.getElementById('task-name').value || 'N/A';
//         const analystName = document.getElementById('analyst-name').value || 'N/A';
//         const notes = document.getElementById('report-notes').value || 'None';

//         // --- Header ---
//         doc.setFontSize(22).setFont(undefined, 'bold');
//         doc.text("OWAS Ergonomic Risk Report", 105, y, { align: 'center' });
//         y += 15;

//         // --- Task Details Section ---
//         doc.setFontSize(14).setFont(undefined, 'bold');
//         doc.text("Task Details", 14, y);
//         y += 7;
//         doc.setFontSize(11).setFont(undefined, 'normal');
//         doc.text(`Task Name: ${taskName}`, 14, y);
//         y += 7;
//         doc.text(`Analyst: ${analystName}`, 14, y);
//         y += 7;
//         doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, y);
//         y += 15;

//         if (includeAiReport) {
//             generateAiReportSection(doc, appState, y);
//         } else {
//             generateManualReportSection(doc, y);
//         }
//         // Get the y-position after the table has been drawn
//         y = doc.autoTable.previous ? doc.autoTable.previous.finalY : y;


//         // --- General Notes Section ---
//         if (y > 250) { // Check if new page is needed for notes
//             doc.addPage();
//             y = 20;
//         } else {
//             y += 10;
//         }

//         doc.setFontSize(14).setFont(undefined, 'bold');
//         doc.text("General Notes & Observations", 14, y);
//         y += 7;
//         doc.setFontSize(11).setFont(undefined, 'normal');
//         const splitNotes = doc.splitTextToSize(notes, 180);
//         doc.text(splitNotes, 14, y);
     

//         // ---> यहाँ से नया कोड जोड़ें <---

//         const pageHeight = doc.internal.pageSize.getHeight();
//         doc.setFontSize(9);
//         doc.setTextColor(150); // Sets the text color to a light grey
//         doc.setFont(undefined, 'normal');

//         doc.text('MTP PROJECT: OWAS Method Software', 105, pageHeight - 15, { align: 'center' });
//         doc.text('DEVELOPED BY NISHANT PANDEY UNDER THE GUIDANCE OF Dr. Priyabarat Pradhan', 105, pageHeight - 10, { align: 'center' });
        
//         // ---> यहाँ तक जोड़ें <---


//         // --- Save the PDF ---
//         doc.save(`OWAS_Report_${taskName.replace(/\s+/g, '_') || 'Untitled'}.pdf`);
// // ... (rest of the code)

        

//         // --- Save the PDF ---
//         doc.save(`OWAS_Report_${taskName.replace(/\s+/g, '_') || 'Untitled'}.pdf`);

//     } catch (error) {
//         console.error("Failed to generate PDF:", error);
//         alert("An error occurred while generating the PDF. Please check the browser console for more details.");
//     }
// }

// /**
//  * Generates the AI Video Analysis table in the PDF.
//  * @param {jsPDF} doc - The jsPDF document instance.
//  * @param {object} appState - The global application state.
//  * @param {number} y - The starting y-position for this section.
//  */
// function generateAiReportSection(doc, appState, y) {
//     doc.setFontSize(14).setFont(undefined, 'bold');
//     doc.text("AI Video Analysis Report", 14, y);

//     if (appState.aiGeneratedResults && appState.aiGeneratedResults.results.length > 0) {
//         const head = [['Posture Code (B,A,L,F)', 'Frequency (%)', 'Risk Category', 'Recommendation']];
//         const body = appState.aiGeneratedResults.results.map(([key, count]) => {
//             const fullCode = `${key}${appState.aiGeneratedResults.loadCode}`;
//             const riskCategory = riskLookupTable[fullCode] || 0;
//             const percentage = ((count / appState.aiGeneratedResults.totalFrames) * 100).toFixed(1);
//             const riskInfo = riskCategories[riskCategory] || { text: 'N/A', description: '' };
//             return [
//                 `${key.split('').join(',')},${appState.aiGeneratedResults.loadCode}`,
//                 `${percentage}%`,
//                 `${riskInfo.text} (Cat. ${riskCategory})`,
//                 riskInfo.description
//             ];
//         });

//         doc.autoTable({
//             head: head,
//             body: body,
//             startY: y + 2,
//             theme: 'grid',
//             headStyles: { fillColor: [22, 160, 133] },
//         });
//     } else {
//         doc.setFontSize(11).setFont(undefined, 'normal');
//         doc.text('No AI analysis results were found for this report.', 14, y + 7);
//     }
// }

// /**
//  * Generates the Manual Frequency Analysis table in the PDF.
//  * @param {jsPDF} doc - The jsPDF document instance.
//  * @param {number} y - The starting y-position for this section.
//  */
// function generateManualReportSection(doc, y) {
//     doc.setFontSize(14).setFont(undefined, 'bold');
//     doc.text("Manual Frequency Analysis Report", 14, y);

//     const manualAnalyzerItems = document.querySelectorAll('.analyzer-item');
//     if (manualAnalyzerItems.length > 0) {
//         const head = [['Posture', 'Frequency (%)', 'Calculated Risk Level']];
//         const body = [];
//         manualAnalyzerItems.forEach(item => {
//             const postureText = item.querySelector('label').textContent;
//             const frequency = item.querySelector('.value-label').textContent;
//             const risk = item.querySelector('.risk-label').textContent;
//             body.push([postureText, frequency, risk]);
//         });

//         doc.autoTable({
//             head: head,
//             body: body,
//             startY: y + 2,
//             theme: 'grid',
//             headStyles: { fillColor: [41, 128, 185] },
//         });
//     } else {
//         doc.setFontSize(11).setFont(undefined, 'normal');
//         doc.text('No postures were added to the Manual Frequency Analyzer.', 14, y + 7);
//     }
// }



























// import { riskCategories, riskLookupTable, postureOptions } from './owas-data.js';

// // --- INITIALIZATION ---
// export function initReporterView(appState) {
//     const aiReportBtn = document.getElementById('generate-ai-report');
//     const manualReportBtn = document.getElementById('generate-manual-report');
    
//     if (!aiReportBtn || !manualReportBtn) {
//         console.error("Report generator buttons not found in the HTML.");
//         return;
//     }

//     if (typeof window.jspdf === 'undefined' || typeof window.Chart === 'undefined' || typeof window.jspdf.jsPDF.API.autoTable === 'undefined') {
//         handleLibraryLoadError(aiReportBtn, manualReportBtn);
//         return;
//     }

//     aiReportBtn.addEventListener('click', () => generatePdf(appState, true));
//     manualReportBtn.addEventListener('click', () => generatePdf(appState, false));
// }

// function handleLibraryLoadError(aiBtn, manualBtn) {
//     console.error("Critical Error: jsPDF, jspdf-autotable, or Chart.js library failed to load.");
//     aiBtn.disabled = true;
//     manualBtn.disabled = true;
//     const container = aiBtn.parentElement.parentElement.parentElement;
//     const errorMsg = document.createElement('p');
//     errorMsg.className = 'text-center text-red-600 font-semibold bg-red-100 p-3 rounded-lg mt-4';
//     errorMsg.textContent = 'PDF/Chart generation is unavailable. Please check internet connection/ad-blocker and refresh.';
//     container.appendChild(errorMsg);
// }


// // --- PDF GENERATION ---
// async function generatePdf(appState, isAiReport) {
//     try {
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
//         let y = 15;

//         const reportData = await processReportData(appState, isAiReport);
//         if (!reportData) {
//             alert("Could not generate report. No data available from analysis.");
//             return;
//         }

//         // --- Header & Task Details ---
//         doc.setFontSize(20).setFont(undefined, 'bold');
//         doc.text("OWAS Ergonomic Risk Report", 105, y, { align: 'center' });
//         y += 15;
//         y = addSectionTitle(doc, "1. Task Details", y);
//         doc.setFontSize(11).setFont(undefined, 'normal');
//         doc.text(`Task Name: ${reportData.taskName}`, 14, y); y += 7;
//         doc.text(`Analyst: ${reportData.analystName}`, 14, y); y += 7;
//         doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 14, y); y += 10;
        
//         // --- Sections ---
//         const sections = [
//             { title: "2. Executive Summary", content: reportData.executiveSummary },
//             { title: "3. Methodology", isMethodology: true },
//             { title: "4. Posture Frequency & Risk Category", isTable: 'posture' },
//             { title: "5. Risk Summary", isTable: 'risk' },
//             { title: "6. Graphical Representation", isChart: true },
//             { title: "7. High-Risk Posture Example", isSnapshot: true },
//             { title: "8. Observations", content: reportData.observations },
//             { title: "9. Recommendations", content: reportData.recommendations },
//             { title: "10. Conclusion", content: reportData.conclusion }
//         ];

//         for (const section of sections) {
//             y = addSectionTitle(doc, section.title, y);
            
//             if (section.content) {
//                 const splitContent = doc.splitTextToSize(section.content || 'N/A', 180);
//                 doc.setFontSize(10).setFont(undefined, 'normal');
//                 doc.text(splitContent, 14, y);
//                 y += splitContent.length * 5 + 5;
//             }
//             else if (section.isMethodology) {
//                 doc.setFontSize(11).setFont(undefined, 'normal');
//                 doc.text(`- Observation Technique: OWAS (Ovako Working Posture Analysis System)`, 14, y); y += 6;
//                 doc.text(`- Data Source: ${isAiReport ? 'AI-based video analysis' : 'Manual observation'}`, 14, y); y += 8;
//                 doc.setFontSize(10).setFont(undefined, 'bold');
//                 doc.text('Understanding the OWAS Code (B-A-L-F):', 14, y); y += 5;
//                 doc.setFontSize(9).setFont(undefined, 'normal');
//                 doc.text(`The 4-digit code represents: B (Back), A (Arms), L (Legs), and F (Force/Load).`, 14, y); y += 10;
//             }
//             else if (section.isTable === 'posture') {
//                 doc.autoTable({
//                     head: [['Code (B-A-L-F)', 'Description', 'Frequency (%)', 'Risk', 'Action']],
//                     body: reportData.tableBody, startY: y, theme: 'grid'
//                 });
//                 y = doc.autoTable.previous.finalY;
//                 doc.setFontSize(8).setFont(undefined, 'italic');
//                 doc.text('Note: AC1=No Action, AC2=Action Soon, AC3=Action ASAP, AC4=Action Immediately.', 14, y + 4);
//                 y += 10;
//             }
//             else if (section.isTable === 'risk') {
//                  doc.autoTable({
//                     head: [['Risk Category', '% Time', 'Action Required']],
//                     body: reportData.riskSummary, startY: y, theme: 'grid'
//                 });
//                 y = doc.autoTable.previous.finalY + 10;
//             }
//             else if (section.isChart) {
//                 y = await addChartsToPdf(doc, y, reportData.chartData);
//             }
//             else if (section.isSnapshot) {
//                 if (reportData.snapshotImage) {
//                     doc.setFontSize(10).setFont(undefined, 'normal');
//                     doc.text(`Snapshot of the highest-risk posture (Code ${reportData.highestRiskPosture.fullCode}):`, 14, y); y += 8;
//                     doc.addImage(reportData.snapshotImage, 'PNG', 14, y, 90, 60); y += 65;
//                     doc.setFontSize(9).setFont(undefined, 'italic');
//                     const desc = `This posture involves: ${reportData.highestRiskPosture.description}.`;
//                     doc.text(doc.splitTextToSize(desc, 180), 14, y); y += 15;
//                 } else {
//                     doc.setFontSize(10).setFont(undefined, 'italic');
//                     doc.text("No high-risk (Category 3 or 4) postures were detected.", 14, y); y += 10;
//                 }
//             }
//         }
        
//         addFooter(doc);
//         doc.save(`OWAS_Report_${reportData.taskName.replace(/[\s.]+/g, '_')}.pdf`);

//     } catch (error) {
//         console.error("Failed to generate PDF:", error);
//         alert("An error occurred while generating the PDF. Please check the console for details.");
//     }
// }

// // --- DATA PROCESSING & HELPERS ---
// const SEVERITY_SCORES = {
//     back: { '1': 1, '2': 3, '3': 2, '4': 4 }, // Straight, Bent, Twisted, Bent&Twisted
//     arms: { '1': 1, '2': 2, '3': 3 }, // Both below, One at/above, Both at/above
//     legs: { '1': 1, '2': 2, '3': 2, '4': 3, '5': 3, '6': 4, '7': 5 } // Sitting, 2-straight, 1-straight, 2-bent, 1-bent, Kneeling, Walking
// };

// async function processReportData(appState, isAiReport) {
//     const taskNameInput = document.getElementById('task-name').value;
//     const analystName = document.getElementById('analyst-name').value || (isAiReport ? 'AI / Software' : 'Manual Analyst');
//     const taskName = isAiReport ? (appState.currentVideoFile?.name || 'AI Analysis') : (taskNameInput || 'Manual Analysis');
//     const sourceData = appState.aiGeneratedResults;

//     if (!sourceData || !sourceData.results || sourceData.results.length === 0 || !sourceData.postureLog) {
//         console.error("Incomplete analysis data for report generator.");
//         return null; 
//     }

//     const { results, totalFrames, loadCode, postureLog } = sourceData;
//     const riskDist = { 1: 0, 2: 0, 3: 0, 4: 0 };
//     let highestRiskPosture = { risk: 0, key: '', description: '', fullCode: '', timestamp: null };
    
//     const bodyPartRisk = { back: 0, arms: 0, legs: 0 };
//     postureLog.forEach(log => {
//         const [back, arms, legs] = log.key.split('');
//         bodyPartRisk.back += (SEVERITY_SCORES.back[back] || 0);
//         bodyPartRisk.arms += (SEVERITY_SCORES.arms[arms] || 0);
//         bodyPartRisk.legs += (SEVERITY_SCORES.legs[legs] || 0);
//     });

//     const tableBody = results.map(([key, count]) => {
//         const [backCode, armsCode, legsCode] = key.split('').map(Number);
//         const fullCode = `${key}${loadCode}`;
//         const riskCategory = riskLookupTable[fullCode] || 0;
//         const percentage = (count / totalFrames) * 100;
//         if (riskCategory > 0) riskDist[riskCategory] += percentage;
//         const description = `${getPostureText('back', backCode)}, ${getPostureText('arms', armsCode)}, ${getPostureText('legs', legsCode)}`;
//         if (riskCategory > highestRiskPosture.risk) {
//             const firstOccurrence = postureLog.find(p => p.key === key);
//             highestRiskPosture = { risk: riskCategory, key, fullCode, description, timestamp: firstOccurrence?.timestamp };
//         }
//         return [fullCode, description, `${percentage.toFixed(1)}%`, `${riskCategories[riskCategory]?.text || 'N/A'} (Cat. ${riskCategory})`, `AC${riskCategory || 'N/A'}`];
//     });

//     let snapshotImage = null;
//     if (highestRiskPosture.risk > 2 && typeof highestRiskPosture.timestamp === 'number') {
//         snapshotImage = await captureFrameAtTime(highestRiskPosture.timestamp);
//     }
    
//     const postureAnalysis = analyzePostureFrequencies(postureLog, totalFrames);
//     const observations = generateDynamicObservations(postureAnalysis);
//     const recommendations = generateDynamicRecommendations(postureAnalysis, highestRiskPosture);
//     const riskSummary = Object.entries(riskDist).filter(([, perc]) => perc > 0).map(([cat, perc]) => [`${riskCategories[cat].text} (Cat. ${cat})`, `${perc.toFixed(1)}%`, riskCategories[cat].description]);
//     const executiveSummary = generateExecutiveSummary(riskDist, observations);
//     const conclusion = generateConclusion(riskDist);
//     const chartData = { riskDist, bodyPartRisk };

//     return { taskName, analystName, tableBody, riskSummary, chartData, observations, recommendations, conclusion, executiveSummary, snapshotImage, highestRiskPosture };
// }

// // --- ALL HELPER FUNCTIONS (COMPLETE) ---

// async function captureFrameAtTime(time) {
//     const videoElement = document.getElementById('input-video');
//     if (!videoElement) return null;
//     return new Promise(resolve => {
//         const onSeeked = () => {
//             videoElement.removeEventListener('seeked', onSeeked);
//             const canvas = document.createElement('canvas');
//             canvas.width = videoElement.videoWidth;
//             canvas.height = videoElement.videoHeight;
//             const ctx = canvas.getContext('2d');
//             ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
//             resolve(canvas.toDataURL('image/png'));
//         };
//         videoElement.addEventListener('seeked', onSeeked);
//         videoElement.currentTime = time;
//     });
// }

// function analyzePostureFrequencies(postureLog, totalFrames) {
//     const analysis = { back: { '1': 0, '2': 0, '3': 0, '4': 0 }, legs: { '4': 0, '5': 0, '6': 0 } };
//     postureLog.forEach(log => {
//         const [back, _, legs] = log.key.split('');
//         if (analysis.back.hasOwnProperty(back)) analysis.back[back]++;
//         if (analysis.legs.hasOwnProperty(legs)) analysis.legs[legs]++;
//     });
//     const toPercent = (count) => (count / totalFrames) * 100;
//     analysis.back.totalBent = toPercent(analysis.back['2'] + analysis.back['4']);
//     analysis.back.totalTwisted = toPercent(analysis.back['3'] + analysis.back['4']);
//     analysis.legs.totalSquatting = toPercent(analysis.legs['4'] + analysis.legs['5']);
//     analysis.legs.totalKneeling = toPercent(analysis.legs['6']);
//     return analysis;
// }

// function generateDynamicObservations(analysis) {
//     let obs = [];
//     if (analysis.back.totalTwisted > 20) {
//         obs.push(`A primary concern is the significant time (${analysis.back.totalTwisted.toFixed(0)}%) the worker spends with a twisted back. This often indicates a poor work layout requiring frequent sideways reaching.`);
//     } else if (analysis.back.totalBent > 20) {
//         obs.push(`The worker spends a notable amount of time (${analysis.back.totalBent.toFixed(0)}%) in a forward-bent posture, suggesting work surfaces may be too low.`);
//     }
//     if (analysis.legs.totalSquatting > 15) {
//         obs.push(`Frequent or prolonged squatting was observed for approximately ${analysis.legs.totalSquatting.toFixed(0)}% of the task, placing high strain on the knees and lower back.`);
//     }
//     if (obs.length === 0) return "The task involves a variety of postures with no single non-neutral posture dominating the work cycle. This reduces static load risk, though specific high-risk moments should still be addressed.";
//     return obs.join(' ');
// }

// function generateDynamicRecommendations(analysis, highestRiskPosture) {
//     let recs = "Based on the key risks identified, the following actions are prioritized:\n\n";
//     let addedRecs = new Set();
//     if (highestRiskPosture.risk === 4 && !addedRecs.has('bent_twisted')) {
//         recs += `For Combined Bending & Twisting (Cat 4 Risk):\n1. Engineering: Immediately redesign the task. Use lift-assist devices, conveyors, or adjustable-height carts.\n2. Administrative: Stop the task and re-evaluate. Implement immediate job rotation.\n\n`;
//         addedRecs.add('bent_twisted');
//     }
//     if (analysis.back.totalTwisted > 20 && !addedRecs.has('twisted')) {
//         recs += `To Address Back Twisting:\n1. Engineering: Relocate materials and tools within the primary work zone (in front of the worker).\n2. Training: Reinforce 'smart steps' - turning the whole body by moving the feet instead of twisting the waist.\n\n`;
//         addedRecs.add('twisted');
//     }
//     if (analysis.legs.totalSquatting > 15 && !addedRecs.has('squatting')) {
//         recs += `To Reduce Squatting Strain:\n1. Engineering: Provide low stools or adjustable platforms. Use tools with longer handles.\n2. Administrative: Alternate squatting tasks with standing or walking tasks.\n\n`;
//         addedRecs.add('squatting');
//     }
//     if (addedRecs.size === 0) return "No immediate corrective actions are required. Encourage general ergonomic best practices.";
//     return recs;
// }

// function getPostureText(part, code) { return postureOptions[part]?.find(opt => opt.code === code)?.text || 'Unknown'; }

// function generateExecutiveSummary(riskDist, observation) {
//     const highRiskTime = (riskDist[3] || 0) + (riskDist[4] || 0);
//     if (highRiskTime > 0) {
//         return `This analysis identifies a significant ergonomic risk, with ${highRiskTime.toFixed(1)}% of the task in high-risk postures. The primary issue is ${(observation || '').toLowerCase().includes('twisted back') ? 'frequent back twisting' : 'a hazardous posture'}. Immediate implementation of engineering and administrative controls is recommended.`;
//     }
//     const mediumRiskTime = riskDist[2] || 0;
//     if (mediumRiskTime > 5) {
//         return `The task is primarily low-risk. However, ${mediumRiskTime.toFixed(1)}% of the time is spent in medium-risk (Category 2) postures, mainly involving back twisting. Corrective actions should be taken soon to prevent long-term strain.`;
//     }
//     return 'This ergonomic assessment found the task consists predominantly of low-risk postures (Category 1). No immediate corrective actions are required.';
// }

// function generateConclusion(distribution) {
//     const highRiskTime = (distribution[3] || 0) + (distribution[4] || 0);
//     const mediumRiskTime = (distribution[2] || 0);
//     if (highRiskTime > 0) return `The worker spends ${highRiskTime.toFixed(1)}% of their time in high-risk postures. This presents a significant probability of leading to musculoskeletal disorders if immediate corrective measures are not taken.`;
//     if (mediumRiskTime > 0) return `While the task is predominantly low-risk, the ${mediumRiskTime.toFixed(1)}% of time spent in medium-risk postures is a concern. Continuous exposure, particularly to back twisting, can lead to chronic injury over time.`;
//     return "The task consists almost entirely of low-risk postures (Category 1). No immediate ergonomic hazards were identified that require intervention.";
// }

// function addSectionTitle(doc, title, y) {
//     if (y > 250) { doc.addPage(); y = 20; }
//     doc.setFontSize(14).setFont(undefined, 'bold');
//     doc.text(title, 14, y);
//     return y + 8;
// }

// function addFooter(doc) {
//     const pageCount = doc.internal.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//         doc.setPage(i);
//         const pageHeight = doc.internal.pageSize.getHeight();
//         doc.setFontSize(9).setTextColor(150);
//         doc.text('MTP PROJECT: OWAS Method Software', 105, pageHeight - 15, { align: 'center' });
//         doc.text('DEVELOPED BY NISHANT PANDEY UNDER THE GUIDANCE OF Dr. Priyabarat Pradhan', 105, pageHeight - 10, { align: 'center' });
//     }
// }

// async function addChartsToPdf(doc, y, chartData) {
//     if (y > 190) { doc.addPage(); y = 20; }
//     const chartColors = { pie: ['#2ecc71', '#f1c40f', '#e67e22', '#e74c3c'], bar: ['#3498db', '#9b59b6', '#27ae60'] };
//     const pieDataValues = Object.values(chartData.riskDist).filter(v => v > 0);
//     const pieDataLabels = Object.keys(chartData.riskDist).filter(k => chartData.riskDist[k] > 0).map(k => `Category ${k} (${chartData.riskDist[k].toFixed(1)}%)`);
//     const pieImage = await createChartImage(350, 350, 'pie', pieDataLabels, pieDataValues, 'Risk Category Distribution (%)', chartColors.pie);
//     doc.addImage(pieImage, 'PNG', 14, y, 80, 80);
//     const barDataValues = Object.values(chartData.bodyPartRisk);
//     const barDataLabels = Object.keys(chartData.bodyPartRisk).map(p => p.charAt(0).toUpperCase() + p.slice(1));
//     const barImage = await createChartImage(500, 300, 'bar', barDataLabels, barDataValues, 'Weighted Risk Score by Body Part', chartColors.bar);
//     doc.addImage(barImage, 'PNG', 105, y, 90, 54);
//     return y + 90;
// }

// async function createChartImage(width, height, type, labels, data, title, colors) {
//     const canvas = document.createElement('canvas');
//     canvas.width = width; canvas.height = height;
//     const chart = new Chart(canvas.getContext('2d'), {
//         type: type,
//         data: { labels: labels, datasets: [{ data: data, backgroundColor: colors, borderWidth: type === 'pie' ? 2 : 0 }] },
//         options: {
//             responsive: false, animation: { duration: 0 },
//             plugins: {
//                 legend: { position: 'right', display: type === 'pie', labels: { font: { size: 12 } } },
//                 title: { display: true, text: title, font: { size: 16 } }
//             },
//             scales: type === 'bar' ? { y: { beginAtZero: true, title: { display: true, text: 'Weighted Score' } } } : {}
//         }
//     });
//     await new Promise(resolve => setTimeout(resolve, 500));
//     const image = chart.toBase64Image();
//     chart.destroy();
//     return image;
// }






























// MOST EFFECTIVE CODE USE THIS ONEE 



// import { riskCategories, riskLookupTable, postureOptions } from './owas-data.js';

// // --- INITIALIZATION ---

// export function initReporterView(appState) {
//     const aiReportBtn = document.getElementById('generate-ai-report');
//     const manualReportBtn = document.getElementById('generate-manual-report');
    
//     if (!aiReportBtn || !manualReportBtn) {
//         console.error("Report generator buttons not found in the HTML.");
//         return;
//     }

//     if (typeof window.jspdf === 'undefined' || typeof window.Chart === 'undefined' || typeof window.jspdf.jsPDF.API.autoTable === 'undefined') {
//         handleLibraryLoadError(aiReportBtn, manualReportBtn);
//         return;
//     }

//     aiReportBtn.addEventListener('click', () => generatePdf(appState, true));
//     manualReportBtn.addEventListener('click', () => generatePdf(appState, false));
// }

// function handleLibraryLoadError(aiBtn, manualBtn) {
//     console.error("Critical Error: jsPDF, jspdf-autotable, or Chart.js library failed to load.");
//     aiBtn.disabled = true;
//     manualBtn.disabled = true;
//     const container = aiBtn.parentElement.parentElement.parentElement;
//     const errorMsg = document.createElement('p');
//     errorMsg.className = 'text-center text-red-600 font-semibold bg-red-100 p-3 rounded-lg mt-4';
//     errorMsg.textContent = 'PDF/Chart generation is unavailable. Please check internet connection/ad-blocker and refresh.';
//     container.appendChild(errorMsg);
// }


// // --- PDF GENERATION ---

// async function generatePdf(appState, isAiReport) {
//     try {
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
//         let y = 15;

//         const reportData = processReportData(appState, isAiReport);

//         // --- Header & Task Details ---
//         doc.setFontSize(20).setFont(undefined, 'bold');
//         doc.text("OWAS Ergonomic Risk Report", 105, y, { align: 'center' });
//         y += 15;
//         y = addSectionTitle(doc, "1. Task Details", y);
//         doc.setFontSize(11).setFont(undefined, 'normal');
//         doc.text(`Task Name: ${reportData.taskName}`, 14, y); y += 7;
//         doc.text(`Analyst: ${reportData.analystName}`, 14, y); y += 7;
//         doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, y); y += 10;
        
//         y = addSectionTitle(doc, "2. Methodology", y);
//         doc.setFontSize(11).setFont(undefined, 'normal');
//         doc.text(`- Observation Technique: OWAS (Ovako Working Posture Analysis System)`, 14, y); y += 6;
//         doc.text(`- Data Source: ${isAiReport ? 'AI-based video analysis' : 'Manual observation'}`, 14, y); y += 10;
        
//         y = addSectionTitle(doc, "3. Posture Frequency & Risk Category", y);
//         doc.autoTable({
//             head: [['Posture Code (B-A-L-F)', 'Description', 'Frequency (%)', 'Risk', 'Action']],
//             body: reportData.tableBody,
//             startY: y, theme: 'grid', headStyles: { fillColor: [26, 82, 118], textColor: 255, fontStyle: 'bold' },
//             styles: { cellPadding: 2.5, fontSize: 9 }, columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 25 }, 3: { cellWidth: 25 }, 4: { cellWidth: 25 } },
//             didDrawPage: (data) => { y = data.cursor.y; }
//         });
//         y = doc.autoTable.previous.finalY + 10;
        
//         y = addSectionTitle(doc, "4. Risk Summary", y);
//         doc.autoTable({
//             head: [['Risk Category', '% Time in this Category', 'Action Required']],
//             body: reportData.riskSummary,
//             startY: y, theme: 'grid', headStyles: { fillColor: [46, 134, 193], textColor: 255, fontStyle: 'bold' },
//             styles: { cellPadding: 2.5, fontSize: 9 },
//             didDrawPage: (data) => { y = data.cursor.y; }
//         });
//         y = doc.autoTable.previous.finalY;
//         doc.setFontSize(8).setFont(undefined, 'italic');
//         doc.text(reportData.riskFocus, 14, y + 5);
//         y += 10;

//         y = await addChartsToPdf(doc, "5. Graphical Representation", reportData.chartData, y);
        
//         if (isAiReport && reportData.highRiskSnapshots.length > 0) {
//             y = addSnapshotsSection(doc, "6. High-Risk Posture Snapshots", reportData.highRiskSnapshots, y);
//         }

//         y = addSectionTitle(doc, "7. Observations", y);
//         doc.setFontSize(10).setFont(undefined, 'normal');
//         doc.text(doc.splitTextToSize(reportData.observations, 180), 14, y);
//         y += doc.splitTextToSize(reportData.observations, 180).length * 5 + 5;

//         y = addSectionTitle(doc, "8. Recommendations", y);
//         doc.setFontSize(10).setFont(undefined, 'normal');
//         doc.text(doc.splitTextToSize(reportData.recommendations, 180), 14, y);
//         y += doc.splitTextToSize(reportData.recommendations, 180).length * 5 + 5;

//         y = addSectionTitle(doc, "9. Conclusion", y);
//         doc.setFontSize(10).setFont(undefined, 'italic');
//         doc.text(doc.splitTextToSize(reportData.conclusion, 180), 14, y);
        
//         addFooter(doc);
//         doc.save(`OWAS_Report_${reportData.taskName.replace(/[\s.]+/g, '_')}.pdf`);

//     } catch (error) {
//         console.error("Failed to generate PDF:", error);
//         alert("An error occurred while generating the PDF. Please check the console.");
//     }
// }


// // --- DATA PROCESSING LOGIC ---

// function processReportData(appState, isAiReport) {
//     if (!isAiReport) {
//         return processManualData();
//     }
    
//     const taskName = appState.currentVideoFile?.name || 'AI Analysis';
//     const analystName = document.getElementById('analyst-name').value || 'AI / Software';
//     const sourceData = appState.aiGeneratedResults;

//     if (!sourceData || sourceData.results.length === 0) {
//         return { 
//             taskName, analystName, 
//             tableBody: [['No data available']], 
//             riskSummary: [], highRiskSnapshots: [], chartData: {}, 
//             observations: 'N/A', recommendations: 'N/A', 
//             conclusion: 'Analysis could not be completed.' 
//         };
//     }

//     const { results, totalFrames, loadCode, snapshots } = sourceData;
//     const riskDist = { 1: 0, 2: 0, 3: 0, 4: 0 };
    
//     // ✅ Body part weighted scores
//     const bodyPartRisk = { back: 0, arms: 0, legs: 0, load: 0 };

//     let highestRiskPosture = { risk: 0, key: '' };
//     const highRiskSnapshots = [];

//     results.forEach(([key, count]) => {
//         const fullCode = `${key}${loadCode}`;
//         const riskCategory = riskLookupTable[fullCode] || 0;
//         const percentage = (count / totalFrames) * 100;

//         // --- High risk snapshots store ---
//         if (riskCategory >= 3 && snapshots && snapshots[key]) {
//             highRiskSnapshots.push({
//                 code: fullCode,
//                 risk: riskCategory,
//                 text: riskCategories[riskCategory]?.text,
//                 image: snapshots[key]
//             });
//         }

//         // --- Risk Distribution ---
//         if (riskCategory > 0) riskDist[riskCategory] += percentage;

//         // --- Weighted Scores (new logic) ---
//         const [backCode, armsCode, legsCode] = key.split('').map(Number);
//         const loadCodeNum = Number(loadCode);

//         bodyPartRisk.back += backCode * percentage;
//         bodyPartRisk.arms += armsCode * percentage;
//         bodyPartRisk.legs += legsCode * percentage;
//         bodyPartRisk.load += loadCodeNum * percentage;

//         if (riskCategory > highestRiskPosture.risk) {
//             highestRiskPosture = { risk: riskCategory, key: key };
//         }
//     });

//     // Normalize (divide by 100 → final weighted score)
//     Object.keys(bodyPartRisk).forEach(part => {
//         bodyPartRisk[part] = (bodyPartRisk[part] / 100).toFixed(2);
//     });

//     // --- Table body for Posture Frequency ---
//     const tableBody = results.map(([key, count]) => {
//         const fullCode = `${key}${loadCode}`;
//         const riskCategory = riskLookupTable[fullCode] || 0;
//         const percentage = (count / totalFrames) * 100;
//         const [backCode, armsCode, legsCode] = key.split('').map(Number);
//         const description = `${getPostureText('back', backCode)}, ${getPostureText('arms', armsCode)}, ${getPostureText('legs', legsCode)}`;
//         return [
//             fullCode,
//             description,
//             `${percentage.toFixed(1)}%`,
//             `${riskCategories[riskCategory]?.text} (Cat. ${riskCategory})`,
//             `AC${riskCategory || 'N/A'}`
//         ];
//     });

//     const riskSummary = Object.entries(riskDist)
//         .filter(([, perc]) => perc > 0)
//         .map(([cat, perc]) => [
//             `${riskCategories[cat].text} (Cat. ${cat})`,
//             `${perc.toFixed(1)}%`,
//             riskCategories[cat].description
//         ]);

//     return {
//         taskName, analystName, tableBody, riskSummary,
//         riskFocus: getRiskFocus(riskDist),
//         chartData: { riskDist, bodyPartRisk },
//         highRiskSnapshots: [...new Map(highRiskSnapshots.map(item => [item.code, item])).values()],
//         observations: generateObservations(results, totalFrames),
//         recommendations: getRecommendations(highestRiskPosture),
//         conclusion: generateConclusion(riskDist)
//     };
// }


// function processManualData() {
//     // This function remains the same as before
//     const taskName = document.getElementById('task-name').value || 'Manual Analysis';
//     const analystName = document.getElementById('analyst-name').value || 'Manual Analyst';
//     const manualAnalyzerItems = document.querySelectorAll('.analyzer-item');
//     if (manualAnalyzerItems.length === 0) {
//         return { taskName, analystName, tableBody: [['No manual postures added']], riskSummary: [], chartData: {}, observations: 'No postures were added.', recommendations: 'N/A', conclusion: 'Analysis could not be completed.' };
//     }
//     const tableBody = [];
//     const riskDist = { 1: 0, 2: 0, 3: 0, 4: 0 };
//     manualAnalyzerItems.forEach(item => {
//         const postureText = item.querySelector('label').textContent;
//         const frequency = parseInt(item.querySelector('.value-label').textContent);
//         const riskText = item.querySelector('.risk-label').textContent;
//         const riskCategory = parseInt(riskText.replace('Risk ', ''));
//         tableBody.push([postureText, `${frequency}%`, riskText]);
//         if (riskCategory > 0) riskDist[riskCategory] += frequency;
//     });
//     const riskSummary = Object.entries(riskDist).filter(([, perc]) => perc > 0).map(([cat, perc]) => [`${riskCategories[cat].text} (Cat. ${cat})`, `${perc.toFixed(1)}%`, riskCategories[cat].description]);
//     return {
//         taskName, analystName, tableBody, riskSummary,
//         tableHead: [['Posture', 'Frequency (%)', 'Calculated Risk Level']],
//         columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 30 }, 2: { cellWidth: 40 } },
//         riskFocus: getRiskFocus(riskDist),
//         chartData: { riskDist, bodyPartRisk: {} },
//         observations: "Manual analysis based on user-defined posture frequencies.",
//         recommendations: "Recommendations should be based on the specific postures identified as high-risk in the analysis.",
//         conclusion: generateConclusion(riskDist)
//     };
// }


// // --- DYNAMIC CONTENT GENERATION ---

// function getRiskFocus(riskDist) {
//     if (riskDist[4] > 0) return "Focus corrective measures on postures in Category 4 immediately.";
//     if (riskDist[3] > 0) return "Focus corrective measures on postures in Category 3 as soon as possible.";
//     if (riskDist[2] > 0) return "Focus corrective measures on postures in Category 2.";
//     return "No significant risk detected that requires immediate action.";
// }

// function generateObservations(results, totalFrames) {
//     if (results.length === 1) return "The task is highly static, with the worker holding a single posture for the entire duration. This lack of movement can lead to muscle fatigue.";
//     const legPostures = new Set(results.map(([key]) => key.charAt(2)));
//     if (legPostures.size <= 1) return "Limited leg posture variation suggests a restricted workspace or a task that requires a fixed stance, increasing strain on the lower body.";
//     const backPostures = results.filter(([key]) => ['3', '4'].includes(key.charAt(0)));
//     const twistedTime = backPostures.reduce((acc, [, count]) => acc + count, 0) / totalFrames * 100;
//     if (twistedTime > 20) return `A significant portion of the task (${twistedTime.toFixed(0)}%) involves a twisted back. This indicates a poor workstation layout or a need to frequently reach sideways/backwards.`;
//     return "The task involves a variety of postures, reducing the risk of static muscle load.";
// }

// function getRecommendations({ key, risk }) {
//     if (risk < 2) return "1. No immediate corrective actions are required. \n2. Encourage general ergonomic best practices and posture awareness.";
//     const [backCode] = key.split('').map(Number);
//     let recs = "Based on the high-risk postures observed, the following actions are recommended:\n";
//     const recommendationDB = {
//         2: "1. Engineering: Adjust workstation height to align with the worker's elbow height to prevent bending.\n2. Administrative: Introduce micro-breaks every 30 minutes for stretching.",
//         3: "1. Engineering: Relocate frequently used items to be within primary reach zones to avoid twisting.\n2. Training: Educate workers on turning with their feet ('smart steps') instead of twisting their waist.",
//         4: "1. Engineering: This task is a high priority for redesign. Use mechanical aids or lift-assist devices to eliminate combined bending and twisting.\n2. Administrative: Implement immediate job rotation to limit exposure time."
//     };
//     recs += recommendationDB[backCode] || "1. A full, on-site ergonomic assessment is recommended to identify the root causes of hazardous postures.";
//     return recs;
// }

// function generateConclusion(distribution) {
//     const highRiskTime = (distribution[3] || 0) + (distribution[4] || 0);
//     const mediumRiskTime = (distribution[2] || 0);
//     if (highRiskTime > 0) return `The analysis shows the worker spends ${highRiskTime.toFixed(1)}% of their time in high-risk postures. Without corrective measures, these may lead to long-term musculoskeletal disorders.`;
//     if (mediumRiskTime > 0) return `Since ${((distribution[1] || 0)).toFixed(1)}% of time is spent in low-risk postures and only ${mediumRiskTime.toFixed(1)}% in medium risk, overall ergonomics are satisfactory. However, long-term exposure to certain postures may still lead to discomfort if not addressed.`;
//     return "The task consists of low-risk postures, and no immediate ergonomic concerns were identified.";
// }

// function getPostureText(part, code) {
//     return postureOptions[part]?.find(opt => opt.code === code)?.text || 'Unknown';
// }


// // --- PDF STYLING & DRAWING HELPERS ---

// function addSectionTitle(doc, title, y) {
//     if (y > 270) { doc.addPage(); y = 20; }
//     doc.setFontSize(14).setFont(undefined, 'bold');
//     doc.text(title, 14, y);
//     return y + 8;
// }

// function addFooter(doc) {
//     const pageCount = doc.internal.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//         doc.setPage(i);
//         const pageHeight = doc.internal.pageSize.getHeight();
//         doc.setFontSize(9).setTextColor(150).setFont(undefined, 'normal');
//         doc.text('MTP PROJECT: OWAS Method Software', 105, pageHeight - 15, { align: 'center' });
//         doc.text('DEVELOPED BY NISHANT PANDEY UNDER THE GUIDANCE OF Dr. Priyabarat Pradhan', 105, pageHeight - 10, { align: 'center' });
//     }
// }

// async function addChartsToPdf(doc, title, chartData, y) {
//     if (!chartData.riskDist || Object.values(chartData.riskDist).reduce((a, b) => a + b, 0) === 0) return y;
//     y = addSectionTitle(doc, title, y);
//     if (y > 190) { doc.addPage(); y = 20; y = addSectionTitle(doc, title, y); }
//     const chartColors = { pie: ['#2ecc71', '#f1c40f', '#e67e22', '#e74c3c'], bar: ['#3498db', '#9b59b6', '#2ecc71'] };
//     const pieDataValues = Object.values(chartData.riskDist).filter(v => v > 0);
//     const pieDataLabels = Object.keys(chartData.riskDist).filter(k => chartData.riskDist[k] > 0).map(k => `Category ${k}`);
//     const pieImage = await createChartImage(250, 250, 'pie', pieDataLabels, pieDataValues, 'Risk Category Distribution (%)', chartColors.pie);
//     doc.addImage(pieImage, 'PNG', 14, y, 80, 80);
//     if (chartData.bodyPartRisk && Object.keys(chartData.bodyPartRisk).length > 0) {
//         const barDataValues = Object.values(chartData.bodyPartRisk);
//         const barDataLabels = Object.keys(chartData.bodyPartRisk).map(p => p.charAt(0).toUpperCase() + p.slice(1));
//         const barImage = await createChartImage(500, 250, 'bar', barDataLabels, barDataValues, 'Weighted Risk Score by Body Part', chartColors.bar);
//         doc.addImage(barImage, 'PNG', 105, y, 90, 45);
//     }
//     return y + 90;
// }

// /**
//  * UPDATED: Adds a section with images of high-risk postures to the PDF.
//  * Now includes error handling for invalid image data.
//  * @returns {number} The new y-position.
//  */
// function addSnapshotsSection(doc, title, snapshots, y) {
//     if (!snapshots || snapshots.length === 0) {
//         return y;
//     }

//     y = addSectionTitle(doc, title, y);
    
//     const snapshotWidth = 85;
//     const snapshotHeight = 48; // Maintain 16:9 aspect ratio
//     const captionHeight = 10;
//     const totalBlockHeight = snapshotHeight + captionHeight;
//     const xPositions = [14, 110];
//     let currentXIndex = 0;

//     snapshots.forEach((snapshot) => {
//         if (y + totalBlockHeight > doc.internal.pageSize.getHeight() - 20) {
//             doc.addPage();
//             y = 20;
//             y = addSectionTitle(doc, title + " (Continued)", y);
//         }
        
//         const x = xPositions[currentXIndex];
//         try {
//             // Check if the image data is a valid base64 string
//             if (snapshot.image && snapshot.image.startsWith('data:image/jpeg;base64,')) {
//                 doc.addImage(snapshot.image, 'JPEG', x, y, snapshotWidth, snapshotHeight);
//                 doc.setFontSize(9).setFont(undefined, 'normal');
//                 doc.text(`Posture: ${snapshot.code} (${snapshot.text})`, x, y + snapshotHeight + 5);
//             } else {
//                 throw new Error("Invalid base64 string");
//             }
//         } catch (e) {
//             console.error(`Failed to add image for posture ${snapshot.code}:`, e);
//             // Draw an error box in the PDF
//             doc.setDrawColor(255, 0, 0); // Red border
//             doc.rect(x, y, snapshotWidth, snapshotHeight);
//             doc.setFontSize(9).setFont(undefined, 'italic').setTextColor(255, 0, 0);
//             doc.text(`Error: Invalid image data for posture ${snapshot.code}`, x + 5, y + (snapshotHeight / 2));
//             doc.setTextColor(0, 0, 0); // Reset text color
//         }

//         if (currentXIndex === 1) {
//             y += totalBlockHeight;
//             currentXIndex = 0;
//         } else {
//             currentXIndex = 1;
//         }
//     });

//     if (currentXIndex === 1) {
//         y += totalBlockHeight;
//     }
//     return y;
// }

// async function createChartImage(width, height, type, labels, data, title, colors) {
//     const canvas = document.createElement('canvas');
//     canvas.width = width;
//     canvas.height = height;
//     const chart = new Chart(canvas.getContext('2d'), {
//         type: type,
//         data: {
//             labels: labels,
//             datasets: [{ data: data, backgroundColor: colors, borderColor: '#fff', borderWidth: type === 'pie' ? 2 : 0 }]
//         },
//         options: {
//             responsive: false, animation: { duration: 0 },
//             plugins: { legend: { position: 'right', display: type === 'pie' }, title: { display: true, text: title, font: { size: 14 } } },
//            scales: type === 'bar'
//     ? {
//         y: {
//             beginAtZero: true,
//             max: 4  // ✅ fix kar diya, hamesha 0–4 range
//         }
//     }
//     : {}

//         }
//     });
//     await new Promise(resolve => setTimeout(resolve, 500));
//     const image = chart.toBase64Image();
//     chart.destroy();
//     return image;
// }














import { riskCategories, riskLookupTable, postureOptions } from './owas-data.js';

// --- INITIALIZATION ---

export function initReporterView(appState) {
    const aiReportBtn = document.getElementById('generate-ai-report');
    const manualReportBtn = document.getElementById('generate-manual-report');
    
    if (!aiReportBtn || !manualReportBtn) {
        console.error("Report generator buttons not found in the HTML.");
        return;
    }

    if (typeof window.jspdf === 'undefined' || typeof window.Chart === 'undefined' || typeof window.jspdf.jsPDF.API.autoTable === 'undefined') {
        handleLibraryLoadError(aiReportBtn, manualReportBtn);
        return;
    }

    aiReportBtn.addEventListener('click', () => generatePdf(appState, true));
    manualReportBtn.addEventListener('click', () => generatePdf(appState, false));
}

function handleLibraryLoadError(aiBtn, manualBtn) {
    console.error("Critical Error: jsPDF, jspdf-autotable, or Chart.js library failed to load.");
    aiBtn.disabled = true;
    manualBtn.disabled = true;
    const container = aiBtn.parentElement.parentElement.parentElement;
    const errorMsg = document.createElement('p');
    errorMsg.className = 'text-center text-red-600 font-semibold bg-red-100 p-3 rounded-lg mt-4';
    errorMsg.textContent = 'PDF/Chart generation is unavailable. Please check internet connection/ad-blocker and refresh.';
    container.appendChild(errorMsg);
}


// --- PDF GENERATION ---

async function generatePdf(appState, isAiReport) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        let y = 15;

        const reportData = processReportData(appState, isAiReport);

        // --- Header & Task Details ---
        doc.setFontSize(20).setFont(undefined, 'bold');
        doc.text("OWAS Ergonomic Risk Report", 105, y, { align: 'center' });
        y += 15;
        y = addSectionTitle(doc, "1. Task Details", y);
        doc.setFontSize(11).setFont(undefined, 'normal');
        doc.text(`Task Name: ${reportData.taskName}`, 14, y); y += 7;
        doc.text(`Analyst: ${reportData.analystName}`, 14, y); y += 7;
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, y); y += 10;
        
        y = addSectionTitle(doc, "2. Methodology", y);
        doc.setFontSize(11).setFont(undefined, 'normal');
        doc.text(`- Observation Technique: OWAS (Ovako Working Posture Analysis System)`, 14, y); y += 6;
        doc.text(`- Data Source: ${isAiReport ? 'AI-based video analysis' : 'Manual observation'}`, 14, y); y += 10;
        
        y = addSectionTitle(doc, "3. Posture Frequency & Risk Category", y);
        doc.autoTable({
            head: [['Posture Code (B-A-L-F)', 'Description', 'Frequency (%)', 'Risk', 'Action']],
            body: reportData.tableBody,
            startY: y, theme: 'grid', headStyles: { fillColor: [26, 82, 118], textColor: 255, fontStyle: 'bold' },
            styles: { cellPadding: 2.5, fontSize: 9 }, columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 25 }, 3: { cellWidth: 25 }, 4: { cellWidth: 25 } },
            didDrawPage: (data) => { y = data.cursor.y; }
        });
        y = doc.autoTable.previous.finalY + 10;
        
        y = addSectionTitle(doc, "4. Risk Summary", y);
        doc.autoTable({
            head: [['Risk Category', '% Time in this Category', 'Action Required']],
            body: reportData.riskSummary,
            startY: y, theme: 'grid', headStyles: { fillColor: [46, 134, 193], textColor: 255, fontStyle: 'bold' },
            styles: { cellPadding: 2.5, fontSize: 9 },
            didDrawPage: (data) => { y = data.cursor.y; }
        });
        y = doc.autoTable.previous.finalY;
        doc.setFontSize(8).setFont(undefined, 'italic');
        doc.text(reportData.riskFocus, 14, y + 5);
        y += 10;

        y = await addChartsToPdf(doc, "5. Graphical Representation", reportData.chartData, y);
        
        if (isAiReport && reportData.highRiskSnapshots.length > 0) {
            y = addSnapshotsSection(doc, "6. High-Risk Posture Snapshots", reportData.highRiskSnapshots, y);
        }

        y = addSectionTitle(doc, "7. Observations", y);
        doc.setFontSize(10).setFont(undefined, 'normal');
        doc.text(doc.splitTextToSize(reportData.observations, 180), 14, y);
        y += doc.splitTextToSize(reportData.observations, 180).length * 5 + 5;

        y = addSectionTitle(doc, "8. Recommendations", y);
        doc.setFontSize(10).setFont(undefined, 'normal');
        doc.text(doc.splitTextToSize(reportData.recommendations, 180), 14, y);
        y += doc.splitTextToSize(reportData.recommendations, 180).length * 5 + 5;

        y = addSectionTitle(doc, "9. Conclusion", y);
        doc.setFontSize(10).setFont(undefined, 'italic');
        doc.text(doc.splitTextToSize(reportData.conclusion, 180), 14, y);
        
        addFooter(doc);
        doc.save(`OWAS_Report_${reportData.taskName.replace(/[\s.]+/g, '_')}.pdf`);

    } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert("An error occurred while generating the PDF. Please check the console.");
    }
}


function processReportData(appState, isAiReport) {
    if (!isAiReport) {
        return processManualData();
    }
    
    const taskName = appState.currentVideoFile?.name || 'AI Analysis';
    const analystName = document.getElementById('analyst-name').value || 'AI / Software';
    const sourceData = appState.aiGeneratedResults;

    if (!sourceData || sourceData.results.length === 0) {
        return { 
            taskName, analystName, 
            tableBody: [['No data available']], 
            riskSummary: [], highRiskSnapshots: [], chartData: {}, 
            observations: 'N/A', recommendations: 'N/A', 
            conclusion: 'Analysis could not be completed.' 
        };
    }

    const { results, totalFrames, loadCode, snapshots } = sourceData;
    const riskDist = { 1: 0, 2: 0, 3: 0, 4: 0 };
    
    const bodyPartRisk = { back: 0, arms: 0, legs: 0, load: 0 };
    let highestRiskPosture = { risk: 0, key: '' };
    const highRiskSnapshots = [];

    // --- SUMMATION FEATURE (START) ---
    // This loop performs the SUMMATION (Sigma) for the weighted score.
    // It iterates through each unique posture to calculate its contribution to the total score.
    results.forEach(([key, count]) => {
        const fullCode = `${key}${loadCode}`;
        const riskCategory = riskLookupTable[fullCode] || 0;
        const percentage = (count / totalFrames) * 100;

        if (riskCategory >= 3 && snapshots && snapshots[key]) {
            highRiskSnapshots.push({
                code: fullCode,
                risk: riskCategory,
                text: riskCategories[riskCategory]?.text,
                image: snapshots[key]
            });
        }

        if (riskCategory > 0) riskDist[riskCategory] += percentage;

        const [backCode, armsCode, legsCode] = key.split('');
        const loadCodeNum = Number(loadCode);

        // This is the core of the summation for each body part.
        // The `+=` operator adds the calculated value for this specific posture to the running total.
        bodyPartRisk.back += (SEVERITY_MAPPING.back[backCode] || 0) * percentage;
        bodyPartRisk.arms += (SEVERITY_MAPPING.arms[armsCode] || 0) * percentage;
        bodyPartRisk.legs += (SEVERITY_MAPPING.legs[legsCode] || 0) * percentage;
        bodyPartRisk.load += (SEVERITY_MAPPING.load[loadCodeNum] || 0) * percentage;

        if (riskCategory > highestRiskPosture.risk) {
            highestRiskPosture = { risk: riskCategory, key: key };
        }
    });
    // --- SUMMATION FEATURE (END) ---

    // Normalize (divide the total sum by 100 to get the final weighted average)
    Object.keys(bodyPartRisk).forEach(part => {
        bodyPartRisk[part] = (bodyPartRisk[part] / 100).toFixed(2);
    });

    // --- Table body for Posture Frequency ---
    const tableBody = results.map(([key, count]) => {
        const fullCode = `${key}${loadCode}`;
        const riskCategory = riskLookupTable[fullCode] || 0;
        const percentage = (count / totalFrames) * 100;
        const [backCode, armsCode, legsCode] = key.split('').map(Number);
        const description = `${getPostureText('back', backCode)}, ${getPostureText('arms', armsCode)}, ${getPostureText('legs', legsCode)}`;
        return [
            fullCode,
            description,
            `${percentage.toFixed(1)}%`,
            `${riskCategories[riskCategory]?.text} (Cat. ${riskCategory})`,
            `AC${riskCategory || 'N/A'}`
        ];
    });

    const riskSummary = Object.entries(riskDist)
        .filter(([, perc]) => perc > 0)
        .map(([cat, perc]) => [
            `${riskCategories[cat].text} (Cat. ${cat})`,
            `${perc.toFixed(1)}%`,
            riskCategories[cat].description
        ]);

    return {
        taskName, analystName, tableBody, riskSummary,
        riskFocus: getRiskFocus(riskDist),
        chartData: { riskDist, bodyPartRisk },
        highRiskSnapshots: [...new Map(highRiskSnapshots.map(item => [item.code, item])).values()],
        observations: generateObservations(results, totalFrames),
        recommendations: getRecommendations(highestRiskPosture),
        conclusion: generateConclusion(riskDist) // Fixed typo here
    };
}


function processManualData() {
    // This function remains the same as before
    const taskName = document.getElementById('task-name').value || 'Manual Analysis';
    const analystName = document.getElementById('analyst-name').value || 'Manual Analyst';
    const manualAnalyzerItems = document.querySelectorAll('.analyzer-item');
    if (manualAnalyzerItems.length === 0) {
        return { taskName, analystName, tableBody: [['No manual postures added']], riskSummary: [], chartData: {}, observations: 'No postures were added.', recommendations: 'N/A', conclusion: 'Analysis could not be completed.' };
    }
    const tableBody = [];
    const riskDist = { 1: 0, 2: 0, 3: 0, 4: 0 };
    manualAnalyzerItems.forEach(item => {
        const postureText = item.querySelector('label').textContent;
        const frequency = parseInt(item.querySelector('.value-label').textContent);
        const riskText = item.querySelector('.risk-label').textContent;
        const riskCategory = parseInt(riskText.replace('Risk ', ''));
        tableBody.push([postureText, `${frequency}%`, riskText]);
        if (riskCategory > 0) riskDist[riskCategory] += frequency;
    });
    const riskSummary = Object.entries(riskDist).filter(([, perc]) => perc > 0).map(([cat, perc]) => [`${riskCategories[cat].text} (Cat. ${cat})`, `${perc.toFixed(1)}%`, riskCategories[cat].description]);
    return {
        taskName, analystName, tableBody, riskSummary,
        tableHead: [['Posture', 'Frequency (%)', 'Calculated Risk Level']],
        columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 30 }, 2: { cellWidth: 40 } },
        riskFocus: getRiskFocus(riskDist),
        chartData: { riskDist, bodyPartRisk: {} },
        observations: "Manual analysis based on user-defined posture frequencies.",
        recommendations: "Recommendations should be based on the specific postures identified as high-risk in the analysis.",
        conclusion: generateConclusion(riskDist)
    };
}


// --- DYNAMIC CONTENT GENERATION ---

// --- NEW: Strain Score Mapping (0-10 Scale) ---
// This is the new "brain" for the weighted score calculation.
const SEVERITY_MAPPING = {
    back: { '1': 0, '2': 6, '3': 7, '4': 10 },
    arms: { '1': 1, '2': 4, '3': 8 },
    legs: { '1': 0, '2': 1, '3': 2, '4': 5, '5': 6, '6': 8, '7': 3 },
    load: { '1': 1, '2': 5, '3': 9 }
};

function getRiskFocus(riskDist) {
    if (riskDist[4] > 0) return "Focus corrective measures on postures in Category 4 immediately.";
    if (riskDist[3] > 0) return "Focus corrective measures on postures in Category 3 as soon as possible.";
    if (riskDist[2] > 0) return "Focus corrective measures on postures in Category 2.";
    return "No significant risk detected that requires immediate action.";
}

function generateObservations(results, totalFrames) {
    if (results.length === 1) return "The task is highly static, with the worker holding a single posture for the entire duration. This lack of movement can lead to muscle fatigue.";
    const legPostures = new Set(results.map(([key]) => key.charAt(2)));
    if (legPostures.size <= 1) return "Limited leg posture variation suggests a restricted workspace or a task that requires a fixed stance, increasing strain on the lower body.";
    const backPostures = results.filter(([key]) => ['3', '4'].includes(key.charAt(0)));
    const twistedTime = backPostures.reduce((acc, [, count]) => acc + count, 0) / totalFrames * 100;
    if (twistedTime > 20) return `A significant portion of the task (${twistedTime.toFixed(0)}%) involves a twisted back. This indicates a poor workstation layout or a need to frequently reach sideways/backwards.`;
    return "The task involves a variety of postures, reducing the risk of static muscle load.";
}

function getRecommendations({ key, risk }) {
    if (risk < 2) return "1. No immediate corrective actions are required. \n2. Encourage general ergonomic best practices and posture awareness.";
    const [backCode] = key.split('').map(Number);
    let recs = "Based on the high-risk postures observed, the following actions are recommended:\n";
    const recommendationDB = {
        2: "1. Engineering: Adjust workstation height to align with the worker's elbow height to prevent bending.\n2. Administrative: Introduce micro-breaks every 30 minutes for stretching.",
        3: "1. Engineering: Relocate frequently used items to be within primary reach zones to avoid twisting.\n2. Training: Educate workers on turning with their feet ('smart steps') instead of twisting their waist.",
        4: "1. Engineering: This task is a high priority for redesign. Use mechanical aids or lift-assist devices to eliminate combined bending and twisting.\n2. Administrative: Implement immediate job rotation to limit exposure time."
    };
    recs += recommendationDB[backCode] || "1. A full, on-site ergonomic assessment is recommended to identify the root causes of hazardous postures.";
    return recs;
}

function generateConclusion(distribution) {
    const highRiskTime = (distribution[3] || 0) + (distribution[4] || 0);
    const mediumRiskTime = (distribution[2] || 0);
    if (highRiskTime > 0) return `The analysis shows the worker spends ${highRiskTime.toFixed(1)}% of their time in high-risk postures. Without corrective measures, these may lead to long-term musculoskeletal disorders.`;
    if (mediumRiskTime > 0) return `Since ${((distribution[1] || 0)).toFixed(1)}% of time is spent in low-risk postures and only ${mediumRiskTime.toFixed(1)}% in medium risk, overall ergonomics are satisfactory. However, long-term exposure to certain postures may still lead to discomfort if not addressed.`;
    return "The task consists of low-risk postures, and no immediate ergonomic concerns were identified.";
}

function getPostureText(part, code) {
    return postureOptions[part]?.find(opt => opt.code === code)?.text || 'Unknown';
}


// --- PDF STYLING & DRAWING HELPERS ---

function addSectionTitle(doc, title, y) {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFontSize(14).setFont(undefined, 'bold');
    doc.text(title, 14, y);
    return y + 8;
}

function addFooter(doc) {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(9).setTextColor(150).setFont(undefined, 'normal');
        doc.text('MTP PROJECT: OWAS Method Software', 105, pageHeight - 15, { align: 'center' });
        doc.text('DEVELOPED BY NISHANT PANDEY UNDER THE GUIDANCE OF Dr. Priyabarat Pradhan', 105, pageHeight - 10, { align: 'center' });
    }
}

async function addChartsToPdf(doc, title, chartData, y) {
    if (!chartData.riskDist || Object.values(chartData.riskDist).reduce((a, b) => a + b, 0) === 0) return y;
    y = addSectionTitle(doc, title, y);
    if (y > 190) { doc.addPage(); y = 20; y = addSectionTitle(doc, title, y); }
    const chartColors = { pie: ['#2ecc71', '#f1c40f', '#e67e22', '#e74c3c'], bar: ['#3498db', '#9b59b6', '#2ecc71', '#34495e'] };
    const pieDataValues = Object.values(chartData.riskDist).filter(v => v > 0);
    const pieDataLabels = Object.keys(chartData.riskDist).filter(k => chartData.riskDist[k] > 0).map(k => `Category ${k}`);
    const pieImage = await createChartImage(250, 250, 'pie', pieDataLabels, pieDataValues, 'Risk Category Distribution (%)', chartColors.pie);
    doc.addImage(pieImage, 'PNG', 14, y, 80, 80);
    if (chartData.bodyPartRisk && Object.keys(chartData.bodyPartRisk).length > 0) {
        const barDataValues = Object.values(chartData.bodyPartRisk);
        const barDataLabels = Object.keys(chartData.bodyPartRisk).map(p => p.charAt(0).toUpperCase() + p.slice(1));
        const barImage = await createChartImage(500, 250, 'bar', barDataLabels, barDataValues, 'Weighted Risk Score by Body Part', chartColors.bar);
        doc.addImage(barImage, 'PNG', 105, y, 90, 45);
    }
    return y + 90;
}

function addSnapshotsSection(doc, title, snapshots, y) {
    if (!snapshots || snapshots.length === 0) {
        return y;
    }

    y = addSectionTitle(doc, title, y);
    
    const snapshotWidth = 85;
    const snapshotHeight = 48; // Maintain 16:9 aspect ratio
    const captionHeight = 10;
    const totalBlockHeight = snapshotHeight + captionHeight;
    const xPositions = [14, 110];
    let currentXIndex = 0;

    snapshots.forEach((snapshot) => {
        if (y + totalBlockHeight > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            y = 20;
            y = addSectionTitle(doc, title + " (Continued)", y);
        }
        
        const x = xPositions[currentXIndex];
        try {
            if (snapshot.image && snapshot.image.startsWith('data:image/jpeg;base64,')) {
                doc.addImage(snapshot.image, 'JPEG', x, y, snapshotWidth, snapshotHeight);
                doc.setFontSize(9).setFont(undefined, 'normal');
                doc.text(`Posture: ${snapshot.code} (${snapshot.text})`, x, y + snapshotHeight + 5);
            } else {
                throw new Error("Invalid base64 string");
            }
        } catch (e) {
            console.error(`Failed to add image for posture ${snapshot.code}:`, e);
            doc.setDrawColor(255, 0, 0); // Red border
            doc.rect(x, y, snapshotWidth, snapshotHeight);
            doc.setFontSize(9).setFont(undefined, 'italic').setTextColor(255, 0, 0);
            doc.text(`Error: Invalid image data for posture ${snapshot.code}`, x + 5, y + (snapshotHeight / 2));
            doc.setTextColor(0, 0, 0); // Reset text color
        }

        if (currentXIndex === 1) {
            y += totalBlockHeight;
            currentXIndex = 0;
        } else {
            currentXIndex = 1;
        }
    });

    if (currentXIndex === 1) {
        y += totalBlockHeight;
    }
    return y;
}

async function createChartImage(width, height, type, labels, data, title, colors) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const chart = new Chart(canvas.getContext('2d'), {
        type: type,
        data: {
            labels: labels,
            datasets: [{ data: data, backgroundColor: colors, borderColor: '#fff', borderWidth: type === 'pie' ? 2 : 0 }]
        },
        options: {
            responsive: false, animation: { duration: 0 },
            plugins: { legend: { position: 'right', display: type === 'pie' }, title: { display: true, text: title, font: { size: 14 } } },
            scales: type === 'bar'
    ? {
        y: {
            beginAtZero: true,
            // --- UPDATED --- Set max to 10 to match the new 0-10 Strain Score system
            max: 10
        }
    }
    : {}

        }
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    const image = chart.toBase64Image();
    chart.destroy();
    return image;
}