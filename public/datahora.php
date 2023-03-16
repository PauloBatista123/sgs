<?php

echo "Hora atual PHP: " . date('d/m/Y H:i:s e T P');
echo "<br>" . "Versão timezonedb: " . timezone_version_get();
echo "<br>" . "Timezone: " . date_default_timezone_get();
echo "<br>" . "Horário verão 1=sim  0=não: " . date('I'); 
echo "<br>" . phpinfo();
exit;

?>