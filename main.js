function renderMath() {
  renderMathInElement(document.body, {
    delimiters: 
    [
      {left: r`\[`, right: r`\]`, display: true},
      {left: r`\(`, right: r`\)`, display: false},
    ],
    macros: {
      "\\N": r`\mathbb N`,
      "\\Z": r`\mathbb Z`,
      "\\R": r`\mathbb R`,
      "\\Q": r`\mathbb Q`,
      "\\E": r`\mathbb E`,
      "\\Aut": r`\operatorname{Aut}`,
      "\\Inn": r`\operatorname{Inn}`,
      "\\Sym": r`\operatorname{Sym}`,
      "\\inv": r`^{-1}`,
      "\\surject": r`\twoheadrightarrow`,
      "\\inject": r`\hookrightarrow`,
      "\\isom": r`\cong`,
      "\\ep": r`\varepsilon`,
      "\\subset": r`\subseteq`,
      "\\set": r`\{ #1 \}`,
      "\\abs": r`\left \lvert #1 \right \rvert`,
      "\\given": r`\; | \;`,
      "\\of": r`\circ`,
    }
  });
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

const titles = [
  r`\( \R \text{osie's} \) \( \mathbb{D}\text{ream} \)`,
  r`\( \R \text{osie's} \) \( \mathbb{N}\text{ightmare} \)`,
  r`\( \R \text{osie's} \) \( \mathbb{N}\text{ightmare} \)`,
  r`\( \R \text{osie's} \) \( \mathbb{H}\text{ell} \)`,
];

let completion;
let currentQuestion;
let course; // 0: Algebra, 1: Analysis, 2: Probability
let showingAll = false;

if (window.localStorage.getItem("dream-course")) {
  completion = JSON.parse(window.localStorage.getItem("dream-completion"));
  currentQuestion = JSON.parse(window.localStorage.getItem("dream-currentQuestion"));
  course = window.localStorage.getItem("dream-course");
} else {
  completion = questions.map(q => q.map(_ => false));
  currentQuestion = titles.map(_ => -1);
  course = 0;
}

// Add KaTeX.js rendering to the whole document
document.addEventListener("DOMContentLoaded", () => {
  renderMath()
  // show page once KaTeX finishes loading
  setTimeout(() => document.getElementsByTagName("html")[0].style.visibility = "visible", 200); 
});

window.onload = () => {
  let questionP = document.querySelector("#question-p");
  let completionP = document.querySelector("#completion-p");
  let nextButton = document.querySelector("#next-button");
  let showAllButton = document.querySelector("#show-all-button");
  let resetButton = document.querySelector("#reset-button");
  let topicsDiv = document.querySelector("#topics-div");
  let title = document.querySelector("#title");

  title.innerHTML = titles[course];

  updateCompletion(completion[course], completionP);
  if (currentQuestion[course] < 0) {
    currentQuestion[course] = pick(questions[course], completion[course], questionP);
    window.localStorage.setItem("dream-currentQuestion", JSON.stringify(currentQuestion));
    window.localStorage.setItem("dream-completion", JSON.stringify(completion));
    window.localStorage.setItem("dream-course", course);
  }

  setQuestion(questions[course], currentQuestion[course], questionP);

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

  Array.from(topicsDiv.children).forEach((b, i) => {
    b.onclick = () => {
      showingAll = false;
      showAllButton.innerHTML = showingAll ? "Hide" : "Show All";
      nextButton.style.display = showingAll ? "none" : "inline";
      title.innerHTML = titles[i];
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
}
