<?php

namespace App\Logging;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\RotatingFileHandler;
use Monolog\Formatter\LineFormatter;
use Monolog\Processor\WebProcessor;

class CustomLogger
{

    /**
      * Create a custom Monolog instance.
      *
      * @return \Monolog\Logger
      */

    public function __invoke()
    {
        $monolog = new Logger('custom');
        // DEBUG -> lumen.log
        $debug = new StreamHandler(storage_path('/logs/lumen.log'));
        $debug->setFormatter(new LineFormatter(null, null, true, true));
        $monolog->pushHandler($debug);

        // INFO -> info.log, Daily Log
        $info = new RotatingFileHandler(storage_path('logs/info.log'), 30, Logger::INFO, false);
        $info->setFormatter(new LineFormatter(null, null, true, true));
        $monolog->pushHandler($info);

        // NOTICE, WARNING, ERROR, ALERT -> Daily Log, Saved for 30 days
        $error = new RotatingFileHandler(storage_path('/logs/lumen.log'), 30, Logger::NOTICE, false);
        $error->setFormatter(new LineFormatter(null, null, true, true));
        $monolog->pushHandler($error);

        $monolog->pushProcessor(new WebProcessor());
        return $monolog;
    }

}
