<?php
/** Blade-обёртка шаблона из БД (site_templates.id=8). Рендер через evo_parser — теги Evo ([[*]], [[snippet]], {{chunk}}) как в админке. */
$__site = rtrim((string) evo()->getConfig('site_url'), '/');
$__csrf = csrf_token();
$__soc = '<div class="mb-3 p-3 border rounded" style="max-width:520px;margin:0 auto 16px;">'
    . '<div class="mb-2 fw-semibold">Вход через соцсети или SMS</div>'
    . '<a class="btn btn-outline-secondary btn-sm me-2" href="' . htmlspecialchars($__site) . '/auth/google">Google</a>'
    . '<a class="btn btn-outline-secondary btn-sm" href="' . htmlspecialchars($__site) . '/auth/yandex">Яндекс</a>'
    . '<hr class="my-3"/>'
    . '<form method="post" action="' . htmlspecialchars($__site) . '/auth/sms/send" class="d-flex flex-wrap gap-2 align-items-center">'
    . '<input type="hidden" name="_token" value="' . htmlspecialchars($__csrf) . '">'
    . '<input class="form-control" style="min-width:200px;max-width:280px;flex:1" name="phone" type="tel" placeholder="+7 900 000-00-00" autocomplete="tel" required>'
    . '<button class="btn btn-primary" type="submit">Получить SMS-код</button></form>'
    . '<p class="small text-muted mt-2 mb-0">Настройте ключи в core/custom/.env. После SMS — <a href="' . htmlspecialchars($__site) . '/auth/sms">ввести код</a>.</p>'
    . '</div>';
$__raw = <<<'_EVO_TPL_8_BODY_EOF_8_'
<!DOCTYPE html>
<html lang="ru">
{{head}}


<body>
   {{header}} 
<div class="container">

	
	
	
[!FormLister?
&formid=`login`
&controller=`Login`
&model=`Pathologic\EvolutionCMS\MODxAPI\modUsers`	
&redirectTo=`13`
&loginField=`email`
&rules=`{
"email":{
	"required":"Обязательно введите email",
	"email":"Введите email правильно"
},
"password":{
	"required":"Обязательно введите пароль"
}
}`
&formTpl=`@CODE:

		<div class="account_form">
			<form method="post">
				<input type="hidden" name="formid" value="login">
				<div class="form-group[+email.errorClass+][+email.requiredClass+]">
					<label for="auth_email">* Email</label>
						<input type="text" class="form-control" id="auth_email" placeholder="Email" name="email" value="[+email.value+]">
						[+email.error+]
				</div>
				<div class="form-group[+password.errorClass+][+password.requiredClass+]">
					<label for="auth_password">* Пароль</label>
						<input type="password" class="form-control" id="auth_password" placeholder="Пароль" name="password" value="">
						[+password.error+]
				</div>
				[+form.messages+]
				<div class="form-group">
					<button type="submit" class="btn btn-primary"> Войти</button>
				</div>
				<div class="text-center"><a href="/account/registraciya">Зарегистрироваться</a> | <a href="[~7~]">Забыли пароль</a></div>
			</form>
		</div>`
&messagesOuterTpl=`@CODE:<div class="alert alert-danger" role="alert">[+messages+]</div>`
&skipTpl=`@CODE:<div class="text-center">Вы уже авторизованы.</div>`
&successTpl=`@CODE:<div class="text-center">Привет, [+fullname+]!</div>`
&errorTpl=`@CODE:<span class="help-block">[+message+]</span>`
&errorClass=` has-error`
&requiredClass=` has-warning`
!]
	</div>
	</body>
</html>

_EVO_TPL_8_BODY_EOF_8_;
$__body = str_replace('<div class="container">', '<div class="container">' . $__soc, $__raw);
?>
{!! evo_parser($__body) !!}
