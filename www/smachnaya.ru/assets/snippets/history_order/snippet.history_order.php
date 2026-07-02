<?php
/**
 * История заказов Commerce для текущего веб-пользователя (customer_id).
 * Вызывается из сниппета БД `history_order` через return require ...
 */
if (!defined('MODX_BASE_PATH')) {
    die('HACK???');
}

/** @var \DocumentParser $modx */
$uid = (int) $modx->getLoginUserID('web');
if ($uid <= 0) {
    return '<section class="commerce-order-history"><p class="text-muted">Чтобы увидеть свои заказы, '
        . '<a href="' . htmlspecialchars($modx->makeUrl(16), ENT_QUOTES, 'UTF-8') . '">войдите</a> '
        . 'или <a href="' . htmlspecialchars($modx->makeUrl(14), ENT_QUOTES, 'UTF-8') . '">зарегистрируйтесь</a>.</p></section>';
}

$modx->invokeEvent('OnWebPageInit');

$statuses = [];
$qs = $modx->db->select('id, title', $modx->getFullTablename('commerce_order_statuses'), '', 'id ASC');
while ($row = $modx->db->getRow($qs)) {
    $statuses[(int) $row['id']] = (string) $row['title'];
}

$csrf = '';
if (function_exists('csrf_token')) {
    $csrf = (string) csrf_token();
}

$tpl = '@CODE:<tr>
    <td>[+id+]</td>
    <td>[+created_fmt+]</td>
    <td><strong>[+amount+] [+currency+]</strong></td>
    <td>[+status_title+]</td>
    <td>
        <form data-evocms-user-action="order/repeat" data-evocms-user-id="[+id+]" method="post" class="d-inline">
            <input type="hidden" name="_token" value="' . htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8') . '">
            <button type="submit" class="btn btn-sm btn-outline-primary">Повторить в корзине</button>
        </form>
    </td>
</tr>';

$owner = '@CODE:<div class="table-responsive commerce-order-history"><table class="table table-bordered table-striped"><thead><tr><th>№</th><th>Дата</th><th>Сумма</th><th>Статус</th><th>Действия</th></tr></thead><tbody>[+dl.wrap+]</tbody></table></div>';

return $modx->runSnippet('DocLister', [
    'controller' => 'onetable',
    'table' => 'commerce_orders',
    'idType' => 'documents',
    'ignoreEmpty' => '1',
    'addWhereList' => 'customer_id=' . $uid,
    'orderBy' => 'created_at DESC',
    'display' => '50',
    'prepare' => static function (array $data, $modx, $DL, $eDL) use ($statuses, $csrf) {
        $data['created_fmt'] = !empty($data['created_at'])
            ? date('d.m.Y H:i', strtotime((string) $data['created_at']))
            : '';
        $sid = isset($data['status_id']) ? (int) $data['status_id'] : 0;
        $data['status_title'] = $statuses[$sid] ?? ('#' . $sid);
        $data['csrf_token'] = $csrf;

        return $data;
    },
    'tpl' => $tpl,
    'ownerTPL' => $owner,
]);
