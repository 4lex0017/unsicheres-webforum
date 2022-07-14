<?php

namespace App\Http\Controllers;

use App\Models\Attacker;
use App\Models\Vulnerability;
use Database\Seeders\PasswordSeeder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\ConfigResource;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * get list of supported vulnerabilities and which difficulties are in use
     * ROUTE GET /admin
     *
     * @return JsonResponse
     */
    public function getSupportedVulnerabilities(): JsonResponse
    {
        $json = Storage::disk('local')->get('/config/vulnerabilities.json');
        $config = json_decode(Storage::disk('local')->get('/config/vulnRoutes.json'), true);
        $content = json_decode($json, true);

        $this->updateChecked($content, 'sqli', 0, $config);
        $this->updateChecked($content, 'rxss', 1, $config);
        $this->updateChecked($content, 'sxss', 2, $config);
        $this->updateChecked($content, 'file', 3, $config);
        $this->updateChecked($content, 'fend', 4, $config);
        $this->updateCheckedStatic($content, 'hash', 5);
        $this->updateCheckedStatic($content, 'user', 6);

        return response()->json($content);
    }

    /**
     * check which difficulties of type are in use
     *
     * @param array $content
     * @param string $type
     * @param int $id
     * @param array $config
     * @return void
     */
    private function updateChecked(array &$content, string $type, int $id, array $config): void
    {
        $routes = $this->getRoutes($config, $type);
        $used_difficulties = array();

        foreach ($routes as $route) {
            $difficulty = $this->getDifficultyOfRouteAndType($route, $type);
            if (in_array($difficulty, $used_difficulties) == false) {
                $used_difficulties[] = $difficulty;
            }
        }

        foreach ($used_difficulties as $difficulty) {
            $content['vulnerabilities'][$id]['subtasks'][$difficulty - 1]['checked'] = true;
        }
    }

    /**
     * return all routes where $type is possible
     *
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
     * return single difficulty
     *
     * @param mixed $route
     * @param string $type
     * @return mixed|null
     */
    public function getDifficultyOfRouteAndType(mixed $route, string $type): mixed
    {
        return DB::connection('secure')
            ->table('vulnerabilities')
            ->where('uri', $route)
            ->value($type . '_difficulty');
    }

    /**
     * check which difficulty of route independent type is in use
     *
     * @param array $content
     * @param string $type
     * @param int $id
     * @return void
     */
    private function updateCheckedStatic(array &$content, string $type, int $id): void
    {
        $difficulty = DB::connection('secure')
            ->table('staticdifficulties')
            ->value($type . '_difficulty');

        $content['vulnerabilities'][$id]['subtasks'][$difficulty - 1]['checked'] = true;
    }

    /**
     * change used difficulties based on config json
     * ROUTE PUT /admin/config/premade
     *
     * @param Request $request
     * @return array
     */
    public function updateConfigurationFromJson(Request $request): array
    {
        $data = json_decode($request->getContent(), true);

        $this->updateStaticDifficulty('hash', $data['hash_difficulty']);
        $this->updateStaticDifficulty('user', $data['user_difficulty']);
        (new PasswordSeeder)->run();

        $this->updateRoutesFromJson($data['data']);

        SiteController::generateNewSmallUserConfig();
        return $this->getConfiguration();
    }

    /**
     * update each route based on array
     *
     * @param $routes
     * @return void
     */
    public function updateRoutesFromJson($routes): void
    {
        foreach ($routes as $route) {
            DB::connection('secure')
                ->table('vulnerabilities')
                ->where('uri', $route['uri'])
                ->update([
                    'sqli_difficulty' => $route['sqli_difficulty'],
                    'rxss_difficulty' => $route['rxss_difficulty'],
                    'sxss_difficulty' => $route['sxss_difficulty'],
                    'file_difficulty' => $route['file_difficulty'],
                    'fend_difficulty' => $route['fend_difficulty'],
                ]);
        }
    }

    /**
     * change used difficulties
     * ROUTE PUT /admin/config
     *
     * @param Request $request
     * @return array
     */
    public function updateConfiguration(Request $request): array
    {
        $config = json_decode(Storage::disk('local')->get('/config/vulnRoutes.json'), true);
        $data = json_decode($request->getContent(), true)['data'];

        $this->doUpdateConfiguration($data, $config);

        // Generate new users that are displayed on the top right.
        SiteController::generateNewSmallUserConfig();

        return $this->getConfiguration();
    }

    /**
     * logic of updateConfiguration()
     *
     * @param mixed $data
     * @param mixed $config
     */
    public function doUpdateConfiguration(mixed $data, mixed $config)
    {
        $stored = array();
        foreach ($data as $element) {
            $type = $this->getType($element['id']);

            if ($element['id'] == 6 || $element['id'] == 7) {
                $this->updateStaticConfig($element['difficulty'], $type);
            } else {
                $this->updateRouteConfig($type, $config, $element['difficulty'], $stored);
            }
        }
        foreach ($stored as $element) {
            $this->writeRemainingRoutes($element['routes'], $element['diffs'], $element['type']);
        }
    }

    /**
     * update config for static vuln type
     *
     * @param $difficulty
     * @param string $type
     */
    public function updateStaticConfig($difficulty, string $type)
    {
        $difficulties_used = $this->getDifficultiesUsed($difficulty);
        $difficulty = $difficulties_used[array_key_first($difficulties_used)];
        $this->updateStaticDifficulty($type, $difficulty);
        (new PasswordSeeder)->run();
    }

    /**
     * DB call for updating a static difficulty
     *
     * @param string $type
     * @param mixed $difficulty
     * @return void
     */
    public function updateStaticDifficulty(string $type, mixed $difficulty): void
    {
        DB::connection('secure')
            ->table('staticdifficulties')
            ->update([$type . '_difficulty' => $difficulty]);
    }

    /**
     * update route config for route dependent vuln type
     *
     * @param string $type
     * @param mixed $config
     * @param $difficulty
     * @param array $stored
     */
    public function updateRouteConfig(string $type, mixed &$config, $difficulty, array &$stored): void
    {
        $max_difficulty = $type == 'file' ? 3 : 4;

        $this->resetDifficulty($type, $max_difficulty);

        $routes = $this->getRoutes($config, $type);

        if (sizeof($difficulty) != $max_difficulty) {
            abort(400);
        }

        $difficulties_used = $this->getDifficultiesUsed($difficulty);

        $this->writeOneRouteForEachDifficulty($difficulties_used, $type, $routes);

        $stored[] = [
            'diffs' => $difficulties_used,
            'type' => $type,
            'routes' => $routes,
        ];
    }

    /**
     * get vulnerability type from $id
     *
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
            case 4:
                $type = 'file';
                break;
            case 5:
                $type = 'fend';
                break;
            case 6:
                $type = 'hash';
                break;
            case 7:
                $type = 'user';
                break;
            default:
                abort(400);
        }
        return $type;
    }

    /**
     * reset difficulty of $type to $max_difficulty for all routes
     *
     * @param string $type
     * @param int $max_difficulty
     * @return void
     */
    public function resetDifficulty(string $type, int $max_difficulty): void
    {
        DB::connection('secure')
            ->table('vulnerabilities')
            ->update([$type . '_difficulty' => $max_difficulty]);
    }

    /**
     * get array of used difficulties as numbers from boolean array
     *
     * @param $difficulty
     * @return array
     */
    public function getDifficultiesUsed($difficulty): array
    {
        $difficulties_used = array();

        for ($i = 1; $i <= sizeof($difficulty); $i++) {
            if ($difficulty[$i]) {
                $difficulties_used[$i] = $i;
            }
        }

        return $difficulties_used;
    }

    /**
     * find a route for each difficulty and sets it to that difficulty.
     * used to ensure every active difficulty has at least one active route.
     *
     * @param array $difficulties_used
     * @param string $type
     * @param mixed $routes
     * @return void
     */
    public function writeOneRouteForEachDifficulty(array &$difficulties_used, string $type, mixed &$routes): void
    {
        foreach ($difficulties_used as $difficulty) {
            if (sizeof($routes) == 0) {
                break;
            }

            list($keys_left, $key, $routes) = $this->getRouteForDifficulty($routes, $type);
            if ($keys_left == false) {
                break;
            }

            $route = $routes[$key]['route'];

            $this->writeDifficultyForRoute($route, $type, $difficulty);

            unset($routes[$key]);
        }
    }

    /**
     * find a route in $routes that isn't used yet
     * needs to do additional check for frontend filter to avoid clashes with the backend xss filter
     *
     * @param mixed $routes
     * @param string $type
     * @return array
     */
    public function getRouteForDifficulty(mixed $routes, string $type): array
    {
        $keys_left = true;
        do {
            $key = array_rand($routes);

            if ($type == 'fend') {
                list($routes, $keys_left) = $this->checkRouteIsNotUsed($routes, $key, $keys_left);
            }

            $not_in_arr = array_key_exists($key, $routes) == false;
            if ($not_in_arr == false) {
                $not_in_arr = $routes[$key] == null;
            }
        } while ($not_in_arr && $keys_left);

        return array($keys_left, $key, $routes);
    }

    /**
     * check whether sxss difficulty of given route is set to something other than 0 to avoid clashes
     *
     * @param mixed $routes
     * @param int|array|string $key
     * @param bool $keys_left
     * @return array
     */
    public function checkRouteIsNotUsed(mixed $routes, int|array|string $key, bool $keys_left): array
    {
        $sxss_difficulty = $routes[$key] == null ?
            4 :
            $this->getDifficultyOfRouteAndType($routes[$key]['route'], 'sxss');

        if ($sxss_difficulty != 4) {
            unset($routes[$key]);
            if (sizeof($routes) == 0) {
                $keys_left = false;
            }
        }

        return array($routes, $keys_left);
    }

    /**
     * write difficulty for a route to DB.
     * if frontend difficulty is set, SXSS difficulty needs to be set to 1 for it to work.
     *
     * @param mixed $route
     * @param string $type
     * @param mixed $difficulty
     * @return void
     */
    public function writeDifficultyForRoute(mixed $route, string $type, mixed $difficulty): void
    {
        DB::connection('secure')
            ->table('vulnerabilities')
            ->where('uri', $route)
            ->update([$type . '_difficulty' => $difficulty]);
        if ($type == 'fend') {
            DB::connection('secure')
                ->table('vulnerabilities')
                ->where('uri', $route)
                ->update(['sxss_difficulty' => 1]);
        }
    }

    /**
     * fill up remaining routes with used difficulties.
     * doesn't fill up more routes than necessary for the frontend filter and includes extra checks for the backend
     * sxss filter to avoid clashes.
     *
     * @param mixed $routes
     * @param array $difficulties_used
     * @param string $type
     * @return void
     */
    public function writeRemainingRoutes(mixed $routes, array $difficulties_used, string $type): void
    {
        if ($type == 'fend') {
            return;
        }

        foreach ($routes as $route) {
            if ($route == null) {
                continue;
            }
            $key = array_rand($difficulties_used);

            $can_write_to_route = true;
            if ($type == 'sxss') {
                $can_write_to_route = $this->getDifficultyOfRouteAndType($route, 'fend') == 4;
            }

            if ($can_write_to_route) {
                $this->writeDifficultyForRoute($route, $type, $difficulties_used[$key]);
            }
        }
    }

    /**
     * get current configuration of endpoints and filter difficulties
     * ROUTE GET /admin/config
     *
     * @return array
     */
    public function getConfiguration(): array
    {
        return [
            'data' => ConfigResource::collection(Vulnerability::all())->jsonSerialize(),
            'hash_difficulty' => DB::connection('secure')->table('staticdifficulties')->value('hash_difficulty'),
            'user_difficulty' => DB::connection('secure')->table('staticdifficulties')->value('user_difficulty'),
        ];
    }

    /**
     * get sxss and frontend difficulty for a single route
     * ROUTE GET /c?r=route
     *
     * @param Request $request
     * @return \Illuminate\Support\Collection
     */
    public function getSingleRoute(Request $request): \Illuminate\Support\Collection
    {
        $route = $request->query('r');

        if ($route == null) {
            abort(400);
        }

        $route = trim($route);

        return DB::connection('secure')
            ->table('vulnerabilities')
            ->where('uri', $route)
            ->select(['sxss_difficulty', 'fend_difficulty', 'rxss_difficulty'])
            ->get();
    }

    /**
     * generate and return the current scoreboard
     * ROUTE GET /admin/scoreboard
     *
     * @return JsonResponse
     */
    public function getScoreboard(): JsonResponse
    {
        $attackers = $this->getAllAttackers();

        $attackers_with_values = $this->addFoundVulnsToAttackers($attackers);

        return response()->json($attackers_with_values);
    }

    /**
     * get all attackers currently stored in DB
     *
     * @return \Illuminate\Support\Collection
     */
    public function getAllAttackers(): \Illuminate\Support\Collection
    {
        return DB::connection('secure')
            ->table('attackers')
            ->select(['ip_address', 'name', 'attacker_id'])
            ->get();
    }

    /**
     * go through attackers and add their found vulnerabilities so they show up in scoreboard
     *
     * @param \Illuminate\Support\Collection $attackers
     * @return array
     */
    public function addFoundVulnsToAttackers(\Illuminate\Support\Collection $attackers): array
    {
        $attackers_with_values = array();
        foreach ($attackers as $attacker) {
            $found_vulns = $this->getFoundVulnsOfAttacker($attacker);

            $vulns_of_attacker = $this->addUriToFoundVulns($found_vulns);

            $attackers_with_values[] = [
                'ipaddress' => $attacker->ip_address,
                'username' => $attacker->name,
                'vulnerabilities' => $vulns_of_attacker,
            ];
        }
        return $attackers_with_values;
    }

    /**
     * get found vulnerabilities for one attacker
     *
     * @param mixed $attacker
     * @return \Illuminate\Support\Collection
     */
    public function getFoundVulnsOfAttacker(mixed $attacker): \Illuminate\Support\Collection
    {
        return DB::connection('secure')
            ->table('found_vulnerabilities')
            ->where('attacker_id', '=', $attacker->attacker_id)
            ->select(['difficulty', 'vuln_type', 'vulnerability_id'])
            ->get();
    }

    /**
     * go through found vulnerabilities and add the uri to each one
     *
     * @param \Illuminate\Support\Collection $found_vulns
     * @return array
     */
    public function addUriToFoundVulns(\Illuminate\Support\Collection $found_vulns): array
    {
        $vulns_of_attacker = array();
        foreach ($found_vulns as $vuln) {
            $uri = $this->getUri($vuln->vulnerability_id);

            $vulns_of_attacker[] = [
                'vulName' => $vuln->vuln_type,
                'vulLevel' => $vuln->difficulty,
                'uri' => $uri,
            ];
        }
        return $vulns_of_attacker;
    }

    /**
     * get uri from vulnerability id
     *
     * @param $vulnerability_id
     * @return mixed|null
     */
    public function getUri($vulnerability_id)
    {
        return DB::connection('secure')
            ->table('vulnerabilities')
            ->where('vulnerability_id', $vulnerability_id)
            ->value('uri');
    }

    /**
     * reset the scoreboard. attackers and config are not affected.
     * ROUTE POST /admin/reset/scoreboard
     *
     * @return \Illuminate\Http\Response
     */
    public function resetScoreboard(): \Illuminate\Http\Response
    {
        DB::connection('secure')
            ->table('found_vulnerabilities')
            ->delete();
        DB::connection('secure')
            ->unprepared("VACUUM;");
        return response()->noContent();
    }

    /**
     * reset the insecure database. used in case of breaking vulnerability use.
     * ROUTE POST /admin/reset/db
     *
     * @return \Illuminate\Http\Response
     */
    public function resetDatabase(): \Illuminate\Http\Response
    {
        $this->resetDB();
        return response()->noContent();
    }

    /**
     * logic for resetDatabase()
     *
     * @return void
     */
    function resetDB(): void
    {
        Artisan::call('migrate:refresh', [
            '--path' => '/database/migrations/insecure',
            '--seed' => true,
        ]);
    }

    /**
     * create unique attacker with name, tracker cookie and id
     * ROUTE POST /attacker
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createAttacker(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required'
        ]);

        if ($validator->fails())
            return response()->json(['error' => $validator->errors()], 422);

        $name = $request->json()->get('name');

        if ((new Attacker)->where('name', $name)->exists())
            return response()->json('Attacker name already exists', 422);

        $tracker_data = base64_encode(openssl_encrypt($name, 'aes-256-ctr',
            "1337youwill420neverguess69thisxd", 0, 'lK_P:-2RB<r#W1u@'));

        Log::debug($tracker_data);

        $attacker = new Attacker;

        $attacker->name = $name;
        $attacker->tracker = $tracker_data;

        $attacker->save();
        //                                                                                   20 years
        return response()->json()->withCookie(cookie('tracker', $tracker_data, 20 * 365 * 24 * 60,
            null, null, false, false)); // http only has to be false because of angular...
    }
}
