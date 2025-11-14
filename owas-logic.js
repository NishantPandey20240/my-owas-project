// // This file contains the pure calculation logic for determining OWAS codes from MediaPipe landmarks.
// // IMPROVED VERSION: This version includes more robust logic for Back, Arm, and Leg posture detection.

// /**
//  * Calculates the angle between three 2D points.
//  * @param {object} a - The first landmark (e.g., shoulder).
//  * @param {object} b - The second landmark (the vertex, e.g., hip).
//  * @param {object} c - The third landmark (e.g., knee).
//  * @returns {number} The calculated angle in degrees.
//  */
// function calculateAngle(a, b, c) {
//     // If any landmark is missing or has low visibility, return 0 to avoid errors.
//     if (!a || !b || !c || a.visibility < 0.6 || b.visibility < 0.6 || c.visibility < 0.6) return 0;
    
//     // Calculate angle using atan2 for better quadrant handling, then convert to degrees.
//     const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
//     let angle = Math.abs(radians * 180.0 / Math.PI);
    
//     // Ensure the angle is always the smaller one (e.g., 170 instead of 190).
//     return angle > 180.0 ? 360 - angle : angle;
// }

// /**
//  * Determines the 3-digit OWAS code (Back, Arms, Legs) from MediaPipe landmarks.
//  * This version uses improved logic for higher accuracy in Back and Arm detection.
//  * @param {Array<object>} landmarks - The array of pose landmarks from MediaPipe.
//  * @returns {object|null} An object with back, arms, and legs codes, or null if detection fails.
//  */
// export function getOwasCodesFromLandmarks(landmarks) {
//     if (!landmarks) return null;
//     const lm = window.POSE_LANDMARKS;
//     if (!lm) return null; // Safety check

//     // Get all necessary landmarks from the landmarks array
//     const shoulder_l = landmarks[lm.LEFT_SHOULDER];
//     const shoulder_r = landmarks[lm.RIGHT_SHOULDER];
//     const hip_l = landmarks[lm.LEFT_HIP];
//     const hip_r = landmarks[lm.RIGHT_HIP];
//     const knee_l = landmarks[lm.LEFT_KNEE];
//     const knee_r = landmarks[lm.RIGHT_KNEE];
//     const elbow_l = landmarks[lm.LEFT_ELBOW];
//     const elbow_r = landmarks[lm.RIGHT_ELBOW];
//     const wrist_l = landmarks[lm.LEFT_WRIST];
//     const wrist_r = landmarks[lm.RIGHT_WRIST];
//     const ankle_l = landmarks[lm.LEFT_ANKLE];
//     const ankle_r = landmarks[lm.RIGHT_ANKLE];

//     // Default OWAS codes
//     let back_code = 1, arms_code = 1;

//     // --- Back Logic ---
//     let is_bent = false, is_twisted = false;

//     // --- 1. Bending Logic (IMPROVED to differentiate sitting from bending) ---
//     let is_sitting_back_check = false;
//     const knee_angle_l_for_sitting = calculateAngle(hip_l, knee_l, ankle_l);
//     const knee_angle_r_for_sitting = calculateAngle(hip_r, knee_r, ankle_r);
    
//     // ***FIXED: Renamed variable to avoid conflict with Legs Logic***
//     const valid_knee_angles_for_back = [knee_angle_l_for_sitting, knee_angle_r_for_sitting].filter(function(angle) { return angle > 0; });

//     if (valid_knee_angles_for_back.length > 0) {
//         const avg_knee_angle = valid_knee_angles_for_back.reduce(function(a, b) { return a + b; }, 0) / valid_knee_angles_for_back.length;
//         if (avg_knee_angle < 135) {
//             is_sitting_back_check = true;
//         }
//     }

//     if (is_sitting_back_check) {
//         const shoulder_mid_x = (shoulder_l.x + shoulder_r.x) / 2;
//         const hip_mid_x = (hip_l.x + hip_r.x) / 2;
//         const torso_height = Math.abs(((shoulder_l.y + shoulder_r.y) / 2) - ((hip_l.y + hip_r.y) / 2));
//         if (torso_height > 0 && Math.abs(shoulder_mid_x - hip_mid_x) > (torso_height * 0.30)) {
//             is_bent = true;
//         }
//     } else {
//         const torso_angle_l = calculateAngle(shoulder_l, hip_l, knee_l);
//         const torso_angle_r = calculateAngle(shoulder_r, hip_r, knee_r);
//         const valid_torso_angles = [torso_angle_l, torso_angle_r].filter(function(angle) { return angle > 0; });

//         if (valid_torso_angles.length > 0) {
//             const avg_torso_angle = valid_torso_angles.reduce(function(a, b) { return a + b; }, 0) / valid_torso_angles.length;
//             if (avg_torso_angle < 160) {
//                 is_bent = true;
//             }
//         }
//     }

//     // --- 2. Twisting Logic ---
//     const shoulder_angle_h = Math.atan2(shoulder_r.y - shoulder_l.y, shoulder_r.x - shoulder_l.x) * 180 / Math.PI;
//     const hip_angle_h = Math.atan2(hip_r.y - hip_l.y, hip_r.x - hip_l.x) * 180 / Math.PI;
//     let twist_angle_diff = Math.abs(shoulder_angle_h - hip_angle_h);
//     if (twist_angle_diff > 180) twist_angle_diff = 360 - twist_angle_diff;
//     const has_torsion = twist_angle_diff > 25;

//     const shoulder_mid_x_twist = (shoulder_l.x + shoulder_r.x) / 2;
//     const hip_mid_x_twist = (hip_l.x + hip_r.x) / 2;
//     const shoulder_mid_y_twist = (shoulder_l.y + shoulder_r.y) / 2;
//     const hip_mid_y_for_height_twist = (hip_l.y + hip_r.y) / 2;
//     const horizontal_offset_twist = Math.abs(shoulder_mid_x_twist - hip_mid_x_twist);
//     const vertical_height_twist = Math.abs(shoulder_mid_y_twist - hip_mid_y_for_height_twist);
//     const lateral_bend_ratio = vertical_height_twist > 0 ? horizontal_offset_twist / vertical_height_twist : 0;
//     const has_lateral_bend = lateral_bend_ratio > 0.20;

//     if(has_torsion || has_lateral_bend) {
//         is_twisted = true;
//     }

//     // --- 3. Final Back Code Assignment ---
//     if (is_bent && is_twisted) back_code = 4;
//     else if (is_bent) back_code = 2;
//     else if (is_twisted) back_code = 3;

//     // --- Arms Logic ---
//     if (shoulder_l && shoulder_r && elbow_l && elbow_r && wrist_l && wrist_r) {
//         const left_arm_above = (elbow_l.y < shoulder_l.y) || (wrist_l.y < shoulder_l.y);
//         const right_arm_above = (elbow_r.y < shoulder_r.y) || (wrist_r.y < shoulder_r.y);
//         if (left_arm_above && right_arm_above) arms_code = 3;
//         else if (left_arm_above || right_arm_above) arms_code = 2;
//     }





// // ====================================================================
//     // --- IMPROVED LEGS LOGIC (Differentiates Floor Sitting vs Kneeling) ---
//     // ====================================================================

//     let legs_code = 7; // Default fallback

//     // 1. Calculate Kinematic Parameters
//     const THETA_STRAIGHT = 150;
//     const ALPHA_SIT_THRESHOLD = 30;
//     const R_FLOOR_THRESHOLD = 0.1;      // For knees
//     const R_HIP_FLOOR_THRESHOLD = 0.2;  // NEW: For hips (slightly larger margin)
//     const R_BALANCE_THRESHOLD = 0.15;
//     const ANKLE_LIFT_THRESHOLD = 0.07;

//     // Helper to get thigh inclination angle (alpha)
//     function getThighInclination(hip, knee) {
//         if (!hip || !knee) return 90;
//         const dy = Math.abs(hip.y - knee.y);
//         const len = Math.sqrt(Math.pow(knee.x - hip.x, 2) + Math.pow(knee.y - hip.y, 2));
//         return (Math.asin(dy / len) * 180 / Math.PI) || 90;
//     }

//     // Calculate angles
//     const theta_L = calculateAngle(hip_l, knee_l, ankle_l);
//     const theta_R = calculateAngle(hip_r, knee_r, ankle_r);
//     const alpha_L = getThighInclination(hip_l, knee_l);
//     const alpha_R = getThighInclination(hip_r, knee_r);

//     // --- Floor Proximity Checks ---
//     const floor_y = Math.max(ankle_l.y, ankle_r.y);
//     // Knee distance from floor
//     const r_floor_knee_L = Math.abs(floor_y - knee_l.y);
//     const r_floor_knee_R = Math.abs(floor_y - knee_r.y);
//     // NEW: Hip distance from floor
//     const r_floor_hip_L = Math.abs(floor_y - hip_l.y);
//     const r_floor_hip_R = Math.abs(floor_y - hip_r.y);

//     // Other metrics
//     const cog_x = (hip_l.x + hip_r.x) / 2;
//     const bos_center_x = (ankle_l.x + ankle_r.x) / 2;
//     const r_balance = Math.abs(cog_x - bos_center_x);
//     const is_shin_L_vertical = Math.abs(knee_l.x - ankle_l.x) < 0.05;
//     const is_shin_R_vertical = Math.abs(knee_r.x - ankle_r.x) < 0.05;
//     const ankle_diff_y = Math.abs(ankle_l.y - ankle_r.y);

//     // --- HIERARCHICAL DECISION TREE ---

//     // Priority 1: Check FLOOR SITTING first (Hips are near floor)
//     if (r_floor_hip_L < R_HIP_FLOOR_THRESHOLD && r_floor_hip_R < R_HIP_FLOOR_THRESHOLD) {
//         legs_code = 1; // Sitting on floor
//     }
//     // Priority 2: Check KNEELING (Code 6) - Knees down, but hips are UP
//     else if (r_floor_knee_L < R_FLOOR_THRESHOLD || r_floor_knee_R < R_FLOOR_THRESHOLD) {
//         legs_code = 6;
//     }
//     // Priority 3: Check STANDING ON ONE LEG (Code 3)
//     else if (ankle_diff_y > ANKLE_LIFT_THRESHOLD) {
//         legs_code = 3;
//     }
//     // Priority 4: Check CHAIR SITTING vs DEEP SQUAT
//     else if (alpha_L < ALPHA_SIT_THRESHOLD && alpha_R < ALPHA_SIT_THRESHOLD) {
//         if (is_shin_L_vertical && is_shin_R_vertical) {
//             legs_code = 1; // Sitting (on chair)
//         } else {
//             legs_code = 4; // Deep squatting
//         }
//     }
//     // Priority 5: REMAINING STANDING (Codes 2, 4, 5)
//     else {
//         const is_L_Straight = theta_L > THETA_STRAIGHT;
//         const is_R_Straight = theta_R > THETA_STRAIGHT;

//         if (is_L_Straight && is_R_Straight) {
//              legs_code = 2; // Standing straight
//         } else {
//              if (r_balance < R_BALANCE_THRESHOLD) {
//                  legs_code = 4; // Balanced bent
//              } else {
//                  legs_code = 5; // Unbalanced bent
//              }
//         }
//     }

//     // Walking override (Optional)
//     const ankle_dist_x = Math.abs(ankle_l.x - ankle_r.x);
//     if (ankle_dist_x > 0.2 && ankle_diff_y > 0.05) {
//          legs_code = 7;
//     }

//     return { back: back_code, arms: arms_code, legs: legs_code };
// }



// this above logic is angle based techanically sound use this above one 










// This file contains the pure calculation logic for determining OWAS codes from MediaPipe landmarks.
// IMPROVED VERSION: This version includes more robust logic for Back, Arm, and Leg posture detection.

/**
 * Calculates the angle between three 2D points.
 * @param {object} a - The first landmark (e.g., shoulder).
 * @param {object} b - The second landmark (the vertex, e.g., hip).
 * @param {object} c - The third landmark (e.g., knee).
 * @returns {number} The calculated angle in degrees.
 */
function calculateAngle(a, b, c) {
    // If any landmark is missing or has low visibility, return 0 to avoid errors.
    if (!a || !b || !c || a.visibility < 0.6 || b.visibility < 0.6 || c.visibility < 0.6) return 0;
    
    // Calculate angle using atan2 for better quadrant handling, then convert to degrees.
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    
    // Ensure the angle is always the smaller one (e.g., 170 instead of 190).
    return angle > 180.0 ? 360 - angle : angle;
}

/**
 * Determines the 3-digit OWAS code (Back, Arms, Legs) from MediaPipe landmarks.
 * This version uses improved logic for higher accuracy in Back and Arm detection.
 * @param {Array<object>} landmarks - The array of pose landmarks from MediaPipe.
 * @returns {object|null} An object with back, arms, and legs codes, or null if detection fails.
 */
export function getOwasCodesFromLandmarks(landmarks) {
    if (!landmarks) return null;
    const lm = window.POSE_LANDMARKS;
    if (!lm) return null; // Safety check

    // Get all necessary landmarks from the landmarks array
    const shoulder_l = landmarks[lm.LEFT_SHOULDER];
    const shoulder_r = landmarks[lm.RIGHT_SHOULDER];
    const hip_l = landmarks[lm.LEFT_HIP];
    const hip_r = landmarks[lm.RIGHT_HIP];
    const knee_l = landmarks[lm.LEFT_KNEE];
    const knee_r = landmarks[lm.RIGHT_KNEE];
    const elbow_l = landmarks[lm.LEFT_ELBOW];
    const elbow_r = landmarks[lm.RIGHT_ELBOW];
    const wrist_l = landmarks[lm.LEFT_WRIST];
    const wrist_r = landmarks[lm.RIGHT_WRIST];
    const ankle_l = landmarks[lm.LEFT_ANKLE];
    const ankle_r = landmarks[lm.RIGHT_ANKLE];

    // Default OWAS codes
    let back_code = 1, arms_code = 1;

    // --- Back Logic ---
    let is_bent = false, is_twisted = false;

    // --- 1. Bending Logic (IMPROVED to differentiate sitting from bending) ---
    let is_sitting_back_check = false;
    const knee_angle_l_for_sitting = calculateAngle(hip_l, knee_l, ankle_l);
    const knee_angle_r_for_sitting = calculateAngle(hip_r, knee_r, ankle_r);
    
    // ***FIXED: Renamed variable to avoid conflict with Legs Logic***
    const valid_knee_angles_for_back = [knee_angle_l_for_sitting, knee_angle_r_for_sitting].filter(function(angle) { return angle > 0; });

    if (valid_knee_angles_for_back.length > 0) {
        const avg_knee_angle = valid_knee_angles_for_back.reduce(function(a, b) { return a + b; }, 0) / valid_knee_angles_for_back.length;
        if (avg_knee_angle < 135) {
            is_sitting_back_check = true;
        }
    }

    if (is_sitting_back_check) {
        const shoulder_mid_x = (shoulder_l.x + shoulder_r.x) / 2;
        const hip_mid_x = (hip_l.x + hip_r.x) / 2;
        const torso_height = Math.abs(((shoulder_l.y + shoulder_r.y) / 2) - ((hip_l.y + hip_r.y) / 2));
        if (torso_height > 0 && Math.abs(shoulder_mid_x - hip_mid_x) > (torso_height * 0.30)) {
            is_bent = true;
        }
    } else {
        const torso_angle_l = calculateAngle(shoulder_l, hip_l, knee_l);
        const torso_angle_r = calculateAngle(shoulder_r, hip_r, knee_r);
        const valid_torso_angles = [torso_angle_l, torso_angle_r].filter(function(angle) { return angle > 0; });

        if (valid_torso_angles.length > 0) {
            const avg_torso_angle = valid_torso_angles.reduce(function(a, b) { return a + b; }, 0) / valid_torso_angles.length;
            if (avg_torso_angle < 160) {
                is_bent = true;
            }
        }
    }

    // --- 2. Twisting Logic ---
    const shoulder_angle_h = Math.atan2(shoulder_r.y - shoulder_l.y, shoulder_r.x - shoulder_l.x) * 180 / Math.PI;
    const hip_angle_h = Math.atan2(hip_r.y - hip_l.y, hip_r.x - hip_l.x) * 180 / Math.PI;
    let twist_angle_diff = Math.abs(shoulder_angle_h - hip_angle_h);
    if (twist_angle_diff > 180) twist_angle_diff = 360 - twist_angle_diff;
    const has_torsion = twist_angle_diff > 25;

    const shoulder_mid_x_twist = (shoulder_l.x + shoulder_r.x) / 2;
    const hip_mid_x_twist = (hip_l.x + hip_r.x) / 2;
    const shoulder_mid_y_twist = (shoulder_l.y + shoulder_r.y) / 2;
    const hip_mid_y_for_height_twist = (hip_l.y + hip_r.y) / 2;
    const horizontal_offset_twist = Math.abs(shoulder_mid_x_twist - hip_mid_x_twist);
    const vertical_height_twist = Math.abs(shoulder_mid_y_twist - hip_mid_y_for_height_twist);
    const lateral_bend_ratio = vertical_height_twist > 0 ? horizontal_offset_twist / vertical_height_twist : 0;
    const has_lateral_bend = lateral_bend_ratio > 0.20;

    if(has_torsion || has_lateral_bend) {
        is_twisted = true;
    }

    // --- 3. Final Back Code Assignment ---
    if (is_bent && is_twisted) back_code = 4;
    else if (is_bent) back_code = 2;
    else if (is_twisted) back_code = 3;

    // --- Arms Logic ---
    if (shoulder_l && shoulder_r && elbow_l && elbow_r && wrist_l && wrist_r) {
        const left_arm_above = (elbow_l.y < shoulder_l.y) || (wrist_l.y < shoulder_l.y);
        const right_arm_above = (elbow_r.y < shoulder_r.y) || (wrist_r.y < shoulder_r.y);
        if (left_arm_above && right_arm_above) arms_code = 3;
        else if (left_arm_above || right_arm_above) arms_code = 2;
    }










// ====================================================================
// --- IMPROVED LEGS LOGIC (Differentiates Floor Sitting vs Kneeling) ---
// ====================================================================

// ====================================================================
// --- FULL UPDATED LEGS LOGIC (Kneeling + Squat Fix) ---
// ====================================================================

// let legs_code = 7; // Default fallback

// // 1. Calculate Kinematic Parameters
// const THETA_STRAIGHT = 150;
// const THETA_KNEEL = 70;          // For sharp knee bend (kneeling)
// const ALPHA_SIT_THRESHOLD = 30;      // For horizontal thigh (sitting/squat)
// const R_FLOOR_THRESHOLD = 0.1;       // For knees on floor
// const R_HIP_FLOOR_THRESHOLD = 0.2;   // For hips on floor
// const R_BALANCE_THRESHOLD = 0.15;
// const ANKLE_LIFT_THRESHOLD = 0.07;
// const VISIBILITY_THRESHOLD = 0.5;    // For checking "hidden" landmarks
// const HIP_SQUAT_THRESHOLD = 0.25;    // Vertical hip-ankle dist for squat vs sit

// // Helper to get thigh inclination angle (alpha)
// function getThighInclination(hip, knee) {
//     if (!hip || !knee) return 90;
//     const dy = Math.abs(hip.y - knee.y);
//     const len = Math.sqrt(Math.pow(knee.x - hip.x, 2) + Math.pow(knee.y - hip.y, 2));
//     if (len === 0) return 90;
//     const ratio = Math.min(1, dy / len); // Ensure ratio is not > 1
//     return (Math.asin(ratio) * 180 / Math.PI) || 90;
// }

// // Calculate angles
// const theta_L = calculateAngle(hip_l, knee_l, ankle_l);
// const theta_R = calculateAngle(hip_r, knee_r, ankle_r);
// const alpha_L = getThighInclination(hip_l, knee_l);
// const alpha_R = getThighInclination(hip_r, knee_r);

// // --- Floor Proximity Checks ---
// const lowest_ankle_y = Math.max(ankle_l.y, ankle_r.y);
// const lowest_knee_y = Math.max(knee_l.y, knee_r.y);
// const floor_y = Math.max(lowest_ankle_y, lowest_knee_y); // Use lowest detected point as "floor"

// // Knee distance from floor
// const r_floor_knee_L = Math.abs(floor_y - knee_l.y);
// const r_floor_knee_R = Math.abs(floor_y - knee_r.y);
// // Hip distance from floor
// const r_floor_hip_L = Math.abs(floor_y - hip_l.y);
// const r_floor_hip_R = Math.abs(floor_y - hip_r.y);

// // --- Visibility & Position Checks ---
// // Check if ankles are hidden (occluded)
// const ankle_L_hidden = (ankle_l.visibility || 1.0) < VISIBILITY_THRESHOLD;
// const ankle_R_hidden = (ankle_r.visibility || 1.0) < VISIBILITY_THRESHOLD;

// // Check if ankles are horizontally *between* the hips
// const hip_min_x = Math.min(hip_l.x, hip_r.x);
// const hip_max_x = Math.max(hip_l.x, hip_r.x);
// const ankle_L_between = (ankle_l.x > (hip_min_x - 0.05)) && (ankle_l.x < (hip_max_x + 0.05));
// const ankle_R_between = (ankle_r.x > (hip_min_x - 0.05)) && (ankle_r.x < (hip_max_x + 0.05));
// const ankles_are_between_hips = (ankle_L_between && ankle_R_between);

// // --- Other metrics ---
// const r_balance = Math.abs(((hip_l.x + hip_r.x) / 2) - ((ankle_l.x + ankle_r.x) / 2));
// const ankle_diff_y = Math.abs(ankle_l.y - ankle_r.y);

// // --- HIERARCHICAL DECISION TREE ---

// // Priority 1: Check KNEELING (Code 6) first.
// const knees_on_floor = (r_floor_knee_L < R_FLOOR_THRESHOLD || r_floor_knee_R < R_FLOOR_THRESHOLD);
// const knees_sharply_bent = (theta_L < THETA_KNEEL && theta_R < THETA_KNEEL);
// const ankles_are_hidden = (ankle_L_hidden && ankle_R_hidden);

// if (knees_on_floor && (knees_sharply_bent || ankles_are_hidden) && ankles_are_between_hips) {
//     legs_code = 6; // Kneeling
// }
// // Priority 2: Check FLOOR SITTING (Code 1) - Hips are near floor
// else if (r_floor_hip_L < R_HIP_FLOOR_THRESHOLD && r_floor_hip_R < R_HIP_FLOOR_THRESHOLD) {
//     legs_code = 1; // Sitting on floor (e.g., cross-legged)
// }
// // Priority 3: Check STANDING ON ONE LEG (Code 3)
// else if (ankle_diff_y > ANKLE_LIFT_THRESHOLD) {
//     legs_code = 3;
// }
// // Priority 4: Check CHAIR SITTING (Code 1) vs DEEP SQUAT (Code 4)
// else if (alpha_L < ALPHA_SIT_THRESHOLD && alpha_R < ALPHA_SIT_THRESHOLD) {
    
//     // NEW LOGIC: Differentiate by Hip Height
//     const avg_hip_y = (hip_l.y + hip_r.y) / 2;
//     const avg_ankle_y = (ankle_l.y + ankle_r.y) / 2;
//     // Vertical distance (assuming Y increases downwards)
//     const hip_ankle_y_dist = Math.abs(avg_hip_y - avg_ankle_y);

//     if (hip_ankle_y_dist < HIP_SQUAT_THRESHOLD) {
//         // Hips are very close to ankles vertically
//         legs_code = 4; // Deep squatting
//     } else {
//         // Hips are significantly higher than ankles
//         legs_code = 1; // Sitting (on chair/stool)
//     }
// }
// // Priority 5: REMAINING STANDING (Codes 2, 4, 5)
// else {
//     const is_L_Straight = theta_L > THETA_STRAIGHT;
//     const is_R_Straight = theta_R > THETA_STRAIGHT;

//     if (is_L_Straight && is_R_Straight) {
//         legs_code = 2; // Standing straight
//     } else {
//         // Note: Code 4 (balanced bent) can be set here *or* in Priority 4
//         if (r_balance < R_BALANCE_THRESHOLD) {
//             legs_code = 4; // Balanced bent (e.g., half-squat)
//         } else {
//             legs_code = 5; // Unbalanced bent
//         }
//     }
// }

// // Walking override (Optional)
// const ankle_dist_x = Math.abs(ankle_l.x - ankle_r.x);
// if (ankle_dist_x > 0.2 && ankle_diff_y > 0.05) {
//     legs_code = 7;
// }

// // This assumes your function returns this at the end
// return { back: back_code, arms: arms_code, legs: legs_code };}













// above logic is very  good this below for testing pupose 




let legs_code = 7; // Default fallback

// 1. Calculate Kinematic Parameters
const THETA_STRAIGHT = 150;
const THETA_KNEEL = 70;          // For sharp knee bend (kneeling)
const ALPHA_SIT_THRESHOLD = 30;      // For horizontal thigh (sitting/squat)
const R_FLOOR_THRESHOLD = 0.1;       // For knees on floor
const R_HIP_FLOOR_THRESHOLD = 0.2;   // For hips on floor
const R_BALANCE_THRESHOLD = 0.15;
const ANKLE_LIFT_THRESHOLD = 0.07;
const VISIBILITY_THRESHOLD = 0.5;    // For checking "hidden" landmarks
const HIP_SQUAT_THRESHOLD = 0.25;    // Vertical hip-ankle dist for squat vs sit

// Helper to get thigh inclination angle (alpha)
function getThighInclination(hip, knee) {
    if (!hip || !knee) return 90;
    const dy = Math.abs(hip.y - knee.y);
    const len = Math.sqrt(Math.pow(knee.x - hip.x, 2) + Math.pow(knee.y - hip.y, 2));
    if (len === 0) return 90;
    const ratio = Math.min(1, dy / len); // Ensure ratio is not > 1
    return (Math.asin(ratio) * 180 / Math.PI) || 90;
}

// Calculate angles
const theta_L = calculateAngle(hip_l, knee_l, ankle_l);
const theta_R = calculateAngle(hip_r, knee_r, ankle_r);
const alpha_L = getThighInclination(hip_l, knee_l);
const alpha_R = getThighInclination(hip_r, knee_r);

// --- Floor Proximity Checks ---
const lowest_ankle_y = Math.max(ankle_l.y, ankle_r.y);
const lowest_knee_y = Math.max(knee_l.y, knee_r.y);
const floor_y = Math.max(lowest_ankle_y, lowest_knee_y); // Use lowest detected point as "floor"

// Knee distance from floor
const r_floor_knee_L = Math.abs(floor_y - knee_l.y);
const r_floor_knee_R = Math.abs(floor_y - knee_r.y);
// Hip distance from floor
const r_floor_hip_L = Math.abs(floor_y - hip_l.y);
const r_floor_hip_R = Math.abs(floor_y - hip_r.y);

// --- Visibility & Position Checks ---
// Check if ankles are hidden (occluded)
const ankle_L_hidden = (ankle_l.visibility || 1.0) < VISIBILITY_THRESHOLD;
const ankle_R_hidden = (ankle_r.visibility || 1.0) < VISIBILITY_THRESHOLD;

// Check if ankles are horizontally *between* the hips
const hip_min_x = Math.min(hip_l.x, hip_r.x);
const hip_max_x = Math.max(hip_l.x, hip_r.x);
const ankle_L_between = (ankle_l.x > (hip_min_x - 0.05)) && (ankle_l.x < (hip_max_x + 0.05));
const ankle_R_between = (ankle_r.x > (hip_min_x - 0.05)) && (ankle_r.x < (hip_max_x + 0.05));
const ankles_are_between_hips = (ankle_L_between && ankle_R_between);

// --- Other metrics ---
const r_balance = Math.abs(((hip_l.x + hip_r.x) / 2) - ((ankle_l.x + ankle_r.x) / 2));
const ankle_diff_y = Math.abs(ankle_l.y - ankle_r.y);

// --- HIERARCHICAL DECISION TREE ---

// Priority 1: Check KNEELING (Code 6) first.
const knees_on_floor = (r_floor_knee_L < R_FLOOR_THRESHOLD || r_floor_knee_R < R_FLOOR_THRESHOLD);
const knees_sharply_bent = (theta_L < THETA_KNEEL && theta_R < THETA_KNEEL);
const ankles_are_hidden = (ankle_L_hidden && ankle_R_hidden);

if (knees_on_floor && (knees_sharply_bent || ankles_are_hidden) && ankles_are_between_hips) {
    legs_code = 6; // Kneeling
}
// Priority 2: Check FLOOR SITTING (Code 1) - Hips are near floor
else if (r_floor_hip_L < R_HIP_FLOOR_THRESHOLD && r_floor_hip_R < R_HIP_FLOOR_THRESHOLD) {
    legs_code = 1; // Sitting on floor (e.g., cross-legged)
}




// ... (Priority 1 aur 2 waise hi rahenge) ...

// ... (Priority 1 aur 2 waise hi rahenge) ...

// Priority 3: Check CHAIR SITTING (Code 1) vs DEEP SQUAT (Code 4)
// (Isko pehle nikaal dena sahi hai)
else if (alpha_L < ALPHA_SIT_THRESHOLD && alpha_R < ALPHA_SIT_THRESHOLD) {
    
    const avg_hip_y = (hip_l.y + hip_r.y) / 2;
    const avg_ankle_y = (ankle_l.y + ankle_r.y) / 2;
    const hip_ankle_y_dist = Math.abs(avg_hip_y - avg_ankle_y);

    if (hip_ankle_y_dist < HIP_SQUAT_THRESHOLD) {
        legs_code = 4; // Deep squatting
    } else {
        legs_code = 1; // Sitting (on chair/stool)
    }
}
// Priority 4 & 5: (NEW CORRECTED LOGIC) Check all other STANDING poses (2, 3, 4, 5)
else {
    // Is point par humein pata hai ki hum 'standing' state mein hain

    // *** YEH HAI FIX ***
    // Pehle check karo ONE leg vs TWO leg
    const ankle_offset_exists = (ankle_diff_y > ANKLE_LIFT_THRESHOLD);
    
    const is_L_Straight = theta_L > THETA_STRAIGHT;
    const is_R_Straight = theta_R > THETA_STRAIGHT;

    if (ankle_offset_exists) {
        // --- PATH 1: ONE LEG IS LIFTED ---
        // Yeh Code 3 ya Code 5 hi ho sakta hai.
        
        // Check karo ki supporting leg (jo zameen par hai) straight hai ya bent.
        // Supporting leg woh hai jiska 'y' coordinate BADA (neeche) hai.
        let supporting_leg_is_bent = false;
        if (ankle_l.y > ankle_r.y) {
            // Left leg support kar raha hai
            supporting_leg_is_bent = !is_L_Straight;
        } else {
            // Right leg support kar raha hai
            supporting_leg_is_bent = !is_R_Straight;
        }

        if (supporting_leg_is_bent) {
            legs_code = 5; // "Squatting on one BENT leg"
        } else {
            legs_code = 3; // "Standing on one leg (straight)"
        }

    } else {
        // --- PATH 2: BOTH LEGS ON GROUND ---
        // Yeh Code 2, 4, ya 5 ho sakta hai.

        if (is_L_Straight && is_R_Straight) {
            // Dono pair zameen par + dono straight
            legs_code = 2; // Standing Straight
        } else {
            // Dono pair zameen par + kam se kam ek bent
            // Balance check karo
            if (r_balance < R_BALANCE_THRESHOLD) {
                legs_code = 4; // Balanced Bent
            } else {
                legs_code = 5; // Unbalanced Bent
            }
        }
    }
}

// Walking override (Optional)
// ... (yeh waise hi rahega) ...
// Walking override (Optional)
const ankle_dist_x = Math.abs(ankle_l.x - ankle_r.x);
if (ankle_dist_x > 0.2 && ankle_diff_y > 0.05) {
    legs_code = 7;
}

// This assumes your function returns this at the end
return { back: back_code, arms: arms_code, legs: legs_code };}

