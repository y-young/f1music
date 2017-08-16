<?php

require_once __DIR__.'/../vendor/autoload.php';

try {
    (new Dotenv\Dotenv(__DIR__.'/../'))->load();
} catch (Dotenv\Exception\InvalidPathException $e) {
    //
}

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
|
| Here we will load the environment and create the application instance
| that serves as the central piece of this framework. We'll use this
| application as an "IoC" container and router for this framework.
|
*/

$app = new Laravel\Lumen\Application(
    realpath(__DIR__.'/../')
);

// Enable Storage
$app->configure('filesystems');
if (!class_exists('Storage')) {
    class_alias('Illuminate\Support\Facades\Storage', 'Storage');
}

// Enable Session
$app->configure('session');
$app->alias('session', 'Illuminate\Session\SessionManager');

 $app->withFacades();

 $app->withEloquent();

/*
|--------------------------------------------------------------------------
| Register Container Bindings
|--------------------------------------------------------------------------
|
| Now we will register a few bindings in the service container. We will
| register the exception handler and the console kernel. You may add
| your own bindings here if you like or you can make another file.
|
*/

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

// Enable Storage
$app->singleton(
    Illuminate\Contracts\Filesystem\Factory::class,
        function ($app) {
            return new Illuminate\Filesystem\FilesystemManager($app);
        }
);

/*
|--------------------------------------------------------------------------
| Register Middleware
|--------------------------------------------------------------------------
|
| Next, we will register the middleware with the application. These can
| be global middleware that run before and after each request into a
| route or middleware that'll be assigned to some specific routes.
|
*/

// Enable Session
$app->middleware([Illuminate\Session\Middleware\StartSession::class]);
$app->routeMiddleware([
     'can' => \Illuminate\Auth\Middleware\Authorize::class,
     'throttle' => App\Http\Middleware\ThrottleRequests::class,
     'auth' => App\Http\Middleware\Authenticate::class,
     'admin' => App\Http\Middleware\AdminAuth::class,
     'redirect' => App\Http\Middleware\RedirectIfLogged::class,
 ]);

/*
|--------------------------------------------------------------------------
| Register Service Providers
|--------------------------------------------------------------------------
|
| Here we will register all of the application's service providers which
| are used to bind services into the container. Service providers are
| totally optional, so you are not required to uncomment this line.
|
*/

// $app->register(App\Providers\AppServiceProvider::class);
 $app->register(App\Providers\AuthServiceProvider::class);
 $app->register(App\Providers\EventServiceProvider::class);
 $app->register(Illuminate\Filesystem\FilesystemServiceProvider::class);
//Enable Session
 $app->register(Illuminate\Session\SessionServiceProvider::class);

// Optimize Log
$app->configureMonologUsing(function(Monolog\Logger $monolog) {
    // DEBUG -> lumen.log
    $monolog->pushHandler(new \Monolog\Handler\StreamHandler(storage_path().'/logs/lumen.log'));

    // INFO -> info.log
    $info = new Monolog\Handler\RotatingFileHandler(storage_path("logs/info.log"), 30, Monolog\Logger::INFO, false);
    $monolog->pushHandler($info);
    //$info->setFormatter(new \Monolog\Formatter\LineFormatter(null, null, true));

    // NOTICE, WARNING, ERROR, ALERT -> Daily Log, Saved for 30 days
    $monolog->pushHandler(new \Monolog\Handler\RotatingFileHandler(storage_path().'/logs/lumen.log', 30, Monolog\Logger::NOTICE, false));

    $monolog->pushProcessor(new \Monolog\Processor\WebProcessor());
    return $monolog;
});

/*
|--------------------------------------------------------------------------
| Load The Application Routes
|--------------------------------------------------------------------------
|
| Next we will include the routes file so that they can all be added to
| the application. This will provide all of the URLs the application
| can respond to, as well as the controllers that may handle them.
|
*/
$app->configure('music');
$app->group(['namespace' => 'App\Http\Controllers'], function ($app) {
    require __DIR__.'/../routes/web.php';
});

return $app;
