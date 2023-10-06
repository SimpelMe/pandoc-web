const urlHost = window.location.href.substr(0, window.location.href.lastIndexOf("/"));

// the following object keeps the file extension for the select option values of 'from' and 'to'
// access: value = extension["key"]
const extension = {"asciidoc_legacy": "asciidoc", "asciidoc": "asciidoc", "beamer": "tex", "biblatex": "bib", "bibtex": "bibtex", "chunkedhtml": "zip", "commonmark_x": "md", "commonmark": "md", "context": "tex", "creole": "txt", "csljson": "json", "csv": "csv", "docbook5": "xml", "docbook": "xml", "docx": "docx", "dokuwiki": "txt", "dzslides": "html", "endnotexml": "xml", "epub2": "epub", "epub3": "epub", "epub": "epub", "fb2": "fb2", "gfm": "md", "haddock": "md", "html4": "html", "html5": "html", "html": "html", "icml": "icml", "ipynb": "ipynb", "jats_archiving": "xml", "jats_articleauthoring": "xml", "jats_publishing": "xml", "jats": "xml", "jira": "txt", "json": "json", "latex": "tex", "man": "man", "markdown_mmd": "md", "markdown_phpextra": "md", "markdown_strict": "md", "markdown": "md", "markua": "md", "mediawiki": "txt", "ms": "ms", "muse": "txt", "native": "hs", "odt": "odt", "opendocument": "odf", "opml": "xml", "org": "txt", "pdf": "pdf", "plain": "txt", "pptx": "pptx", "preview": "html", "revealjs": "html", "ris": "ris", "rst": "rst", "rtf": "rtf", "s5": "html", "slideous": "html", "slidy": "html", "t2t": "t2t", "tei": "tei", "texinfo": "texi", "textile": "textile", "tikiwiki": "txt", "tsv": "tsv", "twiki": "txt", "typst": "typ", "vimwiki": "txt", "xwiki": "txt", "zimwiki": "txt"};

function pandoc(alert) {
  var url = urlHost + '/pandoc.php';
  if (typeof alert === 'undefined') {
    alert === false;
  }
  // checkboxes
  var standalone  = document.getElementById('standalone').checked;
  var tableOfContents  = document.getElementById('table-of-contents').checked;
  var numberSections  = document.getElementById('number-sections').checked;
  var citeproc  = document.getElementById('citeproc').checked;
  // selects
  var wrap  = document.getElementById('wrap').value;
  var highlightStyle  = document.getElementById('highlight-style').value;
  var htmlMathMethod  = document.getElementById('html-math-method').value;
  // files
  var useInputFile  = document.getElementById('cb-inputfile').checked;
  var inputFileExtension = extension[document.getElementById('from').value];
  // docx, epub or odt must be dilivered as a file
  if (!useInputFile && (inputFileExtension == 'docx' || inputFileExtension == 'epub' || inputFileExtension == 'odt')) {
    if (alert === true) {
      document.getElementById('options').setAttribute("open", "open");
      document.getElementById('cb-inputfile').checked = true;
      checkInputFile();
      pushDialog("Error: For conversion from '" + inputFileExtension + "' you must select a file as input.", "error", "inputfile");
    }
    return;
  }
  var inputFile = false;
  if (useInputFile) {
    inputFile = document.getElementById('inputfile').files[0];
  }
  if (!inputFile && useInputFile) {
    if (alert === true) {
      pushDialog("Error: Nothing to convert.\nYou must select a file as input.", "error", "inputfile");
    }
    return;
  }
  var useOutputFile  = document.getElementById('cb-outputfile').checked;
  var outputFileExtension = extension[document.getElementById('to').value];
  // content
  var from  = document.getElementById('from').value;
  if (from === "none") {
    if (alert === true) {
      pushDialog("Error: You must select an input format in the 'From' pulldown menu.", "error", "from");
    }
    return;
  }
  var to  = document.getElementById('to').value;
  var input  = document.getElementById('input').value;
  if (isEmpty(input) && !useInputFile) {
    if (alert === true) {
      pushDialog("Error: Nothing to convert.\n\nYou must either write something into the 'Input field' or select a file as input in the 'Options'.", "error");
    }
    return;
  }
  var formData = new FormData();
  // checkboxes
  formData.set('standalone', standalone);
  formData.set('tableOfContents', tableOfContents);
  formData.set('numberSections', numberSections);
  formData.set('citeproc', citeproc);
  // selects
  formData.set('wrap', wrap);
  formData.set('highlightStyle', highlightStyle);
  formData.set('htmlMathMethod', htmlMathMethod);
  // files
  formData.set('useInputFile', useInputFile);
  formData.set('inputFileExtension', inputFileExtension);
  formData.set('inputFile', inputFile);
  formData.set('useOutputFile', useOutputFile);
  formData.set('outputFileExtension', outputFileExtension);
  // content
  formData.set('from', from);
  formData.set('to', to);
  formData.set('input', input);

  pushDialog('Converting with pandoc', 'busy');

  fetch(url, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
          throw new Error("HTTP error " + response.status);
      }
      if (useOutputFile) {
        return response.blob();
      } else {
        return response.text();
      }
    })
    .then(content => {
      if (useOutputFile) {
        // output as file
        let blob = new Blob([content], {type: 'text/plain'});
        let download = document.getElementById('download');
        download.href = URL.createObjectURL(blob);
        let timestamp = new Date().toISOString().replaceAll('T','_').replaceAll(':', '-').slice(0, 19);
        download.setAttribute("download", "output_" + timestamp + "." + outputFileExtension);
        document.getElementById("download").innerText = "Download output_" + timestamp + "." + outputFileExtension;
        // close the busy dialog
        dialog.close()
      } else {
        if (to === "preview") {
          document.getElementById("output").innerHTML = content;
        } else {
          // delete all elements contents
          document.getElementById("output").innerHTML = "";
          var node = document.createElement("pre");
          document.getElementById("output").appendChild(node);
          node.innerText = content;
        }
        setMainButtonsAppearance();
        // close the busy dialog
        dialog.close()
      }
    })
    .catch(error => {
      // close the busy dialog
      dialog.close()
      pushDialog('Error fetching pandoc output: ' + error, 'error')
      console.log('Error fetching pandoc output: ' + error);
    });
}

// option toc needs option standalone so check standalone
function toggleStandalone() {
  if (document.getElementById('table-of-contents').checked === true) {
    document.getElementById('standalone').checked = true;
  }
}

// option toc needs option standalone so uncheck toc if unchecking standalone
function toggleToc() {
  if (document.getElementById('standalone').checked === false) {
    document.getElementById('table-of-contents').checked = false;
  }
}

function setMainButtonsAppearance() {
  const convertButton = document.getElementById('convert');
  const copyButton = document.getElementById('copy');
  const from  = document.getElementById('from').value;
  const useInputFile  = document.getElementById('cb-inputfile').checked;
  let inputFile = false;
  if (useInputFile) {
    inputFile = document.getElementById('inputfile').files[0];
  }
  var input  = document.getElementById('input').value;
  const output = document.getElementById('output');

  // convert button setting
  if (from === "none") {
    convertButton.setAttribute('disabled', 'disabled');
  } else if (!inputFile && useInputFile) {
    convertButton.setAttribute('disabled', 'disabled');
  } else if (isEmpty(input) && !useInputFile) {
    convertButton.setAttribute('disabled', 'disabled');
    output.innerText = "";
  } else {
    convertButton.removeAttribute('disabled');
  }

  const outputText = document.getElementById('output').innerText;

  // copy button setting
  if (typeof outputText === 'undefined') {
    copyButton.setAttribute('disabled', 'disabled')
  } else if (isEmpty(outputText)) {
    copyButton.setAttribute('disabled', 'disabled')
  } else {
    copyButton.removeAttribute('disabled')
  }
}

function checkInputFile() {
  if (document.getElementById('cb-inputfile').checked === true) {
    document.getElementById('inputfile').removeAttribute("disabled");
    document.getElementById('input').setAttribute("disabled", "disabled");
    document.getElementById('label-inputfield').classList.add("disabled");
    document.getElementById('output').innerText = "";
  } else {
    document.getElementById('inputfile').setAttribute("disabled", "disabled");
    document.getElementById('input').removeAttribute("disabled");
    document.getElementById('label-inputfield').classList.remove("disabled");
  }
}

function checkOutputFile() {
  if (document.getElementById('cb-outputfile').checked === true) {
    document.getElementById('download').setAttribute("href", "#");
    document.getElementById('copy').setAttribute("disabled", "disabled");
    document.getElementById('output').classList.add("disabled");
    document.getElementById('output').innerText = "";
    document.getElementById('label-outputfield').classList.add("disabled");
  } else {
    document.getElementById('download').removeAttribute("href");
    document.getElementById("download").innerText = "";
    document.getElementById('copy').removeAttribute("disabled");
    document.getElementById('output').classList.remove("disabled");
    document.getElementById('label-outputfield').classList.remove("disabled");
  }
}

// This will return the raw HTML, but perhaps you want to do something different,
// for example: recursively embed computed styles:
// https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
function serializeElement(element) {
  return element.outerHTML;
}

async function copyOutput() {
  var element = document.getElementById('output');
  const html = serializeElement(element);
  const htmlBlob = new Blob([html], { type: 'text/html' });
  const text = element.textContent ?? '';
  const textBlob = new Blob([text], { type: 'text/plain' });
  const clipboardItem = new ClipboardItem({
      [htmlBlob.type]: htmlBlob,
      [textBlob.type]: textBlob,
  });
  return navigator.clipboard.write([clipboardItem]);
}

// adapt height of textarea responding to the contents
// it's only working with the corresponding css
function adaptTextareaSize() {
  const growers = document.querySelectorAll(".grow-wrap");
  growers.forEach((grower) => {
    const textarea = grower.querySelector("textarea");
    textarea.addEventListener("input", () => {
      grower.dataset.replicatedValue = textarea.value;
    });
  });
}

function pushDialog(text, type, elementById) {
  var dialogText = document.getElementById('dialogText');
  dialogText.innerText = text;
  if (type === "error") {
    document.getElementById('dialog').classList.add('error-dialog');
    document.getElementById('dialog').classList.remove('busy-dialog');
    dialogText.role = 'alert';
    if (typeof elementById !== 'undefined') {
      document.getElementById(elementById).focus();
    }
  } else if (type === "busy") {
    document.getElementById('dialog').classList.remove('error-dialog');
    document.getElementById('dialog').classList.add('busy-dialog');
  }
  dialog.showModal();
}

// test if a string only contains whitespaces and newlines
function isEmpty(string) {
  return (string.length === 0 || !string.trim());
};

function useExample() {
  var inputField = document.getElementById("input");
  inputField.value = example;
  document.getElementById('from').value = 'markdown';
  document.getElementById('cb-inputfile').checked = false;
  checkInputFile();
  // fire onInput event to adapt height of textarea
  var eventInput = new Event('input', { bubbles: true });
  inputField.dispatchEvent(eventInput);
  // execute pandoc to show example on preview
  pandoc();
}
