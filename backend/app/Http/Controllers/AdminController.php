<?php

namespace App\Http\Controllers;

use App\Models\Vulnerability;
use Illuminate\Http\Request;
use App\Http\Resources\ConfigResource;
use Illuminate\Support\Facades\Artisan;
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
        $config = json_decode(Storage::disk('local')->get('/config/vulnRoutes.json'), true);
        $data = json_decode($request->getContent(), true)['data'];

        $this->doUpdateConfiguration($data, $config);

        return $this->getConfiguration();
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

    /**
     * @param $id
     * @return string
     */
    public function getType($id): string
    {
        $type = 'sqli';
        switch ($id) {
            case 1:
                break;
            case 2:
                $type = 'rxss';
                break;
            case 3:
                $type = 'sxss';
                break;
            default:
                abort(400);
        }
        return $type;
    }

    /**
     * @param mixed $config
     * @param string $type
     * @return array|mixed
     */
    public function getRoutes(mixed $config, string $type): mixed
    {
        $routes = $config[$type];
        if ($type == 'sqli') {
            $routes = array_merge($routes, $config['qsqli']);
        }
        return $routes;
    }

    /**
     * @param $difficulty1
     * @return array
     */
    public function getDifficultiesUsed($difficulty1): array
    {
        $difficulties_used = array();
        for ($i = 1; $i < 5; $i++) {
            if ($difficulty1[$i]) {
                $difficulties_used[$i] = $i;
            }
        }
        return $difficulties_used;
    }

    /**
     * @param array $difficulties_used
     * @param string $type
     * @param mixed $routes
     * @return void
     */
    public function writeOneRouteForEachDifficulty(array &$difficulties_used, string $type, mixed &$routes)
    {
        foreach ($difficulties_used as $difficulty) {
            if (sizeof($routes) == 0) {
                break;
            }
            $key = array_rand($routes);
            while ($routes[$key] == null) {
                $key = array_rand($routes);
            }
            $route = $routes[$key]['route'];
            DB::connection('secure')->table('vulnerabilities')->where('uri', $route)->update([$type . '_difficulty' => $difficulty]);
            unset($routes[$key]);
        }
    }

    /**
     * @param mixed $routes
     * @param array $difficulties_used
     * @param string $type
     * @return void
     */
    public function writeRemainingRoutes(mixed $routes, array $difficulties_used, string $type): void
    {
        foreach ($routes as $route) {
            if ($route == null) {
                continue;
            }
            $key = array_rand($difficulties_used);
            DB::connection('secure')->table('vulnerabilities')->where('uri', $route)->update([$type . '_difficulty' => $difficulties_used[$key]]);
        }
    }

    /**
     * @param mixed $data
     * @param mixed $config
     */
    public function doUpdateConfiguration(mixed $data, mixed $config)
    {
        foreach ($data as $element) {
            $type = $this->getType($element['id']);

            DB::connection('secure')->table('vulnerabilities')->update([$type . '_difficulty' => 4]);

            $routes = $this->getRoutes($config, $type);

            if (sizeof($element['difficulty']) != 4) {
                abort(400);
            }

            $difficulties_used = $this->getDifficultiesUsed($element['difficulty']);

            $this->writeOneRouteForEachDifficulty($difficulties_used, $type, $routes);

            $this->writeRemainingRoutes($routes, $difficulties_used, $type);

        }
    }
}
