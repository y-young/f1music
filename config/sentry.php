<?php

return array(
    'dsn' => '***REMOVED***',

    // capture release as git sha
    'release' => trim(exec('git log --pretty="%h" -n1 HEAD')),
);
