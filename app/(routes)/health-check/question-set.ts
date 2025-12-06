// export const diabetesQuestions = [
//   {
//     feature: "increased_appetite",
//     question: "Do you have increased appetite?",
//     options: [
//       { label: "Never", value: 0 },
//       { label: "Sometimes", value: 0 },
//       { label: "Often", value: 1 },
//       { label: "Very Frequently", value: 1 }
//     ]
//   },
//   {
//     feature: "polyuria",
//     question: "Do you experience frequent urination?",
//     options: [
//       { label: "No", value: 0 },
//       { label: "A little", value: 0 },
//       { label: "Frequently", value: 1 },
//       { label: "All the time", value: 1 }
//     ]
//   },
//   {
//     feature: "itching",
//     question: "Do you have itching symptoms?",
//     options: [
//       { label: "Never", value: 0 },
//       { label: "Sometimes", value: 0 },
//       { label: "Often", value: 1 },
//       { label: "Severe itching", value: 1 }
//     ]
//   },
//   {
//     feature: "skin_rash",
//     question: "Are you experiencing skin rash?",
//     options: [
//       { label: "No", value: 0 },
//       { label: "Mild", value: 0 },
//       { label: "Noticeable rash", value: 1 },
//       { label: "Severe rash", value: 1 }
//     ]
//   },
//   {
//     feature: "continuous_sneezing",
//     question: "Do you sneeze continuously?",
//     options: [
//       { label: "No", value: 0 },
//       { label: "Occasionally", value: 0 },
//       { label: "Often", value: 1 },
//       { label: "Very frequent", value: 1 }
//     ]
//   }
// ];


// export const typhoidQuestions = [
//   {
//     feature: "toxid_look_(typhos)",
//     question: "Do you have a toxic or typhoid-like appearance?",
//     options: [
//       { label: "No", value: 0 },
//       { label: "Mild symptoms", value: 0 },
//       { label: "Unwell appearance", value: 1 },
//       { label: "Severely unwell", value: 1 }
//     ]
//   },
//   {
//     feature: "belly_pain",
//     question: "Do you feel belly or abdominal pain?",
//     options: [
//       { label: "Never", value: 0 },
//       { label: "Rarely", value: 0 },
//       { label: "Often", value: 1 },
//       { label: "Severe pain", value: 1 }
//     ]
//   },
//   {
//     feature: "itching",
//     question: "Are you experiencing itching?",
//     options: [
//       { label: "No", value: 0 },
//       { label: "Sometimes", value: 0 },
//       { label: "Itchy often", value: 1 },
//       { label: "Severe itch", value: 1 }
//     ]
//   },
//   {
//     feature: "skin_rash",
//     question: "Do you have a skin rash?",
//     options: [
//       { label: "No", value: 0 },
//       { label: "Mild rash", value: 0 },
//       { label: "Obvious rash", value: 1 },
//       { label: "Severe rash", value: 1 }
//     ]
//   },
//   {
//     feature: "continuous_sneezing",
//     question: "Are you sneezing continuously?",
//     options: [
//       { label: "No", value: 0 },
//       { label: "Sometimes", value: 0 },
//       { label: "Often", value: 1 },
//       { label: "Very often", value: 1 }
//     ]
//   }
// ];



export const diabetesQuestions = [
  {
    feature: "increased_appetite",
    question: "ช่วงนี้คุณรู้สึกอยากอาหารมากขึ้นกว่าปกติหรือไม่?",
    options: [
      { label: "ไม่เลย", value: 0 },
      { label: "เล็กน้อย", value: 0 },
      { label: "บ่อยครั้ง", value: 1 },
      { label: "บ่อยมากจนผิดสังเกต", value: 1 }
    ]
  },
  {
    feature: "polyuria",
    question: "คุณปัสสาวะบ่อยกว่าปกติหรือมีปริมาณมากขึ้นหรือไม่?",
    options: [
      { label: "ไม่เลย", value: 0 },
      { label: "เล็กน้อย", value: 0 },
      { label: "บ่อยครั้ง", value: 1 },
      { label: "บ่อยมากจนรบกวนชีวิตประจำวัน", value: 1 }
    ]
  },
  {
    feature: "itching",
    question: "คุณมีอาการคันตามผิวหนังบ่อยหรือไม่?",
    options: [
      { label: "ไม่มีอาการคัน", value: 0 },
      { label: "คันเป็นครั้งคราว", value: 0 },
      { label: "คันบ่อย", value: 1 },
      { label: "คันรุนแรงหรือคันต่อเนื่อง", value: 1 }
    ]
  },
  {
    feature: "skin_rash",
    question: "คุณสังเกตว่ามีผื่นหรือตุ่มบนผิวหนังหรือไม่?",
    options: [
      { label: "ไม่มี", value: 0 },
      { label: "มีเล็กน้อย", value: 0 },
      { label: "เห็นชัดเจน", value: 1 },
      { label: "เป็นมากหรือกระจายหลายจุด", value: 1 }
    ]
  },
  {
    feature: "continuous_sneezing",
    question: "คุณมีอาการจามบ่อยหรือจามติด ๆ กันหรือไม่?",
    options: [
      { label: "ไม่เลย", value: 0 },
      { label: "เป็นบางครั้ง", value: 0 },
      { label: "จามบ่อย", value: 1 },
      { label: "จามมากจนรำคาญหรือหยุดยาก", value: 1 }
    ]
  }
];


export const typhoidQuestions = [
  {
    feature: "toxid_look_(typhos)",
    question: "คุณรู้สึกอ่อนเพลีย หน้าตาซีดเซียว หรือดูไม่สบายมากกว่าปกติหรือไม่?",
    options: [
      { label: "ไม่เลย", value: 0 },
      { label: "อ่อนล้าบ้างเล็กน้อย", value: 0 },
      { label: "อ่อนเพลียชัดเจน", value: 1 },
      { label: "อ่อนเพลียมากจนทำกิจวัตรลำบาก", value: 1 }
    ]
  },
  {
    feature: "belly_pain",
    question: "คุณมีอาการปวดท้องหรือแน่นท้องเป็นประจำหรือไม่?",
    options: [
      { label: "ไม่ปวดเลย", value: 0 },
      { label: "ปวดเล็กน้อยเป็นบางครั้ง", value: 0 },
      { label: "ปวดบ่อยครั้ง", value: 1 },
      { label: "ปวดรุนแรงหรือปวดจนทำงานไม่ได้", value: 1 }
    ]
  },
  {
    feature: "itching",
    question: "คุณมีอาการคันตามผิวหนังบ่อยหรือไม่?",
    options: [
      { label: "ไม่คันเลย", value: 0 },
      { label: "คันเล็กน้อยเป็นบางครั้ง", value: 0 },
      { label: "คันบ่อยครั้ง", value: 1 },
      { label: "คันรุนแรงต่อเนื่อง", value: 1 }
    ]
  },
  {
    feature: "skin_rash",
    question: "คุณมีผื่นตามผิวหนัง เช่น ผื่นแดงเล็ก ๆ หรือผื่นกระจายหรือไม่?",
    options: [
      { label: "ไม่มีผื่น", value: 0 },
      { label: "ผื่นเล็กน้อย", value: 0 },
      { label: "ผื่นชัดเจน", value: 1 },
      { label: "ผื่นรุนแรงหรือกระจายหลายตำแหน่ง", value: 1 }
    ]
  },
  {
    feature: "continuous_sneezing",
    question: "คุณมีอาการจามบ่อยหรือจามติด ๆ กันหรือไม่?",
    options: [
      { label: "ไม่จามเลย", value: 0 },
      { label: "จามเป็นบางครั้ง", value: 0 },
      { label: "จามบ่อย", value: 1 },
      { label: "จามมากจนรบกวนชีวิตประจำวัน", value: 1 }
    ]
  }
];
