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
        $response = $this->call('GET', '/');
        $this->assertEquals(200, $response->status());
        $response = $this->call('GET', '/Login');
        $this->assertEquals(200, $response->status());
        $response = $this->call('GET', '/Manage');
        $this->assertEquals(404, $response->status());
    }

    public function testLogin()
    {
        $this->json('POST', '/Login')
             ->seeJson(['error' => 1]);
        $this->json('POST', '/Login', ['stuId' => '31601010'])
             ->seeJson(['error' => 1]);
        $this->json('POST', '/Login', ['stuId' => '***REMOVED***'])
             ->seeJson(['error' => 1]);
        $this->json('POST', '/Login', [
                   'stuId' => '***REMOVED***',
                   'password' => '123456'
               ])
             ->seeJson(['error' => 1]);
        $user = factory('App\User')->make();
        $response = $this->actingAs($user)
                         ->call('GET', '/Login');
        $this->assertEquals(302, $response->status());
      /*$res = $this->actingAs($user)
                    ->call('GET', '/Logout');
         $this->assertEquals(302, $res->status());*/
    }

    public function testPermission()
    {
        $user = factory('App\User')->make();
        $urls = ['Upload', 'List', 'Vote', 'Report'];
        foreach ($urls as $url) {
            $this->assertEquals(401, $this->call('POST', '/'.$url)->status());
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
        $response = $this->actingAs($admin)
                         ->call('GET', '/Manage');
        $this->assertEquals(200, $response->status());

        $_this = $this->actingAs($admin);
        $adminUrls = ['Songs', 'Files', 'Votes', 'Reports', 'Rank'];
        foreach ($adminUrls as $url) {
             $_this->json('GET', '/Manage/'.$url)
                 ->seeJson(['error' => 0]);
        }
    }
}
