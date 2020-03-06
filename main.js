let root = window.location.hostname == "diegolopez.me" ? "/rosies-dream/" : "/";

function renderMath() {
  renderMathInElement(document.body, {
    delimiters: 
    [
      {left: r`\[`, right: r`\]`, display: true},
      {left: r`\(`, right: r`\)`, display: false},
    ],
    macros: macros
  });
}

function parseTitle(title) {
  return title.split("")
    .map(c => c == c.toLowerCase() ? c : r`\( \mathbb ${c}\)`)
    .join("").replace("'", "’");
}

function parseText(text) {
  let lines = text.split('\n').filter(l => l.indexOf('%') != 0).join('\n');

  let questions = lines.split("\\end{problem}").filter(l => l.length > 1);
  questions = questions.map(q => q.replace("\\begin{problem}", ""));

  // from: \begin{enumerate}[1] s1 \item s2 \item s3 \item s4 \end{enumerate}
  // to: createList(1, [s1, s2, s3, s4])

  questions = questions.map(question => {
    let result = "";
    let s = []; // stack
    let currentIndex = 0;
    let done = false;

    while(!done) {
      currentIndex = question.indexOf("\\begin{enumerate}")
      if (currentIndex < 0) {
        done = true;
        result += question;
      } else {
        result += question.substring(0, currentIndex);
        currentIndex += "\\begin{enumerate}".length;
        let type = question.charAt(currentIndex + 1);
        closingIndex = question.indexOf("\\end{enumerate}");
        let subquestions = question.substring(currentIndex, closingIndex);
        subquestions = subquestions.split("\\item").filter(s => s.length > 1).slice(1);
        question = question.substring(closingIndex + "\\end{enumerate}".length);
        result += createList(type, ...subquestions);
      }
    }
    return result;
  });

  return questions;
}

function createList(type, ...strings) {
  return `<ol type=${type}>${strings.map(s => `<li>${s}</li>`).reduce((a, c) => a + c)}</ol>`;
}

function updateCompletion(completion, element) {
  const amountCompleted = completion.reduce((acc, cur) => acc + (cur ? 1 : 0), 0); // count amount of true values
  element.innerHTML = r`Completed \( \frac{${amountCompleted}}{${completion.length}} \)`;
  renderMath();
}

function pick(questions, completion, element) {
  let choice = -1;

  if (!completion.every(e => e)) {
    while (choice < 0 || completion[choice]) {
      choice = Math.floor(Math.random() * questions.length);
    }
  }

  return choice;
}

function setComplete(completion, currentQuestion) {
  completion[currentQuestion] = true;
}

function setQuestion(questions, choice, element) {
  if (choice < 0) { 
    element.innerHTML = "<b> Congrats. </b> You have finished all problems!"
  } else { 
    element.innerHTML = "<b> Problem. </b>" + questions[choice];
  }
  renderMath();
}

function showAll(questions, element) {
  element.innerHTML = `<b> Problem. </b>${questions.reduce((acc, cur) => acc +`</br> </br> <b> Problem. </b> ${cur}`)}`;
  renderMath();
}


let completion;
let currentQuestion;
let course; // 0: Algebra, 1: Analysis, 2: Probability
let showingAll = false;


// Add KaTeX.js rendering to the whole document
document.addEventListener("DOMContentLoaded", () => {
  renderMath()
  // show page once KaTeX finishes loading
  setTimeout(() => document.getElementsByTagName("html")[0].style.visibility = "visible", 200); 
});

window.onload = async() => {
  let questionP = document.querySelector("#question-p");
  let completionP = document.querySelector("#completion-p");
  let nextButton = document.querySelector("#next-button");
  let showAllButton = document.querySelector("#show-all-button");
  let resetButton = document.querySelector("#reset-button");
  let topicsDiv = document.querySelector("#topics-div");
  let title = document.querySelector("#title");


  nextButton.onclick = () => {
    setComplete(completion[course], currentQuestion[course]);
    window.localStorage.setItem("dream-completion", JSON.stringify(completion));
    updateCompletion(completion[course], completionP);
    currentQuestion[course] = pick(questions[course], completion[course], questionP);
    window.localStorage.setItem("dream-currentQuestion", JSON.stringify(currentQuestion));
    setQuestion(questions[course], currentQuestion[course], questionP);
  };

  showAllButton.onclick = () => {
    showingAll = !showingAll;
    if (showingAll) {
      showAll(questions[course], questionP)
    } else {
      setQuestion(questions[course], currentQuestion[course], questionP);
    }
    showAllButton.innerHTML = showingAll ? "Hide" : "Show All";
    nextButton.style.display = showingAll ? "none" : "inline";
  };
  // showAllButton.onclick(); // ONLY FOR DEVELOPMENT, REMOVE IN PRODUCTION

  resetButton.onclick = () => {
    completion[course] = questions[course].map(_ => false);
    updateCompletion(completion[course], completionP);
    currentQuestion[course] = pick(questions[course], completion[course], questionP);
    setQuestion(questions[course], currentQuestion[course], questionP);
    window.localStorage.setItem("dream-currentQuestion", JSON.stringify(currentQuestion));
    window.localStorage.setItem("dream-completion", JSON.stringify(completion));
    window.localStorage.setItem("dream-course", course);
  };

  let questions = [];
  let response = await fetch(root + "topics.json");
  let courses = await response.json();
  let titles = [];
  for (let i = 0; i < courses.length; i++) {
    titles.push(courses[i].nickname);
    let element = document.createElement('button');
    element.textContent = courses[i].name;
    if (i < courses.length - 1) {
      element.className = "right-margin";
    }
    topicsDiv.appendChild(element);

    response = await fetch(root + `questions/${courses[i].filename}`);
    questionsText = await response.text();
    questions.push(parseText(questionsText));
  };

  Array.from(topicsDiv.children).forEach((b, i) => {
    b.onclick = () => {
      showingAll = false;
      showAllButton.innerHTML = showingAll ? "Hide" : "Show All";
      nextButton.style.display = showingAll ? "none" : "inline";
      title.innerHTML = parseTitle(titles[i]);
      course = i;
      if (currentQuestion[course] < 0) {
        currentQuestion[course] = pick(questions[course], completion[course], questionP);
        window.localStorage.setItem("dream-currentQuestion", JSON.stringify(currentQuestion));
        window.localStorage.setItem("dream-completion", JSON.stringify(completion));
        window.localStorage.setItem("dream-course", course);
      }
      updateCompletion(completion[course], completionP);
      setQuestion(questions[course], currentQuestion[course], questionP);
      renderMath();
      window.localStorage.setItem("dream-course", course);
    };
  });

  if (window.localStorage.getItem("dream-course")) {
    completion = JSON.parse(window.localStorage.getItem("dream-completion"));
    currentQuestion = JSON.parse(window.localStorage.getItem("dream-currentQuestion"));
    course = window.localStorage.getItem("dream-course");
  } else {
    completion = questions.map(q => q.map(_ => false));
    currentQuestion = titles.map(_ => -1);
    course = 0;
  }

  title.textContent = parseTitle(titles[course]);

  updateCompletion(completion[course], completionP);
  if (currentQuestion[course] < 0) {
    currentQuestion[course] = pick(questions[course], completion[course], questionP);
    window.localStorage.setItem("dream-currentQuestion", JSON.stringify(currentQuestion));
    window.localStorage.setItem("dream-completion", JSON.stringify(completion));
    window.localStorage.setItem("dream-course", course);
  }

  setQuestion(questions[course], currentQuestion[course], questionP);
}
