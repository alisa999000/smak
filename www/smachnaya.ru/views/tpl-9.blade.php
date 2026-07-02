<?php
/** Blade-обёртка шаблона из БД (site_templates.id=9). Рендер через evo_parser — теги Evo ([[*]], [[snippet]], {{chunk}}) как в админке. */
$__body = <<<'_EVO_TPL_9_BODY_EOF_9_'
<!DOCTYPE html>
<html lang="ru">
{{head}}


<body>
   {{header}} 
<div class="container">

[[history_order]]

	</div>
	</body>
</html>

_EVO_TPL_9_BODY_EOF_9_;
?>
{!! evo_parser($__body) !!}
