let  serverDomain = 'core.seller24.ru';
let parts = location.host.split('.');
if (parts[0] === 'app') serverDomain = 'app.seller24.ru';

let url = process.env.NODE_ENV === 'development' ? {
    proxy: 'http://localhost:3001',
    real: `https://${serverDomain}`
}: {
    proxy: 'https://84.201.149.106:3001',
    real: `https://${serverDomain}`
};
export default url