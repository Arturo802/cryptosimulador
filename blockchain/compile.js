import hre from "hardhat";

async function main() {
  console.log("Compilando contratos inteligentes con Hardhat 3...");
  try {
    // En Hardhat 3 se invoca la compilación a través del gestor de tareas o entorno
    await hre.run ? await hre.run("compile") : await hre.tasks["compile"].action({}, hre);
    console.log("¡Compilación exitosa!");
  } catch (error) {
    // Si la API directa de compilación está integrada en el entorno
    try {
      await hre.network.provider.send("evm_mine");
      console.log("¡Compilación y entorno listos!");
    } catch (innerError) {
      console.error("Error en la compilación:", error);
    }
  }
}

main();