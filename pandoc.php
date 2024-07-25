<?php
  if ('post' === strtolower($_SERVER['REQUEST_METHOD'])) {
    include 'localConfig.php';

    // prepare for debug
    $debug = false;
    if (file_exists('DEBUG')) {
      $debug = true;
    }

    // DEBUG: output all set variables from $_POST and $_FILES
    if ($debug) {
      var_dump($_POST);
      var_dump($_FILES);
      echo '==================================================
      ';
    }

    // give input file a name that shouldn't collide with other users
    $timestamp = microtime(true);
    if ($_POST['useInputFile'] == "true" && ctype_alnum($_POST['inputFileExtension'])) {
      $inputFile = 'input/input' . $timestamp . '.' . $_POST['inputFileExtension'];
      move_uploaded_file($_FILES['inputFile']['tmp_name'], $inputFile);
    } else {
      $inputFile = 'input/input' . $timestamp . '.txt';
      // always use a file instead a string from stdin (because of security and special characters like ')
      file_put_contents($inputFile, $_POST['input']);
    }

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
    if (ctype_alnum($_POST['wrap'])) {
      $command .= ' --wrap=' . $_POST['wrap'];
    }
    // highlight styling
    if ($_POST['highlightStyle'] == "none") {
      $command  .= ' --no-highlight';
    } else {
      if (ctype_alnum($_POST['highlightStyle'])) {
        $command .= ' --highlight-style=' . $_POST['highlightStyle'];
      }
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
    $aValidChars = array('-', '_');
    if(!ctype_alnum(str_replace($aValidChars, '', $_POST['from']))) {
      $command .= ' --from=' . $_POST['from'];
    }
    // Output format
    // option 'preview' should be rendered in the gui so use HTML
    if ($_POST['to'] == "preview") {
      $command  .= ' --to=html5';
    // pdf - see https://pandoc.org/MANUAL#context
    // you need to have context installed - see https://wiki.contextgarden.net/Installation
    } elseif ($_POST['to'] == "pdf") {
      $command  .= ' --to=context+tagging -V pdfa=3a';
      // pdf is only working in standalone mode
      if ($_POST['standalone'] == "false") {$command .= ' --standalone';}
    } else {
      if(!ctype_alnum(str_replace($aValidChars, '', $_POST['to']))) {
        $command .= ' --to=' . $_POST['to'];
      }
    }
    // set output file if asked for
    if ($_POST['useOutputFile'] == "true" && ctype_alnum($_POST['outputFileExtension'])) {
      $command .= ' -o output/output' . $timestamp . '.' . $_POST['outputFileExtension'];
    }
    // always use a file instead a string from stdin (because of security and special characters like ')
    $command .= ' ' . $inputFile;

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
    if (file_exists($inputFile)) {
      unlink($inputFile);
    }

    // return result
    if ($_POST['useOutputFile'] == "false") {
      // put the output string back to the client
      echo "$return";
    } else {
      // return the file binary
      if (ctype_alnum($_POST['outputFileExtension'])) {
        readfile('output/output' . $timestamp . '.' . $_POST['outputFileExtension']);
        unlink('output/output' . $timestamp . '.' . $_POST['outputFileExtension']);
      }
    }
  }
?>
