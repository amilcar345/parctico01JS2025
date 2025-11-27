<?php
/**
 * Trabajo Práctico Integrador - Programación en PHP
 * Alumno: [Tu Nombre Completo]
 * Tema: Blog o Gestor de Noticias (versión simple)
 */

$tituloSitio = "Blog";
$anio = 2025;
$activo = true;

class Noticia {
    private $titulo;
    private $autor;
    private $contenido;
    private $fecha;

    public static $contador = 0; 

    public function __construct($titulo, $autor, $contenido) {
        $this->titulo = $titulo;
        $this->autor = $autor;
        $this->contenido = $contenido;
        $this->fecha = date("Y-m-d H:i");
        self::$contador++;
    }

    public function getTitulo() {
        return $this->titulo;
    }

    public function toArray() {
        return [
            "titulo" => $this->titulo,
            "autor" => $this->autor,
            "contenido" => $this->contenido,
            "fecha" => $this->fecha
        ];
    }

    public static function cantidadNoticias() {
        return self::$contador;
    }
}

$archivo = "data.json";
if (!file_exists($archivo)) {
    file_put_contents($archivo, "[]");
}

$json = file_get_contents($archivo);
$noticias = json_decode($json, true);

$mensaje = "";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $titulo = trim($_POST["titulo"] ?? "");
    $autor = trim($_POST["autor"] ?? "");
    $contenido = trim($_POST["contenido"] ?? "");

    if ($titulo && $autor && $contenido) {
        $nueva = new Noticia($titulo, $autor, $contenido);
        $array = $nueva->toArray();
        array_push($noticias, $array);

        file_put_contents($archivo, json_encode($noticias, JSON_PRETTY_PRINT));
        $mensaje = "✔ Noticia agregada correctamente.";
    } else {
        $mensaje = "⚠ Todos los campos son obligatorios.";
    }
}

?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title><?= $tituloSitio ?></title>
    <link rel="stylesheet" href="./style.css">
    <script defer src="./script.js"></script>
</head>
<body>


    <h1><?= $tituloSitio ?></h1>

    <?php if ($mensaje): ?>
        <div class="alert"><?= $mensaje ?></div>
    <?php endif; ?>

    <div class="card">
        <h2>Agregar nueva noticia</h2>

        <form id="formNoticia" method="post">
            <input type="text" name="titulo" placeholder="Título" class="input">
            <input type="text" name="autor" placeholder="Autor" class="input">
            <textarea name="contenido" placeholder="Contenido" class="input" rows="4"></textarea>
            <button type="submit" class="btn">Guardar</button>
        </form>
    </div>

    <h3>Noticias publicadas (<?= count($noticias) ?>)</h3>

    <?php foreach (array_reverse($noticias) as $n): ?>
        <div class="noticia">
            <h4><?= htmlspecialchars($n["titulo"]) ?></h4>
            <small>Por <?= htmlspecialchars($n["autor"]) ?> - <?= $n["fecha"] ?></small>
            <p><?= nl2br(htmlspecialchars($n["contenido"])) ?></p>
        </div>
    <?php endforeach; ?>

    <p><small>Creadas en esta sesión: <?= Noticia::cantidadNoticias() ?></small></p>

</div>
</body>
</html>
