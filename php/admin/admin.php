<?php
session_start();

if ($_SESSION['user'] == 'admin') {

echo '
{
  "headder": "admin",
  "html": "<div class=\\"admin\\"><h1>ADMINISTRACE</h1><br><ul><li>projekty</li><li>kurátor 2</li><li><span class=\\"logout\\">odhlásit se</span></li></ul></div>"
}
';

} else {

echo '
{
  "headder": "login",
  "html": "<div class=\\"admin\\"><h1>LOGIN</h1><form method=\\"post\\" id=\\"loginFrom\\"><input type=\\"text\\" name=\\"login\\" placeholder=\\"LOGIN\\"><br><input type=\\"password\\" name=\\"pass\\" placeholder=\\"PASSWORD\\"><br><input type=\\"submit\\" name=\\"submit\\" value=\\"OK\\"></form></div>"
}
';

}
