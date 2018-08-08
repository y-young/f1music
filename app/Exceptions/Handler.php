<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Laravel\Lumen\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\HttpException;

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

    protected $messages = [
        403 => 'Permission Denied',
        404 => 'Page Not Found',
        429 => 'Please Try Later',
        503 => 'Be Right Back'
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $e
     * @return void
     */
    public function report(Exception $e)
    {
        if (app()->bound('sentry') && $this->shouldReport($e)) {
            app('sentry')->captureException($e);
        }
        parent::report($e);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $e
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $e)
    {
        if ($e instanceof HttpException) {
            $code = $e->getStatusCode();
            if (in_array($code, [403, 404, 429, 503])) {
                $message = $e->getMessage();
                return response(view('errors.http', ['message' => $this->messages[$code]]), $code);
            }
        }
        if ($e instanceof ValidationException) {
            $message = $e->validator->errors()->first();
            return response()->json(['error' => 1, 'msg' => $message]);
        }
        return parent::render($request, $e);
    }
}
