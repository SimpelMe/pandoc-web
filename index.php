<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
  <?php include dirname($_SERVER['DOCUMENT_ROOT']) . "/simpel.cc/php/head.php"; ?>
  <link rel="stylesheet" href="style.css">
  <script src="script.js" charset="utf-8"></script>
  <?php include 'example.php'; ?>
  <script>
    const example = `<?php echo $example ?>`;
  </script>
</head>

<body>
  <header>
    <?php include dirname($_SERVER['DOCUMENT_ROOT']) . "/simpel.cc/php/header.php"; ?>
  </header>

  <main>
    <dialog id="dialog">
      <p id="dialogText">Message here</p>
      <button onclick="dialog.close()">Close</button>
    </dialog>
    <div class="first-in-main two-column">
      <div class="left label-w-select">
        <label for="from">From</label>
        <select id="from" name="from" required onchange="pandoc()">
          <option value="none" disabled selected hidden>Select input format ...</option>
          <option value="biblatex">BibLaTeX bibliography</option>
          <option value="bibtex">BibTeX bibliography</option>
          <option value="creole">Creole 1.0</option>
          <option value="csljson">CSL JSON bibliography</option>
          <option value="csv">CSV table</option>
          <option value="docbook">DocBook</option>
          <option value="dokuwiki">DokuWiki markup</option>
          <option value="org">Emacs Org mode</option>
          <option value="endnotexml">EndNote XML bibliography</option>
          <option value="epub">EPUB</option>
          <option value="fb2">FictionBook2 e-book</option>
          <option value="haddock">Haddock markup</option>
          <option value="html">HTML</option>
          <option value="jats">JATS XML</option>
          <option value="jira">Jira/Confluence wiki markup</option>
          <option value="json">JSON version of native AST</option>
          <option value="ipynb">Jupyter notebook</option>
          <option value="latex">LaTeX</option>
          <option value="commonmark">Markdown (CommonMark)</option>
          <option value="commonmark_x">Markdown (CommonMark with extensions)</option>
          <option value="gfm">Markdown (GitHub-Flavored)</option>
          <option value="markdown_mmd">Markdown (Multi)</option>
          <option value="markdown_strict">Markdown (original unextended)</option>
          <option value="markdown">Markdown (Pandoc's)</option>
          <option value="markdown_phpextra">Markdown PHP Extra</option>
          <option value="mediawiki">MediaWiki markup</option>
          <option value="muse">Muse</option>
          <option value="native">native Haskell</option>
          <option value="odt">ODT</option>
          <option value="opml">OPML</option>
          <option value="rst">reStructuredText</option>
          <option value="rtf">Rich Text Format</option>
          <option value="ris">RIS bibliography</option>
          <option value="man">roff man</option>
          <option value="textile">Textile</option>
          <option value="tikiwiki">TikiWiki markup</option>
          <option value="tsv">TSV table</option>
          <option value="twiki">TWiki markup</option>
          <option value="t2t">txt2tags</option>
          <option value="typst">typst</option>
          <option value="vimwiki">Vimwiki</option>
          <option value="docx">Word docx</option>
        </select>
      </div>
      <div class="right label-w-select">
        <label for="to">To</label>
        <select id="to" name="to" required onchange="pandoc()">
          <option value="preview">Preview</option>
          <option value="jats">alias for jats_archiving</option>
          <option value="asciidoc">AsciiDoc (modern) as interpreted by AsciiDoctor</option>
          <option value="asciidoc_legacy">AsciiDoc as interpreted by asciidoc-py</option>
          <option value="biblatex">BibLaTeX bibliography</option>
          <option value="bibtex">BibTeX bibliography</option>
          <option value="context">ConTeXt</option>
          <option value="csljson">CSL JSON bibliography</option>
          <option value="docbook">DocBook 4</option>
          <option value="docbook5">DocBook 5</option>
          <option value="dokuwiki">DokuWiki markup</option>
          <option value="org">Emacs Org mode</option>
          <option value="epub2">EPUB v2</option>
          <option value="epub3">EPUB v3 book</option>
          <option value="fb2">FictionBook2 e-book</option>
          <option value="texinfo">GNU Texinfo</option>
          <option value="haddock">Haddock markup</option>
          <option value="html5">HTML</option>
          <option value="icml">InDesign ICML</option>
          <option value="jats_archiving">JATS XML, Archiving and Interchange Tag Set</option>
          <option value="jats_articleauthoring">JATS XML, Article Authoring Tag Set</option>
          <option value="jats_publishing">JATS XML, Journal Publishing Tag Set</option>
          <option value="jira">Jira/Confluence wiki markup</option>
          <option value="json">JSON version of native AST</option>
          <option value="ipynb">Jupyter notebook</option>
          <option value="latex">LaTeX</option>
          <option value="commonmark">Markdown (CommonMark)</option>
          <option value="commonmark_x">Markdown (CommonMark with extensions)</option>
          <option value="gfm">Markdown (GitHub-Flavored)</option>
          <option value="markdown_mmd">Markdown (Multi)</option>
          <option value="markdown_strict">Markdown (original unextended)</option>
          <option value="markdown">Markdown (Pandoc's)</option>
          <option value="markdown_phpextra">Markdown PHP Extra</option>
          <option value="markua">Markua</option>
          <option value="mediawiki">MediaWiki markup</option>
          <option value="muse">Muse</option>
          <option value="native">native Haskell</option>
          <option value="opendocument">OpenDocument</option>
          <option value="odt">OpenOffice text document</option>
          <option value="opml">OPML</option>
          <option value="pdf">PDF</option>
          <option value="plain">plain text</option>
          <option value="pptx">PowerPoint</option>
          <option value="rst">reStructuredText</option>
          <option value="rtf">Rich Text Format</option>
          <option value="man">roff man</option>
          <option value="ms">roff ms</option>
          <option value="dzslides">Slide Show - DZSlides HTML5 + JavaScript</option>
          <option value="beamer">Slide Show - LaTeX beamer</option>
          <option value="revealjs">Slide Show - reveal.js HTML5 + JavaScript</option>
          <option value="s5">Slide Show - S5 HTML and JavaScript</option>
          <option value="slideous">Slide Show - Slideous HTML and JavaScript</option>
          <option value="slidy">Slide Show - Slidy HTML and JavaScript</option>
          <option value="tei">TEI Simple</option>
          <option value="textile">Textile</option>
          <option value="typst">typst</option>
          <option value="docx">Word docx</option>
          <option value="html4">XHTML 1.0 Transitional</option>
          <option value="xwiki">XWiki markup</option>
          <option value="zimwiki">ZimWiki markup</option>
          <option value="chunkedhtml">zip archive of multiple linked HTML files</option>
        </select>
      </div>
    </div>
    <details id="options">
      <summary>Options</summary>
      <div id="details">
        <div id="checkboxes">
          <label for="standalone" title="Produce a standalone document rather than a fragment">
            <input type="checkbox" id="standalone" name="standalone" onchange="pandoc();toggleToc()">Standalone</label>
          <label for="table-of-contents" title="Add table of contents. This option has no effect unless 'Standalone' is used.">
            <input type="checkbox" id="table-of-contents" name="table-of-contents" onchange="pandoc();toggleStandalone()">TOC</label>
          <label for="number-sections" title="Automatically number sections">
            <input type="checkbox" id="number-sections" name="number-sections" onchange="pandoc()">Number sections</label>
          <label for="citeproc" title="Process citations">
            <input type="checkbox" id="citeproc" name="citeproc" onchange="pandoc()">Citeproc</label>
        </div>
        <div id="selects">
          <label for="wrap">Text wrap
            <select id="wrap" title="text wrapping option" onchange="pandoc()">
            <option selected="" value="auto">Auto</option>
            <option value="none">None</option>
            <option value="preserve">Preserve</option>
          </select>
          </label>
          <label for="highlight-style">Code highlighting
            <select id="highlight-style" title="Source code highlighting style" onchange="pandoc()">
              <option selected="" value="none">None</option>
              <option value="pygments">Pygments</option>
              <option value="breezeDark">BreezeDark</option>
              <option value="espresso">Espresso</option>
              <option value="haddock">Haddock</option>
              <option value="kate">Kate</option>
              <option value="monochrome">Monochrome</option>
              <option value="tango">Tango</option>
              <option value="zenburn">Zenburn</option>
            </select>
          </label>
          <label for="html-math-method">Math render HTML
            <select id="html-math-method" title="How math is rendered" onchange="pandoc()">
            <option id="math-plain" value="plain">Plain</option>
            <option id="math-gladtex" value="gladtex">GladTeX</option>
            <option id="math-katex" value="katex">KaTeX</option>
            <option id="math-mathjax" value="mathjax">MathJax</option>
            <option id="math-mathml" value="mathml">MathML</option>
            <option id="math-webtex" value="webtex">WebTeX</option>
          </select>
          </label>
        </div>
        <input type="button" id="example" name="example" value="Use markdown example" onclick="useExample()">
        <div id="files" class="two-column">
          <div class="left">
            <label for="cb-inputfile" title="Use a file as input">
              <input type="checkbox" id="cb-inputfile" name="cb-inputfile" onchange="checkInputFile(),pandoc()">Use file as input</label>
            <form id="inputfile-form" class="file" action="/input" method="post" enctype="multipart/form-data">
              <label for="inputfile">File
                <input id="inputfile" name="file" type="file" /></label>
            </form>
          </div>
          <div class="right">
            <label for="cb-outputfile" title="Use a file for output">
              <input type="checkbox" id="cb-outputfile" name="cb-outputfile" onchange="checkOutputFile(),pandoc()">Use file for output</label>
            <div class="download">
              <a id="download"></a>
            </div>
          </div>
        </div>
      </div>
    </details>
    <div class="two-column">
      <div class="left">
        <div class="flex-space-between">
          <label for="input" id="label-inputfield" class="labelLikeHeading">Input field</label>
          <button type="button" id="convert" name="convert" title="Convert input.
You can use this shortcut:
OSX: [ Ctrl ] + [ Opt ] + [ p ]
WIN: [ Alt ] + [ p ]" accesskey="p" onclick="pandoc(true)">Convert [p]</button>
        </div>
        <div id="inputDub" class="grow-wrap">
          <textarea id="input" name="input"></textarea>
        </div>
      </div>
      <div class="right">
        <div class="flex-space-between">
          <p id="label-outputfield" class="label">Output field</p>
          <button type="button" id="copy" name="copy" title="Copy output text.
You can use this shortcut:
OSX: [ Ctrl ] + [ Opt ] + [ c ]
WIN: [ Alt ] + [ c ]" accesskey="c" onclick="copyOutput()">Copy output field [c]</button>
        </div>
        <div id="output"></div>
      </div>
    </div>
  </main>
  <script>
    // enable auto height on input textarea
    var inputField = document.getElementById("input");
    inputField.addEventListener("input", adaptTextareaSize());
    inputField.addEventListener("change", adaptTextareaSize());
    // Error messages dialog
    const dialog = document.getElementById("dialog");
    const closeButtonDialog = document.querySelector("dialog button");
    closeButtonDialog.addEventListener("click", () => {
      dialog.close();
    });
    // disable form for input file
    checkInputFile();
    checkOutputFile();
  </script>
</body>

</html>
