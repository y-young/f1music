<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ClearOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'music:clear_orders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear orders table to refresh vote list';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        if (config('app.env') == 'production') {
            $this->error('In Production Environment!');
            if ($this->confirm('Are you sure to clear all orders?')) {
                DB::table('orders')->truncate();
                $this->info('Done.');
            } else {
                $this->info('Cancelled.');
            }
        } else {
            $this->info('In Development Environment.');
            DB::table('orders')->truncate();
            $this->info('Done.');
        }
    }
}