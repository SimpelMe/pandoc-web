const urlHost = window.location.href.substr(0, window.location.href.lastIndexOf("/"));

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
        return response.text();
    })
    .then(text => {
        // console.log(text);
        if (to === "preview") {
          // console.log("preview");
          document.getElementById("output").innerHTML = text;
        } else {
          // delete all elements contents
          document.getElementById("output").innerHTML = "";
          var node = document.createElement("pre");
          document.getElementById("output").appendChild(node);
          node.innerText = text;
        }
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
