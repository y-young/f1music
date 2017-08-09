<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

$factory->define(App\User::class, function (Faker\Generator $faker) {
    return [
        'stuId' => rand(315, 317).'01010'.rand(100,800)
    ];
});
$factory->define(App\Song::class, function(Faker\Generator $faker) use ($factory) {
    return [
        'playtime' => $faker->numberBetween(1, 6),
	'name' => $faker->words(rand(1, 4), true),
	'origin' => $faker->words(rand(1, 3), true),
	'uploader' => $factory->raw('App\User')['stuId']	
    ];
});
$factory->define(App\File::class, function (Faker\Generator $faker) use ($factory) {
    return [
	'md5' => $faker->md5,
	'uploader' => $factory->raw('App\User')['stuId']
    ];
});
