<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $n = isset($_POST['n']) ? (int)$_POST['n'] : 0;
    $order = isset($_POST['order']) ? $_POST['order'] : 'ASC';
    
    if ($n > 0) {
        $numbers = array_map(function() { return rand(0, 10000); }, range(1, $n));
        
        usort($numbers, function($a, $b) use ($order) {
            if ($order == 'ASC') {
                return $a <=> $b;
            } else {
                return $b <=> $a;
            }
        });
    }
}
?>

<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generating and sorting</title>
</head>
<body>
    <form method="post">
        <label for="n">Введіть кількість чисел (N):</label>
        <input type="number" name="n" id="n" required min="1">
        
        <label for="order">Зміна порядку сортування:</label>
        <select name="order" id="order">
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
        </select>
        
        <button type="submit">Генерувати та сортувати</button>
    </form>
    
    <?php if (!empty($numbers)) : ?>
        <h3>Результат:</h3>
        <p><?php echo implode(', ', $numbers); ?></p>
    <?php endif; ?>
</body>
</html>
