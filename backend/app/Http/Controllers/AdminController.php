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
        $attackers = $this->getAllAttackers();
        $attackers_with_values = array();

        foreach ($attackers as $attacker) {
            $found_vulns = $this->getFoundVulnsOfAttacker($attacker);
            $vulns_of_attacker = array();

            foreach ($found_vulns as $vuln) {
                $type = $this->getVulnTypeFromVuln($vuln);
                $difficulty = $this->getDifficultyOfVuln($vuln, $type);

                $vulns_of_attacker[] = [
                    'vulName' => $vuln->vuln_type,
                    'vulLevel' => $difficulty,
                ];
            }
            $attackers_with_values[] = [
                'ipaddress' => $attacker->ip_address,
                'username' => $attacker->name,
                'vulnerabilities' => $vulns_of_attacker,
            ];
        }
        return response()->json($attackers_with_values);
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

    /**
     * @return \Illuminate\Support\Collection
     */
    public function getAllAttackers(): \Illuminate\Support\Collection
    {
        $attackers = DB::connection('secure')->table('attackers')
            ->select(['ip_address', 'name', 'attacker_id'])
            ->get();
        return $attackers;
    }

    /**
     * @param mixed $attacker
     * @return \Illuminate\Support\Collection
     */
    public function getFoundVulnsOfAttacker(mixed $attacker): \Illuminate\Support\Collection
    {
        $found_vulns = DB::connection('secure')->table('found_vulnerabilities')
            ->where('attacker_id', '=', $attacker->attacker_id)
            ->select(['vulnerability_id', 'vuln_type'])
            ->get();
        return $found_vulns;
    }

    /**
     * @param mixed $vuln
     * @return string
     */
    public function getVulnTypeFromVuln(mixed $vuln): string
    {
        $type = 'sqli_difficulty';
        switch ($vuln->vuln_type) {
            case 'rxss':
                $type = 'rxss_difficulty';
                break;
            case 'sxss':
                $type = 'sxss_difficulty';
                break;
            default:
                break;
        }
        return $type;
    }

    /**
     * @param mixed $vuln
     * @param string $type
     * @return mixed|null
     */
    public function getDifficultyOfVuln(mixed $vuln, string $type): mixed
    {
        $difficulty = DB::connection('secure')->table('vulnerabilities')
            ->where('vulnerability_id', '=', $vuln->vulnerability_id)
            ->value($type);
        return $difficulty;
    }
}
