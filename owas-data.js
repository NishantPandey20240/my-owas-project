// This file contains all the static data and lookup tables for the OWAS method.

export const owasProcessSteps = [
    { id: 1, title: 'Task Selection', description: 'Select a work task. Determine if it\'s a simple, repetitive task or a multi-phase task with varied postures.' },
    { id: 2, title: 'Define Observation Strategy', description: 'Set observation duration (20-40 mins) and sampling frequency (e.g., every 30-60 seconds) to capture representative work.' },
    { id: 3, title: 'Observe and Collect Data', description: 'At each interval, record the worker\'s posture for back, arms, legs, and load. Use photos/videos for verification.' },
    { id: 4, title: 'Posture Coding', description: 'Assign a numerical code to each body part (Back: 1-4, Arms: 1-3, Legs: 1-7, Load: 1-3) to create a 4-digit code.' },
    { id: 5, title: 'Assign Risk Category', description: 'Use the 4-digit code and an OWAS table to assign a Risk Category (1-4) to each observed posture.' },
    { id: 6, title: 'Calculate Frequency', description: 'Count observations of each posture and calculate the percentage distribution for each body part\'s position (e.g., back bent 30% of time).' },
    { id: 7, title: 'Evaluate Body Part Risk', description: 'Use frequency data to evaluate the ergonomic load on specific body parts and identify those under most stress.' },
    { id: 8, title: 'Create Task Risk Profile', description: 'Summarize all findings in a report, highlighting high-risk postures and the most stressed body parts.' },
    { id: 9, title: 'Recommend Corrective Actions', description: 'Develop recommendations for redesign, such as engineering controls, administrative changes, or new work practices.' },
    { id: 10, title: 'Re-evaluate After Changes', description: 'After implementing changes, repeat the entire OWAS analysis to confirm that ergonomic risk has been effectively reduced.' },
];

export const postureOptions = {
    back: [
        { code: 1, text: 'Straight' }, { code: 2, text: 'Bent' }, { code: 3, text: 'Twisted' }, { code: 4, text: 'Bent & Twisted' },
    ],
    arms: [
        { code: 1, text: 'Both arms below shoulder' }, { code: 2, text: 'One arm at or above shoulder' }, { code: 3, text: 'Both arms at or above shoulder' },
    ],
    legs: [
        { code: 1, text: 'Sitting' }, { code: 2, text: 'Standing on two straight legs' }, { code: 3, text: 'Standing on one straight leg' }, { code: 4, text: 'Standing/squatting on two bent legs' }, { code: 5, text: 'Standing/squatting on one bent leg' }, { code: 6, text: 'Kneeling' }, { code: 7, text: 'Walking or moving' },
    ],
    load: [
        { code: 1, text: 'Load < 10 kg' }, { code: 2, text: '10 kg <= Load < 20 kg' }, { code: 3, text: 'Load >= 20 kg' },
    ]
};

export const riskCategories = {
    1: { text: 'Low Risk', description: 'No action required.' },
    2: { text: 'Medium Risk', description: 'Corrective actions required soon.' },
    3: { text: 'High Risk', description: 'Corrective actions required as soon as possible.' },
    4: { text: 'Very High Risk', description: 'Immediate corrective actions required.' }
};

export const riskLookupTable = { "1111": 1, "1112": 1, "1113": 1, "1121": 1, "1122": 1, "1123": 1, "1131": 1, "1132": 1, "1133": 1, "1141": 1, "1142": 1, "1143": 1, "1151": 1, "1152": 1, "1153": 1, "1161": 1, "1162": 1, "1163": 1, "1171": 1, "1172": 1, "1173": 1, "1211": 1, "1212": 1, "1213": 1, "1221": 1, "1222": 1, "1223": 1, "1231": 1, "1232": 1, "1233": 1, "1241": 1, "1242": 1, "1243": 1, "1251": 1, "1252": 1, "1253": 1, "1261": 1, "1262": 1, "1263": 1, "1271": 1, "1272": 1, "1273": 1, "1311": 1, "1312": 1, "1313": 1, "1321": 1, "1322": 1, "1323": 1, "1331": 1, "1332": 1, "1333": 1, "1341": 2, "1342": 2, "1343": 2, "1351": 2, "1352": 2, "1353": 2, "1361": 1, "1362": 1, "1363": 1, "1371": 1, "1372": 1, "1373": 1, "2111": 1, "2112": 1, "2113": 1, "2121": 1, "2122": 1, "2123": 1, "2131": 1, "2132": 1, "2133": 1, "2141": 2, "2142": 2, "2143": 2, "2151": 2, "2152": 2, "2153": 2, "2161": 1, "2162": 1, "2163": 1, "2171": 1, "2172": 1, "2173": 1, "2211": 2, "2212": 2, "2213": 2, "2221": 2, "2222": 2, "2223": 2, "2231": 2, "2232": 2, "2233": 2, "2241": 4, "2242": 4, "2243": 4, "2251": 4, "2252": 4, "2253": 4, "2261": 4, "2262": 4, "2263": 4, "2271": 2, "2272": 2, "2273": 2, "2311": 2, "2312": 2, "2313": 2, "2321": 2, "2322": 2, "2323": 2, "2331": 2, "2332": 2, "2333": 2, "2341": 4, "2342": 4, "2343": 4, "2351": 4, "2352": 4, "2353": 4, "2361": 4, "2362": 4, "2363": 4, "2371": 2, "2372": 2, "2373": 2, "3111": 1, "3112": 1, "3113": 1, "3121": 1, "3122": 1, "3123": 1, "3131": 1, "3132": 1, "3133": 1, "3141": 2, "3142": 2, "3143": 2, "3151": 2, "3152": 2, "3153": 2, "3161": 1, "3162": 1, "3163": 1, "3171": 1, "3172": 1, "3173": 1, "3211": 2, "3212": 2, "3213": 2, "3221": 2, "3222": 2, "3223": 2, "3231": 2, "3232": 2, "3233": 2, "3241": 4, "3242": 4, "3243": 4, "3251": 4, "3252": 4, "3253": 4, "3261": 2, "3262": 2, "3263": 2, "3271": 2, "3272": 2, "3273": 2, "3311": 2, "3312": 2, "3313": 2, "3321": 2, "3322": 2, "3323": 2, "3331": 2, "3332": 2, "3333": 2, "3341": 4, "3342": 4, "3343": 4, "3351": 4, "3352": 4, "3353": 4, "3361": 2, "3362": 2, "3363": 2, "3371": 2, "3372": 2, "3373": 2, "4111": 3, "4112": 3, "4113": 3, "4121": 3, "4122": 3, "4123": 3, "4131": 3, "4132": 3, "4133": 3, "4141": 4, "4142": 4, "4143": 4, "4151": 4, "4152": 4, "4153": 4, "4161": 3, "4162": 3, "4163": 3, "4171": 3, "4172": 3, "4173": 3, "4211": 3, "4212": 3, "4213": 3, "4221": 3, "4222": 3, "4223": 3, "4231": 3, "4232": 3, "4233": 3, "4241": 4, "4242": 4, "4243": 4, "4251": 4, "4252": 4, "4253": 4, "4261": 3, "4262": 3, "4263": 3, "4271": 3, "4272": 3, "4273": 3, "4311": 3, "4312": 3, "4313": 3, "4321": 3, "4322": 3, "4323": 3, "4331": 3, "4332": 3, "4333": 3, "4341": 4, "4342": 4, "4343": 4, "4351": 4, "4352": 4, "4353": 4, "4361": 3, "4362": 3, "4363": 3, "4371": 3, "4372": 3, "4373": 3 };

//  {
//     back_2: [{ threshold: 80, risk: 4 }, { threshold: 50, risk: 3 }, { threshold: 20, risk: 2 }],
//     back_3: [{ threshold: 80, risk: 4 }, { threshold: 50, risk: 3 }, { threshold: 20, risk: 2 }],
//     back_4: [{ threshold: 50, risk: 4 }, { threshold: 20, risk: 3 }],
//     arms_2: [{ threshold: 50, risk: 3 }, { threshold: 20, risk: 2 }],
//     arms_3: [{ threshold: 50, risk: 3 }, { threshold: 20, risk: 2 }],



//     legs_1: [{ threshold: 90, risk: 2 }],
//     legs_2: [{ threshold: 80, risk: 2 }],
//     legs_3: [{ threshold: 40, risk: 2 }, { threshold: 90, risk: 4 }],
//     legs_4: [{ threshold: 50, risk: 3 }, { threshold: 20, risk: 2 }],
//     legs_5: [{ threshold: 50, risk: 4 }, { threshold: 20, risk: 3 }],
//     legs_6: [{ threshold: 50, risk: 3 }, { threshold: 20, risk: 2 }]
// };

export const frequencyRiskRules = {
  // BACK
  back_1: [], // Upright back -> hamesha 1 risk hai
  back_2: [ // Bent back
    { threshold: 90, risk: 3 },
    { threshold: 50, risk: 2 },
    { threshold: 20, risk: 2 },
  ],
  back_3: [ // Twisted back
    { threshold: 90, risk: 3 },
    { threshold: 60, risk: 3 },
    { threshold: 20, risk: 2 },
  ],
  back_4: [ // Bent + twisted back
    { threshold: 80, risk: 4 },
    { threshold: 40, risk: 3 },
    { threshold: 20, risk: 2 },
  ],

  // ARMS
  arms_1: [], // Both arms below shoulder -> hamesha 1 risk
  arms_2: [ // One arm at or above shoulder
    { threshold: 90, risk: 3 },
    { threshold: 40, risk: 2 },
    { threshold: 20, risk: 2 },
  ],
  arms_3: [ // Both arms at or above shoulder
    { threshold: 90, risk: 3 },
    { threshold: 40, risk: 2 },
    { threshold: 20, risk: 2 },
  ],

  // LEGS
  legs_1: [ // Sitting
    { threshold: 100, risk: 2 },
  ],
  legs_2: [ // Standing on 2 straight legs
    { threshold: 100, risk: 2 },
  ],
  legs_3: [ // Standing on 1 straight leg
    { threshold: 90, risk: 3 },
    { threshold: 40, risk: 2 },
  ],
  legs_4: [ // Standing/squatting on 2 bent legs
    { threshold: 90, risk: 4 },
    { threshold: 30, risk: 3 },
    { threshold: 20, risk: 2 },
  ],
  legs_5: [ // Standing/squatting on 1 bent leg
    { threshold: 90, risk: 4 },
    { threshold: 30, risk: 3 },
    { threshold: 20, risk: 2 },
  ],
  legs_6: [ // Kneeling
    { threshold: 90, risk: 4 },
    { threshold: 30, risk: 3 },
    { threshold: 20, risk: 2 },
  ],
  legs_7: [ // Walking
    { threshold: 100, risk: 2 },
  ]
};
