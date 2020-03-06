# Rosie's Dream

One night, during one of Rosie's epsilon sleep, she dreamt of a way she could practice for math exams by randomly selecting problems.
Low and behold, her dream came true!

## Tech "Stack"

This project is written in pure JavaScript and a single library called KaTeX.js for client-side math rendering.
All the application logic is written in the file `main.js`.
It is important to note that KaTeX has some differences from vanilla LaTeX.
It does not include package management and only supports math mode.
A list of supported functions can be found [here](https://katex.org/docs/supported.html).

**Note.** I strongly prefer using `\( ... \)` and `\[ ... \]` to enter inline math mode and display math mode rather than `$ ... $` and `$$ ... $$`, respectively.
That is why at the moment the site only supports `\( ... \)` and `\[ ... \]`.
If you want to use `$ ... $` and `$$ ... $$` you can make a pull request.

## Repo Organization

```
├── archive                          # folder for archived stuff
│   └── questions.js                 # old file containing questions from Fall 2019 courses
├── assets                           # a folder for application icons
│   ├── android-icon-144x144.png
│   ├── .
│   ├── .
│   ├── .
│   └── ms-icon-70x70.png
├── browserconfig.xml                # no clue what this is or where it came from
├── favicon.ico                      # site icon
├── index.html                       # main html file
├── macros.js                        # file containing all the LaTeX/KaTeX macros
├── main.js                          # main js file
├── manifest.json                    # something something progressive web apps
├── questions                        # folder containing problem statements, one file for each course
│   ├── advancedCalculus.tex
│   ├── algebra4.tex
│   └── analysis4.tex
├── style.css                        # this file is responsible for the "LaTeX" aesthetics
└── topics.json                      # json file containing metadata about the courses
```

## Contribution

If you want to add or change a problem, edit the corresponding file in the `questions/` folder and do a pull request.
The structure of the `.tex` files looks like this

```
\begin{problem}
Prove that blue is the best primary color.
\end{problem}

\begin{problem}
\begin{enumerate}[a]
\item
Prove that yellow not a good color.
\item
Prove that red is a terrible color.
\item
Prove that black is a color.
\item
Prove that "color" is the correct spelling.
\end{enumerate}
\end{problem}
```

Importantly, no LaTeX commands work aside from `\begin{problem}`, `\end{problem}`, `\begin{enumerate}[<type>]`, `\item`, and `\end{enumerate}`.
These are merely there to make it easier to paste from existing `.tex` assignment files. Each question is expected to be surrounded by `\begin{problem}` and `\end{problem}`.
For multiple part questions, there is the `\begin{enumerate}[<type>] ... \end{enumerate}` "environment".
It expects a single argument, either "1" or "a", depending on how you want to label the question.
At the moment, it does not support nested enumeration, so that is another thing you can contribute.

If you wish to add a new course, you need to add an entry to the `topics.json` file, which looks like this

```
[
  {
    "name": "Algebra 4",
    "nickname": "Rosie's Dream",
    "filename": "algebra4.tex"
  },
  {
    "name": "Analysis 4",
    "nickname": "Rosies's Nightmare",
    "filename": "analysis4.tex"
  },
  {
    "name": "Advanced Calculus",
    "nickname": "Rosie's Hell",
    "filename": "advancedCalculus.tex"
  }
]
```

Then add a new `.tex` file in the `questions/` folder.

## Issues

If you already used this site before and it does not work anymore, erase all site data.
This is due to the fact that arrays rather than dictionaries are used for the Local Storage.
As mentioned, another issue is that nested enumerations are not yet supported.
