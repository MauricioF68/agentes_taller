<?php
foreach(glob(__DIR__.'/tests/Feature/*.php') as $f) {
    $c = file_get_contents($f);
    if(strpos($c, 'users()->attach') !== false) {
        file_put_contents($f, str_replace('users()->attach', 'students()->attach', $c));
    }
}
