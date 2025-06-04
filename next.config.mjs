/** @type {import('next').NextConfig} */
const nextConfig = {
  // Adicione a configuração do ESLint aqui dentro
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Adicione outras configurações do Next.js aqui, se necessário
};

export default nextConfig;

// Remova completamente todo o bloco module.exports abaixo
/*
// next.config.js
module.exports = {
  // ...seu config
  eslint: {
    ignoreDuringBuilds: true,
  },
}
*/
