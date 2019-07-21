<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ExampleTest extends TestCase
{
    use DatabaseMigrations;

    public function testPages()
    {
        $this->call('GET', '/')->assertResponseOk();
        $this->call('GET', '/Login')->assertResponseOk();
        $this->call('GET', '/Manage')->seeStatusCode(404);
    }

    public function testLogin()
    {
        $this->json('POST', '/Login')
             ->seeJson(['error' => 1]);
    }

    public function testPermission()
    {
        $user = factory('App\User')->make();
        $urls = ['Upload', 'List', 'Vote', 'Report'];
        foreach ($urls as $url) {
            $this->call('POST', '/'.$url)->seeStatusCode(401);
        }
    }

    public function testUpload()
    {
        //
    }

    public function testVote()
    {
        //
    }

    public function testReport()
    {
        //
    }

    public function testMusic()
    {
        $user = factory('App\User')->make();
        $this->actingAs($user)->json('POST', '/Music/Search', ['keyword' => '***REMOVED***'])
             ->seeJson(['artist' => ['***REMOVED***']]);
        $this->actingAs($user)->json('GET', '/Music/Playlist')
             ->seeJson(['author' => '***REMOVED***']);
    }

    public function testAdmin()
    {
        $admin = factory('App\User')->make(['stuId' => '***REMOVED***']);
        $this->actingAs($admin)
                         ->call('GET', '/Manage')->assertResponseOk();

        $_this = $this->actingAs($admin);
        $adminUrls = ['Songs', 'Files', 'Votes', 'Reports', 'Rank'];
        foreach ($adminUrls as $url) {
             $_this->json('GET', '/Manage/'.$url)
                 ->seeJson(['error' => 0]);
        }
    }
}
