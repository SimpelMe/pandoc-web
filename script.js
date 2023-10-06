const urlHost = window.location.href.substr(0, window.location.href.lastIndexOf("/"));

// the following object keeps the file extension for the select option values of 'from' and 'to'
// access: value = extension["key"]
const extension = {"asciidoc_legacy": "asciidoc", "asciidoc": "asciidoc", "beamer": "tex", "biblatex": "bib", "bibtex": "bibtex", "chunkedhtml": "zip", "commonmark_x": "md", "commonmark": "md", "context": "tex", "creole": "txt", "csljson": "json", "csv": "csv", "docbook5": "xml", "docbook": "xml", "docx": "docx", "dokuwiki": "txt", "dzslides": "html", "endnotexml": "xml", "epub2": "epub", "epub3": "epub", "fb2": "fb2", "gfm": "md", "haddock": "md", "html4": "html", "html5": "html", "html": "html", "icml": "icml", "ipynb": "ipynb", "jats_archiving": "xml", "jats_articleauthoring": "xml", "jats_publishing": "xml", "jats": "xml", "jira": "txt", "json": "json", "latex": "tex", "man": "man", "markdown_mmd": "md", "markdown_phpextra": "md", "markdown_strict": "md", "markdown": "md", "markua": "md", "mediawiki": "txt", "ms": "ms", "muse": "txt", "native": "hs", "odt": "odt", "opendocument": "odf", "opml": "xml", "org": "txt", "pdf": "pdf", "plain": "txt", "pptx": "pptx", "preview": "html", "revealjs": "html", "ris": "ris", "rst": "rst", "rtf": "rtf", "s5": "html", "slideous": "html", "slidy": "html", "t2t": "t2t", "tei": "tei", "texinfo": "texi", "textile": "textile", "tikiwiki": "txt", "tsv": "tsv", "twiki": "txt", "typst": "typ", "vimwiki": "txt", "xwiki": "txt", "zimwiki": "txt"};

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
  console.log(document.getElementById('from').value);
  var inputFileExtension = extension[document.getElementById('from').value];
  console.log(inputFileExtension);
  var useOutputFile  = document.getElementById('cb-outputfile').checked;
  console.log(document.getElementById('to').value);
  var outputFileExtension = extension[document.getElementById('to').value];
  console.log(outputFileExtension);
  // content
  var from  = document.getElementById('from').value;
  if (from === "none") {
    if (alert === true) {
      pushErrorMessage("Error: You must select an input format in the 'From' pulldown menu.", "from");
    }
    return;
  }
  var to  = document.getElementById('to').value;
  var input  = document.getElementById('input').value;
  if (isEmpty(input)) {
    if (alert === true) {
      pushErrorMessage("Error: You must give some input to convert.", "input");
    }
    return;
  }
  var formData = new FormData();
  // checkboxes
  formData.append('standalone', standalone);
  formData.append('tableOfContents', tableOfContents);
  formData.append('numberSections', numberSections);
  formData.append('citeproc', citeproc);
  // selects
  formData.append('wrap', wrap);
  formData.append('highlightStyle', highlightStyle);
  formData.append('htmlMathMethod', htmlMathMethod);
  // files
  formData.append('useInputFile', useInputFile);
  formData.append('inputFileExtension', inputFileExtension);
  formData.append('useOutputFile', useOutputFile);
  formData.append('outputFileExtension', outputFileExtension);
  // content
  formData.append('from', from);
  formData.append('to', to);
  formData.append('input', input);

  fetch(url, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
          throw new Error("HTTP error " + response.status);
      }
      console.log('response');
      if (useOutputFile) {
        return response.blob();
      } else {
        return response.text();
      }
    })
    .then(content => {
      console.log('context');
      if (useOutputFile) {
        // output as file
        let blob = new Blob([content], {type: 'text/plain'});
        let download = document.getElementById('download');
        download.href = URL.createObjectURL(blob);
        let timestamp = new Date().toISOString().replaceAll('T','_').replaceAll(':', '-').slice(0, 19);
        download.setAttribute("download", "output_" + timestamp + "." + outputFileExtension);
        // set a notice on the output field
        document.getElementById("output").innerText = "Use download link above to download 'output_" + timestamp + "." + outputFileExtension + "'.";
      } else {
        // console.log(text);
        if (to === "preview") {
          // console.log("preview");
          document.getElementById("output").innerHTML = content;
        } else {
          // delete all elements contents
          document.getElementById("output").innerHTML = "";
          var node = document.createElement("pre");
          document.getElementById("output").appendChild(node);
          node.innerText = content;
        }
      }
      console.log('end of fetch');
    })
    .catch(error => {
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

function checkInputFile() {
  if (document.getElementById('cb-inputfile').checked === true) {
    document.getElementById('inputfile').removeAttribute("disabled");
    document.getElementById('upload-button').removeAttribute("disabled");
  } else {
    document.getElementById('inputfile').setAttribute("disabled", "disabled");
    document.getElementById('upload-button').setAttribute("disabled", "disabled");
  }
}

function checkOutputFile() {
  if (document.getElementById('cb-outputfile').checked === true) {
    document.getElementById('download').setAttribute("href", "#");
  } else {
    document.getElementById('download').removeAttribute("href");
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

function pushErrorMessage(text, elementById) {
  var errorMessageText = document.getElementById('errorMessageText');
  errorMessageText.innerText = text;
  errorMessageText.role = 'alert';
  if (typeof elementById !== 'undefined') {
    document.getElementById(elementById).focus();
  }
  dialog.showModal();
}

// test if a string only contains whitespaces and newlines
function isEmpty(string) {
  return (string.length === 0 || !string.trim());
};

function useExample() {
  // console.log(example);
  var inputField = document.getElementById("input");
  inputField.value = example;
  document.getElementById('from').value = 'markdown';
  // fire onInput event to adapt height of textarea
  var eventInput = new Event('input', { bubbles: true });
  inputField.dispatchEvent(eventInput);
  // execute pandoc to show example on preview
  pandoc();
}
