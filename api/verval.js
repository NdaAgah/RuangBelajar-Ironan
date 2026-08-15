export default async function handler(req, res) {
    // Hanya izinkan method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'ERROR', message: 'Method Not Allowed' });
    }

    try {
        // Ambil URL rahasia dari Environment Variable Vercel
        const gasUrl = process.env.GAS_ENDPOINT_URL;

        if (!gasUrl) {
            return res.status(500).json({ status: 'ERROR', message: 'Server config error: GAS URL missing.' });
        }

        // Teruskan data dari frontend ke GAS Backend
        const response = await fetch(gasUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(req.body),
            redirect: 'follow'
        });

        const data = await response.json();

        // Kembalikan respons dari GAS ke Frontend pengguna
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ status: 'ERROR', message: error.message });
    }
}