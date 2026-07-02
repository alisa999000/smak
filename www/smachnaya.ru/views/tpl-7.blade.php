<?php
/** Blade-обёртка шаблона из БД (site_templates.id=7). Рендер через evo_parser — теги Evo ([[*]], [[snippet]], {{chunk}}) как в админке. */
$__site = rtrim((string) evo()->getConfig('site_url'), '/');
$__csrf = csrf_token();
$__soc = '<div class="mb-3 p-3 border rounded" style="max-width:520px;margin:0 auto 16px;">'
    . '<div class="mb-2 fw-semibold">Регистрация через соцсети или SMS</div>'
    . '<a class="btn btn-outline-secondary btn-sm me-2" href="' . htmlspecialchars($__site) . '/auth/google">Google</a>'
    . '<a class="btn btn-outline-secondary btn-sm" href="' . htmlspecialchars($__site) . '/auth/yandex">Яндекс</a>'
    . '<hr class="my-3"/>'
    . '<form method="post" action="' . htmlspecialchars($__site) . '/auth/sms/send" class="d-flex flex-wrap gap-2 align-items-center">'
    . '<input type="hidden" name="_token" value="' . htmlspecialchars($__csrf) . '">'
    . '<input class="form-control" style="min-width:200px;max-width:280px;flex:1" name="phone" type="tel" placeholder="+7 900 000-00-00" autocomplete="tel" required>'
    . '<button class="btn btn-primary" type="submit">Получить SMS-код</button></form>'
    . '<p class="small text-muted mt-2 mb-0">После отправки кода откройте <a href="' . htmlspecialchars($__site) . '/auth/sms">страницу ввода кода</a>.</p>'
    . '</div>';
$__raw = <<<'_EVO_TPL_7_BODY_EOF_7_'
<!DOCTYPE html>
<html lang="ru">
{{head}}


<body>
   {{header}} 
<div class="container">
[!FormLister?
&formid=`register`
&controller=`Register`
&model=`Pathologic\EvolutionCMS\MODxAPI\modUsers`	

&rules=`{
    "fullname": {
        "required": "Обязательно введите имя"
    },
    "email": {
        "required": "Обязательно введите email",
        "email": "Введите email правильно"
    },
    "password": {
        "required": "Обязательно введите пароль",
        "minLength": {
            "params": 6,
            "message": "В пароле должно быть больше 6 символов"
        }
    },
    "repeatPassword": {
        "required": "Повторите пароль",
        "equals": {
            "message": "Пароли не совпадают"
        }
    }
}`
&allowedFields=`fullname`
&formControls=`agree`
&formTpl=`@CODE:

        <div class="account_form">
            <form method="post">
                <input type="hidden" name="formid" value="register">
                <div class="form-group[+fullname.errorClass+][+fullname.requiredClass+]">
                    <label for="fullname">* Имя</label>
                    <input type="text" class="form-control" id="fullname" placeholder="Имя" name="fullname" value="[+fullname.value+]">
                    [+fullname.error+]
                </div>
                <div class="form-group[+email.errorClass+][+email.requiredClass+]">
                    <label for="email">* Email</label>
                    <input type="text" class="form-control" id="email" placeholder="Email" name="email" value="[+email.value+]">
                    [+email.error+]
                </div>
                
                        <div class="form-group[+password.errorClass+][+password.requiredClass+]">
                            <label for="password">* Пароль</label>
                            <input type="password" class="form-control" id="password" placeholder="Пароль" name="password" value="">
                            [+password.error+]
                        </div>
                    
                        <div class="form-group[+repeatPassword.errorClass+][+repeatPassword.requiredClass+]">
                            <label for="repeatPassword">* Повторите пароль</label>
                            <input type="password" class="form-control" id="repeatPassword" placeholder="Повторите пароль" name="repeatPassword" value="">
                            [+repeatPassword.error+]
                        </div>
                    
                
                [+form.messages+]
                <div class="form-group">
                    <button type="submit" class="btn btn-primary "> Зарегистрироваться</button>
                </div>
            </form>
        </div>`
&to=`info@sitename.ru`
&reportTpl=`@CODE:Новый пользователь [+fullname.value+] ([+id.value+])`
&ccSender=`1`
&ccSenderField=`email`
&ccSenderTpl=`@CODE:Привет [+fullname.value+]. Для активации учетной записи нужно перейти по ссылке <a href="[+activate.url+]">[+activate.url+]</a>`
&subject=`Регистрация на сайте [(site_name)]`
&messagesOuterTpl=`@CODE:<div class="alert alert-danger" role="alert">[+messages+]</div>`
&successTpl=`@CODE:
<p>Поздравляем с успешной регистрацией, [+fullname.value+]!</p>
<p>После активации вы можете <a href="[~233~]">авторизоваться</a> на сайте.</p>
<p>Если вы не получили письмо для активации учетной записи, <a href="[~3~]">запросите его</a> еще раз.</p>`
&errorTpl=`@CODE:<span class="help-block">[+message+]</span>`
&errorClass=` has-error`
&requiredClass=` has-warning`
!]
	</div>
	</body>
</html>

_EVO_TPL_7_BODY_EOF_7_;
$__body = str_replace('<div class="container">', '<div class="container">' . $__soc, $__raw);
?>
{!! evo_parser($__body) !!}
