<?php

namespace App\Logging;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\RotatingFileHandler;
use Monolog\Formatter\LineFormatter;
use Monolog\LogRecord;
use Monolog\Processor\WebProcessor;

class CustomLogger
{

    /**
     * Create a custom Monolog instance.
     *
     * @return \Monolog\Logger
     */

    public function __invoke(): Logger
    {
        $monolog = new Logger('custom');
        $formatter = new LineFormatter(
            allowInlineLineBreaks: true,
            ignoreEmptyContextAndExtra: true,
            includeStacktraces: true
        );
        $ipProcessor = new ClientIpProcessor();
        $webProcessor = new WebProcessor();

        // DEBUG -> laravel.log
        $debug = new StreamHandler(storage_path('/logs/laravel.log'));
        $debug->setFormatter($formatter);
        $monolog->pushHandler($debug);

        // INFO -> info.log, Daily Log
        $info = new RotatingFileHandler(storage_path('logs/info.log'), 30, Logger::INFO, false);
        $info->setFormatter($formatter);
        $info->pushProcessor($ipProcessor);
        $info->pushProcessor($webProcessor);
        $monolog->pushHandler($info);

        // NOTICE, WARNING, ERROR, ALERT -> Daily Log, Saved for 30 days
        $error = new RotatingFileHandler(storage_path('/logs/laravel.log'), 30, Logger::NOTICE, false);
        $error->setFormatter($formatter);
        $info->pushProcessor($ipProcessor);
        $error->pushProcessor($webProcessor);
        $monolog->pushHandler($error);

        return $monolog;
    }
}

class ClientIpProcessor
{
    public function __invoke(LogRecord $record)
    {
        $record['extra']['client_ip'] = \Request::getClientIp();
        return $record;
    }
}