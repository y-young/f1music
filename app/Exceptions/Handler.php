<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
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
        401 => 'Sorry, please log in to access this page.',
        403 => 'Sorry, you are forbidden from accessing this page.',
        404 => 'Sorry, the page you are looking for could not be found.',
        429 => 'Sorry, you are making too many requests. Please try back later.',
        500 => 'Whoops, something went wrong on our servers.',
        503 => 'Sorry, we are doing some maintenance. Please check back soon.'
    ];

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Throwable  $exception
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     */
    public function render($request, Throwable $exception)
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

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }
}