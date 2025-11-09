<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Course;
use App\Models\AcademicYear;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (Department::count() === 0) {
            $departments = [
                ['name'=>"Engineering and Technology",'established'=>1995,'head'=>"Dr. Robert Smith"],
                ['name'=>"Nursing",'established'=>1997,'head'=>"Dr. Jane Doe"],
                ['name'=>"Accountancy",'established'=>1998,'head'=>"Prof. John Smith"],
                ['name'=>"Business Administration",'established'=>1999,'head'=>"Prof. Sarah Johnson"],
                ['name'=>"Tourism and Hospitality Management",'established'=>2000,'head'=>"Dr. Emily Brown"],
                ['name'=>"Arts and Sciences",'established'=>2001,'head'=>"Prof. David Wilson"],
                ['name'=>"Computer Studies",'established'=>2002,'head'=>"Dr. Alan Turing"],
                ['name'=>"Criminal Justice Education",'established'=>2003,'head'=>"Dr. Michael Chen"],
                ['name'=>"Teacher Education",'established'=>2004,'head'=>"Dr. Emily Rodriguez"],
            ];
            foreach ($departments as $d) {
                Department::create($d);
            }
        }

        if (Course::count() === 0) {
            $map = [
                ['BSIT','INFORMATION TECHNOLOGY','Computer Studies'],
                ['BSBA','BUSINESS','Business Administration'],
                ['BSN','NURSING','Nursing'],
                ['BSA','ACCOUNTANCY','Accountancy'],
                ['BSTM','TOURISM','Tourism and Hospitality Management']
            ];
            foreach ($map as [$name,$code,$dep]) {
                $department = Department::where('name',$dep)->first();
                if ($department) {
                    Course::create([
                        'name'=>$name,
                        'code'=>$code,
                        'department_id'=>$department->id,
                        'credits'=>120,
                        'duration'=>4
                    ]);
                }
            }
        }

        if (AcademicYear::count() === 0) {
            AcademicYear::insert([
                ['name'=>'2024-2025','status'=>'Current','start'=>'2024-09-01','end'=>'2025-06-30','created_at'=>now(),'updated_at'=>now()],
                ['name'=>'2025-2026','status'=>'Planned','start'=>'2025-09-01','end'=>'2026-06-30','created_at'=>now(),'updated_at'=>now()],
                ['name'=>'2023-2024','status'=>'Completed','start'=>'2023-09-01','end'=>'2024-06-30','created_at'=>now(),'updated_at'=>now()],
                ['name'=>'2022-2023','status'=>'Completed','start'=>'2022-09-01','end'=>'2023-06-30','created_at'=>now(),'updated_at'=>now()],
            ]);
        }
    }
}
