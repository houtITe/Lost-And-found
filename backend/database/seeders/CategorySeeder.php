<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $names = [
            'Phone',
            'Student ID Card',
            'Wallet',
            'Bag',
            'Keys',
            'Laptop / Electronics',
            'Documents',
            'Clothing',
            'Books / Stationery',
            'Other',
        ];

        foreach ($names as $name) {
            Category::firstOrCreate(['name' => $name]);
        }
    }
}