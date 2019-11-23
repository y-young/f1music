<?php
return [
    'loginUrl' => 'http://fzyz.net/sys/login.shtml',
    'openUpload' => true,
    'openVote' => true,
    'openDownload' => false,
    'admin' => [],
    'censor' => [],
    'debugAuth' => env('APP_DEBUG', false),
    'playlist' => '2064024722',
    'status' => [
        'upload' => [
            'start' => '2019-11-21 00:00',
            'end' => '2019-12-08 00:00'
        ],
        'vote' => [
            'start' => '2019-12-22 00:00',
            'end' => '2020-1-5 00:00'
        ]
    ]
];
