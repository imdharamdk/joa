<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$action = $_GET['action'] ?? '';

function json_out($payload, int $code = 200): void {
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function exam_keywords(): array {
    return [
        'government','scheme','economy','science','technology','award','sports',
        'india','education','policy','digital','himachal','cabinet','budget','cyber'
    ];
}

function static_news_fallback(): array {
    return [
        ['title' => 'India expands digital public infrastructure for citizen services.', 'url' => 'https://www.india.gov.in'],
        ['title' => 'Himachal Pradesh strengthens e-governance services across districts.', 'url' => 'https://himachal.nic.in'],
        ['title' => 'Cyber awareness and safe internet campaigns expanded for students.', 'url' => 'https://cybercrime.gov.in'],
        ['title' => 'Policy focus continues on AI, data governance and digital skilling.', 'url' => 'https://www.meity.gov.in'],
        ['title' => 'Science and innovation missions boost technology and research ecosystem.', 'url' => 'https://dst.gov.in'],
        ['title' => 'Government schemes and DBT updates remain key exam-relevant topics.', 'url' => 'https://www.mygov.in'],
        ['title' => 'Union budget updates impact economy, jobs and public service preparation.', 'url' => 'https://www.indiabudget.gov.in'],
        ['title' => 'Himachal development initiatives in infrastructure and tourism highlighted.', 'url' => 'https://himachaltourism.gov.in'],
        ['title' => 'National education and skilling reforms continue to evolve.', 'url' => 'https://www.education.gov.in'],
        ['title' => 'Sports governance and major award announcements remain important.', 'url' => 'https://yas.nic.in']
    ];
}

function filter_exam_relevant(array $articles): array {
    $keywords = exam_keywords();
    $unique = [];
    $seen = [];

    foreach ($articles as $article) {
        $title = trim((string)($article['title'] ?? ''));
        $url = trim((string)($article['url'] ?? ''));
        $desc = trim((string)($article['description'] ?? ''));
        if ($title === '') {
            continue;
        }

        $hay = strtolower($title . ' ' . $desc);
        $match = false;
        foreach ($keywords as $k) {
            if (strpos($hay, $k) !== false) {
                $match = true;
                break;
            }
        }
        if (!$match) {
            continue;
        }

        $key = $url !== '' ? $url : $title;
        if (isset($seen[$key])) {
            continue;
        }
        $seen[$key] = true;
        $unique[] = ['title' => $title, 'url' => $url !== '' ? $url : 'https://www.mygov.in'];
    }

    return $unique;
}

function fetch_news_from_api(): array {
    $apiKey = '3bf83bdcec3f42a0b9c4372109157e58';
    $endpoints = [
        "https://newsapi.org/v2/top-headlines?country=in&pageSize=50&apiKey={$apiKey}",
        "https://newsapi.org/v2/everything?q=India%20government%20economy%20science%20technology%20Himachal&sortBy=publishedAt&pageSize=50&language=en&apiKey={$apiKey}"
    ];

    $all = [];

    foreach ($endpoints as $url) {
        $ctx = stream_context_create([
            'http' => ['timeout' => 8, 'ignore_errors' => true],
            'ssl' => ['verify_peer' => true, 'verify_peer_name' => true]
        ]);
        $raw = @file_get_contents($url, false, $ctx);
        if ($raw === false) {
            continue;
        }
        $json = json_decode($raw, true);
        if (!is_array($json) || !isset($json['articles']) || !is_array($json['articles'])) {
            continue;
        }
        $all = array_merge($all, $json['articles']);
    }

    return $all;
}

function build_question_bank(): array {
    $seed = [
        ['Computer','In 8086 architecture, BIU stands for','Bus Interface Unit',['Binary Interface Unit','Bus Instruction Unit','Basic Input Unit']],
        ['Computer','POST in boot process means','Power-On Self-Test',['Power-On System Task','Programmed Operational System Test','Primary Output Scan Test']],
        ['Windows','NTFS adds which feature over FAT32','File permissions (ACL)',['Lower RAM usage','Built-in compiler','No fragmentation']],
        ['MS Excel','Best function for category summary table','PivotTable',['Goal Seek','Filter View','Spell Check']],
        ['MS Excel','To lock row and column in formula use','$A$1 absolute reference',['A$1','A1$','$1A1']],
        ['Networking','CIDR /24 equals','255.255.255.0',['255.255.0.0','255.0.0.0','255.255.255.255']],
        ['Networking','NAT is used to','Translate private IP to public IP',['Encrypt packets','Find DNS','Boost CPU clock']],
        ['DBMS','Foreign key ensures','Referential integrity',['Disk optimization','Memory safety','UI consistency']],
        ['DBMS','ACID property for all-or-none is','Atomicity',['Consistency','Isolation','Durability']],
        ['Cyber Security','Zero-day means','Vulnerability exploited before official patch',['Already patched bug','False positive alert','Firewall success']],
        ['Cyber Security','2FA improves','Authentication security',['Screen resolution','Download speed','File compression']],
        ['Current Affairs','NITI Aayog is','Policy think-tank',['Election body','Defense wing','Stock exchange']],
        ['Current Affairs','DBT stands for','Direct Benefit Transfer',['Digital Bank Tax','Dual Benefit Token','Data Backup Transfer']],
        ['Himachal GK','Summer capital of Himachal Pradesh','Shimla',['Mandi','Solan','Kullu']],
        ['Himachal GK','Chamba Rumal is famous for','Hand embroidery art',['Stone carvings','Metal work','Glass painting']],
        ['Internet','DNS maps','Domain names to IP addresses',['IP to MAC','Ports to files','Cookies to cache']],
        ['Internet','HTTPS provides','Encrypted communication via TLS',['No headers','Only compression','Faster CPU']],
        ['MS Office','PowerPoint is used for','Presentations',['Database design','Kernel tuning','Networking']],
        ['Computer','Virtual memory allows','Running programs larger than RAM',['No need of storage','No CPU scheduling','No I/O']],
        ['Current Affairs','Fiscal deficit means','Expenditure exceeds receipts excluding borrowings',['Import exceeds export','Tax exceeds GDP','Revenue surplus']],
    ];

    $questions = [];
    $id = 1;
    for ($variant = 1; $variant <= 4; $variant++) {
        foreach ($seed as $s) {
        [$topic, $q, $correct, $wrong] = $s;
        $options = array_merge([$correct], $wrong);
        shuffle($options);
        $questions[] = [
            'id' => $id++,
            'topic' => $topic,
            'level' => 'Hard',
            'q' => $q,
            'options' => $options,
            'ans' => array_search($correct, $options, true),
        ];

        $options2 = array_merge([$correct], ["{$wrong[0]} (trap)", "{$wrong[1]} (trap)", "{$wrong[2]} (trap)"]);
        shuffle($options2);
        $questions[] = [
            'id' => $id++,
            'topic' => $topic,
            'level' => 'Hard',
            'q' => "Variant {$variant}: Choose the most accurate statement: {$q}",
            'options' => $options2,
            'ans' => array_search($correct, $options2, true),
        ];
        }
    }

    return $questions; // 160 hard questions
}

if ($action === 'news') {
    $all = fetch_news_from_api();
    $filtered = filter_exam_relevant($all);
    if (count($filtered) === 0) {
        $filtered = static_news_fallback();
    }
    json_out([
        'ok' => true,
        'source' => count($all) > 0 ? 'newsapi' : 'fallback',
        'items' => array_slice($filtered, 0, 10),
        'fetchedAt' => gmdate('c')
    ]);
}

if ($action === 'questions') {
    json_out([
        'ok' => true,
        'items' => build_question_bank(),
        'fetchedAt' => gmdate('c')
    ]);
}

json_out(['ok' => false, 'message' => 'Unknown action'], 400);
