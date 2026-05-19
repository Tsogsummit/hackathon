export const GRADE6_GROUP = "grade_6_scratch";
export const GRADE6_TOPICS = [
  "Frog movement",
  "Snake danger",
  "Birthday celebration",
  "Movement module",
  "Using the new module",
  "Adding the maze"
];

const mc = [
  ["Frog x: 0, y: -150 дээр байвал тайзны аль хэсэгт байна вэ?", ["Доод гол хэсэгт", "Дээд гол хэсэгт", "Баруун захад", "Зүүн захад"], 0, "Frog movement"],
  ["Дээш сум дарахад frog дээш явахын тулд аль координат өөрчлөгдөх вэ?", ["y нэмэгдэнэ", "x нэмэгдэнэ", "хэмжээ багасна", "backdrop солигдоно"], 0, "Frog movement"],
  ["Баруун сум дарахад frog баруун тийш явахын тулд юу хийх вэ?", ["change x by 10", "change y by 10", "play sound", "stop all"], 0, "Frog movement"],
  ["Frog-ийг эхлэх цэгт тавих block аль нь вэ?", ["go to x: 0 y: -150", "say Hello", "play sound", "next costume"], 0, "Frog movement"],
  ["change y by -10 block frog-ийг хаашаа хөдөлгөх вэ?", ["Доош", "Дээш", "Баруун", "Зүүн"], 0, "Frog movement"],
  ["change x by -10 block frog-ийг хаашаа хөдөлгөх вэ?", ["Зүүн", "Баруун", "Дээш", "Доош"], 0, "Frog movement"],

  ["Snake тоглоом дуустал байнга хөдөлж байх хэрэгтэй бол аль loop тохиромжтой вэ?", ["forever", "repeat 1", "wait", "say"], 0, "Snake danger"],
  ["Snake frog-д хүрсэн эсэхийг мэдэхэд аль block хэрэгтэй вэ?", ["touching Frog?", "key up arrow pressed?", "play sound", "set size"], 0, "Snake danger"],
  ["if touching Snake? then go to start гэвэл юу болох вэ?", ["Snake-д хүрвэл frog эхлэл рүү буцна", "frog томорно", "gift алга болно", "дуу унтарна"], 0, "Snake danger"],
  ["repeat until touching Gift? loop хэзээ зогсох вэ?", ["Frog gift-д хүрэх үед", "Ногоон туг дарахад", "1 секунд өнгөрөхөд", "snake ирмэгт хүрэхэд"], 0, "Snake danger"],
  ["if on edge, bounce block snake-д ямар тус болдог вэ?", ["Ирмэгт хүрвэл буцааж ойгоно", "Дуу тоглуулна", "Frog-г нууж өгнө", "Maze зурна"], 0, "Snake danger"],

  ["Gift-д хүрэх үед дэвсгэр зураг солих block аль вэ?", ["switch backdrop to Party", "change x by 10", "repeat until", "define movement"], 0, "Birthday celebration"],
  ["Дуу тоглуулах block аль нь вэ?", ["play sound Birthday until done", "go to x: 0 y: -150", "touching color?", "make a block"], 0, "Birthday celebration"],
  ["Frog дэлгэц дээр үг хэлэхэд аль block хэрэглэнэ вэ?", ["say Happy birthday for 2 seconds", "move 10 steps", "if on edge bounce", "set y to 0"], 0, "Birthday celebration"],
  ["Тоглоом дуусгах үед ямар block ашиглаж болох вэ?", ["stop all", "change x by 10", "set size to 50%", "touching Frog?"], 0, "Birthday celebration"],

  ["Custom block үүсгэхэд Scratch-ийн аль хэсгийг ашигладаг вэ?", ["My Blocks", "Sounds", "Backdrops", "Costumes"], 0, "Movement module"],
  ["movement custom block дотор юу хийх нь зөв вэ?", ["Сумны товчоор хөдөлгөх if block-ууд", "Зөвхөн дуу сонгох block", "Зөвхөн stop all", "Зөвхөн backdrop"], 0, "Movement module"],
  ["Custom block ашиглахын гол давуу тал юу вэ?", ["Код богино, цэгцтэй болно", "Sprite устна", "Компьютер унтарна", "Нууц үг солигдоно"], 0, "Movement module"],
  ["define movement гэдэг block юу илэрхийлдэг вэ?", ["movement нэртэй шинэ block-ийн доторх командыг заана", "тоглоом дууссаныг заана", "gift байрлуулна", "дуу устгана"], 0, "Movement module"],
  ["if key up arrow pressed? then change y by 10 гэвэл юу болох вэ?", ["Дээш сум дарахад дээш хөдөлнө", "Доош сум дарахад доош хөдөлнө", "Gift гарна", "Snake зогсоно"], 0, "Movement module"],

  ["Main script дотор movement block тавивал юу болох вэ?", ["movement доторх командууд ажиллана", "block устна", "файл татагдана", "stage хаагдана"], 0, "Using the new module"],
  ["startup custom block-д юу хадгалах нь тохиромжтой вэ?", ["Эхлэх байрлал, хэмжээ, backdrop", "Зөвхөн mouse pointer", "Зөвхөн username", "Зөвхөн оноо экспорт"], 0, "Using the new module"],
  ["endgame custom block-д юу байрлуулж болох вэ?", ["Win үед backdrop, message, sound, stop all", "Frog-ийн зүүн сумны хөдөлгөөн", "Нэвтрэх нэр", "Maze зураг татах"], 0, "Using the new module"],
  ["Custom block ашиглавал main script ямар болно вэ?", ["Уншихад амар, дараалал нь тод болно", "Үргэлж удаан болно", "Асуулт харагдахгүй болно", "Sprite хөдөлж чадахгүй болно"], 0, "Using the new module"],

  ["Maze-ийн хар хананд хүрсэн эсэхийг шалгахад аль block хэрэгтэй вэ?", ["touching color black?", "play sound Birthday", "next costume", "repeat 10"], 0, "Adding the maze"],
  ["Frog хар хананд хүрвэл юу хийх нь зөв вэ?", ["Эхлэх байрлал руу буцаах", "Үргэлж хурдасгах", "Gift болгох", "Project хаах"], 0, "Adding the maze"],
  ["Maze тоглоомд gift ихэвчлэн хаана байх вэ?", ["Төгсгөлийн цэг дээр", "Start дээр", "Frog дотор", "Sound tab дээр"], 0, "Adding the maze"],
  ["touching color? block ямар ажилтай вэ?", ["Тодорхой өнгөтэй хүрсэн эсэхийг мэдэрнэ", "Дуу сонгоно", "Username сольдог", "Sprite зурдаг"], 0, "Adding the maze"],
  ["Maze тоглоомыг илүү сорилттой болгодог зүйл аль вэ?", ["Хана, саадтай дэвсгэр зураг", "Илүү урт нууц үг", "CSV export", "Хоосон stage"], 0, "Adding the maze"],
  ["Frog gift-д хүрвэл хамгийн зөв дараалал аль вэ?", ["Backdrop солих, message хэлэх, sound тоглуулах, stop all", "Username солих, CSV татах", "Sprite устгах, browser хаах", "Зөвхөн wait хийх"], 0, "Adding the maze"]
];

const blockReadings = [
  {
    topic: "Frog movement",
    title: "Дээш хөдөлгөх",
    prompt: "Frog эхлээд доод гол хэсэгт очно. Дараа нь дээш сум дарах бүрд яах вэ?",
    script: ["when green flag clicked", "set size to 50%", "go to x: 0 y: -150", "forever", "if key up arrow pressed?", "change y by 10"],
    expected: "Дээш сум дарахад frog-ийн y координат нэмэгдэж, frog дээш хөдөлнө."
  },
  {
    topic: "Frog movement",
    title: "Баруун, зүүн хөдөлгөх",
    prompt: "Энэ script баруун болон зүүн сум дарахад frog-ийг яаж хөдөлгөх вэ?",
    script: ["forever", "if key right arrow pressed?", "change x by 10", "if key left arrow pressed?", "change x by -10"],
    expected: "Баруун сум дарахад x нэмэгдэж баруун тийш, зүүн сум дарахад x багасаж зүүн тийш хөдөлнө."
  },
  {
    topic: "Frog movement",
    title: "Эхлэх байрлал",
    prompt: "Ногоон туг дарахад frog-ийн хэмжээ, байрлал хэрхэн тохируулагдах вэ?",
    script: ["when green flag clicked", "switch backdrop to Woods", "set size to 50%", "go to x: 0 y: -150"],
    expected: "Тоглоом эхлэхэд Woods backdrop гарч, frog 50% хэмжээтэй болж доод гол эхлэх байрлалд очно."
  },
  {
    topic: "Snake danger",
    title: "Snake аюул",
    prompt: "Snake frog-д хүрвэл юу болох вэ?",
    script: ["forever", "move 10 steps", "if on edge, bounce", "if touching Frog?", "say caught you! for 2 seconds", "stop all"],
    expected: "Snake байнга хөдөлж ирмэгт ойно. Frog-д хүрвэл caught you гэж хэлээд тоглоом зогсоно."
  },
  {
    topic: "Snake danger",
    title: "Reset хийх",
    prompt: "Frog snake-д хүрвэл дараагийн алхам юу вэ?",
    script: ["if touching Snake?", "say Try again! for 2 seconds", "go to x: 0 y: -150"],
    expected: "Frog snake-д хүрвэл Try again гэж хэлээд эхлэх байрлал руу буцна."
  },
  {
    topic: "Birthday celebration",
    title: "Gift-д хүрэх",
    prompt: "Frog gift-д хүрсний дараа ямар үйлдлүүд дарааллаар ажиллах вэ?",
    script: ["repeat until touching Gift?", "movement", "switch backdrop to Party", "say Happy birthday! for 2 seconds", "play sound Birthday until done", "stop all"],
    expected: "Gift-д хүрэх хүртэл хөдөлнө. Дараа нь party backdrop гарч, мессеж хэлж, дуу тоглоод тоглоом зогсоно."
  },
  {
    topic: "Birthday celebration",
    title: "Visual ба sound output",
    prompt: "Энэ хоёр block дэлгэц болон дуугаар ямар үр дүн үзүүлэх вэ?",
    script: ["switch backdrop to Party", "play sound Birthday until done"],
    expected: "Backdrop Party болж харагдана, Birthday дуу дуусах хүртэл тоглоно."
  },
  {
    topic: "Movement module",
    title: "movement block үүсгэх",
    prompt: "movement custom block дотор ямар хөдөлгөөнүүд хадгалагдсан байна вэ?",
    script: ["define movement", "if key up arrow pressed? change y by 10", "if key down arrow pressed? change y by -10", "if key right arrow pressed? change x by 10", "if key left arrow pressed? change x by -10"],
    expected: "movement block дотор дөрвөн сумны хөдөлгөөн хадгалагдсан байна."
  },
  {
    topic: "Movement module",
    title: "Module ашиглах",
    prompt: "forever loop дотор movement block байвал яагаад хэрэгтэй вэ?",
    script: ["when green flag clicked", "forever", "movement"],
    expected: "forever loop нь movement block-ийг байнга ажиллуулж, сум дарахыг тасралтгүй шалгана."
  },
  {
    topic: "Using the new module",
    title: "Main script цэгцлэх",
    prompt: "Энэ main script ямар дарааллаар ажиллаж байна вэ?",
    script: ["when green flag clicked", "startup", "repeat until touching Gift?", "movement", "endgame"],
    expected: "Эхлээд startup ажиллана, gift-д хүрэх хүртэл movement давтагдана, дараа нь endgame ажиллана."
  },
  {
    topic: "Using the new module",
    title: "startup block",
    prompt: "startup custom block ямар тохиргоонуудыг нэг газар хадгалж байна вэ?",
    script: ["define startup", "switch backdrop to Woods", "set size to 50%", "go to x: 0 y: -150"],
    expected: "startup block нь backdrop, хэмжээ, эхлэх байрлалыг нэг газар цэгцэлж байна."
  },
  {
    topic: "Adding the maze",
    title: "Хар хананд хүрэх",
    prompt: "Frog maze-ийн хар хананд хүрвэл юу болох вэ?",
    script: ["if touching color black?", "say Try again! for 1 seconds", "go to x: 0 y: -150"],
    expected: "Frog хар хананд хүрвэл Try again гэж хэлээд эхлэх байрлал руу буцна."
  },
  {
    topic: "Adding the maze",
    title: "Maze дотор хөдөлгөх",
    prompt: "Энэ script gift-д хүрэх хүртэл frog-ийг хэрхэн удирдаж байна вэ?",
    script: ["repeat until touching Gift?", "movement", "if touching color black?", "go to x: 0 y: -150"],
    expected: "Gift-д хүрэх хүртэл movement ажиллана. Хар хананд хүрвэл frog эхлэх байрлал руу буцна."
  },
  {
    topic: "Adding the maze",
    title: "Gift байрлуулах",
    prompt: "Gift sprite эхлэхэд хаана очих вэ?",
    script: ["when green flag clicked", "set size to 50%", "go to x: -25 y: 150"],
    expected: "Gift 50% хэмжээтэй болж maze-ийн төгсгөлийн байрлал болох x:-25, y:150 дээр очно."
  },
  {
    topic: "Birthday celebration",
    title: "Тоглоом дуусгах",
    prompt: "Дуу тоглосны дараа stop all block юу хийх вэ?",
    script: ["play sound Birthday until done", "stop all"],
    expected: "Birthday дуу дуусах хүртэл тоглоно. Дараа нь бүх script зогсоно."
  }
];

const practicals = [
  {
    title: "Frog эхлэх ба хөдөлгөөн засах",
    issue: "Бэлэн project дээр frog буруу газраас эхэлж, зөвхөн дээш хөдөлж байна.",
    steps: [
      "Frog-ийг x: 0, y: -150 дээр эхлүүл.",
      "Frog-ийн хэмжээг 50% болго.",
      "Дээш, доош, баруун, зүүн сум бүгд ажилладаг болго.",
      "Хөдөлгөөний block-уудаа movement custom block дотор цэгцэл."
    ]
  },
  {
    title: "Snake-д хүрэх үед буцаах",
    issue: "Snake frog-д хүрэхэд тоглоом юу ч хийхгүй байна.",
    steps: [
      "Snake-д хүрсэн эсэхийг touching Snake? block-оор шалга.",
      "Хүрвэл frog Try again гэж богино хугацаанд хэлнэ.",
      "Дараа нь frog x: 0, y: -150 эхлэх байрлал руу буцна.",
      "Энэ шалгалтыг хөдөлгөөн давтагдаж байх хэсэгт байрлуул."
    ]
  },
  {
    title: "Gift-д хүрэх win хэсгийг засах",
    issue: "Frog gift-д хүрсэн ч баярын хэсэг ажиллахгүй байна.",
    steps: [
      "repeat until touching Gift? loop ашигла.",
      "Gift-д хүрсний дараа backdrop-ийг Party болго.",
      "Frog Happy birthday! гэж хэлнэ.",
      "Birthday sound тоглоод дараа нь stop all ажиллана."
    ]
  },
  {
    title: "Main script-ийг module-оор цэгцлэх",
    issue: "Project ажиллаж байгаа боловч код олон газар давхардсан, уншихад хэцүү байна.",
    steps: [
      "startup custom block үүсгээд эхлэх тохиргоог дотор нь хий.",
      "movement custom block дотор сумны хөдөлгөөнүүдийг хий.",
      "endgame custom block дотор win effect-үүдийг хий.",
      "Main script-ээ startup -> repeat until Gift -> movement -> endgame дараалалтай болго."
    ]
  },
  {
    title: "Maze хананд хүрэх reset нэмэх",
    issue: "Frog хар ханан дундуур шууд явж байна.",
    steps: [
      "Maze-ийн хар хананд хүрсэн эсэхийг touching color black? block-оор шалга.",
      "Хар хананд хүрвэл frog x: 0, y: -150 руу буцна.",
      "Gift-ийг maze-ийн төгсгөлд x: -25, y: 150 дээр байрлуул.",
      "Project-оо туршаад ханаар нэвтрэхгүй байгаа эсэхийг шалга."
    ]
  }
];

export function buildGrade6QuestionBank() {
  const questions = [];
  mc.forEach(([text, choices, correctIndex, topic], index) => {
    questions.push({
      id: `grade_6_scratch-mc-${index + 1}`,
      grade_group: GRADE6_GROUP,
      topic,
      type: "multiple_choice",
      question_text: text,
      choices: choices.map((choice, choiceIndex) => ({ id: `c${choiceIndex + 1}`, text: choice })),
      correct_answer: `c${correctIndex + 1}`,
      explanation: "Scratch-ийн үндсэн ойлголтыг шалгана.",
      difficulty: "маш энгийн",
      points: 1,
      test_cases: [],
      starter_code: ""
    });
  });
  blockReadings.forEach((item, index) => {
    questions.push({
      id: `grade_6_scratch-block-${index + 1}`,
      grade_group: GRADE6_GROUP,
      topic: item.topic,
      type: "block_reading",
      question_text: `${item.title}\n\n${item.prompt}\n\nДоорх зургийг 1-р алхмаас эхлэн дарааллаар нь уншаад 1-2 өгүүлбэрээр тайлбарлана уу.`,
      block_script: item.script.join("\n"),
      image_url: `/assets/scratch-blocks/block-reading-${index + 1}.svg`,
      expected_answer: item.expected,
      choices: [],
      correct_answer: "",
      explanation: item.expected,
      difficulty: "маш энгийн",
      points: 2,
      test_cases: [],
      starter_code: ""
    });
  });
  practicals.forEach((item, index) => {
    questions.push({
      id: `grade_6_scratch-practical-${index + 1}`,
      grade_group: GRADE6_GROUP,
      topic: "Adding the maze",
      type: "scratch_practical",
      question_text: `${item.title}\n\nБэлэн Scratch project-ийг шинээр хийхгүй, зөвхөн алдаатай хэсгийг засна.\n\nАсуудал: ${item.issue}\n\nХийх дараалал:\n${item.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`).join("\n")}\n\nДууссаны дараа project-оо ажиллуулж шалгаад Scratch share link эсвэл .sb3 файлын нэрийг бичнэ үү.`,
      image_url: `/assets/scratch-blocks/practical-${index + 1}.svg`,
      rubric: [
        "Зааврын алхмуудыг зөв дарааллаар хийсэн: 2 оноо",
        "Frog-ийн хөдөлгөөн эсвэл reset logic зөв ажилласан: 2 оноо",
        "Custom block/module-ийг зөв ашигласан: 2 оноо",
        "Win эсвэл maze нөхцөл зөв ажилласан: 2 оноо",
        "Project-оо ажиллуулж шалгасан, код цэгцтэй: 2 оноо"
      ],
      choices: [],
      correct_answer: "",
      explanation: "Багш rubric-ийн дагуу гараар 10 оноогоор дүгнэнэ.",
      difficulty: "маш энгийн",
      points: 10,
      test_cases: [],
      starter_code: ""
    });
  });
  return questions;
}
