<?php
return [
    'loginUrl' => 'http://old.fzyz.net/sys/login.shtml',
    'openUpload' => true,
    'openVote' => true,
    'openDownload' => false,
    'admin' => [],
    'censor' => [],
    'debugAuth' => env('APP_DEBUG', false),
    'playlist' => '2064024722',
    'status' => [
        //Format: ISO 8601 / RFC 2822 Date time
        //example: 1970-01-01 00:00
        'upload' => [
            'start' => '2019-11-24 00:00',
            'end' => '2019-12-09 00:00'
        ],
        'vote' => [
            'start' => '2019-12-22 00:00',
            'end' => '2020-01-06 00:00'
        ]
    ]
];
