export default async function handler(req, res) {
    // 1. SET HEADER CORS LENGKAP
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Mengizinkan akses dari localhost
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // 2. TANGANI PREFLIGHT (Browser mengirim request OPTIONS sebelum POST)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 3. Hanya izinkan method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'ERROR', message: 'Method Not Allowed' });
    }

    try {
        const gasUrl = process.env.GAS_ENDPOINT_URL;

        if (!gasUrl) {
            return res.status(500).json({ status: 'ERROR', message: 'Server config error: GAS URL missing.' });
        }

        // Pastikan format body siap dikirim ke GAS
        const bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

        // Teruskan data ke GAS Backend
        const response = await fetch(gasUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: bodyData,
            redirect: 'follow'
        });

        const data = await response.json();

        // Kembalikan respon dari GAS ke browser
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ status: 'ERROR', message: error.message });
    }
}