// find the output element
const output = document.getElementById("output");
// initializing the codemirror and pass configuration to support python and dracula theme
const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
              mode: {
                  name: "python",
                  version: 3,
                  singleLineStringErrors: false,
              },
              theme: "dracula",
              lineNumbers: true,
              indentUnit: 4,
              matchBrackets: true,
            });
// set the initial value of the editor
editor.setValue("print('สวัสดีโลก')");

output.value = "กำลังเริ่มโปรแกรม...\n";

if (output.value === "กำลังเริ่มโปรแกรม...\n") {
   //id run
  $("#run").attr("disabled", true);
  $("#clear").attr("disabled", true);
}


// Add pyodide returned value to the output
function addToOutput(stdout) {
  output.value += ">>> " + "\n" + stdout + "\n";
}

// Clean the output section
function clearHistory() {
  output.value = "";
}

// init Pyodide and show sys.version when it's loaded successfully
async function main() {
  let pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/",
  });
  output.value = pyodide.runPython(`
      import sys
      show = list(sys.version.split(" "))
      result = "Python เวอร์ชั่น : " + show[0]
      result
  `);
  output.value += "\n" + "-- Python พร้อมทำงาน --" + "\n";
  $("#run").attr("disabled", false);
  $("#clear").attr("disabled", false);
  return pyodide;
}
// run the main funciton
let pyodideReadyPromise = main();

// pass the editor value to the pyodide.runPython function and show the result in the output section
async function evaluatePython() {
  let pyodide = await pyodideReadyPromise;
  try {
    pyodide.runPython(`
      import io
      sys.stdout = io.StringIO()
      `);
    let result = pyodide.runPython(editor.getValue());
    let stdout = pyodide.runPython("sys.stdout.getvalue()");
    addToOutput(stdout);
  } catch (err) {
    addToOutput(err);
  }
}