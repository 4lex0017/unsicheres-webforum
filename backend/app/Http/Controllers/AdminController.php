<?php

namespace App\Http\Controllers;

use App\Models\Vulnerability;
use Illuminate\Http\Request;
use App\Http\Resources\ConfigResource;
use Illuminate\Support\Facades\Storage;

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
}
