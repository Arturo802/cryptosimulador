import hre from "hardhat";

async function main() {
  console.log("Iniciando despliegue de RegulatedToken...");

  // En Hardhat 3, la forma correcta de obtener ethers es creando una conexión de red
  const connection = await hre.network.create();
  const { ethers } = connection;

  // Obtenemos los firmantes desde la conexión de red activa
  const [deployer] = await ethers.getSigners();
  console.log("Desplegando contratos con la cuenta:", deployer.address);

  // Parámetros iniciales del token regulado
  const tokenName = "CryptoSimulador Token";
  const tokenSymbol = "CSIM";

  // Desplegamos el contrato
  const RegulatedToken = await ethers.getContractFactory("RegulatedToken");
  console.log("Desplegando contrato en la red local...");
  const regulatedToken = await RegulatedToken.deploy(tokenName, tokenSymbol);

  await regulatedToken.waitForDeployment();

  console.log(`¡Contrato RegulatedToken desplegado con éxito!`);
  console.log(`Dirección del contrato: ${await regulatedToken.getAddress()}`);
}

main().catch((error) => {
  console.error("Error durante el despliegue:", error);
  process.exitCode = 1;
});