<?php
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);

header('Content-Type: text/plain; charset=utf-8');

$from = 'larioja@logrotaxi.com'; // usa un buzón REAL del dominio (mejor que no-reply)
$to = 'olirueda@gmail.com';      // pon un gmail tuyo para probar fuera
$subject = 'Test mail() logrotaxi.com';
$message = "Prueba mail() " . date('Y-m-d H:i:s');

$headers  = "From: LogroTaxi Web <{$from}>\r\n";
$headers .= "Reply-To: {$from}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$ok = mail($to, $subject, $message, $headers, "-f {$from}");

echo "mail() returned: " . ($ok ? "TRUE" : "FALSE") . "\n";
echo "last_error:\n";
var_dump(error_get_last());