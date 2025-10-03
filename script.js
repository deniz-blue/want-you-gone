let audio = document.getElementById("song");
const contentEl = document.getElementById("content");
const creditsEl = document.getElementById("credits");

const getTime = () => audio.currentTime * 1000; // ms
const waitForInteraction = () => new Promise(res => document.body.addEventListener("click", res));

const main = async () => {
  await SCHEMAS.blink();
  
  await loadTimings();
  
  await SCHEMAS.write(["", "[info] Click to play"]);
  await waitForInteraction();
  await SCHEMAS.write(timedText("\n[info] Playing...", 200));
  await SCHEMAS.clear();
  
  audio.play();
  
}

const TimingActions = {
  append: (x, b) => {
    if(b) {
      content = content.slice(0, -x.text.length);
    }
    else appendContent(x.text)
    //console.log(x)
  },
  clear: () => {
    setContent("")
    //console.log("clear")
  },
}

const CreditsActions = {
  append: (x, b) => {
    if(b) {
      creditsContent = creditsContent.slice(0, -x.text.length);
    }
    else appendCredits(x.text)
  },
}

let creditsContent = ""
let appendCredits = str => {
  setCredits(creditsContent + str)
}
let setCredits = str => {
  creditsContent = str
}

let timingLastTime = 0;
let creditsIndex = 0;
let updateDisplay = () => {
  let time = audio.currentTime * 1000;
  let Tactions = [];
  let Cactions = []
  let isBackwards = !(timingLastTime <= time);
  timings.filter(x => (timingLastTime <= x.time) ? (x.time <= time) : (x.time > time)).forEach(x => Tactions.push(x));
  creditsTimings.filter(x => (timingLastTime <= x.time) ? (x.time <= time) : (x.time > time)).forEach(x => Cactions.push(x));
  timingLastTime = time
  
  //console.log(time, Tactions)
  
  if(isBackwards) {
    Tactions = Tactions.reverse();
    Cactions = Cactions.reverse();
  }
  
  Tactions.forEach(x => {
    TimingActions[x.type](x, isBackwards);
  })
  Cactions.forEach(x => CreditsActions[x.type](x, isBackwards))
}

setInterval(() => {
  if(!audio.paused && getTime() > 0) updateDisplay()
}, 1000/20)



let timings = [];
let creditsTimings = [];

const loadTimings = async () => {
  creditsTimings = await loadCreditsTimings();
  timings = loadSongTimings();
}

const Start = () => {
  let time = 0;
  
  
}

const StartCredits = () => {
  let time = 0;
  let intervalSpeed = 30;
  
  let lastIndex = -1;
  
  let setContent = str => {
    content = str;
  };

  let appendContent = str => {
    setContent(content + str);
  };
  
  setInterval(() => {
    time = getTime();
    
    
  }, intervalSpeed);
}




let blink = false;
let blinkDelay = 500;
let cursorShown = false;

let content = "";

let setContent = str => {
  content = str;
};

let appendContent = str => {
  setContent(content + str);
};

let wait = ms => new Promise(r => setTimeout(() => r(), ms));

window.int1 = setInterval(() => contentEl.innerText = content + (blink && cursorShown ? "_" : ""), 1000/30);
window.int2 = setInterval(() => cursorShown = !cursorShown, blinkDelay);

let ccursorShown = true
window.int3 = setInterval(() => creditsEl.innerText = creditsContent + ((ccursorShown && !(getTime() >= 140)) ? "_" : ""), 1000/30);
window.int4 = setInterval(() => ccursorShown = !ccursorShown, blinkDelay);


const loadCreditsTimings = async () => {
  let res = await fetch("/credits.txt");
  let credits = (await res.text()).split("\n");
  
  let _timings = [];
  let _time = 0;
  
  const creditsDur = (audio.duration * 1000) - 20000;
  const delay = creditsDur / credits.join("").length;
  
  let append = str => {
    _timings.push({
      type: "append",
      time: _time,
      text: str,
    });
  };
  
  for(let i = 0 ; credits.length != i ; i++){
    let line = credits[i];
    let t = 0;
    while (line.length > t) {
      let char = line[t];
      let charLast = line[t - 1];
      append(charLast == " " ? " " + char : char);
      t++;
      _time += delay;
    }
    append("\n");
    _time += delay;
  };
  
  return _timings;
}

const loadSongTimings = () => {
  let _timings = [];
  let schemas = getSchema();
  
  let _time = 0;
  
  let append = str => {
    _timings.push({
      type: "append",
      time: _time,
      text: str,
    });
  };
  
  let act = {
    text: (t, d) => {
      append(t);
      if(d) _time += d;
    },
    write: (t, d) => {
      let i = 0;
      while (t.length > i) {
        let char = t[i];
        let charLast = t[i - 1];
        append(charLast == " " ? " " + char : char);
        i++;
        _time += (d || 25);
      }
    },
    clear: () => _timings.push({
      time: _time,
      type: "clear",
    }),
    delay: (t) => {
      _time += t;
    }
  }
  
  for (let i = 0; schemas[i]; i++) {
    let [typ, t, d] = schemas[i];
    act[typ](t, d);
  }
  
  return _timings;
}





const timedText = (str, totalTime) => ["write", str, totalTime / str.length];

const getSchema = () => {
  return [
    ["write", "Forms FORM-29827281-12-2:\nNotice of Dismissal\n", 100],
    ["delay", 900],
    timedText("\n\nWell here we are again", 2000),
    timedText("\nIt's always such a pleasure", 2000),
    ["delay", 200],
    timedText("\nRemember when you tried\nto kill me twice?", 4000),
    ["delay", 1200],
    timedText("\nOh how we laughed and laughed", 2000),
    ["delay", 400],
    timedText("\nExcept I wasn't laughing", 2000),
    ["delay", 600],
    timedText("\nUnder the circumstantes", 1500),
    timedText("\nI've been shockingly nice\n", 2600),
    ["delay", 1000],
    ["clear"],
    timedText("You want your freedom?", 2300),
    timedText("\nTake it", 2000),
    ["delay", 700],
    timedText("\nThats what I'm counting on\n", 2300),
    ["delay", 2300],
    timedText("\nI used to want you dead", 2500),
    timedText("\nbut", 400),
    timedText("\nNow I only want you gone", 2800),
    ["delay", 4000],
    ["clear"],
    ["delay", 1500],
    timedText("\nShe was a lot like you", 2000),
    ["delay", 400],
    timedText("\n(Maybe not quite as heavy)", 2000),
    ["delay", 400],
    timedText("\nNow little Caroline is in here too", 3000),
    ["delay", 2000],
    timedText("\nOne day they woke me up", 2000),
    ["delay", 400],
    timedText("\nSo I could live forever", 2400),
    timedText("\nIt's such a shame the same", 2000),
    timedText("\nwill never happen to you", 2500),
    ["delay", 200],
    ["clear"],
    ["text", "Severance Package Details:\n", 1000],
    timedText("\nYou've got your", 1000),
    timedText("\nshort sad", 800),
    timedText("\nlife left", 2000),
    ["delay", 1500],
    timedText("\nThat's what I'm counting on", 2000),
    ["delay", 2000],
    timedText("\nI'll let you get right to it", 3000),
    ["delay", 800],
    timedText("\nNow I only want you gone\n", 2000),
    ["delay", 4000],
    ["clear"],
    ["delay", 1500],
    timedText("Goodbye my only friend", 2000),
    timedText("\nOh, ", 600),
    timedText("did you think I meant you?", 1800),
    ["delay", 400],
    timedText("\nIt would be funny", 1600),
    timedText("\nif it weren't so sad", 2000),
    ["delay", 1200],
    timedText("\nWell you have been replaced", 2400),
    timedText("\nI don't need anyone now", 2400),
    timedText("\nWhen I delete you maybe", 1600),
    timedText("\n[REDACTED]", 3000),
    ["clear"],
    ["delay", 1000],
    timedText("Go make some new ", 1600),
    timedText("disaster", 2400),
    ["delay", 1600],
    timedText("\nThat's what I'm counting on", 2000),
    ["delay", 1800],
    timedText("\nYou're someone else's problem", 3000),
    ["delay", 1900],
    timedText("\nNow I only want you gone", 2500),
    ["delay", 1900],
    timedText("\nNow I only want you gone", 2500),
    ["delay", 1900],
    timedText("\nNow I only want you", 2000),
    ["delay", 600],
    ["clear"],
    timedText("\n\n\n\n\n\n\n\n\n\n\n gone", 200)
  ];
}


//main();



const SCHEMAS = {
  text: async (data) => {
    appendContent(data[1]);
    if(data[2]) await wait(data[2]);
  },
  delay: async (data) => {
    await wait(data[1]);
  },
  write: async (data) => {
    let t = 0;
    while (data[1].length > t) {
      let char = data[1][t];
      let charLast = data[1][t - 1];
      appendContent(charLast == " " ? " " + char : char);
      t++;
      await wait(data[2] || 25);
    }
  },
  blink: () => blink = true,
  noblink: () => blink = false,
  clear: () => content =  "",
};


/*
Commands:
write - writes text one char at a time
  ["write", "Hewwo", 10] => 10 is delay between chars
delay - waits
blink - starts blinking the cursor
text - instantly adds text
*/

main()

