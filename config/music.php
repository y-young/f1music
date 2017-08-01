<?php
return [
    'loginUrl' => 'http://fzyz.net/sys/login.shtml',
    'openUpload' => true,
    'openVote' => true,
    'admin' => [
        '***REMOVED***',
    ],
    'basepath' => rtrim(app()->basePath('/'), '/'),
    'apppath' => rtrim(app()->basePath('app/'), '/'),
    'publicpath' => rtrim(app()->basePath('public/'), '/'),
    'debugauth' => true
];
