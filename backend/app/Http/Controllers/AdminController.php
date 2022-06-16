<?php

namespace App\Http\Controllers;

use App\Http\Middleware\VulnerabilityMonitor;
use App\Models\Vulnerability;
use Illuminate\Http\Request;
use App\Http\Resources\ConfigResource;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function getSupportedVulnerabilities()
    {
        $json = Storage::disk('local')->get('/config/vulnerabilities.json');
        $content = json_decode($json, true);
        return response()->json($content);
    }

    public function updateConfiguration(Request $request)
    {
    }

    public function getConfiguration()
    {
        return ConfigResource::collection(Vulnerability::all());
    }

    public function getScoreboard()
    {
    }

    public function resetScoreboard()
    {
        DB::connection('secure')->unprepared("DELETE FROM found_vulnerabilities;");
        DB::connection('secure')->unprepared("VACUUM;");
        return response()->noContent();
    }

    public function resetDatabase()
    {
        $this->resetDB();
        return response()->noContent();
    }

    function resetDB(): void
    {
        Artisan::call('migrate:refresh', [
            '--path' => '/database/migrations/insecure',
            '--seed' => true,
        ]);
    }
}
