const r = String.raw; // raw string tag for convenient LateX/KaTeX

const macros = {
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
  "\\set": r`\left \{ #1 \right \}`,
  "\\abs": r`\left \lvert #1 \right \rvert`,
  "\\given": r`\; | \;`,
  "\\of": r`\circ`,
  "\\ideal": r`\triangleleft`
};
