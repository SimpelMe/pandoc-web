<?php
  if ('post' === strtolower($_SERVER['REQUEST_METHOD'])) {
    // var_dump($_POST);
    // echo '==================================================
    // ';
    $file = 'input/input' . microtime(true) . '.txt';
    file_put_contents($file, $_POST['input']);
    // Run pandoc in a sandbox, limiting IO operations in readers and writers to reading the files specified on the command line.
    $command = 'pandoc --sandbox';
    // return no styling
    $command .= ' --css nostyle.css';
    // Option 'preview' should be rendered in the gui so use HTML
    // Checkboxes
    if ($_POST['standalone'] == "true") {$command .= ' --standalone';}
    if ($_POST['tableOfContents'] == "true") {$command .= ' --table-of-contents=true';}
    if ($_POST['numberSections'] == "true") {$command .= ' --number-sections';}
    if ($_POST['citeproc'] == "true") {$command .= ' --citeproc';}
    // Selects
    // text wrapping
    $command .= ' --wrap=' . $_POST['wrap'];
    // highlight styling
    if ($_POST['highlightStyle'] == "none") {
      $command  .= ' --no-highlight';
    } else {
      $command .= ' --highlight-style=' . $_POST['highlightStyle'];
      // to see the highlighting in preview mode standalone is needed
      if ($_POST['to'] == "preview" && $_POST['standalone'] == "false") {$command .= ' --standalone';}
    }
    // html math rendering
    switch ($_POST['htmlMathMethod']) {
      case 'plain':
          break;
      case 'gladtex':
          $command  .= ' --gladtex';
          break;
      case 'katex':
          $command  .= ' --katex';
          break;
      case 'mathjax':
          $command  .= ' --mathjax';
          break;
      case 'mathml':
          $command  .= ' --mathml';
          break;
      case 'webtex':
          $command  .= ' --webtex';
          break;
    }
    // Produce a standalone HTML file with no external dependencies. This option works only with HTML output formats.
    // Never return styling as the preview would be often broken
    $command .= ' --embed-resources=true';
    $command .= ' --from=' . $_POST['from'];
    if ($_POST['to'] == "preview") {
      $command  .= ' --to=html5';
    } else {
      $command .= ' --to=' . $_POST['to'];
    }
    // Always use a file instead a string from stdin (because of security and special characters like ')
    $command .= ' ' . $file;
    // echo $command;
    // echo '
    // ';
    // echo '==================================================
    // ';
    $return = shell_exec($command);
    unlink($file);
    echo "$return";
  }
?>
