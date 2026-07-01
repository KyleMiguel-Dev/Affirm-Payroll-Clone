<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@affirmpayroll.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ],
            [
                'name' => 'Finance Manager',
                'email' => 'finance@affirmpayroll.com',
                'password' => Hash::make('password123'),
                'role' => 'finance',
            ],
            [
                'name' => 'HR Manager',
                'email' => 'hr@affirmpayroll.com',
                'password' => Hash::make('password123'),
                'role' => 'hr',
            ],
            [
                'name' => 'Department Manager',
                'email' => 'manager@affirmpayroll.com',
                'password' => Hash::make('password123'),
                'role' => 'manager',
            ],
            [
                'name' => 'Regular Employee',
                'email' => 'employee@affirmpayroll.com',
                'password' => Hash::make('password123'),
                'role' => 'employee',
            ],
        ];

        foreach ($users as $userData) {
            unset($userData['role']);

            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        $this->command->info('Users seeded successfully!');
    }
}
