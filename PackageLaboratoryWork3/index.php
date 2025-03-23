<?php
session_start();

if (!isset($_SESSION['max_value'])) {
    $_SESSION['max_value'] = 10;
}
if (!isset($_SESSION['sign'])) {
    $_SESSION['sign'] = "+";
}
if (!isset($_SESSION['operand1'])) {
    $_SESSION['operand1'] = 0;
}
if (!isset($_SESSION['operand2'])) {
    $_SESSION['operand2'] = 0;
}
if (!isset($_SESSION['result'])) {
    $_SESSION['result'] = "???";
}
if (!isset($_SESSION['input_value'])) {
    $_SESSION['input_value'] = "";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['max_value'])) {
        $_SESSION['max_value'] = $_POST['max_value'];
    }
    if (isset($_POST['sign'])) {
        $_SESSION['sign'] = $_POST['sign'];
    }
    if (isset($_POST['generate'])) {
        $_SESSION['operand1'] = rand(0, $_SESSION['max_value']);
        if ($_SESSION['sign'] == '+') {
            $_SESSION['operand2'] = rand(0, $_SESSION['max_value'] - $_SESSION['operand1']);
        } elseif ($_SESSION['sign'] == '-') {
            $_SESSION['operand2'] = rand(0, $_SESSION['operand1']);
        } else {
            $_SESSION['operand2'] = rand(0, $_SESSION['max_value']);
        }
        $_SESSION['result'] = "???";
        $_SESSION['input_value'] = "";
    }
    if (isset($_POST['digit'])) {
        $_SESSION['input_value'] .= $_POST['digit'];
    }
    if (isset($_POST['check'])) {
        $user_input = intval($_SESSION['input_value']);
        $correct = false;
        if ($_SESSION['sign'] == '+') {
            $correct = ($_SESSION['operand1'] + $_SESSION['operand2'] == $user_input);
        } elseif ($_SESSION['sign'] == '-') {
            $correct = ($_SESSION['operand1'] - $_SESSION['operand2'] == $user_input);
        } elseif ($_SESSION['sign'] == '*') {
            $correct = ($_SESSION['operand1'] * $_SESSION['operand2'] == $user_input);
        }
        $_SESSION['result'] = $correct ? "Вірно!" : "Спробуй ще!";
        if (!$correct) {
            $_SESSION['input_value'] = "";
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Перевірка усного рахунку</title>
    <link rel="stylesheet" href="main.css">
</head>
<body>
    <h1 class="center">Математичний тест</h1>
    <hr>
    <form method="POST">
        <table class="center">
            <tr>
                <td><button name="max_value" value="10">0-10</button></td>
                <td><button name="max_value" value="20">0-20</button></td>
                <td><button name="max_value" value="28">0-28</button></td>
                <td><button name="max_value" value="100">0-100</button></td>
                <td><button name="sign" value="+">+</button></td>
                <td><button name="sign" value="-">-</button></td>
                <td><button name="sign" value="*">*</button></td>
            </tr>
        </table>
        <hr>
        <table class="center">
            <tr>
                <td><input type="text" value="<?php echo $_SESSION['operand1']; ?>" size="3" readonly></td>
                <td><input type="text" value="<?php echo $_SESSION['sign']; ?>" size="1" readonly></td>
                <td><input type="text" value="<?php echo $_SESSION['operand2']; ?>" size="3" readonly></td>
                <td>=</td>
                <td><input type="text" name="user_input" value="<?php echo $_SESSION['input_value']; ?>" size="4" readonly></td>
                <td><button name="generate">?</button></td>
                <td><input type="text" value="<?php echo $_SESSION['result']; ?>" readonly></td>
            </tr>
        </table>
        <hr>
        <table id="keyboard">
            <tr>
                <?php for ($i = 1; $i <= 9; $i++): ?>
                    <td><button name="digit" value="<?php echo $i; ?>"><?php echo $i; ?></button></td>
                    <?php if ($i % 3 == 0) echo '</tr><tr>'; ?>
                <?php endfor; ?>
                <td><button name="digit" value="0">0</button></td>
                <td colspan="2"><button name="check">OK</button></td>
            </tr>
        </table>
    </form>
    <hr>
</body>
</html>
