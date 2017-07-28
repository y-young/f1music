<?php
return [
    'openUpload' => true,
    'openVote' => true,
    'admin' => [
        '***REMOVED***',
    ],
    'basepath' => rtrim(app()->basePath('/'), '/'),
    'apppath' => rtrim(app()->basePath('App/'), '/'),
    'publicpath' => rtrim(app()->basePath('public/'), '/'),
    'debugauth' => true
];
