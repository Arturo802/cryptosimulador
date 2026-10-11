// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RegulatedToken is ERC20, Ownable {
    // Mapeo para gestionar la lista negra (cuentas congeladas)
    mapping(address => bool) public blacklist;

    // Eventos para trazabilidad en el backend y frontend
    event AccountBlacklisted(address indexed account);
    event AccountWhitelisted(address indexed account);

    constructor(string memory name, string memory symbol) 
        ERC20(name, symbol) 
        Ownable(msg.sender) 
    {
        // Acuñamos una emisión inicial de 1,000,000 tokens al creador (Deployer)
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    // Función exclusiva del administrador para emitir más tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Añadir una cuenta a la lista negra
    function addToBlacklist(address account) public onlyOwner {
        blacklist[account] = true;
        emit AccountBlacklisted(account);
    }

    // Remover una cuenta de la lista negra
    function removeFromBlacklist(address account) public onlyOwner {
        blacklist[account] = false;
        emit AccountWhitelisted(account);
    }

    // Sobrescribimos la función de transferencia para validar restricciones regulatorias
    function _update(
        address from, 
        address to, 
        uint256 value
    ) internal virtual override {
        // Permitir minteo (from == address(0)) y quema (to == address(0))
        if (from != address(0) && to != address(0)) {
            require(!blacklist[from], "RegulatedToken: El remitente esta en la lista negra (congelado)");
            require(!blacklist[to], "RegulatedToken: El destinatario esta en la lista negra (congelado)");
        }
        
        super._update(from, to, value);
    }
}