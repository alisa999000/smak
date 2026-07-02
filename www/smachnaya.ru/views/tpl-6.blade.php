<?php
/** Blade-обёртка шаблона из БД (site_templates.id=6). Рендер через evo_parser — теги Evo ([[*]], [[snippet]], {{chunk}}) как в админке. */
$__body = <<<'_EVO_TPL_6_BODY_EOF_6_'
<!DOCTYPE html>
<html lang="ru">
{{head}}


<body>
   {{header}} 
<div class="container">
[!FormLister?
&formid=`profile`
&exitTo=`16`	
&controller=`Profile`
&model=`Pathologic\EvolutionCMS\MODxAPI\modUsers`	
&rules=`{
    "email":{
        "required":"Введите email",
        "email":"Неверный email",
        "custom":{
            "function":"\\FormLister\\Profile::uniqueEmail",
            "message":"Этот email уже использует другой пользователь"
        }
    },
	"fullname":{
        "required":"Введите имя пользователя",
        "alphaNumeric":"Только буквы и цифры",
    }
}`
&formTpl=`form_personal`
&messagesOuterTpl=`@CODE:<div class="alert alert-danger" role="alert">[+messages+]</div>`
&successTpl=`@CODE:<div class="text-center">Информация обновлена!</div>`
&errorTpl=`@CODE:<span class="help-block">[+message+]</span>`
!]
	
	
	<div class="row row_lg hleb-cab" id="main_section">
			   <div class="col-lg-12">
			   	[[DLcrumbs?
    &ownerTPL=`@CODE: <nav itemscope itemtype="https://schema.org/BreadcrumbList"><ul class="breadcrumps mb40" itemprop="itemListElement">[+crumbs.wrap+]</ul></nav>`
    &tpl=`@CODE:<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a itemprop="item" href="[+url+]" ><span itemprop="name">[+e.title+]</span></a></li>`
    &tplCurrent=`@CODE:<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" class="active"><span itemprop="name">[+e.title+]</span></li>`
    &showCurrent=`1`
]]
			   </div>
		
		
		<h1 class="tit-main">[*pagetitle*]</h1>
		
		
		<div class="row block-data">
			
			<!--Личные данные -->
			<div class="col-md-3">
				<p class="bold">Личные данные</p>
			</div>
			<div class="col-md-7">
				<form action="" method="post">
					
					<div class="fl-data">
						<div class="input-block">
							<label for="username">Имя</label><br>
							<input class="input-dat" type="text" id="username" name="username" placeholder="Ваше имя" required>
						</div>

						<div class="input-block">
							<label for="email">Фамилия</label><br>
							<input class="input-dat s" type="email" id="lastname" name="lastname" placeholder="Ваша фамилия" required>
						</div>
					</div>
					<br>
					
					<label for="otchestvo">Отчество</label><br>
					<input class="input-dat s" type="otchestvo" id="otchestvo" placeholder="Отчество" required>
					
					<br><br>
					<label for="dat">Дата рождения</label>
					<input type="date" class="input-dat s" />
					
					<br><br>
					
					<div class="fl-phone">
						<div class="phn">
							<label for="dat">Телефон*</label><br>
							<input class="input-dat ss" placeholder="+7 (__)__-__-__" type="tel">
						</div>
						<div class="subms">
							<input class="submits" type="submit" name="update" value="Подтвердить">
						</div>
					</div>
					
					
					<input class="submits" type="submit" name="update" value="Сохранить изменения">
				</form>
				
				<div class="divider"></div>
			</div>
			
			
			<!-- Адрес --> 
			<div class="col-md-3">
				<p class="bold">Адрес</p>
			</div>
			
			<div class="col-md-7">
				<form action="" method="post">
					
					<div class="input-container">
						<label for="dat">Улица</label><br>
						<input class="input-dat s" type="text" name="street" placeholder="Например, Санкт-Петербург, улица Савушкина, 141" required>
						<span class="icon"><img src="/assets/images/edit.svg" alt="svg"></span>
					</div>
					
					<br><br>
					
					<div class="fl-phone">
						<div class="phn">
							<label for="dat">Квартира, Этаж</label><br>
							<div class="fl-input">
								<div><input class="input-dat sss" placeholder="Номер квартиры" type="tel"></div>
								<div><input class="input-dat ssss" placeholder="Этаж" type="tel"></div>
							</div>
						</div>
						<div class="kod">
							<label for="dat">Подъезд, Код двери</label><br>
							<div class="fl-input">
								<div><input class="input-dat sss" placeholder="Подъезд" type="tel"></div>
								<div><input class="input-dat ssss" placeholder="Код двери" type="tel"></div>
							</div>
						</div>
					</div>
					
					
					<input class="submits" type="submit" name="update" value="Сохранить изменения">
				</form>
				
				<div class="divider"></div>
			</div>
			
			<!-- Уведомления -->
			<div class="col-md-3">
				<p class="bold">Настройка уведомлений</p>
			</div>
			
			<div class="col-md-7">
					<form action="" method="post">
							
							<div class="push">
							
								<div class="push-text">
									<p>Email</p>
									<p class="texts">Получать уведомления</p>
								</div>

								<div>
									<label class="checkbox-ios">
										<input type="checkbox">
										<span class="checkbox-ios-switch"></span>
									</label>
								</div>
								
							</div> <!-- end push -->
						<br>
							<div class="push">
							
								<div class="push-text">
									<p>Телефон</p>
									<p class="texts">Получать уведомления</p>
								</div>

								<div>
									<label class="checkbox-ios">
										<input type="checkbox">
										<span class="checkbox-ios-switch"></span>
									</label>
								</div>
								
							</div> <!-- end push -->
						
					</form>
				
				
				<div class="divider"></div>
			</div>
			
			
			<!-- Данные учетной записи -->
			<div class="col-md-3">
				<p class="bold">Данные учетной записи</p>
			</div>
			
			<div class="col-md-7">
					<form action="" method="post">
						
						<div class="input-container pas">
							<label for="dat">Пароль</label><br>
							<input class="input-dat pas" type="password" name="street" placeholder="" required>
							<span class="icon"><img src="/assets/images/pas.svg" alt="svg"></span>
						</div>
							
						<br>
						<p id="changepass">Изменить пароль <span><img class="arr-bl" src="/assets/images/arrow.svg" alt="svg"></span></p>
						<div id="toggleBlocks" class="hiddens">
							
							<div class="input-container pas">
								<label for="dat">Текущий пароль*</label><br>
								<input class="input-dat pas" type="password" name="street" placeholder="" required>
								<span class="icon"><img src="/assets/images/pas.svg" alt="svg"></span>
							</div>
							<a href="#" class="los"> Забыли пароль?</a><br>
							<br>
							
							<div class="input-container pas">
								<label for="dat">Новый пароль*</label><br>
								<input class="input-dat pas" type="password" name="street" placeholder="" required>
								<span class="icon"><img src="/assets/images/pas.svg" alt="svg"></span>
							</div><br>
							
							<div class="input-container pas">
								<label for="dat">Повторите пароль</label><br>
								<input class="input-dat pas" type="password" name="street" placeholder="" required>
							</div><br>
							
							
							<input class="submits" type="submit" name="update" value="Сохранить изменения">
							
						</div>
						
					</form>
				
				
				<div class="divider"></div>
				
				<br>
				<p class="bold">Удалить учетную запись</p>
				<p class="del-text">Это невозможно отменить. Все созданные вами данные будут удалены навсегда.</p>
				<div class="del-but">Удалить</div>
			</div>
			
			
			
			
		</div>
		
		
		
		

	</div>
	
	
	
	
	<script>
		document.getElementById('changepass').addEventListener('click', function() {
			const toggleBlock = document.getElementById('toggleBlocks');
			const arrow = document.querySelector('.arr-bl');
			
			toggleBlock.classList.toggle('hiddens');
			
			if (toggleBlock.classList.contains('hiddens')) {
                arrow.style.transform = 'rotate(180deg)';
            } else {
                arrow.style.transform = 'rotate(0deg)';
            }
		});
	</script>
	
	</div>
	
	{{footer}}
	</body>
</html>

_EVO_TPL_6_BODY_EOF_6_;
?>
{!! evo_parser($__body) !!}
