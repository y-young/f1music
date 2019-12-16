<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        MethodNotAllowedHttpException::class,
        ValidationException::class,
    ];

    protected $titles = [
        401 => 'Unauthorized',
        403 => 'Forbidden',
        404 => 'Page Not Found',
        429 => 'Too Many Requests',
        500 => 'Error',
        503 => 'Service Unavailable'
    ];

    protected $messages = [
        401 => 'Sorry, you are not authorized to access this page.',
        403 => 'Sorry, you are forbidden from accessing this page.',
        404 => 'Sorry, the page you are looking for could not be found.',
        429 => 'Sorry, you are making too many requests. Please try back later.',
        500 => 'Whoops, something went wrong on our servers.',
        503 => 'Sorry, we are doing some maintenance. Please check back soon.'
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        if (app()->bound('sentry') && $this->shouldReport($exception)) {
            app('sentry')->captureException($exception);
        }
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     */
    public function render($request, Exception $exception)
    {
        if ($exception instanceof HttpException) {
            $code = $exception->getStatusCode();
            if (in_array($code, [401, 403, 404, 429, 500, 503])) {
                $message = $exception->getMessage();
                return response(view('errors.http', [
                    'code' => $code,
                    'title' => $this->titles[$code],
                    'message' => $this->messages[$code]
                ]), $code);
            }
        }
        if ($exception instanceof ValidationException) {
            $message = $exception->validator->errors()->first();
            return response()->json(['error' => 1, 'msg' => $message]);
        }
        return parent::render($request, $exception);
    }
}
