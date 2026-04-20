
async function testFetch(name, url, options = {}) {
    console.log(`Testing ${name}: ${url}`);
    try {
        const res = await fetch(url, options);
        console.log(`  Result: ${res.status} ${res.statusText}`);
    } catch (e) {
        console.error(`  Error: ${e.message}`);
        if (e.cause) console.error(`  Cause: ${e.cause.message}`);
    }
}

async function run() {
    // 外部サービス
    await testFetch('Mapbox', 'https://api.mapbox.com/search/searchbox/v1/suggest?q=tokyo&access_token=' + process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);
    await testFetch('Supabase', process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/', {
        headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY }
    });
    
    // ローカルサービス（起動している前提）
    if (process.env.MINIO_ENDPOINT) {
        await testFetch('MinIO', process.env.MINIO_ENDPOINT + '/minio/health/ready');
    }
    if (process.env.LIBRETRANSLATE_URL) {
        await testFetch('LibreTranslate', process.env.LIBRETRANSLATE_URL);
    }
    if (process.env.MEILISEARCH_URL) {
        await testFetch('Meilisearch', process.env.MEILISEARCH_URL + 'health');
    }
}

run();
