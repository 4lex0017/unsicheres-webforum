<?php

namespace App\Http\Controllers;

class UtilityController extends Controller
{
    public static function createStringBuilder(string $table, array $map, $request): string
    {
        $insertStr = 'insert into ' . $table . ' (created_at, updated_at, ';
        $valuesStr = ' values ( datetime(), datetime(), ';

        foreach ($map as $key => $value) {
            if (!array_key_exists($key, $request->all())) {
                continue;
            }

            $insertStr .= $value . ', ';

            $val = $request[$key];
            if (is_array($val)) {
                // we need to encode arrays
                $valuesStr .= '"' . json_encode($val) . '", ';
            } else {
                // anything else should be fine
                $valuesStr .= '"' . $val . '", ';
            }
        }

        $insertStr = substr_replace($insertStr, ')', -2);
        $valuesStr = substr_replace($valuesStr, ')', -2);

        return $insertStr . $valuesStr;
    }

    public static function updateStringBuilder(string $table, array $map, $request, $id): string
    {
        $insertStr = 'update ' . $table . ' set ';

        foreach ($map as $key => $value) {
            if (!array_key_exists($key, $request->all())) {
                continue;
            }

            $insertStr .= $value;

            $val = $request[$key];
            if (is_array($val)) {
                // we need to encode arrays
                $insertStr .= '= "' . json_encode($val) . '", ';
            } else {
                // anything else should be fine
                $insertStr .= '= "' . $val . '", ';
            }
        }

        $insertStr .= 'updated_at = datetime() where id = ' . $id;
        return $insertStr;
    }
}
