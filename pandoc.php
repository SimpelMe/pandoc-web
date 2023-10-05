<?php
  if ('post' === strtolower($_SERVER['REQUEST_METHOD'])) {
    include 'localConfig.php';

    // prepare for debug
    $debug = false;
    if (file_exists('DEBUG')) {
      $debug = true;
    }

    // DEBUG: output all set variables from $_POST
    if ($debug) {
      var_dump($_POST);
      echo '==================================================
      ';
    }

    // give input file a name that shouldn't collide with other users
    $file = 'input/input' . microtime(true) . '.txt';
    // always use a file instead a string from stdin (because of security and special characters like ')
    file_put_contents($file, $_POST['input']);

    // run pandoc in a sandbox, limiting IO operations in readers and writers to reading the files specified on the command line.
    $command = 'pandoc --sandbox';
    // avoid DOS attacks - see https://pandoc.org/chunkedhtml-demo/19-a-note-on-security.html #5
    $command .= ' +RTS -M512M -RTS';
    // return no styling as this styling is effecting my preview too
    $command .= ' --css nostyle.css';

    // Checkboxes
    // produce a standalone HTML file with no external dependencies. This option works only with HTML output formats.
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

    $command .= ' --embed-resources=true';
    // Input format
    $command .= ' --from=' . $_POST['from'];
    // Output format
    // option 'preview' should be rendered in the gui so use HTML
    if ($_POST['to'] == "preview") {
      $command  .= ' --to=html5';
    } else {
      $command .= ' --to=' . $_POST['to'];
    }

    // always use a file instead a string from stdin (because of security and special characters like ')
    $command .= ' ' . $file;

    // DEBUG: output error messages from cmd line
    if ($debug) {
      $command .= '  2>&1';
    }

    // DEBUG: output the whole command line
    if ($debug) {
      echo $command;
      echo '
      ';
      echo '==================================================
      ';
    }

    // put the path to pandoc temporarily to the servers path
    // configure the path in localConfig.php
    putenv("PATH=" . PATH);
    // execute pandoc
    $return = shell_exec($command);
    // delete input file as it is not needed anymore
    unlink($file);
    // put the output string back to the client
    echo "$return";
  }
?>
