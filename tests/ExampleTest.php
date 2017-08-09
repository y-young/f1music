<?php

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
	     ->seeJson([
		 'error' => 1
	     ]);
	$this->json('POST', '/Login', ['stuId' => '31601010'])
	     ->seeJson([
		 'error' => 1
	     ]);
    }

    public function testAdmin()
    {
	$admin = factory('App\User')->make(['stuId' => '***REMOVED***']);
	$response = $this->actingAs($admin)
	                 ->call('GET', '/Manage');
	$this->assertEquals(200, $response->status());
	$this->actingAs($admin)
	     ->json('GET', '/Manage/Songs')
	     ->seeJson([
		 'error' => 0
	     ]);
        $this->actingAs($admin)
	     ->json('GET', '/Manage/Files')
	     ->seeJson([
		 'error' => 0
	     ]);
	$this->actingAs($admin)
	     ->json('GET', '/Manage/Votes')
	     ->seeJson([
		 'error' => 0
	     ]);
        $this->actingAs($admin)
	     ->json('GET', '/Manage/Reports')
	     ->seeJson([
		 'error' => 0
	     ]);
        $this->actingAs($admin)
	     ->json('GET', '/Manage/Rank')
	     ->seeJson([
		 'error' => 0
	     ]);
    }
}
