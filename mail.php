<?php
// mail.php (envío simple con mail())

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  exit('Método no permitido');
}

function clean($v) {
  return trim(str_replace(["\r","\n"], ' ', (string)$v));
}

// Recoger campos del formulario
$empresa           = clean($_POST['empresa'] ?? '');
$nombre            = clean($_POST['nombre'] ?? '');
$phone             = clean($_POST['phone'] ?? '');
$email             = clean($_POST['email'] ?? '');
$diarecogida       = clean($_POST['diarecogida'] ?? '');
$horarecogida      = clean($_POST['horarecogida'] ?? '');
$direccionrecogida = clean($_POST['direccionrecogida'] ?? '');
$ciudadrecogida    = clean($_POST['ciudadrecogida'] ?? '');
$destino           = clean($_POST['destino'] ?? '');
$ciudaddestino     = clean($_POST['ciudaddestino'] ?? '');
$observaciones     = trim((string)($_POST['observaciones'] ?? ''));

// Validación mínima
if ($nombre === '' || $phone === '' || $email === '') {
  http_response_code(400);
  exit('Faltan campos obligatorios (Nombre, Teléfono, Email).');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  exit('Email no válido.');
}

// Destinatario
$to = 'larioja@logrotaxi.com';
$subject = 'Nueva solicitud desde la web (Reserva/Consulta)';

// Mensaje
$message =
"Empresa: $empresa\n" .
"Nombre: $nombre\n" .
"Teléfono: $phone\n" .
"Email: $email\n" .
"Día recogida: $diarecogida\n" .
"Hora recogida: $horarecogida\n" .
"Dirección recogida: $direccionrecogida\n" .
"Ciudad recogida: $ciudadrecogida\n" .
"Destino: $destino\n" .
"Ciudad destino: $ciudaddestino\n\n" .
"Observaciones:\n$observaciones\n";

// IMPORTANTE:
// Para evitar bloqueos, el From debe ser del MISMO dominio del hosting.
// Cambia esto por una cuenta/alias que exista en tu dominio.
$from = 'larioja@logrotaxi.com'; // debe existir
$headers  = "From: LogroTaxi Web <{$from}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$ok = mail($to, $subject, $message, $headers, "-f {$from}");

if ($ok) {
  // Redirige a una página de gracias (opcional)
  header('Location: gracias.html');
  exit;
} else {
  http_response_code(500);
  exit('No se pudo enviar el correo (mail() falló).');
}