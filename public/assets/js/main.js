$(document).on('page:fetch',   function() { $.AMUI.progress.start(); });
$(document).on('page:change',  function() { $.AMUI.progress.done(); });
$(document).on('page:restore', function() { $.AMUI.progress.remove(); });