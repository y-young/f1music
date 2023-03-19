<?php

use Illuminate\Support\Str;
use Illuminate\Support\HtmlString;

if (!function_exists('mix_old')) {
    /**
     * Get the path to a versioned Mix file.
     *
     * @param  string  $path
     * @param  string  $manifestDirectory
     * @return \Illuminate\Support\HtmlString|string
     *
     * @throws \Exception
     */
    function mix_old($path, $manifestDirectory = 'assets/')
    {
        static $manifests = [];

        if ($manifestDirectory && !Str::startsWith($manifestDirectory, '/')) {
            $manifestDirectory = "/{$manifestDirectory}";
        }

        $manifestPath = base_path('public' . $manifestDirectory . '/manifest.json');

        if (!isset($manifests[$manifestPath])) {
            if (!file_exists($manifestPath)) {
                throw new Exception('The Webpack manifest does not exist.');
            }

            $manifests[$manifestPath] = json_decode(file_get_contents($manifestPath), true);
        }

        $manifest = $manifests[$manifestPath];

        if (!isset($manifest[$path])) {
            $exception = new Exception("Unable to locate Mix file: {$path}.");

            if (!app('config')->get('app.debug')) {
                report($exception);

                return $path;
            } else {
                throw $exception;
            }
        }

        return new HtmlString($manifest[$path]);
    }
}